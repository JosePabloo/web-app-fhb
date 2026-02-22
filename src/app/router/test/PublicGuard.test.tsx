// FILE: src/app/router/test/PublicGuard.test.tsx
// PURPOSE: Ensure authenticated users hitting public routes are redirected to dashboard and unauthenticated users see public layout.
// NOTES: Mocks useAuth to control auth state; uses MemoryRouter for routing.

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import PublicGuard from '../PublicGuard';

const mockAuthState = { isAuthenticated: false };

vi.mock('../../../core/auth/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

vi.mock('../../layouts/PublicLayout', () => ({
  __esModule: true,
  default: () => <div>Public Layout</div>,
}));

describe('PublicGuard', () => {
  it('redirects authenticated users to /dashboard', () => {
    mockAuthState.isAuthenticated = true;

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<PublicGuard />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders public layout for unauthenticated users', () => {
    mockAuthState.isAuthenticated = false;

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<PublicGuard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Public Layout')).toBeInTheDocument();
  });
});
