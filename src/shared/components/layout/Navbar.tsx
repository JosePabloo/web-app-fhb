// FILE: src/shared/components/layout/Navbar.tsx
// PURPOSE: Top application bar offering primary navigation links for authenticated user workspace.
// NOTES: Uses react-router links; optional companion to Sidebar for quick access actions (settings/logout).

import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <AppBar position="static" elevation={0} color="transparent">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/dashboard"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 700,
          }}
        >
          Casa Norte
        </Typography>

        <Box>
          <Button color="inherit" component={RouterLink} to="/settings">
            Settings
          </Button>
          <Button color="inherit" component={RouterLink} to="/logout">
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
