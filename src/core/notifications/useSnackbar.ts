// FILE: src/core/notifications/useSnackbar.ts
// PURPOSE: Hook exposing global snackbar API for triggering error messages from feature logic.
// NOTES: Throws if provider missing, enforcing usage within SnackbarProvider and keeping notification flow consistent.

import { useContext } from 'react';
import type { SnackbarContextType } from './SnackbarContext';
import { SnackbarContext } from './SnackbarContext';

export function useSnackbar(): SnackbarContextType {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
