// FILE: src/core/auth/AuthContext.ts
// PURPOSE: Type definitions and context for authentication state.

import { createContext } from 'react';
import type { User } from 'firebase/auth';
import type { HydrateResponseDTO } from '../../types/auth';

export interface RegisterCredentialParams {
  username: string;
  email: string;
  phoneNumber?: string;
  inviteId?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: HydrateResponseDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  registerCredential: (params: RegisterCredentialParams) => Promise<void>;
  authenticateCredential: (opts?: {
    silent?: boolean;
    mode?: 'default' | 'conditional';
  }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
