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

export interface DashboardKPIs {
  todaysJobs: number;
  completedJobs: number;
  inProgressJobs: number;
  scheduledJobs: number;
  readyToSchedule: number;
  openEstimates: number;
}

export interface AttentionItem {
  id: string;
  type: 'estimate' | 'job' | 'payment';
  title: string;
  description: string;
}

export interface ActivityItem {
  id: string;
  type: 'estimate' | 'job' | 'payment';
  title: string;
  timestamp: number;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  attentionItems: AttentionItem[];
  recentActivity: ActivityItem[];
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
  dashboard?: DashboardData;
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
