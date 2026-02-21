// FILE: src/app/router/routes.tsx
// PURPOSE: Central declarative route map grouping public and authenticated pages under their respective layouts.
// NOTES: Uses React.lazy for code-splitting; nested children arrays define layout boundaries and '*' catch-all for NotFound.
import { lazy } from 'react';
import PublicGuard from './PublicGuard';
import RequireAuth from './RequireAuth';
import config from '../../shared/config/env';

const RootRoute = lazy(() => import('../../features/app/routes/Root'));
const LoginWithWebAuthn = lazy(() => import('../../features/auth/routes/LoginWithWebAuthn'));
const Contact = lazy(() => import('../../features/auth/routes/Contact'));
const Dashboard = lazy(() => import('../../features/dashboard/routes/Dashboard'));
const AccountSettings = lazy(() => import('../../features/settings/routes/AccountSettings'));
const NotFound = lazy(() => import('../../features/app/routes/NotFound'));
const UnderConstruction = lazy(() => import('../../features/app/routes/UnderConstruction'));
const InviteCreate = lazy(() => import('../../features/invites/routes/InviteCreate'));
const InviteDetails = lazy(() => import('../../features/invites/routes/InviteDetails'));
const InviteLanding = lazy(() => import('../../features/invites/routes/InviteLanding'));
const InviteAccept = lazy(() => import('../../features/invites/routes/InviteAccept'));

const isUnderConstruction = config.featureFlags?.underConstruction ?? false;

const maintenanceRoutes = [{ path: '*', element: <UnderConstruction /> }] as const;

const baseRoutes = [
  {
    element: <PublicGuard />,
    children: [
      { path: '/', element: <RootRoute /> },
      { path: '/login', element: <LoginWithWebAuthn /> },
      { path: '/contact', element: <Contact /> },
      { path: '/invite', element: <InviteLanding /> },
      { path: '/invite/continue', element: <InviteAccept /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/settings', element: <AccountSettings /> },
      { path: '/settings/invite', element: <InviteCreate /> },
      { path: '/settings/invite/:inviteId', element: <InviteDetails /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
] as const;

export const routeConfig = isUnderConstruction ? maintenanceRoutes : baseRoutes;
