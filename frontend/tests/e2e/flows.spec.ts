import { test, expect } from '@playwright/test';

test('language toggle flips dir to rtl', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await page.getByRole('button', { name: 'فا' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('data-lang', 'fa');
});

test('theme toggle flips data-theme', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByLabel('Toggle theme').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('add to cart → cart drawer → checkout flow', async ({ page }) => {
  await page.goto('/#/product/amazon');
  await page.getByRole('button', { name: /Add to cart/i }).click();

  // Drawer opens with the item visible
  await expect(page.locator('.drawer.open')).toBeVisible();
  await expect(page.locator('.cart-item').first()).toBeVisible();

  // Proceed to checkout
  await page.getByRole('button', { name: /^Checkout/ }).click();
  await expect(page).toHaveURL(/#\/checkout/);

  // Step 1: details
  await page.getByLabel(/Full name/i).fill('Jane Doe');
  await page.getByLabel(/Email/i).fill('jane@example.com');
  await page.getByLabel(/Phone/i).fill('+15551234567');
  await page.getByRole('button', { name: /Continue/i }).click();

  // Step 2: payment with default card method
  await expect(page.getByText(/Payment/i).first()).toBeVisible();
});

test('shop search narrows results', async ({ page }) => {
  await page.goto('/#/shop');
  const grid = page.locator('.product-tile');
  const initial = await grid.count();
  expect(initial).toBeGreaterThan(0);

  await page.getByPlaceholder(/Search brands/i).fill('Steam');
  await expect(grid.first()).toBeVisible();
  const filtered = await grid.count();
  expect(filtered).toBeLessThanOrEqual(initial);
});
