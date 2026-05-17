import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.setDecoderPath('/draco/');
useGLTF.preload('/models/bust_smooth_draco.glb', true);

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

const KEYS: Keyframe[] = [
  { p: 0.00, rotY:  0.00, rotX:  0.00, posX:  0.00, posY:  0.00, scale: 1.00, camZ: 6.4 },
  { p: 0.20, rotY:  0.45, rotX:  0.10, posX:  0.55, posY: -0.10, scale: 1.10, camZ: 5.6 },
  { p: 0.40, rotY:  0.20, rotX: -0.05, posX:  0.25, posY:  0.40, scale: 1.40, camZ: 4.8 },
  { p: 0.60, rotY: -1.20, rotX:  0.00, posX: -0.45, posY:  0.20, scale: 1.15, camZ: 5.2 },
  { p: 0.80, rotY: -2.10, rotX:  0.05, posX: -0.25, posY:  0.05, scale: 1.00, camZ: 5.6 },
  { p: 1.00, rotY: -0.50, rotX:  0.00, posX:  0.00, posY:  0.00, scale: 0.90, camZ: 6.6 },
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

  useFrame(({ camera }) => {
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

    camera.position.set(0, 0.2, k.camZ);
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
  const prefersReduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 962 K-vert bust + Draco + physical materials are GPU-expensive every
  // frame. When the hero is off-screen we drop frameloop to "never" so
  // scrolling through the lower sections doesn't pay for invisible draws.
  const frameloop: 'always' | 'never' = active && !prefersReduced ? 'always' : 'never';

  return (
    <Canvas
      camera={{ position: [0, 0.1, 6.4], fov: 32 }}
      shadows
      dpr={[1, 2]}
      frameloop={frameloop}
      aria-hidden="true"
    >
      <color attach="background" args={['#e0e0e0']} />

      {/* Low ambient — let the directional key carve the form. The monolith
          reference has clearly deep shadows on the recessed side of the bust. */}
      <ambientLight intensity={0.28} color="#f0eee8" />

      {/* Strong, slightly warm key from upper-right. Casts the dramatic
          shadows that define the marble. */}
      <directionalLight
        position={[5, 8, 3.5]}
        intensity={3.4}
        color="#fff7e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0004}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-camera-near={1}
        shadow-camera-far={20}
      />

      {/* Cool rim from upper-back-left so the silhouette edge picks up a
          subtle blue cast (visible on the reference's left shoulder). */}
      <directionalLight
        position={[-6, 4, -3]}
        intensity={0.9}
        color="#b0bccc"
      />

      {/* Very subtle fill from below-front so the chin/jaw isn't pitch black. */}
      <hemisphereLight
        args={['#d8d4c8', '#3a3833', 0.35]}
      />

      <Suspense fallback={null}>
        <Bust scrollProgress={prefersReduced ? () => 0 : scrollProgress} />
        <ContactShadows
          position={[0, -1.95, 0]}
          opacity={0.55}
          scale={4}
          blur={2.2}
          far={2.6}
          resolution={1024}
        />
        <Environment preset="studio" environmentIntensity={0.35} />
      </Suspense>
    </Canvas>
  );
}
