/**
 * Asserts the single-palette redesign tokens land in src/styles/index.css:
 *  - background is monolith grey (#e0e0e0)
 *  - ink is near-black (#010101)
 *  - radius is 0 (sharp corners — pill is a separate token)
 *
 * Vitest runs with `css: false`, so happy-dom never parses index.css —
 * `getComputedStyle` would return empty strings. Instead the spec
 * (a) inlines the relevant declarations onto a fresh <style> tag so
 *     getComputedStyle returns *something*, and
 * (b) cross-checks index.css on disk so the tokens are guaranteed to ship.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const cssPath = resolve(here, '..', 'src', 'styles', 'index.css');
const css = readFileSync(cssPath, 'utf8');

describe('redesign tokens', () => {
  beforeAll(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --bg: #e0e0e0;
        --ink: #010101;
        --radius: 0;
      }
    `;
    document.head.appendChild(style);
  });

  it(':root uses monolith grey bg + near-black ink', () => {
    const style = getComputedStyle(document.documentElement);
    expect(style.getPropertyValue('--bg').trim()).toBe('#e0e0e0');
    expect(style.getPropertyValue('--ink').trim()).toBe('#010101');
    expect(style.getPropertyValue('--radius').trim()).toBe('0');
  });

  it('index.css ships the single-palette tokens under :root', () => {
    expect(css).toMatch(/:root\s*\{[\s\S]*?--bg:\s*#e0e0e0/);
    expect(css).toMatch(/:root\s*\{[\s\S]*?--ink:\s*#010101/);
    expect(css).toMatch(/--radius:\s*0\s*;/);
  });

  it('drops the data-theme split — no light/dark blocks remain', () => {
    expect(css).not.toMatch(/html\[data-theme="light"\]/);
    expect(css).not.toMatch(/html\[data-theme="dark"\]/);
  });
});
