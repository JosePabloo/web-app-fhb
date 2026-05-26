// FILE: src/shared/services/apiClient/interceptors.ts
// PURPOSE: Axios interceptors for timing, logging, auth, and application headers.

import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import config from '../../config/env';
import { auth } from '../../../firebase/config';

export interface TimedConfig extends InternalAxiosRequestConfig {
  metadata?: { startTime: number };
}

export type InterceptorFactory = (client: AxiosInstance) => AxiosInstance;

export function withTiming(client: AxiosInstance): AxiosInstance {
  client.interceptors.request.use((requestConfig: TimedConfig) => {
    requestConfig.metadata = { startTime: Date.now() };
    return requestConfig;
  });
  return client;
}

export function withLogging(client: AxiosInstance): AxiosInstance {
  client.interceptors.response.use(
    (response) => {
      const timedConfig = response.config as TimedConfig;
      const duration = timedConfig.metadata?.startTime
        ? Date.now() - timedConfig.metadata.startTime
        : 'N/A';
      console.log(
        `[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} - ${duration}ms`,
      );
      return response;
    },
    (error: AxiosError) => {
      const timedConfig = error.config as TimedConfig | undefined;
      const duration = timedConfig?.metadata?.startTime
        ? Date.now() - timedConfig.metadata.startTime
        : 'N/A';
      console.error(
        `[API] ${error.config?.method?.toUpperCase()} ${error.config?.url} - ERROR - ${duration}ms - ${error.message}`,
      );
      return Promise.reject(error);
    },
  );
  return client;
}

export function withAuth(client: AxiosInstance): AxiosInstance {
  client.interceptors.request.use(async (requestConfig) => {
    requestConfig.headers = requestConfig.headers ?? {};
    requestConfig.headers['X-Application-Name'] = config.application;

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

export function withApplication(client: AxiosInstance): AxiosInstance {
  client.interceptors.request.use(async (requestConfig) => {
    if (config.application) {
      requestConfig.headers = requestConfig.headers ?? {};
      requestConfig.headers['X-Application-Name'] = config.application;
    }
    return requestConfig;
  });
  return client;
}
