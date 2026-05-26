// FILE: features/clients/components/ClientServicesCard.tsx
// PURPOSE: Displays the client's active service subscriptions with cadence and since date.
// NOTES: Matches original layout; expects pre-formatted ISO dates via helper.

import { Box, Paper, Stack, Typography } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EmptyState from '../../../shared/components/ui/EmptyState';
import { formatIsoDate } from '../utils/clientFormatting';
import type { ServiceSubscription } from '../types';

const CLIENT_SERVICES_EMPTY_ICON_SIZE_PX = 40;
const CLIENT_SERVICES_CADENCE_MIN_WIDTH_PX = 80;
const CLIENT_SERVICES_CADENCE_PILL_RADIUS_PX = 999;

export interface ClientServicesCardProps {
  services: ServiceSubscription[];
  onAddService?: () => void;
}

export default function ClientServicesCard({ services, onAddService }: ClientServicesCardProps) {
  return (
    <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
      <Typography variant="h6" sx={{ mb: 1.5 }}>
        Services
      </Typography>

      {services.length === 0 ? (
        <EmptyState
          icon={<CardGiftcardIcon sx={{ fontSize: CLIENT_SERVICES_EMPTY_ICON_SIZE_PX }} />}
          title="No active services"
          description="Add a service subscription to start tracking recurring work."
          action={onAddService ? { label: 'Add service', onClick: onAddService } : undefined}
        />
      ) : (
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          {services.map((s) => (
            <Stack key={s.id} direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                  {s.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Since {formatIsoDate(s.since)}
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: CLIENT_SERVICES_CADENCE_PILL_RADIUS_PX,
                  border: 1,
                  borderColor: 'divider',
                  minWidth: CLIENT_SERVICES_CADENCE_MIN_WIDTH_PX,
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {s.cadence}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
