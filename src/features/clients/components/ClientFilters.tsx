// FILE: src/features/clients/components/ClientFilters.tsx
// PURPOSE: Provides status filter controls enabling parent to narrow client list by lifecycle state.
// NOTES: Emits selected status via onStatusChange; includes 'all' option to disable filtering.

import { Paper, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { ClientStatus } from '../types';

const CLIENT_FILTERS_SELECT_MIN_WIDTH_PX = 160;

export interface ClientFiltersProps {
  status: ClientStatus | 'all';
  onStatusChange: (status: ClientStatus | 'all') => void;
}

const STATUS_OPTIONS: Array<ClientStatus | 'all'> = [
  'all',
  'active',
  'prospect',
  'paused',
  'inactive',
];

export default function ClientFilters({ status, onStatusChange }: ClientFiltersProps) {
  return (
    <Paper elevation={1} sx={{ p: 1.5 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
        <FormControl size="small" sx={{ minWidth: CLIENT_FILTERS_SELECT_MIN_WIDTH_PX }}>
          <InputLabel id="client-status-label">Status</InputLabel>
          <Select
            labelId="client-status-label"
            label="Status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as ClientStatus | 'all')}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ textTransform: 'capitalize' }}>
                {opt === 'all' ? 'All' : opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}
