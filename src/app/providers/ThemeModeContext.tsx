// FILE: src/app/providers/ThemeModeContext.tsx
// PURPOSE: Exposes current color mode and toggle handler so layout elements (e.g., Sidebar) can switch themes.
// NOTES: Provided by AppProvider; use useThemeMode() to consume.

import { createContext, useContext } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export function ThemeModeProvider({ value, children }: { value: ThemeModeContextValue; children: React.ReactNode }) {
  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}

