// FILE: src/features/invites/queries/inviteQueries.ts
// PURPOSE: Builds query options for invite list, detail, and public lookup requests.
// NOTES: Centralizes fetch wiring and stale-time behavior for invite hooks.

import { queryOptions } from '@tanstack/react-query';
import {
  INVITE_STALE_TIME_MS,
  PUBLIC_INVITE_STALE_TIME_MS,
} from '@/shared/server-state/queryDefaults';
import { fetchAllInvites, fetchInviteById, fetchPublicInvite } from '../api/inviteApi';
import { inviteKeys } from './inviteKeys';

export function invitesListQueryOptions() {
  return queryOptions({
    queryKey: inviteKeys.list(),
    queryFn: fetchAllInvites,
    staleTime: INVITE_STALE_TIME_MS,
  });
}

export function inviteDetailQueryOptions(inviteId: string) {
  return queryOptions({
    queryKey: inviteKeys.detail(inviteId),
    queryFn: () => fetchInviteById(inviteId),
    staleTime: INVITE_STALE_TIME_MS,
  });
}

export function publicInviteQueryOptions(inviteId: string) {
  return queryOptions({
    queryKey: inviteKeys.publicDetail(inviteId),
    queryFn: () => fetchPublicInvite(inviteId),
    staleTime: PUBLIC_INVITE_STALE_TIME_MS,
  });
}
