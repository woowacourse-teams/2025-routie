import { createRoot } from 'react-dom/client';

import './styles/reset.css';
import './styles/font.css';

import Route from './routes';

const root = createRoot(document.getElementById('root')!);
root.render(<Route />);
