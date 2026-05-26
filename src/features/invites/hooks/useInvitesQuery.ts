// FILE: src/features/invites/hooks/useInvitesQuery.ts
// PURPOSE: Reads the authenticated invite list from the shared React Query cache.
// NOTES: Keeps invite routes free of direct query option wiring.

import { useQuery } from '@tanstack/react-query';
import { invitesListQueryOptions } from '../queries/inviteQueries';

export function useInvitesQuery() {
  return useQuery(invitesListQueryOptions());
}
