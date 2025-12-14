// FILE: src/core/auth/AuthProvider.tsx
// PURPOSE: Provides global authentication context integrating Firebase, WebAuthn, OTP flows, and profile hydration.
// NOTES: Handles persistence and hydration cooldown; exposes auth actions (OTP, WebAuthn, logout) consumed via useAuth inside AppProvider.

import React, { createContext, useEffect, useState } from 'react';
import type { User, ConfirmationResult, UserCredential } from 'firebase/auth';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { hydrateInitialState } from '../../features/auth/services/userService';
import type { HydrateResponseDTO } from '../../types/auth';
import { register as webauthnRegister, authenticate as webauthnAuthenticate } from '../../features/auth/services/webauthnClient';
import { initRecaptcha, sendOtp as serviceSendOtp, signInWithToken, signOut as serviceSignOut } from '../../features/auth/services/authService';
import { useSnackbar } from '../notifications/useSnackbar';
import { useNavigate } from 'react-router-dom';
import { useModalHost } from '../ui/ModalHostProvider';

export interface AuthContextType {
  user: User | null;
  profile: HydrateResponseDTO | null;
  isAuthenticated: boolean;
  sendOtp: (phone: string) => Promise<ConfirmationResult>;
  confirmOtp: (code: string) => Promise<UserCredential>;
  registerCredential: (username: string, phoneNumber: string, email: string) => Promise<void>;
  authenticateCredential: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<HydrateResponseDTO | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useSnackbar();
  const navigate = useNavigate();
  const { resetSession } = useModalHost();

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((err) => console.warn('Failed to set persistence', err));

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        try {
          initRecaptcha();
        } catch {
          console.warn('initRecaptcha failed');
        }

        const uid = firebaseUser.uid;
        // @ts-expect-error - tracking on window for debugging
        window.__lastHydratedUid = window.__lastHydratedUid ?? null;
        // @ts-expect-error - tracking on window for debugging
        window.__lastHydrationFailedAt = window.__lastHydrationFailedAt ?? 0;
        const COOLDOWN_MS = 30 * 1000;
        // @ts-expect-error - tracking on window for debugging
        if (Date.now() - window.__lastHydrationFailedAt < COOLDOWN_MS) {
          return;
        }
        // @ts-expect-error - tracking on window for debugging
        if (window.__lastHydratedUid === uid) return;

        try {
          const token = await firebaseUser.getIdToken(true);
          const userHydrationDetails = await hydrateInitialState(token);
          setProfile(userHydrationDetails);
          // @ts-expect-error - tracking on window for debugging
          window.__lastHydratedUid = uid;
        } catch (err) {
          console.error('Failed to fetch user profile', err);
          setProfile(null);
          showError('Failed to load user profile');
          // @ts-expect-error - tracking on window for debugging
          window.__lastHydrationFailedAt = Date.now();
        }
      } else {
        setProfile(null);
        // @ts-expect-error - tracking on window for debugging
        window.__lastHydratedUid = null;
        resetSession();
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [resetSession, showError]);

  const sendOtp = async (phone: string) => {
    try {
      const confirmation = await serviceSendOtp(phone);
      setConfirmationResult(confirmation);
      return confirmation;
    } catch (err) {
      console.error('sendOtp failed', err);
      showError((err as Error)?.message ?? 'Failed to send OTP');
      throw err;
    }
  };

  const confirmOtp = async (code: string) => {
    try {
      if (!confirmationResult) throw new Error('No OTP request in progress');
      const credential = await confirmationResult.confirm(code);
      return credential;
    } catch (err) {
      console.error('confirmOtp failed', err);
      showError((err as Error)?.message ?? 'Failed to confirm OTP');
      throw err;
    }
  };

  const registerCredential = async (
    username: string,
    phoneNumber: string,
    email: string
  ): Promise<void> => {
    try {
      const jwt = await webauthnRegister(username, phoneNumber, email);
      await signInWithToken(jwt);
    } catch (error) {
      console.error('registerCredential failed', error);
      showError((error as Error)?.message ?? 'Failed to register credential');
      throw error;
    }
  };

  const authenticateCredential = async (): Promise<void> => {
    try {
      const jwt = await webauthnAuthenticate();
      await signInWithToken(jwt);
    } catch (err) {
      console.error('authenticateCredential failed', err);
      showError((err as Error)?.message ?? 'Authentication failed');
      throw err;
    }
  };

  const logout = async () => {
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
  };

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

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        sendOtp,
        confirmOtp,
        registerCredential,
        authenticateCredential,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
