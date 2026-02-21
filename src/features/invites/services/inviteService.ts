// FILE: src/features/invites/services/inviteService.ts
// PURPOSE: API helpers for creating and resolving Casa Norte invites with phone validation.
// NOTES: Uses auth API base; callers handle errors and presentation.

import { authApi } from '../../../shared/services/apiClient';
import type {
  InviteCreatePayload,
  InviteResponse,
  InviteLookupResponse,
  PhoneValidationResponse,
} from '../types';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export async function createInvite(payload: InviteCreatePayload): Promise<InviteResponse> {
  const response = await authApi.post<ApiResponse<InviteResponse>>('/v1/invites', payload);
  return response.data.data;
}

export async function getInviteById(inviteId: string): Promise<InviteResponse> {
  const response = await authApi.get<ApiResponse<InviteResponse>>(`/v1/invites/${inviteId}`);
  return response.data.data;
}

export async function getInvite(inviteId: string): Promise<InviteLookupResponse> {
  const response = await authApi.get<ApiResponse<InviteLookupResponse>>(
    `/v1/invites/${inviteId}/public`,
  );
  return response.data.data;
}

export async function validatePhone(
  inviteId: string,
  last4Digits: string,
): Promise<PhoneValidationResponse> {
  try {
    const response = await authApi.post<ApiResponse<PhoneValidationResponse>>(
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
