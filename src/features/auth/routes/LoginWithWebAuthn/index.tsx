// FILE: src/features/auth/routes/LoginWithWebAuthn/index.tsx
// PURPOSE: Handles phone-only OTP authentication for existing users.
// NOTES: Two-state flow - phone entry then OTP entry; calls backend API for OTP.
//         Auto-launches WebAuthn/passkey if supported.

import { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Link, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../../app/layouts/PageWrapper';
import { useLoading } from '../../../../core/loading/useLoading';
import { useAuth } from '../../../../core/auth/useAuth';
import { useSnackbar } from '../../../../core/notifications/useSnackbar';
import { formatToE164, isValidUSPhone } from '../../utils/phoneUtils';

export default function LoginWithWebAuthn() {
  const { sendVerificationCode, verifyCode, authenticateCredential } = useAuth();
  const { showError } = useSnackbar();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const [authState, setAuthState] = useState<'initial' | 'phone-entry' | 'otp-entry'>('initial');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [webAuthnAttempted, setWebAuthnAttempted] = useState(false);
  const [isWebAuthnSupported, setIsWebAuthnSupported] = useState<boolean | null>(null);
  const hasLaunchedRef = useRef(false);

  // Auto-launch WebAuthn on mount
  useEffect(() => {
    if (hasLaunchedRef.current) return;
    hasLaunchedRef.current = true;

    // Check if user recently cancelled auto-WebAuthn (within last 30 seconds)
    // This allows refresh to reset the skip, but prevents spam during same session
    const skipTimestamp = sessionStorage.getItem('skipAutoWebAuthn');
    const skipUntil = skipTimestamp ? parseInt(skipTimestamp, 10) : 0;
    const shouldSkip = skipUntil > Date.now();
    
    // Check WebAuthn support
    const webAuthnSupported = typeof window !== 'undefined' && !!window.PublicKeyCredential;
    setIsWebAuthnSupported(webAuthnSupported);

    // Skip if user recently cancelled or WebAuthn not supported
    if (!webAuthnSupported || shouldSkip) {
      setAuthState('phone-entry');
      return;
    }

    setWebAuthnAttempted(true);
    // Attempt silent WebAuthn authentication with conditional mediation
    authenticateCredential({ mode: 'conditional', silent: true })
      .then(() => {
        // WebAuthn succeeded, navigate to dashboard
        navigate('/dashboard');
      })
      .catch((err) => {
        // WebAuthn failed (no passkeys, user cancelled, etc.) - skip for 30 seconds
        console.log('Auto WebAuthn failed, showing phone OTP:', err?.message);
        sessionStorage.setItem('skipAutoWebAuthn', (Date.now() + 30000).toString());
        setAuthState('phone-entry');
      });
  }, [authenticateCredential, navigate]);

  const handleSendCode = useCallback(async () => {
    if (!phoneNumber.trim()) {
      showError('Please enter a phone number');
      return;
    }

    try {
      setIsSendingCode(true);
      
      // Validate and format phone number to E.164
      if (!isValidUSPhone(phoneNumber)) {
        throw new Error('Please enter a valid US phone number');
      }
      
      const e164Phone = formatToE164(phoneNumber);
      setFormattedPhone(e164Phone);
      
      // Call backend to send verification code
      const newSessionId = await sendVerificationCode(e164Phone);
      setSessionId(newSessionId);
      setFormattedPhone(e164Phone);
      setAuthState('otp-entry');
    } catch (err) {
      showError((err as Error).message || 'Failed to send verification code');
    } finally {
      setIsSendingCode(false);
    }
  }, [phoneNumber, sendVerificationCode, showError]);

  const handleVerifyCode = useCallback(async () => {
    if (!otpCode.trim() || otpCode.length !== 6) {
      showError('Please enter the 6-digit code');
      return;
    }

    if (!sessionId) {
      showError('Verification session expired. Please try again.');
      return;
    }

    showLoading();
    try {
      await verifyCode(sessionId, otpCode);
      navigate('/dashboard');
    } catch (err) {
      showError((err as Error).message || 'Invalid verification code');
    } finally {
      hideLoading();
    }
  }, [otpCode, sessionId, verifyCode, navigate, showError, showLoading, hideLoading]);

  const handleChangePhone = useCallback(() => {
    setAuthState('phone-entry');
    setOtpCode('');
    setSessionId(null);
    setFormattedPhone('');
  }, []);

  const handlePhoneKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSendCode();
      }
    },
    [handleSendCode],
  );

  const handleOtpKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleVerifyCode();
      }
    },
    [handleVerifyCode],
  );

  // Manual retry WebAuthn from phone entry screen
  const handleRetryWebAuthn = useCallback(async () => {
    if (!window.PublicKeyCredential) {
      showError('WebAuthn is not supported on this device');
      return;
    }

    try {
      await authenticateCredential({ mode: 'default', silent: false });
      navigate('/dashboard');
    } catch (err) {
      // User cancelled or failed - stay on phone entry
      console.log('Manual WebAuthn retry failed:', err);
    }
  }, [authenticateCredential, navigate, showError]);

  return (
    <PageWrapper>
      <Box
        sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ maxWidth: 900, width: '100%' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h2" fontWeight={700} gutterBottom>
              Casa Norte
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Sign In
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 400 }}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                {authState === 'initial' ? (
                  // Initial state: show loading while WebAuthn is being attempted
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Checking for passkey...
                    </Typography>
                  </Box>
                ) : authState === 'phone-entry' ? (
                  // State 1: Phone number entry
                  <>
                    <Typography variant="h6" gutterBottom>
                      Enter your phone number
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      We'll send you a verification code to sign in.
                    </Typography>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      placeholder="(555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onKeyDown={handlePhoneKeyDown}
                      margin="normal"
                      autoFocus
                      helperText="Enter a US phone number"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Standard message and data rates may apply.
                    </Typography>
                    <Button
                      id="send-code-button"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={handleSendCode}
                      disabled={isSendingCode || !phoneNumber.trim()}
                    >
                      {isSendingCode ? 'Sending Code...' : 'Send Code'}
                    </Button>
                    {isWebAuthnSupported && webAuthnAttempted && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={handleRetryWebAuthn}
                          underline="hover"
                        >
                          Or sign in with passkey
                        </Link>
                      </Box>
                    )}
                  </>
                ) : (
                  // State 2: OTP entry
                  <>
                    <Typography variant="h6" gutterBottom>
                      Enter verification code
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      We sent a code to {formattedPhone}
                    </Typography>
                    <TextField
                      fullWidth
                      label="Verification Code"
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      onKeyDown={handleOtpKeyDown}
                      margin="normal"
                      autoFocus
                      inputProps={{ maxLength: 6, style: { letterSpacing: '0.5em', textAlign: 'center' } }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={handleVerifyCode}
                      disabled={otpCode.length !== 6}
                    >
                      Verify & Sign In
                    </Button>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={handleChangePhone}
                        underline="hover"
                      >
                        Change phone number
                      </Link>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </PageWrapper>
  );
}
