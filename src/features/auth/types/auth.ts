// FILE: src/features/auth/types/auth.ts
// PURPOSE: Defines WebAuthn-related request/response DTOs used during registration and authentication flows.
// NOTES: Imported by webauthnClient service to strongly type server interaction and credential option handling.

export interface FinishRegistrationResponse {
  jwtToken: string;
  message: string;
  data: string;
}

export interface PublicKeyCredentialOptionsJSON {
  // ...existing fields from previous src/types/auth.ts definition...
  challenge: string;
  rp: { id: string; name: string };
  user: { id: string; name: string; displayName?: string };
  pubKeyCredParams: Array<{ type: string; alg: number }>;
  timeout?: number;
  excludeCredentials?: Array<{ id: string; transports?: string[] }>;
  authenticatorSelection?: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    requireResidentKey?: boolean;
    userVerification?: 'required' | 'preferred' | 'discouraged';
  };
  attestation?: 'none' | 'indirect' | 'direct';
}

export interface StartRegistrationData {
  id: string;
  options: PublicKeyCredentialOptionsJSON;
}

export interface StartRegistrationResponse {
  message: string;
  data: StartRegistrationData;
}

export interface PublicKeyCredentialRequestOptionsJSON {
  excludeCredentials: Array<{
    id: string;
    transports?: Array<'usb' | 'nfc' | 'ble' | 'internal'>;
  }>;
  authenticatorSelection?: {
    userVerification?: 'required' | 'preferred' | 'discouraged';
  };
  challenge: string;
  timeout?: number;
  rpId: string;
  userVerification?: 'required' | 'preferred' | 'discouraged';
  allowCredentials?: Array<{
    id: string;
    type: 'public-key';
    transports?: Array<'usb' | 'nfc' | 'ble' | 'internal'>;
  }>;
}

export interface StartAuthData {
  id: string;
  options: PublicKeyCredentialRequestOptionsJSON;
}

export interface StartAuthenticationResponse {
  message: string;
  data: StartAuthData;
}
