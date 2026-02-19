// FILE: src/features/dashboard/components/DomainStatusCard.tsx
// PURPOSE: Card component displaying domain health status with polling indicator.
// NOTES: Uses useDomainHealth hook to poll Google; shows status pill and last checked timestamp.

import { Card, CardContent, Typography, Box } from '@mui/material';
import StatusPill from '../../../shared/components/ui/StatusPill';
import { useDomainHealth, type DomainHealthStatus } from '../hooks/useDomainHealth';

interface DomainStatusCardProps {
  displayUrl: string;
  pingUrl?: string;
}

const statusLabelMap: Record<DomainHealthStatus, string> = {
  checking: 'Checking',
  healthy: 'Healthy',
  unhealthy: 'Unhealthy',
};

const statusColorMap: Record<DomainHealthStatus, 'info' | 'success' | 'error'> = {
  checking: 'info',
  healthy: 'success',
  unhealthy: 'error',
};

function formatLastChecked(timestamp: number | null): string {
  if (timestamp === null) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

export default function DomainStatusCard({ displayUrl, pingUrl }: DomainStatusCardProps) {
  const { status, lastCheckedAtMs } = useDomainHealth(pingUrl ?? displayUrl);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Domain Status
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {displayUrl}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StatusPill label={statusLabelMap[status]} colorVariant={statusColorMap[status]} />
            {lastCheckedAtMs !== null && (
              <Typography variant="caption" color="text.secondary">
                Last checked: {formatLastChecked(lastCheckedAtMs)}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
