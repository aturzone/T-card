import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Reset DOM + localStorage between tests so each runs in a clean app state.
beforeEach(() => {
  localStorage.clear();
  // Default lang is now Persian (rtl). Each test boots from this state.
  document.documentElement.setAttribute('data-lang', 'fa');
  document.documentElement.setAttribute('dir', 'rtl');
});

afterEach(() => {
  cleanup();
});

// happy-dom doesn't ship matchMedia / IntersectionObserver — stub minimally so
// React components that touch them in render don't blow up.
if (!window.matchMedia) {
  window.matchMedia = ((q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '';
  thresholds = [];
}
// @ts-expect-error happy-dom global typing
window.IntersectionObserver = MockIntersectionObserver;
// @ts-expect-error
global.IntersectionObserver = MockIntersectionObserver;

// Silence "scrollTo not implemented" noise during navigation tests.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
