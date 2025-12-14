// FILE: src/app/layouts/PublicLayout.tsx
// PURPOSE: Wrapper layout for unauthenticated routes ensuring consistent viewport sizing before login.
// NOTES: Supplies an Outlet for public auth-related pages separate from authenticated layout concerns.
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export default function PublicLayout() {
  return (
    <Box sx={{ minHeight: '100vh', width: '100vw' }}>
      <Outlet />
    </Box>
  );
}
