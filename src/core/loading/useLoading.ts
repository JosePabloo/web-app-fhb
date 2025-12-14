// FILE: src/core/loading/useLoading.ts
// PURPOSE: Hook to consume LoadingContext providing imperative show/hide loading controls.
// NOTES: Enforces provider presence (throws) ensuring loading state modifications remain centralized.

import { useContext } from 'react';
import type { LoadingContextType } from './LoadingContext';
import { LoadingContext } from './LoadingContext';

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
