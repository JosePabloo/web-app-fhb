// FILE: src/features/auth/routes/LoginWithWebAuthn/index.tsx
// PURPOSE: Handles WebAuthn credential registration and authentication to obtain JWT and enter protected area.
// NOTES: Invokes useAuth WebAuthn actions and navigates to /dashboard; complements OTP login alternative in public flow.

import { useEffect, useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../../app/layouts/PageWrapper';
import { useLoading } from '../../../../core/loading/useLoading';
import { useAuth } from '../../../../core/auth/useAuth';
import { useSnackbar } from '../../../../core/notifications/useSnackbar';
import { useAutoPasskeyLaunch } from '../../hooks/useAutoPasskeyLaunch';

export default function LoginWithWebAuthn() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { showError } = useSnackbar()
// Form state: 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const { registerCredential, authenticateCredential } = useAuth();
  // Enable automatic passkey launch when this component mounts
  useAutoPasskeyLaunch(true);

  const handleRegister = async () => {
    showLoading();
    try {
      if (!username) throw new Error('Enter a username to register');
      if (!phoneNumber) throw new Error('Enter a Phone Number to register');
      if (!email) throw new Error('Enter an email to register');

      await registerCredential(username, phoneNumber, email);
      navigate('/dashboard');
    } catch (err) {
      showError((err as Error).message);
    } finally {
      hideLoading();
    }
  };

  const handleAuthenticate = async () => {
    showLoading();
    try {
      await authenticateCredential({ mode: 'default' });
      navigate('/dashboard');
    } catch (err) {
      showError((err as Error).message);
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
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <TextField
                  fullWidth
                  label="Name"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  margin="normal"
                />
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={handleRegister}
                >
                  Register Security Key
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={handleAuthenticate}
                >
                  Login with Security Key
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </PageWrapper>
  );
}
