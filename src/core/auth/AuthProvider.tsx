// FILE: src/core/auth/AuthProvider.tsx
// PURPOSE: Provides global authentication context integrating Firebase, WebAuthn, and profile hydration.
// NOTES: Handles persistence and hydration cooldown; exposes auth actions (WebAuthn, logout) consumed via useAuth inside AppProvider.

import React, { useEffect, useState, useRef } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { hydrateInitialState } from '../../features/auth/services/userService';
import {
  register as webauthnRegister,
  authenticate as webauthnAuthenticate,
} from '../../features/auth/services/webauthnClient';
import {
  signInWithToken,
  signOut as serviceSignOut,
} from '../../features/auth/services/authService';
import { useSnackbar } from '../notifications/useSnackbar';
import { useNavigate } from 'react-router-dom';
import { useModalHost } from '../ui/useModalHost';
import { AuthContext, type RegisterCredentialParams } from './AuthContext';
import type { HydrateResponseDTO } from '../../types/auth';

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

  const registerCredential = async (params: RegisterCredentialParams): Promise<void> => {
    try {
      const jwt = await webauthnRegister(params);
      await signInWithToken(jwt);
    } catch (error) {
      console.error('registerCredential failed', error);
      showError((error as Error)?.message ?? 'Failed to register credential');
      throw error;
    }
  };

  const authenticateCredential = async (opts?: {
    silent?: boolean;
    mode?: 'default' | 'conditional';
  }): Promise<void> => {
    try {
      console.log('Starting WebAuthn authentication');
      const jwt = await webauthnAuthenticate(opts?.mode);
      await signInWithToken(jwt);
    } catch (err) {
      console.error('authenticateCredential failed', err);

      // Silently handle expected errors when silent mode is enabled
      if (opts?.silent && err instanceof Error) {
        const errorName = err.name;
        if (errorName === 'NotAllowedError' || errorName === 'AbortError') {
          return;
        }
      }

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
        isLoading: loading,
        registerCredential,
        authenticateCredential,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
