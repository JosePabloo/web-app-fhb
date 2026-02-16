// FILE: src/app/providers/ThemeModeContext.tsx
// PURPOSE: Type definitions and context for theme mode.

import { createContext } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeModeContextValue {
  mode: ThemeMode;
  toggle: () => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);
