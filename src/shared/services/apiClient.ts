// FILE: src/shared/services/apiClient.ts
// PURPOSE: Defines axios instances for general, auth, and spread-sync API communication using env-derived base URLs.
// NOTES: Shared by feature services (auth/user/webauthn); centralizes credential and baseURL configuration.

import axios from 'axios';
import config from '../config/env';
import { auth } from '../../firebase/config';

function attachAuthInterceptor(client: ReturnType<typeof axios.create>) {
  client.interceptors.request.use(async (requestConfig) => {
    requestConfig.headers = requestConfig.headers ?? {};
    requestConfig.headers['X-Application-Name'] = config.application;

    // Preserve explicit Authorization header if caller set one.
    if ('Authorization' in requestConfig.headers) {
      return requestConfig;
    }

    const token = await auth.currentUser?.getIdToken?.();
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  });
  return client;
}

function attachApplicationInterceptor(client: ReturnType<typeof axios.create>) {
  client.interceptors.request.use(async (requestConfig) => {
    // Add application identification header
    if (config.application) {
      requestConfig.headers = requestConfig.headers ?? {};
      requestConfig.headers['X-Application-Name'] = config.application;
    }
    return requestConfig;
  });
  return client;
}

// Base Axios instance for the app
export const apiClient = attachApplicationInterceptor(attachAuthInterceptor(axios.create({
  baseURL: config.apiBase,
  withCredentials: true,
})));

// Casa Norte auth-specific API client (can use a dedicated base if needed)
export const casaNorteAuthApi = attachApplicationInterceptor(attachAuthInterceptor(axios.create({
  baseURL: config.authApiBase ?? config.apiBase,
  withCredentials: true,
})));

// Casa Norte Spread Sync API client (uses main apiBase)
export const casaNorteSpreadSyncApi = apiClient;
