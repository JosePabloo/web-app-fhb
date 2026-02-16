// FILE: src/app/layouts/AuthLayout.tsx
// PURPOSE: Provides the protected application layout with sidebar navigation and main content outlet.
// NOTES: Main area is a flex column with overflow handling so inner pages own their scroll regions.

import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { lazy, Suspense, useState } from 'react';

const Sidebar = lazy(() =>
  import('../../shared/components/layout/Sidebar').then((m) => ({ default: m.default }))
);

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
      <Suspense fallback={null}>
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
      </Suspense>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          // use minHeight so content taller than the viewport can scroll
          minHeight: '100dvh',
          p: 3,
          // let the main area scroll vertically; children manage inner scroll containers
          overflowY: 'auto',
          transition: 'width 0.3s ease',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
