/**
 * Single source of truth for the shop's public contact details + trust seals.
 * Consumed by the footer and the contact page so the numbers never drift.
 *
 * The localized, human-readable forms (Persian digits, full address) live in
 * i18n.ts under `info_phone` / `info_address`. Keep them in sync with the raw
 * values below.
 */
export const COMPANY = {
  /** Raw number for the `tel:` link — always latin digits, no spaces. */
  phoneTel: '+985137417087',
  email: 'hello@t-card.co',
  /** Maps deep-link for the office address (opens in a new tab). */
  mapsUrl: 'https://www.google.com/maps?q=مشهد+خیابان+۱۵متری+هاشمی‌نژاد',

  /**
   * eNamad — «نماد اعتماد الکترونیکی», Iran's official e-commerce trust seal.
   * These come from the embed snippet in the eNamad panel (trustseal.enamad.ir).
   *
   * The seal only renders on the *registered domain* — on localhost / an
   * unapproved domain the official image won't load, so the badge falls back to
   * a self-contained placeholder (see components/ui/Enamad.tsx).
   */
  enamad: {
    id: '734609',
    code: '84QwUiUGSRz64w0NtTsqm84KA74uv5An',
  },
} as const;
