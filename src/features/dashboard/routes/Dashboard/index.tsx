// FILE: src/features/dashboard/routes/Dashboard/index.tsx
// PURPOSE: Primary protected landing page after authentication representing user entry into app functionality.
// NOTES: Rendered under AuthLayout; displays user name and domain health status card.

import { Grid, Typography } from '@mui/material';
import { useAuth } from '../../../../core/auth/useAuth';
import DomainStatusCard from '../../components/DomainStatusCard';

export default function Dashboard() {
  const { user, profile } = useAuth();

  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : (user?.displayName ?? user?.email ?? 'User');

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Typography variant="h4">{displayName}</Typography>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <DomainStatusCard displayUrl="https://www.google.com" />
      </Grid>
    </Grid>
  );
}
