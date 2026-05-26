// FILE: src/features/invites/mutations/useCreateInviteMutation.ts
// PURPOSE: Creates invites and updates the affected invite caches.
// NOTES: Merges create-response metadata with submitted form values for the detail screen seed.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInvite } from '../api/inviteApi';
import {
  createInviteRecord,
  upsertInviteDetail,
  upsertInviteInListIfLoaded,
} from '../cache/inviteCache';
import type { InviteCreatePayload } from '../types';

export function useCreateInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InviteCreatePayload) => {
      const invite = await createInvite(payload);
      return createInviteRecord(payload, invite);
    },
    onSuccess: (invite) => {
      upsertInviteDetail(queryClient, invite);
      upsertInviteInListIfLoaded(queryClient, invite);
    },
  });
}
