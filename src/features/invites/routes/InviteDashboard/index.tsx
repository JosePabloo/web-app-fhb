// FILE: src/features/invites/routes/InviteDashboard/index.tsx
// PURPOSE: Admin dashboard displaying all team invites with create action.
// NOTES: Renders table of invites; backend handles authorization.

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Stack,
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
import { getAllInvites } from '../../services/inviteService';
import type { InviteResponse } from '../../types';

export default function InviteDashboard() {
  const navigate = useNavigate();
  const { showError } = useSnackbar();
  const [invites, setInvites] = useState<InviteResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvites = async () => {
      setLoading(true);
      try {
        const data = await getAllInvites();
        setInvites(data);
      } catch {
        showError('Failed to load invites');
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, [showError]);

  const handleCreateClick = useCallback(() => {
    navigate('/invites/invite');
  }, [navigate]);

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
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        minHeight: 0,
        height: '100%',
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3, flexShrink: 0 }}
      >
        <Stack spacing={0.5}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 0.08, textTransform: 'uppercase' }}
            color="text.secondary"
          >
            Team
          </Typography>
          <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 700 }}>
            Invites
          </Typography>
        </Stack>

        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
          Create Invite
        </Button>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
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
                  onClick={() => navigate(`/invites/${invite.inviteId}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    {invite.firstName} {invite.lastName}
                  </TableCell>
                  <TableCell>{invite.email || '—'}</TableCell>
                  <TableCell>
                    <StatusPill
                      label={invite.status || 'pending'}
                      colorVariant={getStatusColor(invite.status)}
                    />
                  </TableCell>
                  <TableCell>{invite.roles?.join(', ') || '—'}</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>{formatDate(invite.expiresAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
