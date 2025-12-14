// FILE: src/app/providers/AppProvider.tsx
// PURPOSE: Root composition assembling theme, router, and global context providers for the entire app lifecycle.
// NOTES: Wraps AppRouter with ThemeProvider, BrowserRouter, Auth/Loading/Snackbar providers plus LoadingOverlay side-effect component. Includes a light/dark theme toggle consumed by Sidebar.

import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import baseTheme, { darkPalette, lightPalette } from '../theme';
import AppRouter from '../router';
import { AuthProvider } from '../../core/auth/AuthProvider';
import { LoadingProvider } from '../../core/loading/LoadingProvider';
import { SnackbarProvider } from '../../core/notifications/SnackbarProvider';
import LoadingOverlay from '../../shared/components/layout/LoadingOverlay';
import { ModalHostProvider } from '../../core/ui/ModalHostProvider';
import OnboardingGate from '../../features/onboarding/components/OnboardingGate';

import { useMemo, useState } from 'react';
import { ThemeModeProvider } from './ThemeModeContext';

export function AppProvider() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const theme = useMemo(
    () =>
      createTheme({
        palette: mode === 'light' ? lightPalette : darkPalette,
        typography: baseTheme.typography,
        shape: baseTheme.shape,
        components: baseTheme.components,
      }),
    [mode]
  );

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeModeProvider value={{ mode, toggle: toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <BrowserRouter>
            <ModalHostProvider>
              <AuthProvider>
                <LoadingProvider>
                  <AppRouter />
                  <OnboardingGate />
                  <LoadingOverlay />
                </LoadingProvider>
              </AuthProvider>
            </ModalHostProvider>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </ThemeModeProvider>
  );
}

export default AppProvider;
