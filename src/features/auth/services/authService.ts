// FILE: src/features/auth/services/authService.ts
// PURPOSE: Wraps backend API for phone OTP authentication and Firebase auth helpers for custom token sign-in.
// NOTES: Phone OTP flow calls backend endpoints which handle session code generation and JWT return.

import { signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';
import { auth } from '../../../firebase/config';
import { spreadSyncApi } from '../../../shared/services/apiClient';

// Types for phone OTP flow - matches backend ApiResponse<T> structure
interface PhoneSendCodeResponseData {
  sessionId: string;
  message: string;
}

interface PhoneVerifyCodeResponseData {
  jwtToken: string;
  message: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

/**
 * Sends a verification code to the given phone number via the backend.
 * The backend validates the phone exists, generates a session code, and stores it in Firestore.
 * X-Application-Name header is passed via interceptor.
 * 
 * @param phoneNumber - E.164 formatted phone number (e.g., +15551234567)
 * @returns Session ID from the backend
 */
export async function sendVerificationCode(
  phoneNumber: string
): Promise<string> {
  const response = await spreadSyncApi.post<ApiResponse<PhoneSendCodeResponseData>>(
    '/casa-norte/webauthn/send-code',
    { phoneNumber }
  );
  
  return response.data.data.sessionId;
}

/**
 * Verifies the OTP code with the backend.
 * The backend validates the code against the stored session and returns a JWT.
 * X-Application-Name header is passed via interceptor.
 * 
 * @param sessionId - The session ID from sendVerificationCode
 * @param code - The 6-digit OTP code entered by the user
 * @returns JWT token from successful verification
 */
export async function verifyCode(
  sessionId: string,
  code: string
): Promise<string> {
  const response = await spreadSyncApi.post<ApiResponse<PhoneVerifyCodeResponseData>>(
    '/casa-norte/webauthn/verify-code',
    { sessionId, code }
  );
  
  return response.data.data.jwtToken;
}

/**
 * Signs in with a custom JWT token from the backend.
 * This is called after successful phone OTP verification to establish the Firebase session.
 * 
 * @param jwt - JWT token from backend phone verification
 * @returns Firebase UserCredential
 */
export async function signInWithToken(jwt: string): Promise<UserCredential> {
  return signInWithCustomToken(auth, jwt);
}

/**
 * Gets the current Firebase ID token.
 * 
 * @param forceRefresh - Whether to force token refresh
 * @returns ID token string or null if not authenticated
 */
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  if (!auth.currentUser) return null;
  return auth.currentUser.getIdToken(forceRefresh);
}

/**
 * Signs out the user from Firebase.
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Re-export types for use in components
export type { UserCredential };
