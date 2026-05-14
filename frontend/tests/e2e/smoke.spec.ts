import { test, expect } from '@playwright/test';

/**
 * Hits every route in HashRouter form, asserts the page renders + no console
 * errors. Mirrors tests/routes.test.tsx but in a real browser.
 */
const ROUTES: Array<[string, RegExp]> = [
  ['#/',                      /Gift cards, beautifully delivered/i],
  ['#/shop',                  /All gift cards/i],
  ['#/shop?cat=gaming',       /All gift cards/i],
  ['#/product/amazon',        /Amazon/i],
  ['#/product/does-not-exist',/Not found/i],
  ['#/about',                 /About/i],
  ['#/faq',                   /Questions, answered/i],
  ['#/contact',               /Talk to us/i],
  ['#/how',                   /Three steps/i],
  ['#/account',               /Welcome back/i],
  ['#/terms',                 /Terms of Service/i],
  ['#/privacy',               /Privacy Policy/i],
  ['#/cookies',               /Cookies/i],
  ['#/zzz-not-real',          /Page not found/i],
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
