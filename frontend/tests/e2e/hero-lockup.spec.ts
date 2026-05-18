import { test, expect } from '@playwright/test';

/**
 * The Wave-2 page-name lockup is intentionally enormous (clamp(72px, 16vw, 240px))
 * — this spec just sanity-checks that the rendered h1 on the headline routes is
 * physically tall, i.e. the lockup CSS is in effect and not a 32-px fallback.
 */
const ROUTES: Array<[string, number]> = [
  ['#/',     80],
  ['#/shop', 80],
];

for (const [hash, minHeight] of ROUTES) {
  test(`hero lockup on ${hash} renders large h1`, async ({ page }) => {
    await page.goto('/' + hash);
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const box = await h1.boundingBox();
    expect(box, `expected an h1 bounding box on ${hash}`).not.toBeNull();
    expect(box!.height).toBeGreaterThan(minHeight);
  });
}
