import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';
import './index.css';
import { enableMocking } from './testing/mocks';

const root = document.getElementById('root');

if (!root) {
  throw new Error('No root element found');
}

const bootstrap = async (): Promise<void> => {
  await enableMocking();

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

void bootstrap();
