import { brandIcon } from '@/data/brand-icons';
import type { Brand } from '@/data/types';

interface BrandMarkProps {
  brand: Brand;
  size: number;       // px
  /** Background tint behind the glyph. Ignored in monolith mode (no container fill). */
  bg?: string;
  /** Color of the glyph. */
  color?: string;
}

/**
 * Renders the brand's real Simple Icons glyph when available, otherwise the
 * `initial` letter monogram. Used inside the gift card art.
 *
 * Monolith redesign: no rounded container, no background fill. Icon renders
 * at its natural size in a transparent square frame.
 */
export function BrandMark({ brand, size, color }: BrandMarkProps) {
  const ic = brandIcon(brand.id);
  const fg = color ?? brand.palette.accent;

  if (ic) {
    return (
      <span
        className="logo-mark"
        style={{
          width: size,
          height: size,
          background: 'transparent',
          color: fg,
          borderRadius: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label={brand.name.en}
      >
        <svg viewBox={ic.viewBox} width={size} height={size} fill="currentColor" aria-hidden="true">
          <path d={ic.path} />
        </svg>
      </span>
    );
  }

  // Fallback to letter monogram — display sans, uppercase, weight 700, no container.
  return (
    <span
      className="logo-mark font-display"
      style={{
        width: size,
        height: size,
        background: 'transparent',
        color: fg,
        fontSize: size,
        fontWeight: 700,
        textTransform: 'uppercase',
        borderRadius: 0,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {brand.initial}
    </span>
  );
}
