// FILE: src/core/auth/AuthProvider.test.tsx
// PURPOSE: Validate hydration, logout/reset, and error handling paths in AuthProvider.
// NOTES: Uses dynamic imports inside tests to avoid hoisting issues with vi.mock.

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { AuthProvider } from './AuthProvider';

// Hoisted mocks: define factories inline to avoid top-level variable access.
vi.mock('firebase/auth', () => {
  const onAuthStateChanged = vi.fn((..._args: unknown[]) => vi.fn());
  const setPersistence = vi.fn(() => Promise.resolve());
  const browserLocalPersistence = {};
  return { __esModule: true, onAuthStateChanged, setPersistence, browserLocalPersistence };
});

vi.mock('../../features/auth/services/userService', () => {
  const hydrateInitialState = vi.fn();
  const completeHydration = vi.fn();
  return { hydrateInitialState, completeHydration };
});

vi.mock('../../features/auth/services/authService', () => {
  const initRecaptcha = vi.fn();
  const sendOtp = vi.fn();
  const signInWithToken = vi.fn();
  const signOut = vi.fn();
  return { initRecaptcha, sendOtp, signInWithToken, signOut };
});

vi.mock('../../features/auth/services/webauthnClient', () => {
  const register = vi.fn();
  const authenticate = vi.fn();
  return { register, authenticate };
});

vi.mock('../notifications/useSnackbar', () => {
  const showError = vi.fn();
  return { useSnackbar: () => ({ showError }) };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  const navigate = vi.fn();
  return { ...actual, useNavigate: () => navigate };
});

vi.mock('../ui/ModalHostProvider', () => {
  const resetSession = vi.fn();
  return { useModalHost: () => ({ resetSession }) };
});

vi.mock('../../firebase/config', () => ({ auth: {} }));

function Consumer() {
  return <div>consumer</div>;
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hydrates profile on auth state change and clears on logout', async () => {
    const { hydrateInitialState } = await import('../../features/auth/services/userService');
    const { signOut } = await import('../../features/auth/services/authService');
    const { useModalHost } = await import('../ui/ModalHostProvider');
    const { onAuthStateChanged } = await import('firebase/auth');

    (hydrateInitialState as any).mockResolvedValueOnce({ id: 'u1' });
    (signOut as any).mockResolvedValueOnce(undefined);

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    const handler = (onAuthStateChanged as any).mock.calls[0][1];

    await handler({ uid: '123', getIdToken: vi.fn().mockResolvedValue('token') } as any);
    expect(hydrateInitialState as any).toHaveBeenCalled();

    await handler(null);
    expect((useModalHost as any)().resetSession).toHaveBeenCalled();
  });

  it('logs when hydration fails without surfacing a snackbar on initial load', async () => {
    const { hydrateInitialState } = await import('../../features/auth/services/userService');
    const { useSnackbar } = await import('../notifications/useSnackbar');
    const { onAuthStateChanged } = await import('firebase/auth');

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (hydrateInitialState as any).mockRejectedValueOnce(new Error('fail'));

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    const handler = (onAuthStateChanged as any).mock.calls[0][1];
    await handler({ uid: '123', getIdToken: vi.fn().mockResolvedValue('token') } as any);

    expect(errorSpy).toHaveBeenCalled();
    expect((useSnackbar as any)().showError).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
