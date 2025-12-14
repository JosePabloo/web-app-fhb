// FILE: src/features/auth/services/authService.ts
// PURPOSE: Wraps Firebase auth helpers for Recaptcha initialization, phone OTP, custom token sign-in, and session management.
// NOTES: Consumed by AuthProvider to implement OTP and token flows; abstracts external Firebase API surface.

import { RecaptchaVerifier as RecaptchaVerifierRaw, signInWithPhoneNumber, signInWithCustomToken } from 'firebase/auth';
import type { ConfirmationResult, UserCredential } from 'firebase/auth';
import { auth } from '../../../firebase/config';

const RecaptchaVerifier = RecaptchaVerifierRaw;

let recaptchaVerifier: RecaptchaVerifierRaw | null = null;

export function initRecaptcha(containerId = 'recaptcha-container'): RecaptchaVerifierRaw | null {
  // Ensure we're in a browser environment
  if (typeof window === 'undefined') return null;

  // Ensure firebase auth has been initialized and has an app reference
  if (!auth || !('app' in auth) || !auth.app) {
    console.warn('initRecaptcha: Firebase auth not initialized yet; skipping recaptcha init');
    return null;
  }

  if (!recaptchaVerifier) {
    try {
      recaptchaVerifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
    } catch (err) {
      console.warn('initRecaptcha: RecaptchaVerifier creation failed', err);
      return null;
    }
  }
  return recaptchaVerifier;
}

export async function sendOtp(phoneNumber: string): Promise<ConfirmationResult> {
  const verifier = initRecaptcha();
  if (!verifier) {
    throw new Error('Recaptcha is not ready. Please try again after a moment.');
  }
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
}

export async function confirmOtp(confirmationResult: ConfirmationResult, code: string): Promise<UserCredential> {
  return confirmationResult.confirm(code);
}

export async function signInWithToken(jwt: string): Promise<UserCredential> {
  return signInWithCustomToken(auth, jwt);
}

export async function getIdToken(forceRefresh = false): Promise<string | null> {
  if (!auth.currentUser) return null;
  return auth.currentUser.getIdToken(forceRefresh);
}

export async function signOut(): Promise<void> {
  await auth.signOut();
}
