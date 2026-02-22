// FILE: src/core/loading/LoadingProvider.tsx
// PURPOSE: Implements global loading state management toggling isLoading for overlay visibility.
// NOTES: Wraps children in LoadingContext and pairs with LoadingOverlay component mounted in AppProvider.

import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { LoadingContext } from './LoadingContext';

export function LoadingProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = useCallback(() => setIsLoading(true), []);
  const hideLoading = useCallback(() => setIsLoading(false), []);

  const value = useMemo(
    () => ({ isLoading, showLoading, hideLoading }),
    [isLoading, showLoading, hideLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}
