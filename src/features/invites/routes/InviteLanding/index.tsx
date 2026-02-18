// FILE: src/features/invites/routes/InviteLanding/index.tsx
// PURPOSE: Public landing page for invite links, adds phone validation before passkey registration.
// NOTES: Fetches invite by id, shows first name, validates phone last 4 digits, then routes to registration.

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography, Alert } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageWrapper from '../../../../app/layouts/PageWrapper';
import { getInvite, validatePhone } from '../../services/inviteService';
import type { InviteLookupResponse } from '../../types';

export default function InviteLanding() {
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get('i') ?? '';
  const navigate = useNavigate();
  const [invite, setInvite] = useState<InviteLookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [validatingPhone, setValidatingPhone] = useState(false);
  const [phoneValidated, setPhoneValidated] = useState(false);
  const validationRef = useRef(false);

  useEffect(() => {
    if (!inviteId) {
      setError('Missing invite link.');
      return;
    }

    let active = true;
    const fetchInvite = async () => {
      setLoading(true);
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
        if (active) setLoading(false);
      }
    };

    fetchInvite();
    return () => {
      active = false;
    };
  }, [inviteId]);

  

  const handleContinue = useCallback(() => {
    if (!inviteId || !phoneValidated) return;
    navigate(`/invite/continue?i=${inviteId}`, {
      state: { phoneValidated: true }
    });
  }, [inviteId, phoneValidated, navigate]);

  

  const tenantLabel = useMemo(() => {
    if (!invite) return '';
    return invite.tenantName ?? invite.tenantId ?? 'your team';
  }, [invite]);

  return (
    <PageWrapper>
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
        <Card sx={{ maxWidth: 520, width: '100%' }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                You&apos;re invited
              </Typography>
              {loading ? (
                <Typography color="text.secondary">Checking invite details...</Typography>
              ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
) : invite ? (
                <>
                  <Typography variant="body1" color="text.secondary">
                    You&apos;re invited to join <strong>{tenantLabel}</strong>.
                  </Typography>
                  
                  {!phoneValidated && (
                    <Stack spacing={2}>
                      <Typography variant="body2" color="text.secondary">
                        To continue, please enter the last 4 digits of the phone number used to create this invite.
                      </Typography>
                      
                      <TextField
                        fullWidth
                        label="Last 4 digits of phone number"
                        value={phoneLast4}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            setPhoneLast4(value);
                            setPhoneError('');
                            
                            // Auto-validate when 4 digits entered, with guards
                            if (value.length === 4 && !phoneValidated && !validationRef.current && !loading && !error && invite) {
                              validationRef.current = true;
                              setValidatingPhone(true);
                              
                              validatePhone(inviteId, value)
                                .then(response => {
                                  if (response.isValid) {
                                    setPhoneValidated(true);
                                    setPhoneError('');
                                  } else {
                                    setPhoneValidated(false);
                                    setPhoneError(response.reason || 'Phone validation failed');
                                  }
                                })
                                .catch(() => {
                                  setPhoneValidated(false);
                                  setPhoneError('Validation service unavailable');
                                })
                                .finally(() => {
                                  setValidatingPhone(false);
                                  validationRef.current = false;
                                });
                            }
                          }
                        }}
                        error={!!phoneError}
                        helperText={phoneError}
                        disabled={loading || !!error || validatingPhone || phoneValidated}
                        inputProps={{ maxLength: 4, style: { textAlign: 'center', letterSpacing: '0.5em' } }}
                      />
                      
                      {phoneError && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          {phoneError}
                        </Typography>
                      )}
                    </Stack>
                  )}
                  
                  {phoneValidated && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      Phone validated! You can now continue with passkey registration.
                    </Alert>
                  )}
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      onClick={handleContinue}
                      disabled={!phoneValidated || validatingPhone}
                      fullWidth
                    >
                      Continue with Passkey
                    </Button>
                  </Box>
                </>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </PageWrapper>
  );
}
