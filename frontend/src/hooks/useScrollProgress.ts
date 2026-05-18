import { useEffect, useRef, type RefObject } from 'react';

/**
 * Returns a getter that yields 0..1 progress through a scroll-jacked section.
 *
 * `offset` accounts for a fixed/sticky header that takes the top N pixels of
 * the viewport. With offset=72, scrollY=0 already yields progress=0 (no dead
 * zone before the first pixel of scroll registers). Without it, the section's
 * `rect.top` starts at +offset and the first `offset` pixels of scroll would
 * be clamped to progress=0.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  offset = 0,
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
      // Effective stage height = section height - (vh - offset). The sticky
      // child fills (vh - offset), so the section "scroll-jacks" for
      // height - (vh - offset) pixels — i.e. height - vh + offset.
      const total = Math.max(1, rect.height - vh + offset);
      const scrolled = Math.min(total, Math.max(0, offset - rect.top));
      progressRef.current = scrolled / total;
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [ref, offset]);

  return () => progressRef.current;
}
