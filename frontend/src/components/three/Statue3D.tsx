import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { PCFSoftShadowMap } from 'three';

declare global {
  interface Window {
    __preSplash?: {
      ready: () => void;
      modelReady: () => void;
      dismiss: () => void;
    };
  }
}

useGLTF.setDecoderPath('/draco/');
// NOTE: no `useGLTF.preload(...)` here on purpose. The inline JS in
// index.html pre-fetches the GLB into THREE.Cache (see preloadAssets.ts).
// Calling preload here would race that and trigger a second fetch in
// Chromium. The Bust component below calls useGLTF(url) which hits the
// pre-populated cache synchronously.

export type Statue3DProps = {
  scrollProgress: () => number;
  /**
   * When false, the underlying WebGL render loop is paused (frameloop:
   * "never"). Use this to stop the bust from drawing 60 fps off-screen
   * — without that gate, scrolling past the hero stays expensive even
   * though nothing is visible.
   */
  active?: boolean;
};

type BustProps = {
  scrollProgress: () => number;
};

type Keyframe = {
  p: number;
  rotY: number;
  rotX: number;
  posX: number;
  posY: number;
  scale: number;
  camZ: number;
};

// Pose timeline rebuilt from the monolithstudio.com frame captures in
// /ref-mono (p00 → p100). The reference bust rotates monotonically ~220°
// around its vertical axis through the hero, with a scale-up peak near the
// middle (close-up shot of the shoulders) and a settle back to normal size
// by the end (full-frame left-profile portrait).
const KEYS: Keyframe[] = [
  { p: 0.00, rotY:  0.00, rotX:  0.00, posX:  0.00, posY:  0.00, scale: 1.00, camZ: 6.4 },
  { p: 0.12, rotY:  0.35, rotX:  0.10, posX:  0.25, posY:  0.05, scale: 1.18, camZ: 5.6 }, // engagement zoom + slight turn
  { p: 0.28, rotY:  0.85, rotX:  0.05, posX:  0.45, posY:  0.30, scale: 1.45, camZ: 4.8 }, // close-up, head leaning forward
  { p: 0.42, rotY:  1.60, rotX:  0.00, posX:  0.20, posY:  0.50, scale: 1.65, camZ: 4.0 }, // peak zoom, back-3/4 view (~92°)
  { p: 0.56, rotY:  2.40, rotX: -0.05, posX: -0.20, posY:  0.45, scale: 1.55, camZ: 4.2 }, // continuing rotation past back
  { p: 0.70, rotY:  3.10, rotX:  0.00, posX: -0.40, posY:  0.20, scale: 1.20, camZ: 5.2 }, // emerging on the far side
  { p: 0.85, rotY:  3.60, rotX:  0.05, posX: -0.30, posY:  0.05, scale: 1.00, camZ: 6.0 }, // settling into profile
  { p: 1.00, rotY:  3.85, rotX:  0.00, posX: -0.15, posY:  0.00, scale: 0.90, camZ: 6.6 }, // exit, left profile portrait
];

const smoothstep = (t: number) => t * t * (3 - 2 * t);

function sample(p: number) {
  const x = Math.min(1, Math.max(0, p));
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].p < x) i++;
  const a = KEYS[i];
  const b = KEYS[Math.min(KEYS.length - 1, i + 1)];
  const span = Math.max(1e-6, b.p - a.p);
  const t = smoothstep((x - a.p) / span);
  return {
    rotY: a.rotY + (b.rotY - a.rotY) * t,
    rotX: a.rotX + (b.rotX - a.rotX) * t,
    posX: a.posX + (b.posX - a.posX) * t,
    posY: a.posY + (b.posY - a.posY) * t,
    scale: a.scale + (b.scale - a.scale) * t,
    camZ: a.camZ + (b.camZ - a.camZ) * t,
  };
}

const FACE_FORWARD_Y = Math.PI;
const STAND_UPRIGHT_X = Math.PI / 2;

