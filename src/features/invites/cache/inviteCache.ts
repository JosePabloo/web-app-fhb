// FILE: src/features/invites/cache/inviteCache.ts
// PURPOSE: Centralizes invite cache merge, seed, and update helpers.
// NOTES: Preserves partial invite data across create, list, detail, and public invite flows.

import type { QueryClient } from '@tanstack/react-query';
import type {
  InviteCreatePayload,
  InviteCreateResponse,
  InviteLookupResponse,
  InviteRecord,
  InviteResponse,
} from '../types';
import { inviteKeys } from '../queries/inviteKeys';

function assignInviteField<K extends keyof InviteRecord>(
  record: InviteRecord,
  key: K,
  value: InviteRecord[K],
) {
  record[key] = value;
}

export function mergeInviteRecords(
  current?: InviteRecord,
  incoming?: InviteRecord,
): InviteRecord | undefined {
  if (!current) {
    return incoming;
  }

  if (!incoming) {
    return current;
  }

  const merged: InviteRecord = { ...current };

  for (const [key, value] of Object.entries(incoming) as Array<
    [keyof InviteRecord, InviteRecord[keyof InviteRecord]]
  >) {
    if (value !== undefined) {
      assignInviteField(merged, key, value);
    }
  }

  return merged;
}

export function createInviteRecord(
  payload: InviteCreatePayload,
  response: InviteCreateResponse,
): InviteRecord {
  return {
    inviteId: response.inviteId,
    tenantId: response.tenantId,
    status: response.status,
    expiresAt: response.expiresAt,
    inviteLink: response.inviteLink,
    shortCode: response.shortCode ?? null,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    roles: payload.roles,
  };
}

export function seedInviteDetail(queryClient: QueryClient, invite: InviteResponse) {
  queryClient.setQueryData<InviteResponse | undefined>(inviteKeys.detail(invite.inviteId), (current) =>
    mergeInviteRecords(current, invite) ?? invite,
  );
}

export function upsertInviteDetail(queryClient: QueryClient, invite: InviteResponse) {
  queryClient.setQueryData<InviteResponse | undefined>(inviteKeys.detail(invite.inviteId), (current) =>
    mergeInviteRecords(current, invite) ?? invite,
  );
}

export function upsertInviteInListIfLoaded(queryClient: QueryClient, invite: InviteResponse) {
  queryClient.setQueryData<InviteResponse[] | undefined>(inviteKeys.list(), (current) => {
    if (!current) {
      return current;
    }

    const exists = current.some((item) => item.inviteId === invite.inviteId);
    if (!exists) {
      return [invite, ...current];
    }

    return current.map((item) =>
      item.inviteId === invite.inviteId ? (mergeInviteRecords(item, invite) ?? invite) : item,
    );
  });
}

export function seedPublicInvite(queryClient: QueryClient, invite: InviteLookupResponse) {
  queryClient.setQueryData<InviteLookupResponse | undefined>(
    inviteKeys.publicDetail(invite.inviteId),
    (current) => current ?? invite,
  );
}
