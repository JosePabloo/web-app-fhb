// FILE: src/features/app/routes/NotFound/index.tsx
// PURPOSE: Fallback route component rendering a 404 message and navigation back home for unmatched paths.
// NOTES: Registered as '*' in routeConfig to terminate routing tree when no other route matches.

import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" color="primary" component={RouterLink} to="/">
        Go Home
      </Button>
    </Box>
  );
}
