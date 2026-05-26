// FILE: src/features/invites/mutations/useValidateInvitePhoneMutation.ts
// PURPOSE: Validates invite phone numbers before the passkey flow continues.
// NOTES: Uses React Query mutation state for the validation request.

import { useMutation } from '@tanstack/react-query';
import { validateInvitePhone } from '../api/inviteApi';
import type { PhoneValidationResponse } from '../types';

export interface ValidateInvitePhoneInput {
  inviteId: string;
  last4Digits: string;
}

export function useValidateInvitePhoneMutation() {
  return useMutation<PhoneValidationResponse, Error, ValidateInvitePhoneInput>({
    mutationFn: ({ inviteId, last4Digits }) => validateInvitePhone(inviteId, last4Digits),
  });
}