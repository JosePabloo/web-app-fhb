// FILE: src/shared/services/apiClient/createClient.ts
// PURPOSE: Factory function for creating configured axios instances.

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import config from '../../config/env';
import {
  withTiming,
  withLogging,
  withApplication,
  withAuth,
  type InterceptorFactory,
} from './interceptors';

export function createApiClient(
  baseURL: string,
  options: AxiosRequestConfig,
  interceptors: InterceptorFactory[],
): AxiosInstance {
  let client = axios.create({
    baseURL,
    withCredentials: true,
    timeout: config.requestTimeout,
    timeoutErrorMessage: 'Request timed out',
    ...options,
  });

  for (const interceptor of interceptors) {
    client = interceptor(client);
  }

  return client;
}

const requestInterceptors: InterceptorFactory[] = [withTiming, withApplication, withAuth];
const responseInterceptors: InterceptorFactory[] = [withLogging];
export const defaultInterceptors: InterceptorFactory[] = [
  ...requestInterceptors,
  ...responseInterceptors,
];
