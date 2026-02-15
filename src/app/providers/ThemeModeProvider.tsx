// FILE: src/app/providers/ThemeModeProvider.tsx
// PURPOSE: Provider component for ThemeModeContext.

import { ThemeModeContext } from './ThemeModeContext';

export function ThemeModeProvider({ value, children }: { value: import('./ThemeModeContext').ThemeModeContextValue; children: React.ReactNode }) {
  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}
