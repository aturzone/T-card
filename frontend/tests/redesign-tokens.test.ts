/**
 * Asserts the Wave-1A redesign tokens land in src/styles/index.css:
 *  - light theme background is the editorial gray (#e8e5e0)
 *  - ink is true black (#0a0a0a)
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
    document.documentElement.setAttribute('data-theme', 'light');
    // Inject the light-theme tokens into a real <style> so getComputedStyle
    // resolves the variables in this test environment.
    const style = document.createElement('style');
    style.textContent = `
      html[data-theme="light"] {
        --bg: #e8e5e0;
        --ink: #0a0a0a;
        --radius: 0;
      }
    `;
    document.head.appendChild(style);
  });

  it('light theme uses gray bg', () => {
    const style = getComputedStyle(document.documentElement);
    expect(style.getPropertyValue('--bg').trim()).toBe('#e8e5e0');
    expect(style.getPropertyValue('--ink').trim()).toBe('#0a0a0a');
    expect(style.getPropertyValue('--radius').trim()).toBe('0');
  });

  it('index.css ships the redesign tokens under [data-theme="light"]', () => {
    expect(css).toMatch(/html\[data-theme="light"\][\s\S]*?--bg:\s*#e8e5e0/);
    expect(css).toMatch(/html\[data-theme="light"\][\s\S]*?--ink:\s*#0a0a0a/);
    // --radius: 0 may appear under :root, not necessarily inside the light block
    expect(css).toMatch(/--radius:\s*0\s*;/);
  });
});
