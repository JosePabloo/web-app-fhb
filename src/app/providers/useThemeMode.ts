// FILE: src/app/providers/useThemeMode.ts
// PURPOSE: Hook to consume ThemeModeContext.

import { useContext } from 'react';
import { ThemeModeContext, type ThemeModeContextValue } from './ThemeModeContext';

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}
