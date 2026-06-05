import { useEffect, useState } from 'react';

/**
 * Detects whether the current browser/environment can actually create a
 * WebGL2 context. Returns null during SSR / first render, then true/false.
 *
 * Why: in Lighthouse headless audits (and on the rare device without GPU
 * accel), three.js logs noisy errors when WebGL fails. By gating the
 * `<Statue3D>` Canvas on this, we degrade gracefully to the SVG
 * silhouette instead of polluting the console — which boosts the
 * Lighthouse Best-Practices score from 96 to 100.
 */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}
