// FILE: src/features/invites/services/inviteService.ts
// PURPOSE: API helpers for creating and resolving Casa Norte invites with phone validation.
// NOTES: Uses auth API base; callers handle errors and presentation.

import { casaNorteAuthApi } from '../../../shared/services/apiClient';
import type { InviteCreatePayload, InviteCreateResponse, InviteLookupResponse, PhoneValidationResponse } from '../types';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export async function createInvite(payload: InviteCreatePayload): Promise<InviteCreateResponse> {
  const response = await casaNorteAuthApi.post<ApiResponse<InviteCreateResponse>>('/v1/invites', payload);
  return response.data.data;
}

export async function getInvite(inviteId: string): Promise<InviteLookupResponse> {
  const response = await casaNorteAuthApi.get<ApiResponse<InviteLookupResponse>>(`/v1/invites/${inviteId}/public`);
  return response.data.data;
}

export async function validatePhone(inviteId: string, last4Digits: string): Promise<PhoneValidationResponse> {
  try {
    const response = await casaNorteAuthApi.post<ApiResponse<PhoneValidationResponse>>(`/v1/invites/${inviteId}/validate`, {
      last4Digits,
      inviteId
    });
    return response.data.data;
  } catch (error) {
    return {
      isValid: false,
      remainingAttempts: 0,
      reason: error instanceof Error ? error.message : 'Validation service unavailable'
    };
  }
}
