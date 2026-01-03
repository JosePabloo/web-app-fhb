// FILE: src/features/app/routes/Root/index.test.tsx
// PURPOSE: Verify the root route redirects authenticated users and renders the public landing when unauthenticated.
// NOTES: Mocks useAuth to control authentication state; uses MemoryRouter for route assertions.

import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import RootRoute from './index';

const mockAuthState = { isAuthenticated: false };

vi.mock('../../../../core/auth/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

describe('RootRoute', () => {
  it('redirects to dashboard when authenticated', () => {
    mockAuthState.isAuthenticated = true;

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Dashboard/)).toBeInTheDocument();
  });

  it('shows landing for unauthenticated users', () => {
    mockAuthState.isAuthenticated = false;

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<RootRoute />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Discover the perfect interior solutions for every room/i)).toBeInTheDocument();
  });
});
