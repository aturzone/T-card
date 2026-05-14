import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { App } from '@/App';
import '@/styles/index.css';

const root = document.getElementById('app');
if (!root) throw new Error('#app root element missing');

createRoot(root).render(
  <StrictMode>
    <HashRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  </StrictMode>,
);
