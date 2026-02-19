// FILE: src/features/dashboard/hooks/useDomainHealth.ts
// PURPOSE: Hook for polling domain health status using client-side fetch with no-cors mode.
// NOTES: Used by DomainStatusCard to display real-time health status; polls automatically.

import { useCallback, useEffect, useRef, useState } from 'react';

export type DomainHealthStatus = 'checking' | 'healthy' | 'unhealthy';

export interface UseDomainHealthOptions {
  intervalMs?: number;
  timeoutMs?: number;
}

export interface UseDomainHealthResult {
  status: DomainHealthStatus;
  lastCheckedAtMs: number | null;
  checkNow: () => Promise<void>;
}

export function useDomainHealth(
  url: string,
  { intervalMs = 30_000, timeoutMs = 5_000 }: UseDomainHealthOptions = {},
): UseDomainHealthResult {
  const [status, setStatus] = useState<DomainHealthStatus>('checking');
  const [lastCheckedAtMs, setLastCheckedAtMs] = useState<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const requestIdRef = useRef(0);
  const isMountedRef = useRef(false);

  const checkHealth = useCallback(async () => {
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;

    setStatus('checking');

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const pingUrl = new URL('/generate_204', url).toString();
      await fetch(pingUrl, {
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!isMountedRef.current || requestId !== requestIdRef.current) {
        return;
      }
      setStatus('healthy');
      setLastCheckedAtMs(Date.now());
    } catch {
      if (!isMountedRef.current || requestId !== requestIdRef.current) {
        return;
      }
      setStatus('unhealthy');
      setLastCheckedAtMs(Date.now());
    } finally {
      clearTimeout(timeoutId);
    }
  }, [url, timeoutMs]);

  useEffect(() => {
    isMountedRef.current = true;
    void checkHealth();
    intervalRef.current = setInterval(checkHealth, intervalMs);

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkHealth, intervalMs]);

  return { status, lastCheckedAtMs, checkNow: checkHealth };
}
