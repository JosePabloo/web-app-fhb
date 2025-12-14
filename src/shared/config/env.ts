// FILE: src/shared/config/env.ts
// PURPOSE: Validates required environment variables and exposes structured config object (API + Firebase settings).
// NOTES: Imported at startup (main.tsx) for fail-fast validation and reused by firebase config and API clients.

const required = [
  'VITE_API_CASA_NORTE_SPREAD_SYNC_URL',
  'VITE_API_CASA_NORTE_AUTH_URL',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

const env = import.meta.env as Record<string, string | undefined>;

const missing = required.filter((k) => !env[k]);
if (missing.length) {
  throw new Error(`Missing required env variables: ${missing.join(', ')}`);
}

const underConstruction = env.VITE_UNDER_CONSTRUCTION === 'true';

export const config = {
  apiBase: env.VITE_API_CASA_NORTE_SPREAD_SYNC_URL ?? '',
  authApiBase: env.VITE_API_CASA_NORTE_AUTH_URL ?? '',
  firebase: {
    apiKey: env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
    appId: env.VITE_FIREBASE_APP_ID ?? '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL,
  },
  featureFlags: {
    underConstruction,
  },
};

export default config;
