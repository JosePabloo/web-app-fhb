// FILE: src/features/auth/hooks/useAutoPasskeyLaunch.ts
// PURPOSE: Automatically attempts passkey sign-in when login screen loads using conditional UI mediation
// NOTES: Uses sessionStorage to prevent repeated attempts; swallows expected errors for silent mode

import { useEffect } from 'react';
import { useAuth } from '../../../core/auth/useAuth';

const SESSION_KEY = 'passkey:autoAttempted';

export function useAutoPasskeyLaunch(enabled: boolean = true): void {
  const { isAuthenticated, authenticateCredential } = useAuth();

  useEffect(() => {
    // Only run if enabled and user is not authenticated
    if (!enabled || isAuthenticated) {
      return;
    }

    // Check browser support
    if (
      typeof window === 'undefined' ||
      !window.isSecureContext ||
      !window.PublicKeyCredential
    ) {
      return;
    }

    // Check if we already attempted auto-launch (one-shot guard)
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      return;
    }

    // SET GUARD IMMEDIATELY - before any async work
    sessionStorage.setItem(SESSION_KEY, 'true');

    // Check if conditional mediation is available
    const isConditionalMediationAvailable = 
      'isConditionalMediationAvailable' in window.PublicKeyCredential &&
      typeof (window.PublicKeyCredential as { isConditionalMediationAvailable?: unknown }).isConditionalMediationAvailable === 'function';

    if (!isConditionalMediationAvailable) {
      return; // Conditional UI not supported, don't auto-launch
    }

    // Attempt conditional mediation
    const attemptAutoPasskey = async () => {
      try {
        // Check if conditional mediation is actually available
        const isAvailable = await (window.PublicKeyCredential as { isConditionalMediationAvailable: () => Promise<boolean> }).isConditionalMediationAvailable();
        if (!isAvailable) {
          return;
        }

        

        // Attempt silent authentication with conditional mediation
        await authenticateCredential({
          silent: true,
          mode: 'conditional'
        });
      } catch (error) {
        // Silent fail for auto-launch - expected errors include:
        // NotAllowedError: User dismissed or no passkey available
        // AbortError: User cancelled the operation
        // Any other errors are also swallowed for auto-launch
        console.debug('Auto passkey launch failed (expected):', error);
      }
    };

    attemptAutoPasskey();
  }, [enabled, isAuthenticated, authenticateCredential]);
}
