// FILE: features/clients/components/ClientJobHistoryCard.tsx
// PURPOSE: Displays completed jobs (job history) for the client with date, amount, and status label.
// NOTES: Filters for status === 'completed'; preserves original layout.

import { Box, Paper, Stack, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import EmptyState from '../../../shared/components/ui/EmptyState';
import type { JobSummary } from '../types';
import { formatIsoDate, formatCurrency } from '../utils/clientFormatting';

const CLIENT_JOB_HISTORY_EMPTY_ICON_SIZE_PX = 40;

export interface ClientJobHistoryCardProps {
  jobs: JobSummary[];
}

export default function ClientJobHistoryCard({ jobs }: ClientJobHistoryCardProps) {
  const completed = jobs.filter((j) => j.status === 'completed');

  return (
    <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Job history
      </Typography>

      {completed.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon sx={{ fontSize: CLIENT_JOB_HISTORY_EMPTY_ICON_SIZE_PX }} />}
          title="No job history yet"
          description="Completed jobs will appear here once services are finished."
        />
      ) : (
        <Stack spacing={1.5}>
          {completed.map((job) => (
            <Stack key={job.id} direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                  {job.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatIsoDate(job.date)}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2">{formatCurrency(job.amountCents)}</Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'success.main', textTransform: 'capitalize' }}
                >
                  Completed
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
