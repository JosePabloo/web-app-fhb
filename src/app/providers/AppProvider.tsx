// FILE: src/app/providers/AppProvider.tsx
// PURPOSE: Root composition assembling theme, router, and global context providers for the entire app lifecycle.
// NOTES: Wraps AppRouter with ThemeProvider, BrowserRouter, Auth/Loading/Snackbar providers plus LoadingOverlay side-effect component. Includes a light/dark theme toggle consumed by Sidebar.

import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { lazy, Suspense, useCallback, useMemo, useState } from 'react';

import baseTheme, { darkPalette, lightPalette } from '../theme';
import AppRouter from '../router';
import { SnackbarProvider } from '../../core/notifications/SnackbarProvider';
import { LoadingProvider } from '../../core/loading/LoadingProvider';
import { ThemeModeProvider } from './ThemeModeContext';
import { AuthProvider } from '../../core/auth/AuthProvider';
import AppErrorBoundary from '../../shared/components/errors/AppErrorBoundary';
import { createAppQueryClient } from '../../shared/server-state/queryClient';
const ModalHostProvider = lazy(() =>
  import('../../core/ui/ModalHostProvider').then((m) => ({ default: m.ModalHostProvider })),
);
const OnboardingGate = lazy(() =>
  import('../../features/onboarding/components/OnboardingGate').then((m) => ({
    default: m.default,
  })),
);
const LoadingOverlay = lazy(() =>
  import('../../shared/components/layout/LoadingOverlay').then((m) => ({ default: m.default })),
);

export function AppProvider() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [queryClient] = useState(() => createAppQueryClient());
  const theme = useMemo(
    () =>
      createTheme({
        palette: mode === 'light' ? lightPalette : darkPalette,
        typography: baseTheme.typography,
        shape: baseTheme.shape,
        components: baseTheme.components,
      }),
    [mode],
  );

  const toggleTheme = useCallback(
    () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    [],
  );

  const themeModeValue = useMemo(() => ({ mode, toggle: toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeModeProvider value={themeModeValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <AppErrorBoundary>
            <SnackbarProvider>
              <BrowserRouter>
                <Suspense fallback={null}>
                  <ModalHostProvider>
                    <AuthProvider>
                      <LoadingProvider>
                        <AppRouter />
                        <OnboardingGate />
                        <LoadingOverlay />
                      </LoadingProvider>
                    </AuthProvider>
                  </ModalHostProvider>
                </Suspense>
              </BrowserRouter>
            </SnackbarProvider>
          </AppErrorBoundary>
        </QueryClientProvider>
      </ThemeProvider>
    </ThemeModeProvider>
  );
}

export default AppProvider;
