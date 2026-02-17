// FILE: src/features/auth/services/webauthnClient.ts
// PURPOSE: Orchestrates WebAuthn registration/authentication with backend to produce JWT for custom token sign-in.
// NOTES: Used by AuthProvider via registerCredential/authenticateCredential; depends on @passwordless-id/webauthn client and API.

import { client as webauthnClient } from '@passwordless-id/webauthn';
import { casaNorteAuthApi } from '../../../shared/services/apiClient';
import type { ApiResponse } from '../../auth/services/userService';
import type {
  StartRegistrationData,
  StartAuthData,
  FinishRegistrationResponse,
  PublicKeyCredentialRequestOptionsJSON,
} from '../types/auth';

const application = 'CASA_NORTE_DEV';

function getCurrentRpId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.location.hostname || null;
  } catch {
    return null;
  }
}

export interface RegisterParams {
  username: string;
  email: string;
  phoneNumber?: string;
  inviteId?: string;
}

export async function register({
  username,
  email,
  phoneNumber,
  inviteId,
}: RegisterParams): Promise<string> {
  if (!window.PublicKeyCredential) {
    console.warn('WebAuthn not supported');
    return '';
  }

  const requestBody: Record<string, string> = {
    username,
    email,
    application,
  };
  if (inviteId) {
    requestBody.inviteId = inviteId;
  }
  if (phoneNumber) {
    requestBody.phoneNumber = phoneNumber;
  }
  if (phoneNumber) {
    requestBody.phoneNumber = phoneNumber;
  }

  const regRes = await casaNorteAuthApi.post<ApiResponse<StartRegistrationData>>(
    '/casa-norte/webauthn/registrations',
    requestBody,
  );
  const { id: provisionalId, options } = regRes.data.data;

  const registrationPayload = await webauthnClient.register({
    challenge: options.challenge,
    user: options.user,
    domain: getCurrentRpId() ?? options.rp.id,
    timeout: options.timeout,
    userVerification: options.authenticatorSelection?.userVerification,
    discoverable: options.authenticatorSelection?.requireResidentKey ? 'required' : 'preferred',
    attestation: options.attestation === 'direct',
  });

  const { id, rawId, type, response } = registrationPayload;
  const body = {
    id,
    rawId,
    type,
    response: {
      clientDataJSON: response.clientDataJSON,
      attestationObject: response.attestationObject,
      authenticatorData: response.authenticatorData,
    },
    publicKey: response.publicKey,
    publicKeyAlgorithm: response.publicKeyAlgorithm,
    transports: response.transports,
    application,
  };

  const finishRes = await casaNorteAuthApi.post<ApiResponse<FinishRegistrationResponse>>(
    `/casa-norte/webauthn/registrations/${provisionalId}/finish`,
    body,
  );

  return finishRes.data.data.jwtToken;
}

// Type guard for conditional mediation availability
function isConditionalMediationAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.PublicKeyCredential &&
    'isConditionalMediationAvailable' in window.PublicKeyCredential &&
    typeof (window.PublicKeyCredential as { isConditionalMediationAvailable?: unknown })
      .isConditionalMediationAvailable === 'function'
  );
}

export async function authenticate(mode: 'default' | 'conditional' = 'default'): Promise<string> {
  if (!window.PublicKeyCredential) {
    console.warn('WebAuthn not supported');
    return '';
  }

  const authRes = await casaNorteAuthApi.post<ApiResponse<StartAuthData>>(
    '/casa-norte/webauthn/authenticate',
    { application },
  );

  const { id: provisionalId, options } = authRes.data.data;
  const opts = options as PublicKeyCredentialRequestOptionsJSON;

  const rpIdFromServer =
    typeof opts.rpId === 'string' ? opts.rpId : ((opts.rpId as { id?: string }).id ?? '');
  const domain = getCurrentRpId() ?? rpIdFromServer;

  const authOptions = {
    challenge: opts.challenge,
    domain,
    timeout: opts.timeout,
    allowCredentials: opts.excludeCredentials
      ?.filter((c) => !!c.transports)
      .map((c) => ({
        id: c.id,
        transports: c.transports!,
      })),
    userVerification: opts.authenticatorSelection?.userVerification,
  };

  // Add conditional mediation if supported and requested
  if (mode === 'conditional' && isConditionalMediationAvailable()) {
    try {
      const isAvailable = await (
        window.PublicKeyCredential as { isConditionalMediationAvailable: () => Promise<boolean> }
      ).isConditionalMediationAvailable();
      if (isAvailable) {
        (authOptions as { mediation?: string }).mediation = 'conditional';
      }
    } catch {
      // Fall back to default if conditional check fails
    }
  }

  const assertionPayload = await webauthnClient.authenticate(authOptions);

  const { id, rawId, type, response } = assertionPayload;
  const body = {
    id,
    rawId,
    type,
    response: {
      clientDataJSON: response.clientDataJSON,
      authenticatorData: response.authenticatorData,
      signature: response.signature,
      userHandle: response.userHandle,
    },
    application,
  };

  const finishRes = await casaNorteAuthApi.post<ApiResponse<FinishRegistrationResponse>>(
    `/casa-norte/webauthn/authenticate/${provisionalId}`,
    body,
  );

  return finishRes.data.data.jwtToken;
}
