// FILE: src/shared/components/layout/Sidebar.test.tsx
// PURPOSE: Validate Sidebar renders nav items and handles toggle/logout wiring.
// NOTES: Mocks auth hook and uses MemoryRouter to inspect navigation calls.

import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar, { defaultNavItems } from './Sidebar';

const logout = vi.fn();
const navigate = vi.fn();
const toggle = vi.fn();

vi.mock('../../../core/auth/useAuth', () => ({
  useAuth: () => ({ logout }),
}));

vi.mock('../../../app/providers/useThemeMode', () => ({
  useThemeMode: () => ({ mode: 'light', toggle }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe('Sidebar', () => {
  it('renders default nav items and triggers navigate on click', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Sidebar open onToggle={() => {}} />
      </MemoryRouter>
    );

    for (const item of defaultNavItems) {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      await user.click(screen.getByText(item.label));
      expect(navigate).toHaveBeenCalledWith(item.path);
    }
  });

  it('renders custom nav items when provided', async () => {
    const user = userEvent.setup();
    const customItems = [{ label: 'Clients', icon: <span>Icon</span>, path: '/clients' }];

    render(
      <MemoryRouter>
        <Sidebar open onToggle={() => {}} items={customItems} />
      </MemoryRouter>
    );

    expect(screen.getByText('Clients')).toBeInTheDocument();
    await user.click(screen.getByText('Clients'));
    expect(navigate).toHaveBeenCalledWith('/clients');
  });

  it('toggles theme when theme item clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Sidebar open onToggle={() => {}} />
      </MemoryRouter>
    );

    await user.click(screen.getAllByText(/Dark mode/i)[0]);
    expect(toggle).toHaveBeenCalled();
  });
});
