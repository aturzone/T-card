import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.setDecoderPath('/draco/');
useGLTF.preload('/models/bust.glb', true);

export type Statue3DProps = {
  scrollProgress: () => number;
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

// First-pass keyframes derived from monolithstudio.com captures (ref-monolith-s*.png).
// p = 0..1 progress through the pinned hero region. The bust rests at p=0
// (facing camera, centered) and snaps poses on scroll.
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

// With both X (+π/2) and Z (+π/2) baked into the cloned mesh, the face ends
// up pointing world -Z (away from camera). Outer group Y rotation of π flips
// it 180° to world +Z (toward camera) at the rotY=0 keyframe.
const FACE_FORWARD_Y = Math.PI;

// Pre-Z rotation around X to flip the bust so the head points up and the
// torso cut faces down. The sign is +π/2 — verified empirically (-π/2 puts
// the bust head-down).
const STAND_UPRIGHT_X = Math.PI / 2;

function Bust({ scrollProgress }: BustProps) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/bust.glb') as unknown as {
    scene: THREE.Group;
  };

  // Bake the orientation fix into the cloned mesh so the bust is upright
  // and facing the camera at the rotY=0 keyframe:
  //   - rotate +π/2 around Z to stand the bust upright (its tall axis is +X
  //     in the GLB — laid on its side natively)
  //   - rotate +π/2 around Y to bring the carved face toward -Z (camera)
  // The outer group ref then applies per-stage rotY around world Y.
  const { cloned, normScale, cutBottom } = useMemo(() => {
    const c = scene.clone(true);
    // Bake both orientation fixes:
    //   - X rotation: head up, cut perpendicular to the floor (-π/2 around X)
    //   - Z rotation: stand the bust upright (its tall axis is +X in the GLB)
    // Three.js Euler default order is 'XYZ' (intrinsic), so X is applied
    // first, then the rotated Z axis takes the bust upright.
    c.rotation.set(STAND_UPRIGHT_X, 0, Math.PI / 2);
    c.updateMatrixWorld(true);
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
    };
  }, [scene]);

  // Single-palette marble — cream-warm so it reads as sculpture against
  // the #e0e0e0 monolith-grey canvas. No theme branch.
  useMemo(() => {
    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: '#ece5d4',
          roughness: 0.52,
          metalness: 0.0,
          sheen: 0.08,
          sheenColor: new THREE.Color('#f0e2c2'),
          emissive: new THREE.Color('#1a1612'),
          emissiveIntensity: 0.08,
        });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [cloned]);

  // Scroll-bound. No `dt`, no time accumulator, no Math.sin. Every transform
  // is a pure function of scrollProgress() — bust is stone-still when scroll
  // is stone-still.
  useFrame(({ camera }) => {
    if (!ref.current) return;
    const p = scrollProgress();
    const k = sample(p);

    ref.current.rotation.y = FACE_FORWARD_Y + k.rotY;
    ref.current.rotation.x = k.rotX;

    // Anchor the bust so its CUT (bottom of the torso) sits ~1 world unit
    // below frame center — right above the contact-shadow plane at y=-1.7.
    // Head then sits in the upper third of the viewport.
    const cutAnchorY = -1.7 - cutBottom; // group offset so cutBottom lands at y=-1.7
    ref.current.position.set(k.posX, cutAnchorY + k.posY, 0);
    ref.current.scale.setScalar(normScale * k.scale);

    camera.position.set(0, 0.2, k.camZ);
    camera.lookAt(0, 0.0, 0);
  });

  return (
    <group ref={ref}>
      <primitive object={cloned} />
    </group>
  );
}

export default function Statue3D({ scrollProgress }: Statue3DProps) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <Canvas
      camera={{ position: [0, 0.1, 6.4], fov: 32 }}
      shadows
      dpr={[1, 2]}
      aria-hidden="true"
    >
      {/* Single-palette canvas — matches body background (#e0e0e0) so the
          bust dissolves into the page as a marble portrait, not a black hole. */}
      <color attach="background" args={['#e0e0e0']} />
      <ambientLight intensity={0.55} />
      {/* Soft key — top-right, slightly cooler than before so the marble
          doesn't go bone-white on a light backdrop. */}
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.8}
        color="#fff6e3"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-6, 1, -3]} intensity={0.6} color="#a8bcd6" />
      <pointLight position={[2, -1, 4]} intensity={0.25} color="#fff4dc" />
      <Suspense fallback={null}>
        <Bust scrollProgress={prefersReduced ? () => 0 : scrollProgress} />
        <ContactShadows
          position={[0, -1.7, 0]}
          opacity={0.32}
          scale={6}
          blur={3}
          far={3.5}
        />
        <Environment preset="apartment" />
      </Suspense>
    </Canvas>
  );
}
