// FILE: src/shared/types/common.ts
// PURPOSE: Shared DTO type definitions for hydration, user records, tenant settings, and preferences across features.
// NOTES: Consumed by auth/user services and contexts; must align with backend contract to avoid runtime mismatches.

export interface TenantSettingsDTO {
  themeColor?: string;
  dateFormat?: string;
}

export interface UserPreferencesDTO {
  locale?: string;
  timezone?: string;
  dashboardLayout?: string;
}

export interface HydrateResponseDTO {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  featureFlags: Record<string, boolean>;
  tenantSettings: TenantSettingsDTO;
  preferences: UserPreferencesDTO;
}

export interface UserResponseDTO {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}
