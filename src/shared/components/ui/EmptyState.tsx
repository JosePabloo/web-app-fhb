// FILE: src/shared/components/ui/EmptyState.tsx
// PURPOSE: Reusable empty state component for lists and cards with optional action.
// NOTES: Use when data is missing; provides icon, messaging, and optional CTA button.

import { Box, Button, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  sx?: SxProps<Theme>;
}

export default function EmptyState({ icon, title, description, action, sx }: EmptyStateProps) {
  const baseSx: SxProps<Theme> = { py: 3, px: 2, textAlign: 'center' };
  const mergedSx = Array.isArray(sx) ? [baseSx, ...sx] : sx ? [baseSx, sx] : [baseSx];

  return (
    <Stack alignItems="center" justifyContent="center" sx={mergedSx}>
      <Box sx={{ color: 'text.secondary', mb: 1.5 }}>{icon}</Box>
      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 280 }}>
        {description}
      </Typography>
      {action && (
        <Button variant="outlined" size="small" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Stack>
  );
}
