// FILE: src/features/auth/services/authService.ts
// PURPOSE: Wraps Firebase auth helpers for custom token sign-in and session management.
// NOTES: Consumed by AuthProvider to implement WebAuthn token flows; abstracts external Firebase API surface.

import { signInWithCustomToken } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';
import { auth } from '../../../firebase/config';



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
