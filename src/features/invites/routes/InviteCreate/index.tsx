// FILE: src/features/invites/routes/InviteCreate/index.tsx
// PURPOSE: Authenticated screen for creating team invites and sharing invite links.
// NOTES: Uses InviteForm and navigates to InviteDetails after successful creation.

import { useCallback, useMemo } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import InviteForm, { type InviteFormValues } from '../../components/InviteForm';
import { createInvite } from '../../services/inviteService';
import { formatPhoneNumber } from '../../../../shared/utils/phone';
import { useLoading } from '../../../../core/loading/useLoading';
import { useSnackbar } from '../../../../core/notifications/useSnackbar';
import { useInvite } from '../../../../core/invites/useInvite';
import type { InviteResponse } from '../../types';

export default function InviteCreate() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { showError } = useSnackbar();
  const { setCurrentInvite } = useInvite();

  const handleCancel = useCallback(() => {
    navigate('/settings');
  }, [navigate]);

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

        const inviteData: InviteResponse = {
          ...response,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          roles: values.roles,
        };

        setCurrentInvite(inviteData);
        navigate(`/settings/invite/${response.inviteId}`);
      } catch (err) {
        showError((err as Error)?.message ?? 'Failed to create invite');
      } finally {
        hideLoading();
      }
    },
    [hideLoading, navigate, setCurrentInvite, showError, showLoading],
  );

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

      <Stack spacing={3} sx={{ flexGrow: 1, maxWidth: 600 }}>
        <InviteForm
          defaultValues={useMemo(
            () => ({
              email: '',
              roles: ['team_member'],
              firstName: '',
              lastName: '',
              phoneNumber: '',
            }),
            [],
          )}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Stack>
    </Box>
  );
}