// Two related shades for the bust + pedestal. The pedestal reads slightly
// cooler and grittier so it feels like a stone base, not a bone-white
// continuation of the figure.
const MARBLE_COLOR = '#d8cdb5';
const PEDESTAL_COLOR = '#b8b1a3';

function Bust({ scrollProgress }: BustProps) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/bust_smooth_draco.glb') as unknown as {
    scene: THREE.Group;
  };

  // Signal the pre-React splash that the model has finished parsing and
  // the scene is about to render its first frame. Splash dismisses on
  // this so the bust is visible the same frame the curtain fades.
  useEffect(() => {
    // Two RAFs guarantee one rendered frame with the bust in the scene
    // before we tell the splash to fade.
    let cancelled = false;
    const r1 = requestAnimationFrame(() => {
      if (cancelled) return;
      const r2 = requestAnimationFrame(() => {
        if (!cancelled) window.__preSplash?.modelReady?.();
      });
      return () => cancelAnimationFrame(r2);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(r1);
    };
  }, []);

  const { cloned, normScale, cutBottom, bbox } = useMemo(() => {
    const c = scene.clone(true);
    c.rotation.set(STAND_UPRIGHT_X, 0, Math.PI / 2);
    c.updateMatrixWorld(true);

    // bust_smooth_draco.glb is pre-subdivided (Catmull-Clark, 2 levels) in
    // Blender — see frontend/scripts/smooth-bust.py. No JS-side mergeVertices
    // or normal recompute needed; doing so would clobber Blender's careful
    // smooth shading.

    const box = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    c.position.sub(center);
    const tallest = Math.max(size.x, size.y, size.z);
    const n = tallest > 0 ? 2.8 / tallest : 1;
    return {
      cloned: c,
      normScale: n,
      cutBottom: -size.y * n / 2,
      bbox: { x: size.x, y: size.y, z: size.z },
    };
  }, [scene]);

  // Aged marble material — closer to the monolith reference (cooler tone,
  // higher roughness, subtle clearcoat for soft highlights only on the
  // brightest planes).
  useMemo(() => {
    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: MARBLE_COLOR,
          roughness: 0.72,
          metalness: 0.0,
          sheen: 0.05,
          sheenColor: new THREE.Color('#e8dec6'),
          clearcoat: 0.08,
          clearcoatRoughness: 0.6,
          emissive: new THREE.Color('#1c1812'),
          emissiveIntensity: 0.04,
          flatShading: false,
        });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [cloned]);

  // Pedestal dimensions, in the wrapper's pre-scale local frame (same frame
  // the cloned bust sits in). Sized so the disc reads as a museum plinth —
  // roughly 1/4 the bust width, ~8% the bust height.
  const pedestalH = bbox.y * 0.09;
  const pedestalTopR = bbox.x * 0.22;
  const pedestalBottomR = bbox.x * 0.26;
  const pedestalY = -bbox.y / 2 - pedestalH / 2;

  useFrame(({ camera, size }) => {
    if (!ref.current) return;
    const p = scrollProgress();
    const k = sample(p);

    ref.current.rotation.y = FACE_FORWARD_Y + k.rotY;
    ref.current.rotation.x = k.rotX;

    // Anchor the bust so its CUT sits at world y=-1.7 (same as v1, before
    // the pedestal was added). The pedestal hangs naturally below this in
    // the group's local frame, so it appears just below the cut.
    const cutAnchorY = -1.7 - cutBottom;
    ref.current.position.set(k.posX, cutAnchorY + k.posY, 0);
    ref.current.scale.setScalar(normScale * k.scale);

    // Aspect-aware camera distance — gentle linear pullback at narrow
    // aspects. Tuned so a portrait phone (aspect ~0.46) shows the bust
    // at ~75% of desktop size, not ~50%. The bust is mostly vertical
    // (head dominates) so a little side-crop is fine.
    const aspect = size.height > 0 ? size.width / size.height : 1.6;
    const aspectMult = aspect < 1.6
      ? 1 + (1.6 - aspect) * 0.35
      : 1;
    camera.position.set(0, 0.2, k.camZ * aspectMult);
    camera.lookAt(0, 0.0, 0);
  });

  return (
    <group ref={ref}>
      <primitive object={cloned} />
      <mesh
        position={[0, pedestalY, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[pedestalTopR, pedestalBottomR, pedestalH, 48, 1, false]} />
        <meshPhysicalMaterial
          color={PEDESTAL_COLOR}
          roughness={0.92}
          metalness={0.0}
          clearcoat={0.0}
          sheen={0.02}
        />
      </mesh>
    </group>
  );
}

