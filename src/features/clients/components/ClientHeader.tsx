// FILE: features/clients/components/ClientHeader.tsx
// PURPOSE: Header section for Client Details with avatar, name, contact info, status pill, address, and actions.
// NOTES: Pure presentational component; preserves original layout and copy.

import { Avatar, Box, Button, Paper, Stack, Typography } from '@mui/material';
import type { Client } from '../types';
import { formatClientStatus, fullNameOf } from '../utils/clientFormatting';
import StatusPill from '../../../shared/components/ui/StatusPill';

const CLIENT_HEADER_AVATAR_SIZE_PX = 44;

export interface ClientHeaderProps {
  client: Client & { address?: string };
}

export default function ClientHeader({ client }: ClientHeaderProps) {
  const fullName = fullNameOf(client);
  const initial = fullName[0]?.toUpperCase() ?? '?';

  return (
    <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: 1, borderColor: 'divider' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: CLIENT_HEADER_AVATAR_SIZE_PX,
              height: CLIENT_HEADER_AVATAR_SIZE_PX,
            }}
          >
            {initial}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {fullName}
          </Typography>

            {/* Contact & status row */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {client.email}
            </Typography>

            {client.phoneNumber && (
              <Typography variant="body2" color="text.secondary">
                {client.phoneNumber}
              </Typography>
            )}

              <StatusPill label={formatClientStatus(client.status)} />
            </Box>

            {/* Address under contact */}
            {client.address && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {client.address}
              </Typography>
            )}
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button variant="contained" size="small">
            Edit client
          </Button>
          <Button variant="outlined" size="small">
            Add job
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
