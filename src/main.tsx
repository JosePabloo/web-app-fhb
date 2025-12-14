// FILE: src/main.tsx
// PURPOSE: Application entry point bootstrapping React root and composing global providers via AppProvider.
// NOTES: Imports env config first for early variable validation then renders provider tree into #root.

import './shared/config/env';
import { createRoot } from 'react-dom/client';
import './index.css';

import { AppProvider } from './app/providers/AppProvider';

createRoot(document.getElementById('root')!).render(<AppProvider />);
