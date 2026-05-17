import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.setDecoderPath('/draco/');
useGLTF.preload('/models/bust.glb', true);

export type Statue3DProps = {
  scrollProgress: () => number;
  theme?: 'light' | 'dark';
};

type BustProps = {
  scrollProgress: () => number;
  theme: 'light' | 'dark';
};

// Smooth easing for stage transitions
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// Map p∈[0,1] to a 4-stage piecewise progress with smooth crossfades.
// Returns { stage: 0..3, local: 0..1 within stage, blend: smoothed local }
function stageOf(p: number) {
  const raw = Math.min(0.9999, Math.max(0, p)) * 4; // 0..4
  const stage = Math.floor(raw);
  const local = raw - stage;
  return { stage, local, blend: easeInOut(local) };
}

function Bust({ scrollProgress, theme }: BustProps) {
  const ref = useRef<THREE.Group>(null);
  const spinRef = useRef(0);
  const { scene } = useGLTF('/models/bust.glb') as unknown as {
    scene: THREE.Group;
  };

  // Compute & cache the source bounding box so we can centre + scale the bust
  // explicitly. Shift the pivot DOWN by half the bust height so the head sits
  // at world Y≈0 (viewport vertical centre) rather than the bbox centre being
  // at the neck — this is what plants the head INSIDE the lockup band.
  const { cloned, normScale, bustHeight } = useMemo(() => {
    const c = scene.clone(true);
    const box = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    // Recentre so origin is at the bbox centre (neck/upper-chest).
    c.position.sub(center);
    // Uniform scale: target bust height ~ 3.6 units (slightly larger than before).
    const tallest = Math.max(size.x, size.y, size.z);
    const n = tallest > 0 ? 3.6 / tallest : 1;
    return { cloned: c, normScale: n, bustHeight: size.y * n };
  }, [scene]);

  // Re-shade to warm cream marble (no clearcoat — was reading plastic-y).
  useMemo(() => {
    const marbleColor = theme === 'dark' ? '#d8d4ca' : '#f0ebe2';
    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: marbleColor,
          roughness: 0.55,
          metalness: 0.0,
          sheen: 0.05,
          sheenColor: new THREE.Color('#e8dfc8'),
        });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [cloned, theme]);

  // 4-section scroll choreography — Monolith-style.
  // Camera stays roughly stationary; the bust turns + drifts. The continuous
  // background spin is accumulated in `spinRef` so it never gets clobbered
  // by per-frame target-rotation writes.
  useFrame(({ camera }, dt) => {
    if (!ref.current) return;
    const p = scrollProgress();
    const { stage, blend } = stageOf(p);

    // Continuous slow base spin — accumulates regardless of stage maths.
    spinRef.current += dt * 0.08;

    // Per-stage rotation OFFSETS (small, deliberate turns — never a full
    // revolution between stages, so the head never disappears entirely).
    const STAGE_ROT = [0, 0.6, 1.3, 2.1]; // radians ≈ 0°, 34°, 75°, 120°
    const baseRot = STAGE_ROT[stage];
    const nextRot = STAGE_ROT[Math.min(3, stage + 1)];
    const targetRot = THREE.MathUtils.lerp(baseRot, nextRot, blend);
    ref.current.rotation.y = spinRef.current + targetRot;

    // Position the bust so its HEAD sits in the upper third of the viewport
    // (right inside the TCARD lockup band). The mesh's pivot is at its bbox
    // centre, so we shift world Y DOWN by half its height to plant the head
    // near origin (camera looks at 0,0,0). Small per-stage tweaks for life.
    const headLift = -bustHeight / 2 + 0.35; // bring head up into lockup
    const STAGE_BUSTY = [headLift, headLift + 0.1, headLift - 0.05, headLift + 0.3];
    const bustY = THREE.MathUtils.lerp(
      STAGE_BUSTY[stage],
      STAGE_BUSTY[Math.min(3, stage + 1)],
      blend,
    );
    ref.current.position.y = bustY;

    // Camera: tight band — stationary X, gentle Z dolly only on stage 1.
    const CAM_Z = [5.4, 4.4, 5.0, 5.8];
    const camZ = THREE.MathUtils.lerp(
      CAM_Z[stage],
      CAM_Z[Math.min(3, stage + 1)],
      blend,
    );
    camera.position.set(0, 0.4, camZ);
    camera.lookAt(0, 0.1, 0);
  });

  return (
    <primitive
      ref={ref}
      object={cloned}
      scale={[normScale, normScale, normScale]}
      position={[0, 0, 0]}
    />
  );
}

export default function Statue3D({
  scrollProgress,
  theme = 'light',
}: Statue3DProps) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ambient = theme === 'dark' ? 0.1 : 0.2;

  return (
    <Canvas
      camera={{ position: [0, 0.4, 6], fov: 32 }}
      shadows
      dpr={[1, 2]}
      aria-hidden="true"
    >
      <ambientLight intensity={ambient} />
      {/* Dramatic warm key — top-right */}
      <directionalLight
        position={[4, 7, 5]}
        intensity={3.2}
        color="#fff0d4"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      />
      {/* Cold rim — back-left */}
      <directionalLight position={[-6, 1, -3]} intensity={0.9} color="#7d96b8" />
      {/* Warm fill */}
      <pointLight position={[2, -1, 4]} intensity={0.3} color="#fff4dc" />
      <Suspense fallback={null}>
        <Bust
          scrollProgress={prefersReduced ? () => 0 : scrollProgress}
          theme={theme}
        />
        <ContactShadows
          position={[0, -1.7, 0]}
          opacity={0.45}
          scale={6}
          blur={3}
          far={3.5}
        />
        <Environment preset="apartment" />
      </Suspense>
    </Canvas>
  );
}
