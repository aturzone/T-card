/**
 * Boots the full app at every route in a MemoryRouter and asserts:
 *   - the page renders without throwing
 *   - the expected heading/marker is present
 *   - no React error boundaries / console errors fire
 *
 * This is the cheapest, fastest smoke net for "did anything crash" — runs
 * in <1s and would have caught the crash the user just reported.
 */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi, beforeEach } from 'vitest';

import { AppProvider } from '@/context/AppContext';
import { App } from '@/App';
import { BRANDS } from '@/data/brands';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppProvider>
        <App />
      </AppProvider>
    </MemoryRouter>,
  );
}

const ROUTES: Array<{ path: string; expect: RegExp | string }> = [
  { path: '/',                       expect: /Gift cards, beautifully delivered/i },
  { path: '/shop',                   expect: /All gift cards/i },
  { path: '/shop?cat=gaming',        expect: /All gift cards/i },
  { path: `/product/${BRANDS[0].id}`, expect: new RegExp(BRANDS[0].name.en, 'i') },
  { path: '/product/does-not-exist', expect: /Not found/i },
  { path: '/checkout',               expect: /(Your cart is quiet|Checkout)/i },
  { path: '/about',                  expect: /About/i },
  { path: '/faq',                    expect: /Questions, answered/i },
  { path: '/contact',                expect: /Talk to us/i },
  { path: '/how',                    expect: /Three steps/i },
  { path: '/account',                expect: /Welcome back/i },
  { path: '/terms',                  expect: /Terms of Service/i },
  { path: '/privacy',                expect: /Privacy Policy/i },
  { path: '/cookies',                expect: /Cookies/i },
  { path: '/nonexistent-route-xyz',  expect: /Page not found/i },
];

describe('every route renders without crashing', () => {
  let consoleErrSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  for (const { path, expect: marker } of ROUTES) {
    test(`route ${path}`, () => {
      const { container } = renderAt(path);
      // Page rendered at least *something*.
      expect(container.firstChild).not.toBeNull();
      // Marker copy present in the page.
      expect(screen.getAllByText(marker).length).toBeGreaterThan(0);
    });
  }

  test('no React error-boundary console output across the route sweep', () => {
    const reactErrors = consoleErrSpy.mock.calls.filter((call) => {
      const first = call[0];
      if (typeof first !== 'string') return false;
      // Tolerate the well-known "act()" + key warnings — they're harmless here.
      if (first.includes('Warning: An update to')) return false;
      if (first.includes('act(')) return false;
      return /Error|Cannot|undefined|null/i.test(first);
    });
    expect(reactErrors).toEqual([]);
  });
});
