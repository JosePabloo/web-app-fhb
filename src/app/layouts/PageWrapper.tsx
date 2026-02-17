// FILE: src/app/layouts/PageWrapper.tsx
// PURPOSE: Generic page framing component giving full-height structure and containerized content region.
// NOTES: Inserts #recaptcha-container for auth flows; used within individual route components rather than router layout.

// CHECK IF THIS IS BEING USED?
import { Container, Box } from '@mui/material';
import type { PropsWithChildren } from 'react';

export default function ({ children }: PropsWithChildren) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div id="recaptcha-container" />
      <Container fixed>{children}</Container>
    </Box>
  );
}
