import { useEffect, useRef, useState } from 'react';

export function useReveal<T extends Element = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return { ref, shown };
}
