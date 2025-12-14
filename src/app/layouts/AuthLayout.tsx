// FILE: src/app/layouts/AuthLayout.tsx
// PURPOSE: Provides the protected application layout with sidebar navigation and main content outlet.
// NOTES: Main area is a flex column with overflow handling so inner pages own their scroll regions.

import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar, { defaultNavItems } from '../../shared/components/layout/Sidebar';
import { useState } from 'react';

export default function AuthLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100dvh',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        items={[...defaultNavItems]}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100dvh',
          p: 3,
          overflowY: 'auto',
          transition: 'width 0.3s ease',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
