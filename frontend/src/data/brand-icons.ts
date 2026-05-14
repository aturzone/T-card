import {
  siGoogleplay,
  siAppstore,
  siSteam,
  siPlaystation,
  siRoblox,
  siNetflix,
  siSpotify,
  siYoutube,
  siRazer,
  siUbereats,
  siStarbucks,
  siVisa,
} from 'simple-icons';

type SimpleIcon = { title: string; slug: string; svg: string; path: string; hex: string };

/**
 * Brand id → Simple Icons glyph (or null).
 *
 * simple-icons is SIL-OFL/CC0 — used by GitHub, Vercel, shadcn, etc.
 * A few brands aren't in the pack (Amazon, Xbox, Nintendo, Disney+) due to
 * trademark policies — those fall back to the typographic monogram defined by
 * `brand.initial` in brands.ts.
 */
const ICONS: Record<string, SimpleIcon | null> = {
  amazon: null,
  'google-play': siGoogleplay,
  'app-store': siAppstore,
  steam: siSteam,
  playstation: siPlaystation,
  xbox: null,
  nintendo: null,
  roblox: siRoblox,
  netflix: siNetflix,
  spotify: siSpotify,
  'disney-plus': null,
  'youtube-premium': siYoutube,
  'razer-gold': siRazer,
  'uber-eats': siUbereats,
  starbucks: siStarbucks,
  'visa-prepaid': siVisa,
};

export interface BrandIcon {
  path: string;
  viewBox: string;
}

export function brandIcon(brandId: string): BrandIcon | null {
  const ic = ICONS[brandId];
  if (!ic) return null;
  return { path: ic.path, viewBox: '0 0 24 24' };
}
