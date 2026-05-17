import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Bounds } from '@react-three/drei';
import * as THREE from 'three';

// Wire drei's useGLTF to our local Draco decoder. Without this it tries the
// gstatic CDN which is fine in prod but breaks on offline / air-gapped runs.
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

function Bust({ scrollProgress, theme }: BustProps) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/bust.glb') as unknown as { scene: THREE.Group };

  const cloned = useMemo(() => scene.clone(true), [scene]);

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

  useFrame(({ camera }, dt) => {
    if (!ref.current) return;
    const p = scrollProgress();

    // continuous slow rotation
    ref.current.rotation.y += dt * 0.08;

    // mid-scroll camera dolly + lookAt rise (0.3 → 0.7)
    const t = THREE.MathUtils.smoothstep(p, 0.3, 0.7);
    const zoom = THREE.MathUtils.lerp(6, 3, t);
    camera.position.z = zoom;
    camera.position.y = THREE.MathUtils.lerp(0.5, 1.0, t);
    camera.lookAt(0, THREE.MathUtils.lerp(0, 0.6, t), 0);

    // bust slides out as scroll completes (0.7 → 1.0)
    const exit = THREE.MathUtils.smoothstep(p, 0.7, 1.0);
    ref.current.position.y = -exit * 2.5;
  });

  return <primitive ref={ref} object={cloned} />;
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
      camera={{ position: [0, 0.5, 6], fov: 30 }}
      shadows
      dpr={[1, 2]}
      aria-hidden="true"
    >
      <ambientLight intensity={ambient} />
      {/* Warm key — top-right, dramatic */}
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
      {/* Subtle warm fill */}
      <pointLight position={[2, -1, 4]} intensity={0.3} color="#fff4dc" />
      <Suspense fallback={<FallbackPrimitive />}>
        <Bounds fit clip observe margin={1.05}>
          <Bust
            scrollProgress={prefersReduced ? () => 0 : scrollProgress}
            theme={theme}
          />
        </Bounds>
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.55}
          scale={6}
          blur={3}
          far={3.5}
        />
        <Environment preset="apartment" />
      </Suspense>
    </Canvas>
  );
}

