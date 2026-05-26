import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  overline?: string;
}

export function PageHeader({ title, subtitle, action, overline }: PageHeaderProps) {
  return (
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 1.5,
      }}
    >
      <Stack spacing={0.5}>
        {overline && (
          <Typography
            variant="overline"
            sx={{ letterSpacing: 0.08, textTransform: 'uppercase' }}
            color="text.secondary"
          >
            {overline}
          </Typography>
        )}
        <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 700 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>
      {action}
    </Box>
  );
}
