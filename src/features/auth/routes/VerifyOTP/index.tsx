// FILE: src/features/auth/routes/VerifyOTP/index.tsx
// PURPOSE: Collects OTP code for second step of phone-based authentication prior to entering protected routes.
// NOTES: Placeholder logic until confirmOtp integration; loaded under PublicLayout and will redirect on successful verification.

import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../../app/layouts/PageWrapper';
import { useLoading } from '../../../../core/loading/useLoading';
import { useSnackbar } from '../../../../core/notifications/useSnackbar';

export default function VerifyOTP() {
  const { showError } = useSnackbar();
  const { showLoading, hideLoading } = useLoading();
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
    showLoading();
    try {
      // TODO: wire to real confirmOtp when available
      if (!code) throw new Error('Please enter the verification code');
      // placeholder: simulate success
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
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Verify OTP
            </Typography>
            <TextField
              fullWidth
              label="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              margin="normal"
            />
            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleVerify}>
              Verify
            </Button>
          </CardContent>
        </Card>
      </Box>
    </PageWrapper>
  );
}
