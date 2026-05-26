// FILE: features/clients/components/ClientUpcomingServicesCard.tsx
// PURPOSE: Shows upcoming scheduled jobs for the client with date and amount.
// NOTES: UI identical to original; pure presentational.

import { Box, Paper, Stack, Typography } from '@mui/material';
import type { JobSummary } from '../types';
import { formatIsoDate, formatCurrency } from '../utils/clientFormatting';

export interface ClientUpcomingServicesCardProps {
  jobs: JobSummary[];
}

export default function ClientUpcomingServicesCard({ jobs }: ClientUpcomingServicesCardProps) {
  const upcoming = jobs.filter((j) => j.status === 'scheduled');

  return (
    <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Upcoming services
      </Typography>

      {upcoming.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No upcoming services scheduled.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {upcoming.map((job) => (
            <Stack key={job.id} direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                  {job.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Scheduled for {formatIsoDate(job.date)}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2">{formatCurrency(job.amountCents)}</Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
