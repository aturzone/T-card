import { test, expect } from '@playwright/test';

/**
 * Hits every route in HashRouter form, asserts the page renders + no console
 * errors. Mirrors tests/routes.test.tsx but in a real browser.
 */
const ROUTES: Array<[string, RegExp]> = [
  // Home hero is Wave 3 — until then either the new TCARD lockup or legacy copy is fine.
  ['#/',                      /TCARD|Gift cards, beautifully delivered/i],
  ['#/shop',                  /BRANDS/],
  ['#/shop?cat=gaming',       /BRANDS/],
  ['#/product/amazon',        /Amazon/i],
  ['#/product/does-not-exist',/Not found/i],
  ['#/about',                 /ABOUT/],
  ['#/faq',                   /QUESTIONS/],
  ['#/contact',               /CONTACT/],
  ['#/how',                   /HOW IT WORKS/],
  ['#/account',               /ACCOUNT/],
  ['#/terms',                 /LEGAL|Terms of Service/],
  ['#/privacy',               /LEGAL|Privacy Policy/],
  ['#/cookies',               /LEGAL|Cookies/],
  ['#/zzz-not-real',          /404/],
];

for (const [hash, marker] of ROUTES) {
  test(`route ${hash} renders cleanly`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/' + hash);
    await expect(page.getByText(marker).first()).toBeVisible();
    expect(errors, `console/page errors on ${hash}`).toEqual([]);
  });
}
