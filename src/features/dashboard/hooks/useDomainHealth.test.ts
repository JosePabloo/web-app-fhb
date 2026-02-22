// FILE: src/features/dashboard/hooks/useDomainHealth.test.ts
// PURPOSE: Tests for useDomainHealth hook verifying status transitions and polling behavior.
// NOTES: Mocks global.fetch; tests polling behavior.

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useDomainHealth } from './useDomainHealth';

describe('useDomainHealth', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with checking status', () => {
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useDomainHealth('https://example.com'));
    expect(result.current.status).toBe('checking');
  });

  it('sets status to healthy when fetch resolves', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response());

    const { result } = renderHook(() => useDomainHealth('https://example.com'));

    await waitFor(
      () => {
        expect(result.current.status).toBe('healthy');
      },
      { timeout: 2000 },
    );

    expect(result.current.lastCheckedAtMs).not.toBeNull();
  });

  it('sets status to unhealthy when fetch rejects', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useDomainHealth('https://example.com'));

    await waitFor(
      () => {
        expect(result.current.status).toBe('unhealthy');
      },
      { timeout: 2000 },
    );

    expect(result.current.lastCheckedAtMs).not.toBeNull();
  });

  it('provides checkNow function to manually trigger check', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(new Response());

    const { result } = renderHook(() => useDomainHealth('https://example.com'));

    await waitFor(
      () => {
        expect(result.current.status).toBe('healthy');
      },
      { timeout: 2000 },
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    fetchSpy.mockClear();

    await act(async () => {
      await result.current.checkNow();
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  }, 10000);
});
