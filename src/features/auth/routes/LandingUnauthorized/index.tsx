// FILE: src/features/auth/routes/LandingUnauthorized/index.tsx
// PURPOSE: Public landing screen prompting unauthenticated users to initiate login/onboarding.
// NOTES: Served under PublicLayout before authentication; uses PageWrapper for consistent vertical centering and recaptcha anchor.

import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PageWrapper from "../../../../app/layouts/PageWrapper";

export default function LandingUnauthorized() {
  return (
    <PageWrapper>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" gutterBottom>
          Casa Norte
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Onboarding
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Please login to continue.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/login"
        >
          Go to Login
        </Button>
      </Box>
    </PageWrapper>
  );
}
