
// FILE: src/features/invites/components/InviteForm.tsx
// PURPOSE: Controlled form for creating an invite with identity and role details.
// NOTES: Keeps local state and delegates submission/cancel handling to parent.

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormGroup,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { InviteRole } from '../types';

export interface InviteFormValues {
  email?: string;
  roles: InviteRole[];
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface InviteFormProps {
  defaultValues: InviteFormValues;
  onSubmit: (values: InviteFormValues) => Promise<void> | void;
  onCancel: () => void;
}

const ROLE_OPTIONS: Array<{ value: InviteRole; label: string; description: string }> = [
  {
    value: 'tenant_admin',
    label: 'Tenant admin',
    description: 'Full access to team settings, invites, and billing.',
  },
  {
    value: 'team_member',
    label: 'Team member',
    description: 'Access to routes, clients, and day-to-day work.',
  },
];

export default function InviteForm({ defaultValues, onSubmit, onCancel }: InviteFormProps) {
  const [values, setValues] = useState<InviteFormValues>(defaultValues);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues]);

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (submitting) return;
      try {
        setSubmitting(true);
        await onSubmit(values);
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit, submitting, values],
  );

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      <Stack spacing={3}>
        <Typography variant="caption" color="text.secondary">
          Fields marked with * are required.
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="firstName"
              label="First name"
              value={values.firstName}
              onChange={handleTextChange}
              fullWidth
              required
              autoFocus
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="lastName"
              label="Last name"
              value={values.lastName}
              onChange={handleTextChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={values.email || ''}
              onChange={handleTextChange}
              fullWidth
              helperText="Invitation link and onboarding details go here."
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="phoneNumber"
              label="Phone number"
              type="tel"
              value={values.phoneNumber}
              onChange={handleTextChange}
              fullWidth
              required
              helperText="Used for onboarding and passkey recovery."
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl component="fieldset" required>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Roles</Typography>
              <FormGroup>
                {ROLE_OPTIONS.map((role) => (
                  <FormControlLabel
                    key={role.value}
                    control={
                      <Checkbox
                        checked={values.roles.includes(role.value)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setValues((prev) => ({
                            ...prev,
                            roles: checked
                              ? [...prev.roles, role.value]
                              : prev.roles.filter((r) => r !== role.value),
                          }));
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">{role.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {role.description}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
              <FormHelperText>Select all roles that apply.</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={submitting}>
            Create invite
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
