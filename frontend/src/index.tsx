import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';

import './styles/reset.css';
import './styles/font.css';

import Route from './routes';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  sendDefaultPii: true,
});

const root = createRoot(document.getElementById('root')!);
root.render(<Route />);
