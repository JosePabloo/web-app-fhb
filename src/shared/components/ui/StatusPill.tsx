// FILE: src/shared/components/ui/StatusPill.tsx
// PURPOSE: Unified, reusable status pill component mapping semantic variants to theme palette.
// NOTES: Use across features to ensure consistent status styling.

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export type StatusPillColor = 'success' | 'info' | 'warning' | 'error' | 'default';

export interface StatusPillProps {
  label: string;
  colorVariant?: StatusPillColor;
}

export default function StatusPill({ label, colorVariant = 'default' }: StatusPillProps) {
  const theme = useTheme();

  const colorMap: Record<StatusPillColor, { bg: string; fg: string }> = {
    success: { bg: theme.palette.success.light, fg: theme.palette.success.dark },
    info: { bg: theme.palette.info.light, fg: theme.palette.info.dark },
    warning: { bg: theme.palette.warning.light, fg: theme.palette.warning.dark },
    error: { bg: theme.palette.error.light, fg: theme.palette.error.dark },
    default: { bg: theme.palette.action.hover, fg: theme.palette.text.primary },
  };

  const colors = colorMap[colorVariant] ?? colorMap.default;

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 1.5,
        py: 0.5,
        borderRadius: 999,
        bgcolor: colors.bg,
        color: colors.fg,
        fontSize: 12,
        fontWeight: 600,
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </Box>
  );
}
