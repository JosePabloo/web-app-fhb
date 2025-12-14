// FILE: src/shared/services/apiClient.ts
// PURPOSE: Defines axios instances for general, auth, and spread-sync API communication using env-derived base URLs.
// NOTES: Shared by feature services (auth/user/webauthn); centralizes credential and baseURL configuration.

import axios from 'axios';
import config from '../config/env';

// Base Axios instance for the app
export const apiClient = axios.create({
  baseURL: config.apiBase,
  withCredentials: true,
});

// Casa Norte auth-specific API client (can use a dedicated base if needed)
export const casaNorteAuthApi = axios.create({
  baseURL: config.authApiBase ?? config.apiBase,
  withCredentials: true,
});

// Casa Norte Spread Sync API client (uses main apiBase)
export const casaNorteSpreadSyncApi = apiClient;
