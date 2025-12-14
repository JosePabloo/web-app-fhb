// FILE: src/core/loading/LoadingProvider.tsx
// PURPOSE: Implements global loading state management toggling isLoading for overlay visibility.
// NOTES: Wraps children in LoadingContext and pairs with LoadingOverlay component mounted in AppProvider.

import { useState, type PropsWithChildren } from 'react';
import { LoadingContext } from './LoadingContext';

export function LoadingProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}
