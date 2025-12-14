// FILE: src/features/app/routes/UnderConstruction/index.tsx
// PURPOSE: Temporary maintenance screen shown when under-construction flag is enabled to halt normal routing during active development.
// NOTES: Overrides all routes when enabled so authenticated and public users see the same construction notice.

import { Box, Button, Stack, Typography } from '@mui/material';

export default function UnderConstruction() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 10,
      }}
    >
      <Stack spacing={3} alignItems="center" textAlign="center" maxWidth={560}>
        <Box
          component="img"
          src="/casa-norte-logo.png"
          alt="Casa Norte logo"
          sx={{ height: 274, width: 'auto' }}
        />
    
        <Stack spacing={1}>
          <Typography variant="h3">Under construction</Typography>
          <Typography variant="body1">We&apos;re finishing things up and will be back shortly.</Typography>
        </Stack>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </Stack>
    </Box>
  );
}
