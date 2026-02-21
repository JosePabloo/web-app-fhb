import type { HydrateResponseDTO } from '../types/hydrate';
import type { UserResponseDTO } from '../../../types/user';
import { spreadSyncApi } from '../../../shared/services/apiClient';

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface CompleteHydrationPayload {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  photoFile?: File | null;
}

export async function fetchUsers(): Promise<UserResponseDTO[]> {
  const { data } = await spreadSyncApi.get<UserResponseDTO[]>('/users');
  return data;
}

export async function hydrateInitialState(token?: string): Promise<HydrateResponseDTO | null> {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  const response = await spreadSyncApi.get<ApiResponse<HydrateResponseDTO>>(
    '/casa-norte/hydrate',
    config,
  );

  return response.data.data ?? null;
}

export async function completeHydration(
  payload: CompleteHydrationPayload,
  token?: string,
): Promise<HydrateResponseDTO | null> {
  const config = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(payload.photoFile ? { 'Content-Type': 'multipart/form-data' } : {}),
        },
      }
    : undefined;

  const shouldUseFormData = !!payload.photoFile;
  const body = shouldUseFormData ? new FormData() : ({} as Record<string, unknown>);

  const assignField = (key: string, value?: string) => {
    if (!value) return;
    if (shouldUseFormData && body instanceof FormData) {
      body.append(key, value);
    } else {
      (body as Record<string, unknown>)[key] = value;
    }
  };

  assignField('firstName', payload.firstName);
  assignField('lastName', payload.lastName);
  assignField('phoneNumber', payload.phoneNumber);
  if (shouldUseFormData && body instanceof FormData && payload.photoFile) {
    body.append('photo', payload.photoFile);
  }

  const response = await spreadSyncApi.put<ApiResponse<HydrateResponseDTO>>(
    '/casa-norte/hydrate',
    body,
    config,
  );

  return response.data.data ?? null;
}
