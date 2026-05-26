// FILE: src/app/router/PublicGuard.tsx
// PURPOSE: Redirect authenticated users away from public routes to their dashboard.
// NOTES: Wraps public layout branches so authed users don't see login/landing screens. 
// SYNC REQUIRED: changes to this file require an automatic discovery for code changes at the platform, cn-shell 

import { Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import { useAuth } from '../../core/auth/useAuth';

export default function PublicGuard() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <PublicLayout />;
}
