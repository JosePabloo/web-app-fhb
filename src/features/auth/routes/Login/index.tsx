// FILE: src/features/auth/routes/Login/index.tsx
// PURPOSE: Collects phone input and triggers OTP send flow to transition user into verification step.
// NOTES: Uses useAuth.sendOtp and Loading/Snackbar contexts; navigates to /verify on success within PublicLayout.

import { useEffect, useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../../app/layouts/PageWrapper';
import { useLoading } from '../../../../core/loading/useLoading';
import { useAuth } from '../../../../core/auth/useAuth';
import { useSnackbar } from '../../../../core/notifications/useSnackbar';
import { formatPhoneNumber } from '../../../../shared/utils/phone';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../../../../firebase/config';

export default function Login() {
  const { sendOtp } = useAuth();
  const { showError } = useSnackbar();
  const { showLoading, hideLoading } = useLoading();
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    showLoading();
    try {
      const formatted = formatPhoneNumber(phoneNumber);
      const confirmation = await sendOtp(formatted);

      if (confirmation) {
        navigate('/verify');
      } else {
        throw new Error('OTP not sent. Please try again.');
      }
    } catch (error) {
      showError((error as Error).message);
      console.error('OTP send failed:', error);
    } finally {
      hideLoading();
    }
  };

  return (
    <PageWrapper>
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ maxWidth: 900, width: '100%' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h2" fontWeight={700} gutterBottom>
              Casa Norte
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Onboarding
            </Typography>
          </Box>
          <Box sx={{ maxWidth: 400 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Login
                </Typography>
                <TextField
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  margin="normal"
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{ mt: 2 }}
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </PageWrapper>
  );
}
