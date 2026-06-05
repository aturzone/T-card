import { useEffect } from 'react';
import Lenis from 'lenis';

const REDUCED_MOTION_PARAM = 'reducedmotion=1';

function shouldDisable(): boolean {
  if (typeof window === 'undefined') return true;
  const { search, hash } = window.location;
  return search.includes(REDUCED_MOTION_PARAM) || hash.includes(REDUCED_MOTION_PARAM);
}

export function useLenis() {
  useEffect(() => {
    if (shouldDisable()) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      syncTouch: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
