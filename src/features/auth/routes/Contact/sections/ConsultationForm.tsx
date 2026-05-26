// FILE: src/features/auth/routes/Contact/sections/ConsultationForm.tsx
// PURPOSE: Structured consultation form with local validation and submission feedback states.
// NOTES: Uses shared contact theme recipes for labels, fields, and CTA consistency.

import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Alert, Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import {
  contactCopy,
  initialValues,
  investmentRangeOptions,
  projectTypeOptions,
  submitDelayMs,
  type FormValues,
  validateContactForm,
} from '../contact.data';
import { fieldLabelSx, fieldSx, primaryButtonSx, space, typography } from '../contact.theme';

type FormErrors = Partial<Record<keyof FormValues, string>>;

const twoColumnRowSx = {
  display: 'grid',
  gap: space.form.rowGap,
  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
} as const;

function FieldLabel({ htmlFor, label, required }: { htmlFor: string; label: string; required?: boolean }) {
  return (
    <Typography component="label" htmlFor={htmlFor} sx={fieldLabelSx}>
      {label}
      {required ? ' *' : ''}
    </Typography>
  );
}

function FieldGroup({ children }: { children: ReactNode }) {
  return <Stack spacing={space.form.labelToInput}>{children}</Stack>;
}

export default function ConsultationForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const formDisabled = submitting;
  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  const onFieldChange = (key: keyof FormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => {
      if (!prev[key]) {
        return prev;
      }

      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');

    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      // Placeholder submission until backend transport is provided.
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), submitDelayMs);
      });
      setSubmitted(true);
      setValues(initialValues);
    } catch {
      setSubmitError('Unable to submit right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: space.form.offsetY }}>
      <Stack spacing={space.form.stackGap}>
        {submitted && (
          <Alert severity="success" role="status">
            Thank you. We received your inquiry and will contact you to schedule a consultation.
          </Alert>
        )}

        {submitError && <Alert severity="error">{submitError}</Alert>}

        <Box sx={twoColumnRowSx}>
          <FieldGroup>
            <FieldLabel htmlFor="fullName" label="Full Name" required />
            <TextField
              id="fullName"
              name="fullName"
              value={values.fullName}
              onChange={onFieldChange('fullName')}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName}
              disabled={formDisabled}
              required
              fullWidth
              sx={fieldSx}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="email" label="Email" required />
            <TextField
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={onFieldChange('email')}
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={formDisabled}
              required
              fullWidth
              sx={fieldSx}
            />
          </FieldGroup>
        </Box>

        <Box sx={twoColumnRowSx}>
          <FieldGroup>
            <FieldLabel htmlFor="phone" label="Phone" />
            <TextField
              id="phone"
              name="phone"
              value={values.phone}
              onChange={onFieldChange('phone')}
              disabled={formDisabled}
              fullWidth
              sx={fieldSx}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="projectType" label="Project Type" />
            <TextField
              id="projectType"
              select
              name="projectType"
              value={values.projectType}
              onChange={onFieldChange('projectType')}
              disabled={formDisabled}
              fullWidth
              sx={fieldSx}
            >
              <MenuItem value="">Select project type</MenuItem>
              {projectTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </FieldGroup>
        </Box>

        <FieldGroup>
          <FieldLabel htmlFor="projectAddress" label="Project Address" />
          <TextField
            id="projectAddress"
            name="projectAddress"
            value={values.projectAddress}
            onChange={onFieldChange('projectAddress')}
            disabled={formDisabled}
            fullWidth
            sx={fieldSx}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="investmentRange" label="Estimated Investment Range" required />
          <TextField
            id="investmentRange"
            select
            name="investmentRange"
            value={values.investmentRange}
            onChange={onFieldChange('investmentRange')}
            error={Boolean(errors.investmentRange)}
            helperText={errors.investmentRange}
            disabled={formDisabled}
            required
            fullWidth
            sx={fieldSx}
          >
            <MenuItem value="">Select estimated range</MenuItem>
            {investmentRangeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="message" label="Project Details" required />
          <TextField
            id="message"
            name="message"
            value={values.message}
            onChange={onFieldChange('message')}
            error={Boolean(errors.message)}
            helperText={errors.message}
            disabled={formDisabled}
            required
            multiline
            minRows={5}
            fullWidth
            sx={fieldSx}
          />
        </FieldGroup>

        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: space.form.buttonMt, mb: space.form.buttonMb }}>
          <Button type="submit" variant="contained" disabled={formDisabled} sx={primaryButtonSx}>
            {submitting ? 'Submitting...' : 'Request Consultation'}
          </Button>
        </Box>

        <Stack spacing={space.form.locationGap}>
          <Typography sx={{ fontFamily: typography.body, color: '#2f2b25', fontWeight: 600, fontSize: '0.82rem' }}>
            {contactCopy.location}
          </Typography>
          <Typography sx={{ fontFamily: typography.body, color: '#66615a', fontSize: '0.82rem' }}>
            {contactCopy.appointmentLine}
          </Typography>
        </Stack>

        {hasErrors && (
          <Typography sx={{ color: '#8b2f2f', fontFamily: typography.body, fontSize: '0.84rem' }}>
            Please resolve the highlighted fields before submitting.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
