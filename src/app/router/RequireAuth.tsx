// FILE: src/app/router/RequireAuth.tsx
// PURPOSE: Protects authenticated routes by ensuring valid auth before rendering private content.
// NOTES: Wraps authenticated layout branches; redirects unauthenticated users to login.

import { Navigate, useLocation } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../../core/auth/useAuth';

export default function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <AuthLayout />;
}
