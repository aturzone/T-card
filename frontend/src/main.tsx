import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { App } from '@/App';
import { waitForPreloadedAssets } from '@/preloadAssets';
import '@/styles/index.css';

declare global {
  interface Window {
    __preSplash?: {
      ready: () => void;
      modelReady: () => void;
      dismiss: () => void;
    };
  }
}

const root = document.getElementById('app');
if (!root) throw new Error('#app root element missing');

// Block React boot until the inline pre-fetched GLB+HDR have been
// pumped into THREE.Cache. This eliminates the dual-fetch we observed
// in the network panel (inline preload + drei XHR firing both). With
// the cache primed, drei's FileLoader.load() returns synchronously
// from cache — zero second network round-trip for hero assets.
waitForPreloadedAssets().then(() => {
  createRoot(root).render(
    <StrictMode>
      <HashRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </HashRouter>
    </StrictMode>,
  );

  // Signal the pre-React splash that the app has mounted. The splash
  // still waits for the bust to signal modelReady before fading.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.__preSplash?.ready();
    });
  });
});
