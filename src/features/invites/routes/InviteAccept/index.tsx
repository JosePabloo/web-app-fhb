// FILE: src/features/invites/routes/InviteAccept/index.tsx
// PURPOSE: Public passkey registration screen for invite redemption.
// NOTES: Pulls invite details for context and passes inviteId into WebAuthn registration.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageWrapper from '../../../../app/layouts/PageWrapper';
import StepGuard from '../../../../shared/components/StepGuard';
import { getInvite } from '../../services/inviteService';
import type { InviteLookupResponse } from '../../types';
import { useAuth } from '../../../../core/auth/useAuth';
import { useLoading } from '../../../../core/loading/useLoading';
import { useSnackbar } from '../../../../core/notifications/useSnackbar';

export default function InviteAccept() {
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get('i') ?? '';
  const navigate = useNavigate();
  const { registerCredential } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const { showError } = useSnackbar();

  const [invite, setInvite] = useState<InviteLookupResponse | null>(null);
  const [error, setError] = useState('');
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!inviteId) {
      setError('Missing invite link.');
      return;
    }

    let active = true;
    const fetchInvite = async () => {
      setLoadingInvite(true);
      try {
        const response = await getInvite(inviteId);
        if (!active) return;
        setInvite(response);
        setError('');
      } catch (err) {
        if (!active) return;
        console.error('Failed to fetch invite', err);
        setError('This invite is invalid or expired.');
        setInvite(null);
      } finally {
        if (active) setLoadingInvite(false);
      }
    };

    fetchInvite();
    return () => {
      active = false;
    };
  }, [inviteId]);

  useEffect(() => {
    if (invite) {
      setFirstName(invite.firstName ?? '');
      setLastName(invite.lastName ?? '');
      setPhoneNumber(invite.maskedPhoneNumber ?? '');
      setEmail(invite.maskedEmail?.replace(/[*]/g, '') ?? '');
    }
  }, [invite]);

  const tenantLabel = useMemo(() => invite?.tenantName ?? invite?.tenantId ?? 'your team', [invite]);

  const handleRegister = useCallback(async () => {
    if (!inviteId) return;
    console.log('inviteId: ${inviteId}: ', inviteId)
    showLoading();
    try {
      if (!firstName || !lastName) throw new Error('Enter your first and last name');
      if (!email) throw new Error('Enter your email');
      const username = `${firstName} ${lastName}`.trim();
      console.log('Registering credential for inviteId:', username, email, phoneNumber ? `with phone: ${phoneNumber}` : 'without phone');
      await registerCredential({ username, email, phoneNumber, inviteId });
      navigate('/dashboard');
    } catch (err) {
      showError((err as Error)?.message ?? 'Failed to register passkey');
    } finally {
      hideLoading();
    }
  }, [email, firstName, hideLoading, inviteId, lastName, navigate, phoneNumber, registerCredential, showError, showLoading]);

  return (
    <StepGuard 
      validateState={(state) => state?.phoneValidated === true}
      fallbackPath="/invite"
    >
      <PageWrapper>
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
        <Card sx={{ maxWidth: 520, width: '100%' }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {firstName}, finish your invite
              </Typography>
              {loadingInvite ? (
                <Typography color="text.secondary">Loading invite details...</Typography>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary">
                    you&apos;re joining <strong>{tenantLabel}</strong>. Complete your details and register
                    a passkey to continue.
                  </Typography>
                  {invite?.maskedEmail ? (
                    <Typography variant="body2" color="text.secondary">
                      This invite is tied to <strong>{invite.maskedEmail}</strong>.
                    </Typography>
                  ) : null}
                </>
              )}

              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField
                  label="First name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  fullWidth
                  disabled={!!error || loadingInvite}
                />
                <TextField
                  label="Last name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  fullWidth
                  disabled={!!error || loadingInvite}
                />
                <TextField
                  label="Phone number"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  fullWidth
                  disabled={!!error || loadingInvite}
                  helperText={
                    invite?.maskedPhoneNumber
                      ? 'Phone number from your invite (you can edit if needed)'
                      : undefined
                  }
                />
                <TextField
                  label="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  fullWidth
                  disabled={!!error || loadingInvite}
                  helperText={
                    invite?.maskedEmail
                      ? `Use the email this invite was sent to (${invite.maskedEmail}).`
                      : undefined
                  }
                />
              </Stack>

              <Button
                variant="text"
                onClick={handleRegister}
                disabled={!!error || loadingInvite || !inviteId}
              >
                Register passkey
              </Button>
          
            </Stack>
          </CardContent>
        </Card>
      </Box>
      </PageWrapper>
    </StepGuard>
  );
}
