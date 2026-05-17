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
    // Warmer cream marble — slightly brighter than before so it reads
    // sculpted against the new black canvas backdrop.
    const marbleColor = theme === 'dark' ? '#dcd6c9' : '#ece5d4';
    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: marbleColor,
          roughness: 0.5,
          metalness: 0.0,
          sheen: 0.08,
          sheenColor: new THREE.Color('#f0e2c2'),
          // Subtle subsurface-ish softness via emissive at 0 + low spec
          emissive: new THREE.Color('#1a1612'),
          emissiveIntensity: 0.12,
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

    // Time accumulator for the breathing wobble. NOT a full continuous spin —
    // user wanted "shake", not a rotating display piece.
    spinRef.current += dt;

    // Bust faces the camera. David's STL faces +X in its local frame, so a
    // -π/2 rotation around Y brings the carved face forward to -Z.
    const FACE_FORWARD = 0;
    // Per-stage Y rotation offsets — small turns so the head never disappears.
    const STAGE_ROT = [
      FACE_FORWARD + 0.0,
      FACE_FORWARD + 0.45,
      FACE_FORWARD - 0.35,
      FACE_FORWARD + 0.7,
    ];
    const baseRot = STAGE_ROT[stage];
    const nextRot = STAGE_ROT[Math.min(3, stage + 1)];
    const targetRot = THREE.MathUtils.lerp(baseRot, nextRot, blend);
    // Subtle breathing wobble (~±5° on Y, ~±2° on X, ~12-second period).
    const wobbleY = Math.sin(spinRef.current * 0.45) * 0.09;
    const wobbleX = Math.sin(spinRef.current * 0.32 + 1.3) * 0.04;
    ref.current.rotation.y = targetRot + wobbleY;
    ref.current.rotation.x = wobbleX;

    // Position the bust so its HEAD sits in the upper third of the viewport
    // (right inside the TCARD lockup band). The mesh's pivot is at its bbox
    // centre, so we shift world Y DOWN by half its height to plant the head
    // near origin (camera looks at 0,0,0). Small per-stage tweaks for life.
    // Lift the bust so the head's crown is at world Y≈+0.4. Camera looks at
    // (0, 0.1, 0), so the FACE lands near the camera target — bust reads as a
    // proper portrait, not a top-down crown view.
    const headLift = -bustHeight / 2 + 0.4;
    const STAGE_BUSTY = [headLift, headLift + 0.05, headLift - 0.08, headLift + 0.12];
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
      {/* Black backdrop — the marble glows only against deep ink (this is the
          Monolith trick — their canvas bg is rgb(1,1,1) and the bust reads
          like a museum spotlight against it). Works for both themes since
          the bust is the focal anchor either way. */}
      <color attach="background" args={['#0a0a0a']} />
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
