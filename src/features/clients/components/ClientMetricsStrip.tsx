// FILE: features/clients/components/ClientMetricsStrip.tsx
// PURPOSE: Renders the top metrics row for Client Details using provided client data.
// NOTES: Matches original UI and labels; pure presentational.

import { Paper, Stack, Typography } from '@mui/material';
import { formatIsoDate, formatCurrency } from '../utils/clientFormatting';

export interface ClientMetricsStripProps {
  client: {
    jobsCompleted: number;
    lastServiceDate?: string;
    nextScheduledJob?: string;
    outstandingBalanceCents: number;
  };
}

export default function ClientMetricsStrip({ client }: ClientMetricsStripProps) {
  const metricConfig = [
    { key: 'jobsCompleted', label: 'Jobs completed', value: client.jobsCompleted },
    {
      key: 'lastServiceDate',
      label: 'Last service date',
      value: formatIsoDate(client.lastServiceDate),
    },
    {
      key: 'nextScheduledJob',
      label: 'Next scheduled job',
      value: formatIsoDate(client.nextScheduledJob),
    },
    {
      key: 'outstandingBalance',
      label: 'Outstanding balance',
      value: formatCurrency(client.outstandingBalanceCents),
    },
  ] as const;

  return (
    <Stack direction="row" spacing={2} flexWrap="wrap">
      {metricConfig.map((m) => (
        <Paper
          key={m.key}
          elevation={0}
          sx={{ p: 2, minWidth: 180, flex: '1 1 0', border: 1, borderColor: 'divider' }}
        >
          <Typography variant="caption" color="text.secondary">
            {m.label}
          </Typography>
          <Typography variant="h6">{m.value}</Typography>
        </Paper>
      ))}
    </Stack>
  );
}
