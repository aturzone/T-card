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
  // Route markers below are English copy — force lang=en so the markers
  // resolve regardless of the new default (Persian).
  localStorage.setItem('tcard.lang', JSON.stringify('en'));
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppProvider>
        <App />
      </AppProvider>
    </MemoryRouter>,
  );
}

const ROUTES: Array<{ path: string; expect: RegExp | string }> = [
  // Home hero lockup is Wave-3 — for now home still renders the existing tagline,
  // so accept either the new TCARD lockup or the legacy tagline.
  { path: '/',                       expect: /TCARD|Gift cards, beautifully delivered/i },
  { path: '/shop',                   expect: /BRANDS/ },
  { path: '/shop?cat=gaming',        expect: /BRANDS/ },
  { path: `/product/${BRANDS[0].id}`, expect: new RegExp(BRANDS[0].name.en, 'i') },
  { path: '/product/does-not-exist', expect: /Not found/i },
  { path: '/checkout',               expect: /(Your cart is quiet|CHECKOUT)/ },
  { path: '/about',                  expect: /ABOUT/ },
  { path: '/faq',                    expect: /QUESTIONS/ },
  { path: '/contact',                expect: /CONTACT/ },
  { path: '/how',                    expect: /HOW IT WORKS/ },
  { path: '/account',                expect: /ACCOUNT/ },
  { path: '/terms',                  expect: /LEGAL|Terms of Service/ },
  { path: '/privacy',                expect: /LEGAL|Privacy Policy/ },
  { path: '/cookies',                expect: /LEGAL|Cookies/ },
  { path: '/nonexistent-route-xyz',  expect: /404/ },
];

describe('every route renders without crashing', () => {
  let consoleErrSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  for (const { path, expect: marker } of ROUTES) {
    test(`route ${path}`, async () => {
      const { container } = renderAt(path);
      // Page rendered at least *something*.
      expect(container.firstChild).not.toBeNull();
      // Marker copy present in the page (lazy routes resolve via Suspense).
      const hits = await screen.findAllByText(marker);
      expect(hits.length).toBeGreaterThan(0);
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

describe('global footer — contact details + trust seal', () => {
  test('shows phone, address and a clickable eNamad trust seal', () => {
    renderAt('/');

    // Phone is a tel: link; address points at the office map.
    const phone = screen.getByRole('link', { name: /\+98 51 3741 7087/ });
    expect(phone).toHaveAttribute('href', 'tel:+985137417087');
    expect(screen.getByText(/Hasheminejad St, Mashhad/)).toBeInTheDocument();

    // eNamad seal links to the live trustseal verification page in a new tab.
    const seal = screen.getByRole('link', { name: /trust seal/i });
    expect(seal).toHaveAttribute('target', '_blank');
    expect(seal.getAttribute('href')).toMatch(/trustseal\.enamad\.ir.*id=734609/);
    // eNamad requires referrerpolicy=origin and NO rel="noreferrer" — the latter
    // stops the seal from rendering.
    expect(seal).toHaveAttribute('referrerpolicy', 'origin');
    expect(seal.getAttribute('rel') ?? '').not.toContain('noreferrer');
  });
});
