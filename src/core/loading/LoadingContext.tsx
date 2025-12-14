// FILE: src/core/loading/LoadingContext.tsx
// PURPOSE: Declares shape of global loading state and actions for showing/hiding the app-wide overlay.
// NOTES: Context value supplied by LoadingProvider and consumed via useLoading to control UI feedback during async ops.

import { createContext } from 'react';

export interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
