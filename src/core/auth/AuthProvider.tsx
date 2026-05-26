// FILE: src/core/auth/AuthProvider.tsx
// PURPOSE: Provides global authentication context integrating Firebase, WebAuthn, OTP flows, and profile hydration.
// NOTES: Handles persistence and hydration cooldown; exposes auth actions (OTP, WebAuthn, logout) consumed via useAuth inside AppProvider.

import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { hydrateInitialState } from '../../features/auth/services/userService';
import type { HydrateResponseDTO } from '../../types/auth';
import {
  register as webauthnRegister,
  authenticate as webauthnAuthenticate,
} from '../../features/auth/services/webauthnClient';
import {
  signInWithToken,
  signOut as serviceSignOut,
  sendVerificationCode as phoneSendVerificationCode,
  verifyCode as phoneVerifyCode,
} from '../../features/auth/services/authService';
import { useSnackbar } from '../notifications/useSnackbar';
import { useNavigate } from 'react-router-dom';
import { useModalHost } from '../ui/ModalHostProvider';

export interface AuthContextType {
  user: User | null;
  profile: HydrateResponseDTO | null;
  isAuthenticated: boolean;
  registerCredential: (
    username: string,
    email: string,
    phoneNumber?: string,
    inviteId?: string,
  ) => Promise<void>;
  authenticateCredential: (opts?: {
    silent?: boolean;
    mode?: 'default' | 'conditional';
  }) => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationCode: (phone: string) => Promise<string>;
  verifyCode: (sessionId: string, code: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<HydrateResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useSnackbar();
  const navigate = useNavigate();
  const { resetSession } = useModalHost();

  // Hydration tracking state using refs instead of window globals
  const hydratedUidRef = useRef<string | null>(null);
  const cooldownUntilMs = useRef<number>(0);
  const inflight = useRef<boolean>(false);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((err) =>
      console.warn('Failed to set persistence', err),
    );

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const uid = firebaseUser.uid;

        // Clear profile immediately if UID changes to prevent data leakage
        if (hydratedUidRef.current !== uid) {
          setProfile(null);
          hydratedUidRef.current = null;
          cooldownUntilMs.current = 0;
        }
        const COOLDOWN_MS = 30 * 1000;

        // Prevent hydration if already in cooldown
        if (Date.now() < cooldownUntilMs.current) {
          setLoading(false);
          return;
        }

        // Prevent hydration if same user already successfully hydrated
        if (hydratedUidRef.current === uid) {
          setLoading(false);
          return;
        }

        // Prevent hydration if already in flight
        if (inflight.current) {
          setLoading(false);
          return;
        }

        try {
          inflight.current = true;
          const token = await firebaseUser.getIdToken();
          const userHydrationDetails = await hydrateInitialState(token);
          setProfile(userHydrationDetails);
          hydratedUidRef.current = uid; // Mark uid as successfully hydrated
          cooldownUntilMs.current = 0; // Reset cooldown on success
        } catch (err) {
          console.error('Failed to fetch user profile', err);
          setProfile(null);
          cooldownUntilMs.current = Date.now() + COOLDOWN_MS;
          // Only show error if this isn't the initial load
          if (hydratedUidRef.current !== null) {
            showError('Failed to load user profile');
          }
        } finally {
          inflight.current = false;
          setLoading(false);
        }
      } else {
        setProfile(null);
        hydratedUidRef.current = null;
        cooldownUntilMs.current = 0;
        inflight.current = false;
        resetSession();
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [resetSession, showError]);

  const registerCredential = useCallback(
    async (
      username: string,
      email: string,
      phoneNumber?: string,
      inviteId?: string,
    ): Promise<void> => {
      try {
        const jwt = await webauthnRegister(username, email, phoneNumber, inviteId);
        await signInWithToken(jwt);
      } catch (error) {
        console.error('registerCredential failed', error);
        showError((error as Error)?.message ?? 'Failed to register credential');
        throw error;
      }
    },
    [showError],
  );

  const authenticateCredential = useCallback(
    async (opts?: { silent?: boolean; mode?: 'default' | 'conditional' }): Promise<void> => {
      try {
        console.log('Starting WebAuthn authentication');
        const jwt = await webauthnAuthenticate(opts?.mode);
        await signInWithToken(jwt);
      } catch (err) {
        console.error('authenticateCredential failed', err);

        // When silent mode is enabled, only suppress showing error to user, but still throw
        // so caller can handle (e.g., set sessionStorage to skip auto-prompt next time)
        if (opts?.silent && err instanceof Error) {
          const errorName = (err as any).name;
          if (errorName === 'NotAllowedError' || errorName === 'AbortError') {
            throw err; // Still throw so caller can handle
          }
        }

        showError((err as Error)?.message ?? 'Authentication failed');
        throw err;
      }
    },
    [showError],
  );

  const logout = useCallback(async () => {
    try {
      await serviceSignOut();
      // ensure local auth state is cleared so UI updates immediately
      setUser(null);
      setProfile(null);
      resetSession();
      // optional: navigate to login screen after logout
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('logout failed', err);
      showError('Failed to logout');
      throw err;
    }
  }, [navigate, resetSession, showError]);

  const sendVerificationCode = useCallback(
    async (phone: string): Promise<string> => {
      try {
        // X-Application-Name header is passed via interceptor
        return await phoneSendVerificationCode(phone);
      } catch (error) {
        console.error('sendVerificationCode failed', error);
        showError((error as Error)?.message ?? 'Failed to send verification code');
        throw error;
      }
    },
    [showError],
  );

  const verifyCode = useCallback(
    async (sessionId: string, code: string): Promise<void> => {
      try {
        // X-Application-Name header is passed via interceptor
        
        // Call backend to verify code and get JWT
        const jwt = await phoneVerifyCode(sessionId, code);
        
        // Sign in with the JWT to establish Firebase session
        await signInWithToken(jwt);
        
        // The onAuthStateChanged listener will handle hydration automatically
      } catch (error) {
        console.error('verifyCode failed', error);
        showError((error as Error)?.message ?? 'Failed to verify code');
        throw error;
      }
    },
    [showError],
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      isAuthenticated: !!user,
      registerCredential,
      authenticateCredential,
      logout,
      sendVerificationCode,
      verifyCode,
    }),
    [user, profile, registerCredential, authenticateCredential, logout, sendVerificationCode, verifyCode],
  );

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          color: '#666',
        }}
      >
        Loading your session...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
