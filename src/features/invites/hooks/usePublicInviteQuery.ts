// FILE: src/features/invites/hooks/usePublicInviteQuery.ts
// PURPOSE: Reads the public invite lookup from the shared React Query cache.
// NOTES: Lets the invite landing and accept steps reuse the same cached invite record.

import { useQuery } from '@tanstack/react-query';
import { publicInviteQueryOptions } from '../queries/inviteQueries';

export function usePublicInviteQuery(inviteId?: string) {
  return useQuery({
    ...publicInviteQueryOptions(inviteId ?? ''),
    enabled: Boolean(inviteId),
  });
}
