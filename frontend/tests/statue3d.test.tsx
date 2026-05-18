import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as THREE from 'three';

// Mock drei BEFORE importing the component under test. We stub:
//  - useGLTF to return a fake scene (with .clone) holding a single mesh so the
//    component's traversal + material override paths execute without touching GLTFLoader.
//  - useGLTF.preload to a no-op (otherwise module load triggers a network fetch).
//  - Environment + ContactShadows to inert nulls so we don't need an Environment preset
//    HDR file fetched at test time.
vi.mock('@react-three/drei', () => {
  const fakeScene = new THREE.Group();
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial(),
  );
  fakeScene.add(mesh);

  const useGLTF = Object.assign(
    () => ({ scene: fakeScene }),
    {
      preload: () => undefined,
      setDecoderPath: () => undefined,
    },
  );

  return {
    useGLTF,
    Environment: () => null,
    ContactShadows: () => null,
    Bounds: ({ children }: { children: React.ReactNode }) => children,
  };
});

import Statue3D from '@/components/three/Statue3D';
import Statue3DStatic from '@/components/three/Statue3DStatic';

describe('Statue3DStatic', () => {
  it('renders an SVG with role=presentation and aria-hidden', () => {
    const { container } = render(<Statue3DStatic />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('role')).toBe('presentation');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    // Path data inlined.
    expect(svg?.querySelector('path')).not.toBeNull();
  });
});

describe('Statue3D', () => {
  it('renders a <canvas> element', () => {
    const { container } = render(
      <Statue3D scrollProgress={() => 0} theme="light" />,
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });
});
