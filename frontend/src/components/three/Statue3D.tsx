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
  const { scene } = useGLTF('/models/bust.glb') as unknown as {
    scene: THREE.Group;
  };

  // Compute & cache the source bounding box so we can centre + scale the bust
  // explicitly (no Bounds auto-fit — the auto-frame was making the bust read
  // as a small adrift sliver instead of a viewport-dominating sculpture).
  const { cloned, centerY, normScale } = useMemo(() => {
    const c = scene.clone(true);
    const box = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    // Translate the mesh so its bounding-box centre sits at origin
    c.position.sub(center);
    // Pick a uniform scale so the tallest dim spans ~3 units (viewport-y dominant)
    const tallest = Math.max(size.x, size.y, size.z);
    const n = tallest > 0 ? 3.2 / tallest : 1;
    return { cloned: c, centerY: center.y, normScale: n };
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
  }, [cloned, theme, centerY]);

  // 4-section scroll choreography — matches Monolith's staged scrolljack feel.
  // Stage 0  : front-on, slow Y-spin, camera mid-distance.
  // Stage 1  : 3/4 turn right, camera dollies in on the face.
  // Stage 2  : side profile (90°), camera pulls back, bust drifts up.
  // Stage 3  : back-of-head into oblique, bust slides off-screen as we exit.
  useFrame(({ camera }, dt) => {
    if (!ref.current) return;
    const p = scrollProgress();
    const { stage, blend } = stageOf(p);

    // Continuous slow base rotation (felt motion when sitting at one section)
    ref.current.rotation.y += dt * 0.06;

    // Per-stage additive Y rotation offset
    const STAGE_ROT = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
    const baseRot = STAGE_ROT[stage] ?? 0;
    const nextRot = STAGE_ROT[Math.min(3, stage + 1)] ?? STAGE_ROT[3];
    const targetRot = THREE.MathUtils.lerp(baseRot, nextRot, blend);
    // Apply target rotation as a Y offset added to the continuous spin
    ref.current.rotation.y =
      (ref.current.rotation.y % (Math.PI * 2)) * 0.4 + targetRot;

    // Per-stage camera + bust vertical positioning
    const CAM_Z = [6.0, 3.6, 5.4, 7.5];
    const CAM_Y = [0.4, 1.05, 0.6, 0.2];
    const TARGET_Y = [0.0, 0.55, 0.2, -0.4];
    const BUST_Y = [0.0, 0.0, 0.25, -1.8];

    const camZ = THREE.MathUtils.lerp(
      CAM_Z[stage],
      CAM_Z[Math.min(3, stage + 1)],
      blend,
    );
    const camY = THREE.MathUtils.lerp(
      CAM_Y[stage],
      CAM_Y[Math.min(3, stage + 1)],
      blend,
    );
    const targetY = THREE.MathUtils.lerp(
      TARGET_Y[stage],
      TARGET_Y[Math.min(3, stage + 1)],
      blend,
    );
    const bustY = THREE.MathUtils.lerp(
      BUST_Y[stage],
      BUST_Y[Math.min(3, stage + 1)],
      blend,
    );

    camera.position.x = 0;
    camera.position.y = camY;
    camera.position.z = camZ;
    camera.lookAt(0, targetY, 0);
    ref.current.position.y = bustY;
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

function FallbackPrimitive() {
  return (
    <mesh position={[0, 0, 0]}>
      <capsuleGeometry args={[0.7, 1.4, 8, 16]} />
      <meshStandardMaterial color="#e8e3d6" roughness={0.7} />
    </mesh>
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
      <Suspense fallback={<FallbackPrimitive />}>
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
