// FILE: src/features/clients/routes/ClientDetails/index.tsx
// PURPOSE: Thin orchestration route composing Client Details child components.
// NOTES: Preserves original layout and sticky chat; client data fetched from API.

import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Stack, CircularProgress, Breadcrumbs, Link, Typography } from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import ClientHeader from '../../components/ClientHeader';
import ClientMetricsStrip from '../../components/ClientMetricsStrip';
import ClientServicesCard from '../../components/ClientServicesCard';
import ClientUpcomingServicesCard from '../../components/ClientUpcomingServicesCard';
import ClientJobHistoryCard from '../../components/ClientJobHistoryCard';
import ClientInvoicesCard from '../../components/ClientInvoicesCard';
import ClientMessagesPanel from '../../components/ClientMessagesPanel';
import { getClient } from '../../services/clientService';
import { useSnackbar } from '../../../../core/notifications/useSnackbar';
import EmptyState from '../../../../shared/components/ui/EmptyState';
import type { Client } from '../../types';
import {
  mockServices,
  mockJobs,
  mockInvoices,
  mockMessages,
} from '../../mocks/clientDetailsMock';

const CLIENT_DETAILS_EMPTY_ICON_SIZE_PX = 44;

export default function ClientDetails() {
  const { id: clientId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { showError } = useSnackbar();

  const passedClient = location.state?.client as Client | undefined;

  const [client, setClient] = useState<Client | null>(passedClient || null);
  const [loading, setLoading] = useState(!passedClient);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (client && client.id === clientId) {
      return;
    }

    if (!clientId) return;

    const fetchClient = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getClient(clientId);
        setClient(data);
      } catch {
        setError(true);
        showError('Failed to load client');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [client, clientId, showError]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !client) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <EmptyState
          icon={<PersonOffIcon sx={{ fontSize: CLIENT_DETAILS_EMPTY_ICON_SIZE_PX }} />}
          title="Client not found"
          description="We couldn’t load this client. It may have been removed or you may not have access."
          action={{ label: 'Back to clients', onClick: () => navigate('/clients') }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 0 }, pt: 3, pb: 4 }}>
      {/* CENTERED CONTENT WRAPPER */}
      <Box sx={{ maxWidth: (t) => t.breakpoints.values.lg, mx: 'auto', px: { xs: 0, md: 4 } }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1.5 }}>
          <Link underline="hover" color="inherit" component={RouterLink} to="/clients">
            Clients
          </Link>
          <Typography sx={{ color: 'text.primary' }}>
            {client.firstName} {client.lastName}
          </Typography>
        </Breadcrumbs>
        {/* HEADER */}
        <ClientHeader client={client} />

        {/* MAIN GRID: metrics + details + sticky chat */}
        <Grid container spacing={3} alignItems="flex-start">
          {/* LEFT COLUMN: metrics + detail cards */}
          <Grid size={{ xs: 12, md: 7 }} sx={{ pl: 0 }}>
            <Stack spacing={3}>
              {/* METRICS STRIP - using mock data for now */}
              <ClientMetricsStrip
                client={{
                  jobsCompleted: 0,
                  lastServiceDate: undefined,
                  nextScheduledJob: undefined,
                  outstandingBalanceCents: 0,
                }}
              />

              {/* SERVICES (PLAN / SUBSCRIPTIONS) */}
              <ClientServicesCard services={mockServices} />

              {/* UPCOMING SERVICES (SCHEDULED JOBS) */}
              <ClientUpcomingServicesCard jobs={mockJobs} />

              {/* JOB HISTORY (COMPLETED JOBS) */}
              <ClientJobHistoryCard jobs={mockJobs} />

              {/* INVOICES */}
              <ClientInvoicesCard invoices={mockInvoices} />
            </Stack>
          </Grid>

          {/* RIGHT COLUMN: sticky chat */}
          <Grid
            size={{ xs: 12, md: 5 }}
            sx={{ pr: 0, display: 'flex', justifyContent: 'flex-end' }}
          >
            <ClientMessagesPanel messages={mockMessages} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
