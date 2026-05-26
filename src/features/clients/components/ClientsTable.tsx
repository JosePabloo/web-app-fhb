// FILE: src/features/clients/components/ClientsTable.tsx
// PURPOSE: Client list rendered as card-like rows that blend into the parent surface and open client details on click.
// NOTES: Uses shared StatusPill and date formatter; spacing/typography normalized and rows are accessible.

import { useCallback } from 'react';
import { Avatar, Box, Button, ButtonBase, Divider, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Client } from '../types';
import StatusPill from '../../../shared/components/ui/StatusPill';
import { formatIsoDate } from '../../../shared/utils/date';
import { formatClientStatus } from '../utils/clientFormatting';

const CLIENT_ROW_AVATAR_SIZE_PX = 40;
const CLIENT_ROW_DIVIDER_MARGIN_LEFT_SPACING = 5;
const CLIENT_ROW_LAST_JOB_MIN_WIDTH_PX = 120;

export interface ClientsTableProps {
  clients: Client[];
}

export default function ClientsTable({ clients }: ClientsTableProps) {
  const navigate = useNavigate();

  const handleOpenClient = useCallback(
    (id: string) => {
      navigate(`/clients/${id}`);
    },
    [navigate],
  );

  if (clients.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No clients found. Try adjusting your search or filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {clients.map((client, idx) => (
        <ClientRowCard
          key={client.id}
          client={client}
          isLast={idx === clients.length - 1}
          onOpen={handleOpenClient}
        />
      ))}
    </Box>
  );
}

/* ---------- helpers ---------- */

function statusToVariant(status: Client['status']): 'success' | 'info' | 'warning' | 'default' {
  switch (status) {
    case 'active':
      return 'success';
    case 'prospect':
      return 'info';
    case 'paused':
      return 'warning';
    case 'inactive':
    default:
      return 'default';
  }
}

interface ClientRowCardProps {
  client: Client;
  isLast: boolean;
  onOpen: (id: string) => void;
}

function ClientRowCard({ client, isLast, onOpen }: ClientRowCardProps) {
  const created = formatIsoDate(client.createdAt);
  const lastJob = formatIsoDate(client.lastJobAt);

  return (
    <Box>
      <ButtonBase
        onClick={() => onOpen(client.id)}
        aria-label={`Open client ${client.firstName} ${client.lastName}`}
        sx={{
          width: '100%',
          justifyContent: 'flex-start',
          textAlign: 'left',
          px: 2,
          py: 1.5,
          borderRadius: 0,
          bgcolor: 'transparent',
          '&:hover': { bgcolor: (t) => t.palette.action.hover },
          alignItems: 'flex-start',
        }}
      >
        <Stack spacing={1.5} sx={{ width: '100%' }}>
          {/* Top row */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                src={client.avatarUrl}
                sx={{ width: CLIENT_ROW_AVATAR_SIZE_PX, height: CLIENT_ROW_AVATAR_SIZE_PX }}
              >
                {client.firstName.charAt(0)}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body1" fontWeight={600} noWrap>
                  {client.firstName} {client.lastName}
                </Typography>

                <Typography variant="caption" color="text.secondary" noWrap>
                  {client.email}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <StatusPill
                label={formatClientStatus(client.status)}
                colorVariant={statusToVariant(client.status)}
              />

              <Button
                size="small"
                variant="text"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(client.id);
                }}
              >
                View
              </Button>
            </Stack>
          </Stack>

          {/* Meta row: left = date created, right = last job */}
          <Stack
            direction="row"
            spacing={3}
            justifyContent="space-between"
            flexWrap="wrap"
            sx={{ mt: 0.5 }}
          >
            <Box sx={{ mb: 0.5 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'uppercase' }}
              >
                Date created
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {created}
              </Typography>
            </Box>

            <Box
              sx={{
                mb: 0.5,
                textAlign: { xs: 'left', md: 'right' },
                minWidth: CLIENT_ROW_LAST_JOB_MIN_WIDTH_PX,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'uppercase' }}
              >
                Last job
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {lastJob}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </ButtonBase>

      {!isLast && (
        <Divider
          sx={{
            ml: CLIENT_ROW_DIVIDER_MARGIN_LEFT_SPACING,
            opacity: 0.5,
          }}
        />
      )}
    </Box>
  );
}
