import { Box } from '@mui/material';
import type { ReactNode } from 'react';

export interface PageLayoutProps {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function PageLayout({ header, children, footer }: PageLayoutProps) {
  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {header}
      {children}
      {footer}
    </Box>
  );
}
