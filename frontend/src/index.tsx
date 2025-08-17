import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';

import './styles/reset.css';
import './styles/font.css';

import Route from './routes';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  sendDefaultPii: true,
  integrations: [Sentry.browserTracingIntegration()],
  tracePropagationTargets: ['localhost', 'https://api.routie.me'],
  tracesSampleRate: 1.0,
});

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  return worker.start();
}

enableMocking().then(() => {
  const root = createRoot(document.getElementById('root')!);
  root.render(<Route />);
});
