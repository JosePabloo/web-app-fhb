// FILE: src/shared/components/errors/AppErrorBoundary.tsx
// PURPOSE: Global error boundary with a high-level fallback screen.
// NOTES: Catches render-time errors and redirects to the landing page to recover.

import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { Component, useEffect, useMemo, type ErrorInfo, type PropsWithChildren } from 'react';

const LANDING_PATH = '/';
const REDIRECT_GUARD_KEY = 'app_error_boundary_redirected_v1';

function hasRedirectGuard(): boolean {
  try {
    return sessionStorage.getItem(REDIRECT_GUARD_KEY) === '1';
  } catch {
    return false;
  }
}

function setRedirectGuard(): void {
  try {
    sessionStorage.setItem(REDIRECT_GUARD_KEY, '1');
  } catch {
    // ignore
  }
}

function AppCrashScreen({
  error,
  errorInfo,
}: {
  error: Error;
  errorInfo: ErrorInfo | null;
}) {
  const shouldAutoRedirect =
    typeof window !== 'undefined' &&
    window.location.pathname !== LANDING_PATH &&
    !hasRedirectGuard();

  useEffect(() => {
    if (!shouldAutoRedirect) return;

    setRedirectGuard();
    const timeoutId = window.setTimeout(() => {
      window.location.replace(LANDING_PATH);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [shouldAutoRedirect]);

  const details = useMemo(() => {
    if (!import.meta.env.DEV || !error) return null;
    return [`${error.name}: ${error.message}`, errorInfo?.componentStack?.trim(), error.stack?.trim()]
      .filter(Boolean)
      .join('\n\n');
  }, [error, errorInfo]);

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', py: 8 }}>
      <Container maxWidth="sm">
        <Paper variant="outlined" sx={{ p: 4 }}>
          <Stack spacing={2.5}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Something went wrong
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {shouldAutoRedirect
                ? 'Refreshing to the landing page…'
                : 'Use the button below to return to the landing page.'}
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" onClick={() => window.location.replace(LANDING_PATH)}>
                Go to landing page
              </Button>
              <Button variant="outlined" onClick={() => window.location.reload()}>
                Reload
              </Button>
            </Stack>

            {details && (
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 2,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: 12,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {details}
              </Box>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

interface AppErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class AppErrorBoundary extends Component<PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): Partial<AppErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('AppErrorBoundary caught an error', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.error) {
      return <AppCrashScreen error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}
