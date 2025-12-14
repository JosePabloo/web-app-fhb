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

export async function register(
  username: string,
  phoneNumber: string,
  email: string,
): Promise<string> {
  if (!window.PublicKeyCredential) {
    console.warn('WebAuthn not supported');
    return '';
  }

  const regRes = await casaNorteAuthApi.post<ApiResponse<StartRegistrationData>>(
    '/casa-norte/webauthn/registrations',
    { username, phoneNumber, email, application },
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

export async function authenticate(): Promise<string> {
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

  const rpIdFromServer = typeof opts.rpId === 'string' ? opts.rpId : (opts.rpId as any);
  const domain = getCurrentRpId() ?? rpIdFromServer;

  const assertionPayload = await webauthnClient.authenticate({
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
  });

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
