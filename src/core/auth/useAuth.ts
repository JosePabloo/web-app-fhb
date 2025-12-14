// FILE: src/core/auth/useAuth.ts
// PURPOSE: Hook accessor for AuthContext giving components unified entry point to auth state and actions.
// NOTES: Enforces provider usage (throws if missing) forming boundary between feature code and auth implementation.

import { useContext } from 'react';
import type { AuthContextType } from './AuthProvider';
import { AuthContext } from './AuthProvider';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
