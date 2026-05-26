// FILE: src/features/invites/hooks/useInviteDetailQuery.ts
// PURPOSE: Reads a single authenticated invite record from the shared React Query cache.
// NOTES: Reuses any seeded list data first so invite details can load without an immediate refetch.

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchInviteById } from '../api/inviteApi';
import { mergeInviteRecords } from '../cache/inviteCache';
import type { InviteResponse } from '../types';
import { inviteKeys } from '../queries/inviteKeys';
import { inviteDetailQueryOptions } from '../queries/inviteQueries';

export function useInviteDetailQuery(inviteId?: string) {
  const queryClient = useQueryClient();

  const getListInvite = () => {
    if (!inviteId) {
      return undefined;
    }

    const invites = queryClient.getQueryData<InviteResponse[]>(inviteKeys.list());
    return invites?.find((invite) => invite.inviteId === inviteId);
  };

  return useQuery({
    queryKey: inviteKeys.detail(inviteId ?? ''),
    queryFn: async () => {
      const invite = await fetchInviteById(inviteId as string);
      return mergeInviteRecords(getListInvite(), invite) ?? invite;
    },
    staleTime: inviteId ? inviteDetailQueryOptions(inviteId).staleTime : undefined,
    enabled: Boolean(inviteId),
    placeholderData: () => getListInvite(),
  });
}
