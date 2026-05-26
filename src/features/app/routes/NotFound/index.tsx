// FILE: src/features/app/routes/NotFound/index.tsx
// PURPOSE: Fallback route component rendering a 404 message and navigation back home for unmatched paths.
// NOTES: Registered as '*' in routeConfig to terminate routing tree when no other route matches.
// Can we do this at the CDN layer? 

import { Box, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The page you are looking for does not exist.
      </Typography>
    </Box>
  );
}
