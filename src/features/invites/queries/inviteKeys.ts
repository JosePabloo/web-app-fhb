// FILE: src/features/invites/queries/inviteKeys.ts
// PURPOSE: Defines stable React Query keys for invite resources.
// NOTES: Shared across hooks, cache helpers, and mutations to keep cache access aligned.

export const inviteKeys = {
  all: ['invites'] as const,
  list: () => [...inviteKeys.all, 'list'] as const,
  detail: (inviteId: string) => [...inviteKeys.all, 'detail', inviteId] as const,
  publicDetail: (inviteId: string) => [...inviteKeys.all, 'public', inviteId] as const,
  phoneValidation: (inviteId: string) => [...inviteKeys.all, 'validate', inviteId] as const,
};
