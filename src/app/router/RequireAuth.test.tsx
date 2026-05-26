// FILE: src/app/router/RequireAuth.test.tsx
// PURPOSE: Ensure unauthenticated users hitting private routes are redirected to login.
// NOTES: Mocks useAuth to control auth state; uses MemoryRouter for routing.

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import RequireAuth from './RequireAuth';

const mockUseAuth = vi.hoisted(() => vi.fn());

vi.mock('../../core/auth/useAuth', () => ({
  useAuth: mockUseAuth,
}));

vi.mock('../layouts/AuthLayout', () => ({
  __esModule: true,
  default: () => <div>Auth Layout</div>,
}));

describe('RequireAuth', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('redirects unauthenticated users to /login', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/dashboard" element={<RequireAuth />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders auth layout for authenticated users', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/dashboard" element={<RequireAuth />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Auth Layout')).toBeInTheDocument();
  });
});
