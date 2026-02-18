// FILE: src/features/invites/routes/InviteCreate/index.tsx
// PURPOSE: Authenticated screen for creating team invites and sharing invite links.
// NOTES: Uses InviteForm and native share/clipboard fallbacks to distribute invite URL.

import { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import InviteForm, { type InviteFormValues } from '../../components/InviteForm';
import { createInvite } from '../../services/inviteService';
import { formatPhoneNumber } from '../../../../shared/utils/phone';
import { useLoading } from '../../../../core/loading/useLoading';
import { useSnackbar } from '../../../../core/notifications/useSnackbar';

function buildInviteUrl(inviteId: string): string {
  if (typeof window === 'undefined') return `/invite?i=${inviteId}`;
  return `${window.location.origin}/invite?i=${inviteId}`;
}

export default function InviteCreate() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { showError } = useSnackbar();
  const [lastInviteUrl, setLastInviteUrl] = useState<string>('');
  const [lastInviteEmail, setLastInviteEmail] = useState<string>('');

  const handleCancel = useCallback(() => {
    navigate('/settings');
  }, [navigate]);

  const handleShare = useCallback(
    async (inviteUrl: string, email?: string) => {
      const shareText = email ? `Invite for ${email}` : 'Invite for your teammate';
      try {
        if (navigator.share) {
          await navigator.share({
            title: 'Casa Norte invite',
            text: shareText,
            url: inviteUrl,
          });
          console.log('Invite shared.');
          return;
        }
      } catch (err) {
        console.warn('Native share failed, falling back to clipboard', err);
      }

      try {
        await navigator.clipboard.writeText(inviteUrl);
        console.log('Invite link copied to clipboard.');
      } catch (err) {
        console.error('Failed to copy invite link', err);
        showError('Could not share the invite link. Please copy it manually.');
      }
    },
    [showError],
  );

  const handleSubmit = useCallback(
    async (values: InviteFormValues) => {
      showLoading();
      try {
        if (!values.roles.length) {
          throw new Error('Select at least one role for this invite.');
        }
        const normalizedPhone = formatPhoneNumber(values.phoneNumber);
        const response = await createInvite({
          ...values,
          phoneNumber: normalizedPhone,
        });
        const inviteUrl = response.inviteLink ?? buildInviteUrl(response.inviteId);
        setLastInviteUrl(inviteUrl);
        setLastInviteEmail(values.email ?? '');
        // Remove auto-share - user will click Share link button manually
      } catch (err) {
        showError((err as Error)?.message ?? 'Failed to create invite');
      } finally {
        hideLoading();
      }
    },
    [hideLoading, showError, showLoading],
  );

  const handleShareClick = useCallback(async () => {
    if (!lastInviteUrl) return;
    await handleShare(lastInviteUrl, lastInviteEmail);
  }, [handleShare, lastInviteEmail, lastInviteUrl]);

  const handleCopyClick = useCallback(async () => {
    if (!lastInviteUrl) return;
    try {
      await navigator.clipboard.writeText(lastInviteUrl);
      console.log('Invite link copied to clipboard.');
    } catch {
      showError('Could not copy the invite link.');
    }
  }, [lastInviteUrl, showError]);

  const shareSummary = useMemo(() => {
    if (!lastInviteUrl) return null;
    return (
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack spacing={0.4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Invite ready to share
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Send this link to {lastInviteEmail || 'your teammate'}.
            </Typography>
          </Stack>
          <TextField
            label="Invite link"
            value={lastInviteUrl}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="contained" onClick={handleShareClick}>
              Share link
            </Button>
            <Button variant="outlined" onClick={handleCopyClick}>
              Copy link
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  }, [handleCopyClick, handleShareClick, lastInviteEmail, lastInviteUrl]);

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
          <Typography variant="overline" sx={{ letterSpacing: 0.08, textTransform: 'uppercase' }} color="text.secondary">
            Settings
          </Typography>
          <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 700 }}>
            Invite a teammate
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Send a passkey-enabled invite to bring someone onto your route team.
          </Typography>
        </Stack>

        <Button
          component={RouterLink}
          to="/settings"
          size="small"
          variant="text"
          sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}
        >
          Back to settings
        </Button>
      </Stack>

      <Stack spacing={3} sx={{ flexGrow: 1 }}>
        <InviteForm
          defaultValues={useMemo(() => ({
            email: '',
            roles: ['team_member'],
            firstName: '',
            lastName: '',
            phoneNumber: '',
          }), [])}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        {shareSummary}
      </Stack>
    </Box>
  );
}
