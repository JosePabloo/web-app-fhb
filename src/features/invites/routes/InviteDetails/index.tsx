// FILE: src/features/invites/routes/InviteDetails/index.tsx
// PURPOSE: Authenticated screen displaying invite details after creation.
// NOTES: Reads invite data from the shared React Query cache and refetches only when needed.

import { useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from '../../../../core/notifications/useSnackbar';
import { useInviteDetailQuery } from '../../hooks/useInviteDetailQuery';

function buildInviteUrl(inviteId: string): string {
  if (typeof window === 'undefined') return `/invite?i=${inviteId}`;
  return `${window.location.origin}/invite?i=${inviteId}`;
}

function formatExpiry(expiresAt?: number): string {
  if (!expiresAt) return 'No expiration';
  const date = new Date(expiresAt * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function InviteDetails() {
  const navigate = useNavigate();
  const { inviteId: urlInviteId } = useParams<{ inviteId: string }>();
  const { showError } = useSnackbar();
  const { data: inviteData, isPending, isError } = useInviteDetailQuery(urlInviteId);

  useEffect(() => {
    if (isError) {
      showError('Failed to load invite details');
    }
  }, [isError, showError]);

  const handleCopyClick = useCallback(async () => {
    const inviteLink =
      inviteData?.inviteLink ?? (inviteData?.inviteId ? buildInviteUrl(inviteData.inviteId) : '');

    if (!inviteLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);
      console.log('Invite link copied to clipboard.');
    } catch {
      showError('Could not copy the invite link.');
    }
  }, [inviteData?.inviteId, inviteData?.inviteLink, showError]);

  const handleShare = useCallback(async () => {
    const inviteLink =
      inviteData?.inviteLink ?? (inviteData?.inviteId ? buildInviteUrl(inviteData.inviteId) : '');
    const email = inviteData?.email;
    const shareText = email ? `Invite for ${email}` : 'Invite for your teammate';
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Casa Norte invite',
          text: shareText,
          url: inviteLink,
        });
        console.log('Invite shared.');
        return;
      }
    } catch (err) {
      console.warn('Native share failed, falling back to clipboard', err);
    }

    try {
      await navigator.clipboard.writeText(inviteLink);
      console.log('Invite link copied to clipboard.');
    } catch {
      showError('Could not share the invite link. Please copy it manually.');
    }
  }, [inviteData, showError]);

  const handleCreateAnother = useCallback(() => {
    navigate('/invites/invite');
  }, [navigate]);

  if (isPending) {
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
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!inviteData || !urlInviteId) {
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
        <Stack spacing={2} alignItems="flex-start">
          <Typography variant="h5">Invite not found</Typography>
          <Typography variant="body2" color="text.secondary">
            The invite you're looking for doesn't exist or has expired.
          </Typography>
          <Button component={RouterLink} to="/invites/invite" variant="contained">
            Create an invite
          </Button>
        </Stack>
      </Box>
    );
  }

  const hasFullDetails = !!(inviteData.firstName && inviteData.lastName);
  const inviteLink =
    inviteData.inviteLink ?? (inviteData.inviteId ? buildInviteUrl(inviteData.inviteId) : '');
  const inviteContact =
    inviteData.email ??
    inviteData.maskedEmail ??
    inviteData.phoneNumber ??
    inviteData.maskedPhoneNumber;

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
        sx={{ mb: 2, flexShrink: 0 }}
      >
        <Stack spacing={0.5}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 0.08, textTransform: 'uppercase' }}
            color="text.secondary"
          >
            Settings
          </Typography>
          <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 700 }}>
            Invite Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share this invite with your teammate.
          </Typography>
        </Stack>

        <Button
          component={RouterLink}
          to="/invites"
          size="small"
          variant="text"
          sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}
        >
          Back to invites
        </Button>
      </Stack>

      <Stack spacing={3} sx={{ flexGrow: 1, maxWidth: 600 }}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            {hasFullDetails ? (
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {inviteData.firstName} {inviteData.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {inviteContact || 'No contact on file'}
                  </Typography>
                </Stack>
                <Chip
                  label={inviteData.status || 'Pending'}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>
            ) : (
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Invite ID: {inviteData.inviteId}
                </Typography>
                <Chip
                  label={inviteData.status || 'Pending'}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>
            )}

            {hasFullDetails && inviteData.roles && (
              <Stack direction="row" spacing={1}>
                {inviteData.roles.map((role) => (
                  <Chip
                    key={role}
                    label={role === 'tenant_admin' ? 'Tenant Admin' : 'Team Member'}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            )}

            <Box>
              <Typography variant="caption" color="text.secondary">
                Expires
              </Typography>
              <Typography variant="body2">{formatExpiry(inviteData.expiresAt)}</Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Stack spacing={0.4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Invite link
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {hasFullDetails
                  ? `Share this link with ${inviteData.email || 'your teammate'}.`
                  : 'Share this link with your teammate.'}
              </Typography>
            </Stack>
            <TextField
              label="Invite link"
              value={inviteLink}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" startIcon={<ShareIcon />} onClick={handleShare}>
                Share link
              </Button>
              <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={handleCopyClick}>
                Copy link
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={handleCreateAnother}
          sx={{ alignSelf: 'flex-start' }}
        >
          Create another invite
        </Button>
      </Stack>
    </Box>
  );
}
