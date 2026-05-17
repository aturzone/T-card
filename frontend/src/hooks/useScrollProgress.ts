import { useEffect, useRef, type RefObject } from 'react';

export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
): () => number {
  const progressRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) {
        raf = requestAnimationFrame(update);
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = Math.max(1, rect.height - vh);
      const scrolled = Math.min(total, Math.max(0, -rect.top));
      progressRef.current = scrolled / total;
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [ref]);

  return () => progressRef.current;
}
