// FILE: src/shared/server-state/testQueryClient.ts
// PURPOSE: Provides an isolated QueryClient factory for tests.
// NOTES: Disables retries so tests fail fast and deterministically.

import { QueryClient } from '@tanstack/react-query';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
