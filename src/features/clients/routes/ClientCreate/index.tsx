// FILE: src/features/clients/routes/ClientCreate/index.tsx
// PURPOSE: Authenticated screen for creating a new client using the shared ClientForm.
// NOTES: Uses a simple page header with back link; submission calls API.

import { useCallback } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import ClientForm from '../../components/ClientForm';
import type { ClientFormValues } from '../../components/ClientForm';
import { createClient } from '../../services/clientService';
import { PageLayout } from '../../../../shared/components/ui/PageLayout';
import { PageHeader } from '../../../../shared/components/ui/PageHeader';
import { useSnackbar } from '../../../../core/notifications/useSnackbar';

export default function ClientCreate() {
  const navigate = useNavigate();
  const { showError } = useSnackbar();

  const handleSubmit = useCallback(
    async (values: ClientFormValues) => {
      try {
        const createdClient = await createClient({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phone || undefined,
          status: values.status,
          addressLine1: values.addressLine1 || undefined,
          addressLine2: values.addressLine2 || undefined,
          city: values.city || undefined,
          state: values.state || undefined,
          postalCode: values.postalCode || undefined,
          accessNotes: values.accessNotes || undefined,
          preferredContactMethod: values.preferredContactMethod,
          allowEmail: values.allowEmail,
          allowSms: values.allowSms,
          allowPromotions: values.allowPromotions,
          leadSource: values.leadSource,
          billingPreference: values.billingPreference,
          internalNotes: values.internalNotes || undefined,
        });
        navigate(`/clients/${createdClient.id}`, { state: { client: createdClient } });
      } catch {
        showError('Failed to create client');
      }
    },
    [navigate, showError],
  );

  const handleCancel = useCallback(() => {
    navigate('/clients');
  }, [navigate]);

  return (
    <PageLayout
      header={
        <PageHeader
          overline="Clients"
          title="Add new client"
          subtitle="Capture basic contact details and status to start managing this client."
          action={
            <Button component={RouterLink} to="/clients" size="small" variant="text">
              Back to clients
            </Button>
          }
        />
      }
    >
      <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex', alignItems: 'flex-start' }}>
        <ClientForm
          mode="create"
          defaultValues={{
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            status: 'active',
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Box>
    </PageLayout>
  );
}
