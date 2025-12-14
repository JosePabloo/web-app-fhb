// src/types/auth.ts

export type { HydrateResponseDTO } from '../shared/types/common';

export interface TenantSettingsDTO {
    themeColor?: string;
    dateFormat?: string;
    // add other tenant‐wide settings as needed
}

export interface UserPreferencesDTO {
    locale?: string;
    timezone?: string;
    dashboardLayout?: string;
    // add other user‐specific preferences as needed
}

// WebAuthn-related types have been moved to src/features/auth/types/auth.ts
