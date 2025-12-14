// FILE: src/core/notifications/SnackbarContext.tsx
// PURPOSE: Defines global snackbar error messaging contract for surfacing transient errors.
// NOTES: Context implemented by SnackbarProvider; consumed via useSnackbar to decouple UI from notification logic.

import { createContext } from 'react';

export interface SnackbarContextType {
  showError: (message: string) => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);
