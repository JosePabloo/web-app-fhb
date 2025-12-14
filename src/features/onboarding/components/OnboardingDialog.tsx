// FILE: src/features/onboarding/components/OnboardingDialog.tsx
// PURPOSE: Multi-step onboarding dialog to collect initial user details for new accounts.
// NOTES: Local state only; hook up submission once backend endpoint is available.

import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';

type OnboardingFormState = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  photoFile: File | null;
};

interface OnboardingDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete?: (data: OnboardingFormState) => void | Promise<void>;
  defaultValues?: Partial<OnboardingFormState>;
}

const steps = ['Welcome', 'Contact', 'Photo'];

export default function OnboardingDialog({
  open,
  onClose,
  onComplete,
  defaultValues,
}: OnboardingDialogProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formState, setFormState] = useState<OnboardingFormState>({
    firstName: defaultValues?.firstName ?? '',
    lastName: defaultValues?.lastName ?? '',
    phoneNumber: defaultValues?.phoneNumber ?? '',
    photoFile: defaultValues?.photoFile ?? null,
  });

  useEffect(() => {
    if (!open) return;
    setActiveStep(0);
    setFormState((prev) => ({
      ...prev,
      firstName: defaultValues?.firstName ?? '',
      lastName: defaultValues?.lastName ?? '',
      phoneNumber: defaultValues?.phoneNumber ?? '',
      photoFile: defaultValues?.photoFile ?? null,
    }));
  }, [open, defaultValues?.firstName, defaultValues?.lastName, defaultValues?.phoneNumber, defaultValues?.photoFile]);

  const photoPreview = useMemo(() => {
    if (!formState.photoFile) return null;
    return URL.createObjectURL(formState.photoFile);
  }, [formState.photoFile]);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const [submitting, setSubmitting] = useState(false);

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleComplete = async () => {
    if (!onComplete) {
      onClose();
      return;
    }
    try {
      setSubmitting(true);
      await onComplete(formState);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormState((prev) => ({ ...prev, photoFile: file }));
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={2}>
            <Typography variant="h6">Welcome to Casa Norte</Typography>
            <Typography variant="body2" color="text.secondary">
              Let&apos;s set up your profile so teammates know who you are.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="First name"
                value={formState.firstName}
                onChange={(e) => setFormState((prev) => ({ ...prev, firstName: e.target.value }))}
                fullWidth
                autoFocus
              />
              <TextField
                label="Last name"
                value={formState.lastName}
                onChange={(e) => setFormState((prev) => ({ ...prev, lastName: e.target.value }))}
                fullWidth
              />
            </Stack>
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={2}>
            <Typography variant="h6">How can we reach you?</Typography>
            <Typography variant="body2" color="text.secondary">
              Add a phone number so we can help secure your account and provide updates.
            </Typography>
            <TextField
              label="Phone number"
              placeholder="+1 (555) 123-4567"
              value={formState.phoneNumber}
              onChange={(e) => setFormState((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              fullWidth
            />
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={2}>
            <Typography variant="h6">Add a photo</Typography>
            <Typography variant="body2" color="text.secondary">
              A clear photo helps teammates recognize you.
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={photoPreview ?? undefined}
                alt="Profile preview"
                sx={{ width: 64, height: 64 }}
              />
              <Button variant="outlined" component="label">
                Upload photo
                <input hidden type="file" accept="image/*" onChange={handleFileChange} />
              </Button>
              {formState.photoFile && (
                <Typography variant="body2" color="text.secondary">
                  {formState.photoFile.name}
                </Typography>
              )}
            </Stack>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Finish setting up your account</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Divider />
          {renderStepContent()}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Skip for now
        </Button>
        <Box display="flex" gap={1}>
          <Button onClick={handleBack} disabled={activeStep === 0 || submitting}>
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext} disabled={submitting}>
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={handleComplete} disabled={submitting}>
              Finish
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
