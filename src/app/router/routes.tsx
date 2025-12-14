// FILE: src/app/router/routes.tsx
// PURPOSE: Central declarative route map grouping public and authenticated pages under their respective layouts.
// NOTES: Uses React.lazy for code-splitting; nested children arrays define layout boundaries and '*' catch-all for NotFound.
import { lazy } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import PublicGuard from './PublicGuard';
import config from '../../shared/config/env';

const RootRoute = lazy(() => import('../../features/app/routes/Root'));
const LoginWithWebAuthn = lazy(() => import('../../features/auth/routes/LoginWithWebAuthn'));
const VerifyOTP = lazy(() => import('../../features/auth/routes/VerifyOTP'));
const Dashboard = lazy(() => import('../../features/dashboard/routes/Dashboard'));
const AccountSettings = lazy(() => import('../../features/settings/routes/AccountSettings'));
const NotFound = lazy(() => import('../../features/app/routes/NotFound'));
const UnderConstruction = lazy(() => import('../../features/app/routes/UnderConstruction'));

const isUnderConstruction = config.featureFlags?.underConstruction ?? false;

const maintenanceRoutes = [{ path: '*', element: <UnderConstruction /> }] as const;

const baseRoutes = [
  {
    element: <PublicGuard />,
    children: [
      { path: '/', element: <RootRoute /> },
      { path: '/login', element: <LoginWithWebAuthn /> },
      { path: '/verify', element: <VerifyOTP /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/settings', element: <AccountSettings /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
] as const;

export const routeConfig = isUnderConstruction ? maintenanceRoutes : baseRoutes;
