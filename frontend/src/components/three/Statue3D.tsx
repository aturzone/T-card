import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

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
  // Draco-compressed GLB lives in /public/models/bust.glb.
  // drei's useGLTF auto-wires the Draco decoder; decoder files ship under /public/draco/.
  const { scene } = useGLTF('/models/bust.glb') as unknown as { scene: THREE.Group };

  // Clone so we never mutate the cached source scene across mounts/themes.
  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Re-shade every mesh to matte white marble, independent of source materials.
  useMemo(() => {
    const marbleColor = theme === 'dark' ? '#e2dfd7' : '#f5f3ed';
    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: marbleColor,
          roughness: 0.65,
          metalness: 0.0,
          sheen: 0.1,
          sheenColor: new THREE.Color('#fff8e8'),
        });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [cloned, theme]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.1; // slow continuous spin
    const p = scrollProgress();
    ref.current.rotation.x = p * 0.15; // gentle forward tilt on scroll
    ref.current.position.y = -1.2 - p * 1.2; // sinks slightly on scroll
  });

  return <primitive ref={ref} object={cloned} scale={2.4} position={[0, -1.2, 0]} />;
}

// Preload the model so the bust GLB is fetched as soon as this module is imported.
useGLTF.preload('/models/bust.glb');

export default function Statue3D({ scrollProgress, theme = 'light' }: Statue3DProps) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ambientIntensity = theme === 'dark' ? 0.15 : 0.25;

  return (
    <Canvas
      camera={{ position: [0, 0.5, 5.5], fov: 32 }}
      shadows
      dpr={[1, 2]}
      aria-hidden="true"
    >
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.0}
        color="#fff4e0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 2, -3]} intensity={0.4} color="#c8d4ff" />
      <Suspense fallback={null}>
        <Bust
          scrollProgress={prefersReduced ? () => 0 : scrollProgress}
          theme={theme}
        />
        <ContactShadows
          position={[0, -2.2, 0]}
          opacity={0.35}
          scale={6}
          blur={2.5}
          far={4}
        />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  );
}