export default function Statue3D({ scrollProgress, active = true }: Statue3DProps) {
  // 962 K-vert bust + Draco + physical materials are GPU-expensive every
  // frame. When the hero is off-screen we drop frameloop to "never" so
  // scrolling through the lower sections doesn't pay for invisible draws.
  const frameloop: 'always' | 'never' = active ? 'always' : 'never';

  return (
    <Canvas
      camera={{ position: [0, 0.1, 6.4], fov: 32 }}
      shadows={{ type: PCFSoftShadowMap }}
      style={{ width: '100%', height: '100%', display: 'block' }}
      // Cap dpr at 1.5x instead of 2x. On a 4K-retina display the bust
      // doesn't visibly lose detail but the GPU pixel-fill drops by ~44 %.
      // Critical for tabs on integrated graphics not OOMing the GPU.
      dpr={[1, 1.5]}
      frameloop={frameloop}
      // Request the discrete GPU on hybrid systems; disable alpha so the
      // composite doesn't have to read back a transparent canvas.
      gl={{ powerPreference: 'high-performance', antialias: true, alpha: false, stencil: false }}
      aria-hidden="true"
    >
      <color attach="background" args={['#e0e0e0']} />

      {/* Lower ambient — lets the directional key carve dramatic shadows
          into the bust planes (deep recesses, sharp cheekbone falloff). */}
      <ambientLight intensity={0.22} color="#f0eee8" />

      {/* KEY — strong warm directional from upper-right. Casts the
          self-shadows that define the bust silhouette. Tighter shadow
          camera + 4096 map + soft PCF radius = cinematic falloff. */}
      <directionalLight
        position={[4.5, 7.5, 3.2]}
        intensity={3.8}
        color="#fff5e0"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.00018}
        shadow-normalBias={0.02}
        shadow-radius={4}
        shadow-camera-left={-2.2}
        shadow-camera-right={2.2}
        shadow-camera-top={2.4}
        shadow-camera-bottom={-2.4}
        shadow-camera-near={2}
        shadow-camera-far={18}
      />

      {/* FILL — soft warm from camera-side-low, lifts the dark recesses
          without flattening the key shadow. No shadow casting. */}
      <directionalLight
        position={[-2, 2, 5]}
        intensity={0.55}
        color="#f4ecd8"
      />

      {/* RIM — cool back-light from upper-left-back, traces the
          silhouette edge so the bust separates from the background. */}
      <directionalLight
        position={[-5, 5, -4]}
        intensity={1.4}
        color="#a8c2d6"
      />

      {/* TOP halo — small spotlight kissing the crown of the head from
          directly above-back, gives the hair/scalp a subtle highlight. */}
      <spotLight
        position={[0.5, 9, -2]}
        angle={0.55}
        penumbra={0.7}
        intensity={0.9}
        color="#fff2dc"
        distance={20}
      />

      {/* Hemisphere fill — sky/ground ambient bounce so the chin and
          neck recesses don't go pitch black. */}
      <hemisphereLight
        args={['#d8d4c8', '#2a2825', 0.40]}
      />

      <Suspense fallback={null}>
        <Bust scrollProgress={scrollProgress} />
        {/* Self-hosted studio HDR — same file drei's preset="studio" pulls
            from raw.githack.com, but bundled in /public/hdri/ so the page
            renders offline with no third-party fetch. */}
        <Environment files="/hdri/studio_small_03_512.hdr" environmentIntensity={0.45} />
      </Suspense>
    </Canvas>
  );
}
