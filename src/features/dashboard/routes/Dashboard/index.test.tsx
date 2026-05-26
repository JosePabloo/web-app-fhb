// FILE: src/features/dashboard/routes/Dashboard/index.test.tsx
// PURPOSE: Tests for Dashboard component verifying user name rendering and domain status card display.
// NOTES: Mocks AuthContext to provide profile data; verifies UI elements are present.

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { AuthContext } from '../../../../core/auth/AuthProvider';
import Dashboard from './index';

vi.mock('../../components/DomainStatusCard', () => ({
  default: function MockDomainStatusCard() {
    return <div data-testid="domain-status-card">Domain Status</div>;
  },
}));

describe('Dashboard', () => {
  const mockUser = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
  } as const;

  const mockProfile = {
    id: 'test-id',
    tenantId: 'tenant-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    status: 'ACTIVE',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    permissions: [],
    featureFlags: {},
    tenantSettings: {},
    preferences: {},
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders user name from profile', () => {
    render(
      <AuthContext.Provider
        value={{
          user: mockUser,
          profile: mockProfile,
          isAuthenticated: true,
          registerCredential: vi.fn(),
          authenticateCredential: vi.fn(),
          logout: vi.fn(),
          sendVerificationCode: vi.fn(),
          verifyCode: vi.fn(),
        }}
      >
        <Dashboard />
      </AuthContext.Provider>,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders domain status card', () => {
    render(
      <AuthContext.Provider
        value={{
          user: mockUser,
          profile: mockProfile,
          isAuthenticated: true,
          registerCredential: vi.fn(),
          authenticateCredential: vi.fn(),
          logout: vi.fn(),
          sendVerificationCode: vi.fn(),
          verifyCode: vi.fn(),
        }}
      >
        <Dashboard />
      </AuthContext.Provider>,
    );

    expect(screen.getByTestId('domain-status-card')).toBeInTheDocument();
  });

  it('falls back to user displayName when profile is null', () => {
    render(
      <AuthContext.Provider
        value={{
          user: mockUser,
          profile: null,
          isAuthenticated: true,
          registerCredential: vi.fn(),
          authenticateCredential: vi.fn(),
          logout: vi.fn(),
          sendVerificationCode: vi.fn(),
          verifyCode: vi.fn(),
        }}
      >
        <Dashboard />
      </AuthContext.Provider>,
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('shows "User" when no profile or user info available', () => {
    render(
      <AuthContext.Provider
        value={{
          user: null,
          profile: null,
          isAuthenticated: true,
          registerCredential: vi.fn(),
          authenticateCredential: vi.fn(),
          logout: vi.fn(),
          sendVerificationCode: vi.fn(),
          verifyCode: vi.fn(),
        }}
      >
        <Dashboard />
      </AuthContext.Provider>,
    );

    expect(screen.getByText('User')).toBeInTheDocument();
  });
});
