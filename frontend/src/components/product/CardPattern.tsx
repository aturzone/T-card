import { brandIcon } from '@/data/brand-icons';
import { BRANDS } from '@/data/brands';

interface CardPatternProps {
  brandId: string;
}

/**
 * Per-card background watermark.
 *
 * Strategy:
 *  - If the brand has a real Simple Icons mark, render it huge in the corner
 *    with high blur + low opacity (it reads as a brand-tinted halo).
 *  - Otherwise, fall back to one of four abstract pattern families
 *    (deterministically chosen by index) — same logic the original design used.
 */
export function CardPattern({ brandId }: CardPatternProps) {
  const ic = brandIcon(brandId);

  if (ic) {
    // Huge blurred brand glyph as a watermark
    return (
      <svg viewBox="0 0 400 250" preserveAspectRatio="xMaxYMid slice" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id={`blur-${brandId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
        </defs>
        {/* Soft radial glow */}
        <circle cx="340" cy="50" r="160" fill="white" opacity="0.06" />
        {/* Big blurred brand mark */}
        <g
          transform="translate(220, -30) scale(11)"
          fill="white"
          opacity="0.18"
          filter={`url(#blur-${brandId})`}
        >
          <path d={ic.path} />
        </g>
        {/* Crisp accent mark on top, faint */}
        <g transform="translate(290, 30) scale(4.5)" fill="white" opacity="0.08">
          <path d={ic.path} />
        </g>
      </svg>
    );
  }

  // Fallback — original abstract patterns
  const idx = Math.max(0, BRANDS.findIndex((b) => b.id === brandId)) % 4;

  if (idx === 0) {
    return (
      <svg viewBox="0 0 400 250" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id={`p-${brandId}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="250" fill={`url(#p-${brandId})`} />
        <circle cx="320" cy="60" r="120" fill="white" opacity="0.08" />
        <circle cx="340" cy="40" r="60" fill="white" opacity="0.06" />
      </svg>
    );
  }
  if (idx === 1) {
    return (
      <svg viewBox="0 0 400 250" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={-50 + i * 40} y1="0" x2={50 + i * 40} y2="250" stroke="white" strokeWidth="0.6" opacity="0.25" />
        ))}
      </svg>
    );
  }
  if (idx === 2) {
    return (
      <svg viewBox="0 0 400 250" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <circle key={i} cx="380" cy="40" r={30 + i * 30} fill="none" stroke="white" strokeWidth="0.8" opacity="0.18" />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <path d="M0,200 Q100,160 200,180 T400,150 L400,250 L0,250 Z" fill="white" opacity="0.08" />
      <path d="M0,180 Q100,140 200,160 T400,130" stroke="white" strokeWidth="0.6" fill="none" opacity="0.3" />
      <path d="M0,210 Q100,170 200,190 T400,160" stroke="white" strokeWidth="0.6" fill="none" opacity="0.2" />
    </svg>
  );
}
