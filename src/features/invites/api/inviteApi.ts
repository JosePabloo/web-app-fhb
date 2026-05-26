// FILE: src/features/invites/api/inviteApi.ts
// PURPOSE: Wraps invite-related backend requests for authenticated and public flows.
// NOTES: Keeps HTTP transport details separate from invite query hooks and mutations.

import { casaNorteAuthApi } from '../../../shared/services/apiClient';
import type {
  InviteCreatePayload,
  InviteCreateResponse,
  InviteLookupResponse,
  InviteRecord,
  InviteListResponse,
  PhoneValidationResponse,
} from '../types';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export async function createInvite(payload: InviteCreatePayload): Promise<InviteCreateResponse> {
  const response = await casaNorteAuthApi.post<ApiResponse<InviteCreateResponse>>(
    '/v1/invites',
    payload,
  );
  return response.data.data;
}

export async function fetchInviteById(inviteId: string): Promise<InviteRecord> {
  const response = await casaNorteAuthApi.get<ApiResponse<InviteLookupResponse>>(
    `/v1/invites/${inviteId}`,
  );
  return response.data.data;
}

export async function fetchAllInvites(): Promise<InviteListResponse[]> {
  const response = await casaNorteAuthApi.get<ApiResponse<InviteListResponse[]>>('/v1/invites');
  return response.data.data ?? [];
}

export async function fetchPublicInvite(inviteId: string): Promise<InviteLookupResponse> {
  const response = await casaNorteAuthApi.get<ApiResponse<InviteLookupResponse>>(
    `/v1/invites/${inviteId}/public`,
  );
  return response.data.data;
}

export async function validateInvitePhone(
  inviteId: string,
  last4Digits: string,
): Promise<PhoneValidationResponse> {
  try {
    const response = await casaNorteAuthApi.post<ApiResponse<PhoneValidationResponse>>(
      `/v1/invites/${inviteId}/validate`,
      {
        last4Digits,
        inviteId,
      },
    );
    return response.data.data;
  } catch (error) {
    return {
      isValid: false,
      remainingAttempts: 0,
      reason: error instanceof Error ? error.message : 'Validation service unavailable',
    };
  }
}
