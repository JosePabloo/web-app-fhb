// FILE: src/features/app/routes/Root/index.tsx
// PURPOSE: Home route gate that redirects authenticated users to their landing page and shows the public landing otherwise.
// NOTES: Uses auth context to decide between dashboard redirect and the unauthenticated landing experience.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../../core/auth/useAuth';
import LandingUnauthorized from '../../../auth/routes/LandingUnauthorized';

export default function RootRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingUnauthorized />;
}
