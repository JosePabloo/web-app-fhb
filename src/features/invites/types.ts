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

export interface InviteCreateResponse {
  inviteId: string;
  tenantId?: string;
  status?: string;
  expiresAt?: number;
  inviteLink?: string;
  shortCode?: string | null;
}

export interface InviteRecord {
  inviteId: string;
  tenantId?: string;
  tenantName?: string;
  status?: string;
  expiresAt?: number;
  inviteLink?: string;
  shortCode?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  maskedEmail?: string;
  maskedPhoneNumber?: string;
  roles?: InviteRole[];
  createdAt?: number;
  uses?: number;
  maxUses?: number;
  createdByUid?: string | null;
}

export type InviteResponse = InviteRecord;

export interface InviteListResponse extends InviteRecord {}

export interface InviteLookupResponse {
  inviteId: string;
  tenantId?: string;
  maskedEmail?: string;
  firstName?: string;
  lastName?: string;
  maskedPhoneNumber?: string;
  tenantName?: string;
  status?: string;
  expiresAt?: number;
}

export interface PhoneValidationRequest {
  last4Digits: string;
  inviteId: string;
}

export interface PhoneValidationResponse {
  isValid: boolean;
  remainingAttempts: number;
  reason?: string;
}
