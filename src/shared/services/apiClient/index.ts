// FILE: src/shared/services/apiClient/index.ts
// PURPOSE: Exports configured API clients for spread-sync and auth services.

import config from '../../config/env';
import { createApiClient, defaultInterceptors } from './createClient';

export const spreadSyncApi = createApiClient(config.apiBase, {}, defaultInterceptors);

export const authApi = createApiClient(
  config.authApiBase ?? config.apiBase,
  {},
  defaultInterceptors,
);
