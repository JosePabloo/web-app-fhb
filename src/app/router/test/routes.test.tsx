// FILE: src/app/router/routes.test.tsx
// PURPOSE: Verify routeConfig switches to the under-construction catch-all when flagged and defaults to base routes otherwise.
// NOTES: Mocks shared/config/env per test to avoid env validation and to toggle the feature flag.

import { afterEach, describe, expect, it, vi } from 'vitest';

const mockEnvModule = (underConstruction: boolean) => {
  const mockConfig = {
    apiBase: '',
    authApiBase: '',
    firebase: { apiKey: '', authDomain: '', projectId: '', appId: '' },
    featureFlags: { underConstruction },
  };
  vi.doMock('../../shared/config/env', () => ({
    __esModule: true,
    default: mockConfig,
    config: mockConfig,
  }));
};

describe('routeConfig', () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.doUnmock('../../shared/config/env');
  });

  it('uses maintenance-only routes when under construction flag is on', async () => {
    vi.doMock('./PublicGuard', () => ({ __esModule: true, default: () => null }));
    vi.doMock('../layouts/AuthLayout', () => ({ __esModule: true, default: () => null }));
    mockEnvModule(true);
    const { routeConfig } = await import('../routes');
    const maintenanceRoute = routeConfig[0] as { path?: string };

    expect(routeConfig).toHaveLength(1);
    expect((routeConfig as readonly { path: string }[])[0].path).toBe('*');
  });

  it('uses base routes when under construction flag is off', async () => {
    vi.doMock('./PublicGuard', () => ({ __esModule: true, default: () => null }));
    vi.doMock('../layouts/AuthLayout', () => ({ __esModule: true, default: () => null }));
    mockEnvModule(false);
    const { routeConfig } = await import('../routes');

    expect(routeConfig).toHaveLength(3);
    const hasDashboard = routeConfig.some(
      (route) => 'children' in route && route.children?.some((child) => child.path === '/dashboard')
    );
    const hasContact = routeConfig.some(
      (route) => 'children' in route && route.children?.some((child) => child.path === '/contact')
    );
    const hasNotFound = routeConfig.some((route) => 'path' in route && route.path === '*');

    expect(hasDashboard).toBe(true);
    expect(hasContact).toBe(true);
    expect(hasNotFound).toBe(true);
  });
});
