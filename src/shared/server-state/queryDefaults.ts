// FILE: src/shared/server-state/queryDefaults.ts
// PURPOSE: Centralizes React Query timings so feature hooks share consistent cache behavior.
// NOTES: Tuned for Danny's Route navigation flows where back-navigation should reuse recent data.

export const QUERY_GC_TIME_MS = 30 * 60_000;
export const CLIENT_STALE_TIME_MS = 5 * 60_000;
// Backward-compatible alias for older query modules still importing this symbol.
export const DEFAULT_STALE_TIME_MS = CLIENT_STALE_TIME_MS;
export const PROPERTY_STALE_TIME_MS = 2 * 60_000;
export const PROPERTY_ACTIVITY_STALE_TIME_MS = 30 * 1_000;
export const DASHBOARD_ACTIVITY_STALE_TIME_MS = 30 * 1_000;
export const INVITE_STALE_TIME_MS = 2 * 60_000;
export const PUBLIC_INVITE_STALE_TIME_MS = 2 * 60_000;
export const MAPBOX_GEOCODE_STALE_TIME_MS = 24 * 60 * 60_000;
