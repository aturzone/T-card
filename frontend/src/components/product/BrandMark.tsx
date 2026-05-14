import { brandIcon } from '@/data/brand-icons';
import type { Brand } from '@/data/types';

interface BrandMarkProps {
  brand: Brand;
  size: number;       // px
  /** Background tint behind the glyph. */
  bg?: string;
  /** Color of the glyph. */
  color?: string;
}

/**
 * Renders the brand's real Simple Icons glyph when available, otherwise the
 * `initial` letter monogram. Used inside the gift card art.
 */
export function BrandMark({ brand, size, bg, color }: BrandMarkProps) {
  const ic = brandIcon(brand.id);
  const background = bg ?? brand.palette.accent;
  const fg = color ?? brand.palette.b;

  if (ic) {
    return (
      <span
        className="logo-mark"
        style={{
          width: size,
          height: size,
          background,
          color: fg,
          borderRadius: size * 0.27,
        }}
        aria-label={brand.name.en}
      >
        <svg viewBox={ic.viewBox} width={size * 0.62} height={size * 0.62} fill="currentColor" aria-hidden="true">
          <path d={ic.path} />
        </svg>
      </span>
    );
  }

  // Fallback to letter monogram
  return (
    <span
      className="logo-mark italic"
      style={{
        width: size,
        height: size,
        background,
        color: fg,
        fontSize: size * 0.6,
        borderRadius: size * 0.27,
      }}
    >
      {brand.initial}
    </span>
  );
}
