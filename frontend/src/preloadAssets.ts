/**
 * Pre-populates three.js's shared Cache with ArrayBuffers already
 * pre-fetched by the inline JS in index.html. This is the ONLY way to
 * truly dedupe with drei's later `useGLTF` / `Environment` fetches —
 * Chrome doesn't merge `<link rel="preload">` with later `fetch()`
 * requests reliably.
 *
 * `await waitForPreloadedAssets()` is called from `main.tsx` BEFORE
 * `createRoot().render()` so that by the time React mounts and drei
 * runs `FileLoader.load(url)`, `Cache.get(url)` returns the bytes
 * synchronously and no network request fires.
 */
import { Cache } from 'three';

type PreloadStore = Record<string, ArrayBuffer | Promise<ArrayBuffer | null> | null>;

declare global {
  interface Window {
    __preloadedAssets?: PreloadStore;
  }
}

const MAX_WAIT_MS = 12000;

export async function waitForPreloadedAssets(): Promise<void> {
  Cache.enabled = true;
  const store = window.__preloadedAssets || {};
  const entries = Object.entries(store);
  if (entries.length === 0) return;

  // Race each pending fetch against a max wait so React boots even if
  // the network stalls. Failed fetches fall through to drei (it'll
  // re-fetch normally), so they're non-fatal.
  const promises = entries.map(([url, value]) => {
    if (value instanceof ArrayBuffer) {
      Cache.add(url, value);
      return Promise.resolve();
    }
    if (value && typeof (value as Promise<ArrayBuffer | null>).then === 'function') {
      return (value as Promise<ArrayBuffer | null>).then((buf) => {
        if (buf instanceof ArrayBuffer) {
          Cache.add(url, buf);
          (window.__preloadedAssets || {})[url] = buf;
        }
      }).catch(() => {});
    }
    return Promise.resolve();
  });

  await Promise.race([
    Promise.allSettled(promises),
    new Promise<void>((r) => setTimeout(r, MAX_WAIT_MS)),
  ]);
}
