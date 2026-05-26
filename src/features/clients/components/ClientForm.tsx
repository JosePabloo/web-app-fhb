// FILE: src/features/clients/components/ClientForm.tsx
// PURPOSE: Reusable, typed form for creating and editing clients; collects contact, address,
//          status, communication prefs, and operational details with consistent MUI UX.
// NOTES: Purely presentational; normalized defaults, no routing. Avoids inline lambdas in JSX for perf.

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Switch,
  MenuItem,
} from '@mui/material';
import type { ClientStatus, ContactMethod, LeadSource, BillingPreference } from '../types';

// Local form shape kept here; shared unions live in features/clients/types.ts
export interface ClientFormValues {
  // Basic identity
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: ClientStatus;

  // Address
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;

  // Communication
  preferredContactMethod: ContactMethod;
  allowEmail: boolean;
  allowSms: boolean;
  allowPromotions: boolean;

  // Operational
  leadSource?: LeadSource; // optional; can be unspecified
  billingPreference: BillingPreference;
  accessNotes: string;
  internalNotes: string;
}

interface ClientFormProps {
  mode: 'create' | 'edit';
  defaultValues: Partial<ClientFormValues> &
    Pick<ClientFormValues, 'firstName' | 'lastName' | 'email' | 'status'>;
  onSubmit: (values: ClientFormValues) => Promise<void> | void;
  onCancel: () => void;
}

// Option lists kept close for easy maintenance
const LEAD_SOURCE_OPTIONS: Array<{ value: LeadSource; label: string }> = [
  { value: 'google', label: 'Google search' },
  { value: 'facebook', label: 'Facebook / social' },
  { value: 'referral', label: 'Referral' },
  { value: 'returning', label: 'Returning customer' },
  { value: 'door_hanger', label: 'Door hanger / flyer' },
  { value: 'other', label: 'Other' },
];

const BILLING_PREFERENCE_OPTIONS: Array<{ value: BillingPreference; label: string }> = [
  { value: 'invoice_email', label: 'Invoice by email' },
  { value: 'autopay', label: 'Autopay on file' },
  { value: 'manual', label: 'Manual / other' },
];

function normalizeDefaultValues(v: ClientFormProps['defaultValues']): ClientFormValues {
  return {
    // Basic
    firstName: v.firstName ?? '',
    lastName: v.lastName ?? '',
    email: v.email ?? '',
    phone: v.phone ?? '',
    status: v.status ?? 'active',
    // Address
    addressLine1: v.addressLine1 ?? '',
    addressLine2: v.addressLine2 ?? '',
    city: v.city ?? '',
    state: v.state ?? '',
    postalCode: v.postalCode ?? '',
    // Communication
    preferredContactMethod: v.preferredContactMethod ?? 'email',
    allowEmail: v.allowEmail ?? true,
    allowSms: v.allowSms ?? false,
    allowPromotions: v.allowPromotions ?? false,
    // Operational
    leadSource: v.leadSource,
    billingPreference: v.billingPreference ?? 'invoice_email',
    accessNotes: v.accessNotes ?? '',
    internalNotes: v.internalNotes ?? '',
  };
}

