// FILE: src/features/settings/routes/AccountSettings/index.tsx
// PURPOSE: Protected user profile management page allowing viewing/editing of account details and logout action.
// NOTES: Consumes AuthProvider profile and logout; lives under AuthLayout and will later persist changes via API.

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, TextField, Button } from '@mui/material';
import { useAuth } from '../../../../core/auth/useAuth';
import { formatPhoneNumberIntoEnglish } from '../../../../shared/utils/phone';

export default function AccountSettings() {
  const { profile, logout } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setEmail(profile.email);
      const phoneValue = profile.phoneNumber
        ? formatPhoneNumberIntoEnglish(profile.phoneNumber) ?? ''
        : '';
      setPhone(phoneValue);
    }
  }, [profile]);

  if (!profile) {
    return <Typography>Loading account details...</Typography>;
  }

  const handleSave = () => {
    // TODO: implement save logic
  };

  return (
    <Box>
      <Stack spacing={10} direction="row">
        <Typography variant="h4" gutterBottom>
          Account Settings
        </Typography>
        <Button variant="outlined" color="secondary" onClick={logout}>
          Logout
        </Button>
      </Stack>

      <Paper elevation={1} sx={{ p: 3, mt: 2, maxWidth: 500 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </Stack>

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Phone"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
