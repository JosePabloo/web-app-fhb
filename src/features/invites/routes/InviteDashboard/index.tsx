// FILE: src/features/invites/routes/InviteDashboard/index.tsx
// PURPOSE: Admin dashboard displaying all team invites with create action.
// NOTES: Uses React Query so revisiting the page reuses the recent invite list cache.

import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from '../../../../core/notifications/useSnackbar';
import StatusPill from '../../../../shared/components/ui/StatusPill';
import { seedInviteDetail } from '../../cache/inviteCache';
import { useInvitesQuery } from '../../hooks/useInvitesQuery';
import type { InviteResponse } from '../../types';
import { PageLayout } from '../../../../shared/components/ui/PageLayout';
import { PageHeader } from '../../../../shared/components/ui/PageHeader';

export default function InviteDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showError } = useSnackbar();
  const { data: invites = [], isPending, isError } = useInvitesQuery();

  useEffect(() => {
    if (isError) {
      showError('Failed to load invites');
    }
  }, [isError, showError]);

  const handleCreateClick = useCallback(() => {
    navigate('/invites/invite');
  }, [navigate]);

  const handleOpenInvite = useCallback(
    (invite: InviteResponse) => {
      seedInviteDetail(queryClient, invite);
      navigate(`/invites/${invite.inviteId}`);
    },
    [navigate, queryClient],
  );

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'success';
      case 'pending':
        return 'warning';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '—';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (isPending) {
    return (
      <PageLayout
        header={
          <PageHeader
            overline="Team"
            title="Invites"
            action={
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
                Create Invite
              </Button>
            }
          />
        }
      >
        <TableContainer component={Paper} variant="outlined">
          <Typography sx={{ py: 6, textAlign: 'center' }}>
            <CircularProgress size={24} />
          </Typography>
        </TableContainer>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      header={
        <PageHeader
          overline="Team"
          title="Invites"
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
              Create Invite
            </Button>
          }
        />
      }
    >
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invites.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No invites yet. Create one to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              invites.map((invite) => (
                <TableRow
                  key={invite.inviteId}
                  hover
                  onClick={() => handleOpenInvite(invite)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    {invite.firstName} {invite.lastName}
                  </TableCell>
                  <TableCell>{invite.maskedPhoneNumber || '—'}</TableCell>
                  <TableCell>
                    <StatusPill
                      label={invite.status || 'pending'}
                      colorVariant={getStatusColor(invite.status)}
                    />
                  </TableCell>
                  <TableCell>{invite.roles?.join(', ') || '—'}</TableCell>
                  <TableCell>{formatDate(invite.createdAt)}</TableCell>
                  <TableCell>{formatDate(invite.expiresAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </PageLayout>
  );
}
