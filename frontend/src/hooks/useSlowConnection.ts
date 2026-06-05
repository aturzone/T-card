import { useEffect, useState } from 'react';

/**
 * Detect a slow network so heavy hero assets (3D bust, HDR environment)
 * can be skipped in favor of the static SVG silhouette. Hits the 5s-on-3G
 * goal — without this, the bust GLB alone is ~50s on real 3G.
 *
 * Slow = effectiveType ∈ {slow-2g, 2g, 3g} OR saveData flag set OR
 * downlink under 1.5 Mbps. Returns `false` on browsers without Network
 * Information API (treats them as fast).
 */
type Conn = {
  effectiveType?: string;
  downlink?: number;
  saveData?: boolean;
  addEventListener?: (k: string, fn: () => void) => void;
  removeEventListener?: (k: string, fn: () => void) => void;
};

function readConn(): Conn | undefined {
  if (typeof navigator === 'undefined') return undefined;
  return (navigator as unknown as { connection?: Conn }).connection;
}

function urlOverride(): boolean | null {
  if (typeof window === 'undefined') return null;
  const qs = (window.location.search || '') + (window.location.hash || '');
  if (/(\?|&|#)slow=1\b/.test(qs)) return true;
  if (/(\?|&|#)fast=1\b/.test(qs)) return false;
  return null;
}

function stickyFlag(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem('tcard.slownet') === '1';
  } catch {
    return false;
  }
}

function isSlow(c?: Conn): boolean {
  const override = urlOverride();
  if (override !== null) return override;
  if (stickyFlag()) return true;
  if (!c) return false;
  if (c.saveData) return true;
  if (c.effectiveType && /^(slow-2g|2g|3g)$/.test(c.effectiveType)) return true;
  if (typeof c.downlink === 'number' && c.downlink > 0 && c.downlink < 1.5) return true;
  return false;
}

export function isSlowConnectionNow(): boolean {
  return isSlow(readConn());
}

export function useSlowConnection(): boolean {
  const [slow, setSlow] = useState(() => isSlow(readConn()));
  useEffect(() => {
    const c = readConn();
    if (!c?.addEventListener) return;
    const onChange = () => setSlow(isSlow(c));
    c.addEventListener('change', onChange);
    return () => c.removeEventListener?.('change', onChange);
  }, []);
  return slow;
}
