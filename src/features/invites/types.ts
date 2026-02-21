// FILE: src/features/invites/types.ts
// PURPOSE: Shared types for invite creation and lookup flows.
// NOTES: Mirrors Casa Norte auth invite API payloads and responses.

export type InviteRole = 'tenant_admin' | 'team_member';

export interface InviteCreatePayload {
  email?: string;
  roles: InviteRole[];
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface InviteResponse {
  inviteId: string;
  status?: string;
  expiresAt?: number;
  inviteLink?: string;
  shortCode?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  roles?: InviteRole[];
}

export type InviteCreateResponse = InviteResponse;
export type InviteLookupResponse = InviteResponse & {
  maskedEmail?: string;
  maskedPhoneNumber?: string;
  tenantId?: string;
  tenantName?: string;
};

export interface PhoneValidationRequest {
  last4Digits: string;
  inviteId: string;
}

export interface PhoneValidationResponse {
  isValid: boolean;
  remainingAttempts: number;
  reason?: string;
}
