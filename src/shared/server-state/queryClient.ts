// FILE: src/shared/server-state/queryClient.ts
// PURPOSE: Creates the app-wide React Query client used for all server-state caching.
// NOTES: Default query options intentionally avoid aggressive refetching on focus.

import { QueryClient } from '@tanstack/react-query';
import { QUERY_GC_TIME_MS } from './queryDefaults';

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        gcTime: QUERY_GC_TIME_MS,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