export default function ClientForm({ mode, defaultValues, onSubmit, onCancel }: ClientFormProps) {
  const [values, setValues] = useState<ClientFormValues>(() =>
    normalizeDefaultValues(defaultValues),
  );
  const [submitting, setSubmitting] = useState(false);

  // Keep state in sync when editing existing client
  useEffect(() => {
    setValues(normalizeDefaultValues(defaultValues));
  }, [defaultValues]);

  // Generic text handler (TextField string values)
  const handleTextInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  // Radio/select string enums
  const handlePreferredContactChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, preferredContactMethod: value as ContactMethod }));
  }, []);

  const handleLeadSourceChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, leadSource: value ? (value as LeadSource) : undefined }));
  }, []);

  const handleBillingPreferenceChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((prev) => ({ ...prev, billingPreference: value as BillingPreference }));
    },
    [],
  );

  // Switches
  const handleSwitchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      const { name } = event.target;
      setValues((prev) => ({ ...prev, [name]: checked }));
    },
    [],
  );

  // Status segmented control
  const handleStatusChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newStatus: ClientStatus | null) => {
      if (!newStatus) return;
      setValues((prev) => ({ ...prev, status: newStatus }));
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

  const primaryCta = useMemo(() => (mode === 'create' ? 'Create client' : 'Save changes'), [mode]);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      <Stack spacing={4}>
        {/* Meta line */}
        <Typography variant="caption" color="text.secondary">
          Fields marked with * are required.
        </Typography>

        {/* Section: Basic info */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Client details
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            We'll use these details on estimates, invoices, and service reminders.
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                name="firstName"
                label="First name"
                value={values.firstName}
                onChange={handleTextInputChange}
                fullWidth
                required
                autoFocus
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                name="lastName"
                label="Last name"
                value={values.lastName}
                onChange={handleTextInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={values.email}
                onChange={handleTextInputChange}
                fullWidth
                required
                helperText="Used for sending quotes, invoices, and notifications."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                name="phone"
                label="Phone"
                type="tel"
                value={values.phone}
                onChange={handleTextInputChange}
                fullWidth
                helperText="Optional, but helpful for day-of-service updates."
              />
            </Grid>
          </Grid>
        </Box>

        {/* Section: Address */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Service address
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Where you'll perform the work. You can add more properties later if needed.
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="addressLine1"
                label="Address line 1"
                value={values.addressLine1}
                onChange={handleTextInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="addressLine2"
                label="Address line 2"
                value={values.addressLine2}
                onChange={handleTextInputChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                name="city"
                label="City"
                value={values.city}
                onChange={handleTextInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                name="state"
                label="State"
                value={values.state}
                onChange={handleTextInputChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                name="postalCode"
                label="ZIP / Postal code"
                value={values.postalCode}
                onChange={handleTextInputChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="accessNotes"
                label="Gate code / access notes"
                value={values.accessNotes}
                onChange={handleTextInputChange}
                fullWidth
                multiline
                minRows={2}
                helperText="Optional. Gate code, lockbox instructions, pets, or anything the crew should know on arrival."
              />
            </Grid>
          </Grid>
        </Box>

        {/* Section: Status */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Status
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This helps you filter and prioritize clients in the list.
          </Typography>

          <ToggleButtonGroup
            value={values.status}
            exclusive
            onChange={handleStatusChange}
            aria-label="Client status"
            size="small"
          >
            <ToggleButton value="active" aria-label="Active">
              Active
            </ToggleButton>
            <ToggleButton value="prospect" aria-label="Prospect">
              Prospect
            </ToggleButton>
            <ToggleButton value="paused" aria-label="Paused">
              Paused
            </ToggleButton>
            <ToggleButton value="inactive" aria-label="Inactive">
              Inactive
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Section: Communication */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Communication
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            How this client prefers to hear from you and what they agree to receive.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Preferred contact method</FormLabel>
                <RadioGroup
                  row
                  name="preferredContactMethod"
                  value={values.preferredContactMethod}
                  onChange={handlePreferredContactChange}
                >
                  <FormControlLabel value="email" control={<Radio />} label="Email" />
                  <FormControlLabel value="phone" control={<Radio />} label="Phone call" />
                  <FormControlLabel value="sms" control={<Radio />} label="Text / SMS" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1.5}>
                <FormControlLabel
                  control={
                    <Switch
                      name="allowEmail"
                      checked={values.allowEmail}
                      onChange={handleSwitchChange}
                    />
                  }
                  label="Send booking, estimate, and invoice emails"
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="allowSms"
                      checked={values.allowSms}
                      onChange={handleSwitchChange}
                    />
                  }
                  label="Send SMS reminders for upcoming visits"
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="allowPromotions"
                      checked={values.allowPromotions}
                      onChange={handleSwitchChange}
                    />
                  }
                  label="Send occasional promotions and seasonal offers"
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Section: Operational */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Operational details
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Optional, but helpful for reporting, billing, and team context.
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                name="leadSource"
                label="Lead source"
                value={values.leadSource ?? ''}
                onChange={handleLeadSourceChange}
                fullWidth
              >
                <MenuItem value="">Not specified</MenuItem>
                {LEAD_SOURCE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                name="billingPreference"
                label="Billing preference"
                value={values.billingPreference}
                onChange={handleBillingPreferenceChange}
                fullWidth
              >
                {BILLING_PREFERENCE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                name="internalNotes"
                label="Internal notes"
                value={values.internalNotes}
                onChange={handleTextInputChange}
                fullWidth
                multiline
                minRows={3}
                placeholder="Anything your team should know (e.g., 'dog in yard', 'prefers Friday mornings', 'gate sticks when hot')."
              />
            </Grid>
          </Grid>
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={submitting}>
            {primaryCta}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
