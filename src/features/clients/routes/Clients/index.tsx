import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Stack, Button, Typography, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ClientSearchBar from '../../components/ClientSearchBar';
import ClientFilters from '../../components/ClientFilters';
import ClientsTable from '../../components/ClientsTable';
import { getClients } from '../../services/clientService';
import type { Client, ClientStatus } from '../../types';
import { PageLayout } from '../../../../shared/components/ui/PageLayout';
import { PageHeader } from '../../../../shared/components/ui/PageHeader';
import { useSnackbar } from '../../../../core/notifications/useSnackbar';

const CLIENTS_EMPTY_STATE_ICON_SIZE_PX = 48;

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ClientStatus | 'all'>('all');
  const { showError } = useSnackbar();

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const data = await getClients();
        setClients(data);
      } catch {
        showError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [showError]);

  const filtered: Client[] = useMemo(() => {
    return clients.filter((c) => {
      const haystack = `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesStatus = status === 'all' || c.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, status]);

  const isEmpty = clients.length === 0 && !search && status === 'all';

  if (loading) {
    return (
      <PageLayout
        header={
          <PageHeader
            title="Clients"
            subtitle="Manage your clients, view their latest activity, and access contact details in one place."
            action={
              <Button variant="contained" size="medium" component={RouterLink} to="/clients/new">
                Add client
              </Button>
            }
          />
        }
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Clients"
          subtitle="Manage your clients, view their latest activity, and access contact details in one place."
          action={
            isEmpty ? undefined : (
              <Button variant="contained" size="medium" component={RouterLink} to="/clients/new">
                Add client
              </Button>
            )
          }
        />
      }
    >
      {isEmpty ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <PersonAddIcon
            sx={{ fontSize: CLIENTS_EMPTY_STATE_ICON_SIZE_PX, color: 'text.secondary', mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            No clients yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add your first client to get started
          </Typography>
          <Button variant="contained" component={RouterLink} to="/clients/new">
            Add Client
          </Button>
        </Paper>
      ) : (
        <>
          <Stack spacing={2} sx={{ mb: 2, flexShrink: 0 }}>
            <ClientSearchBar value={search} onChange={setSearch} />
            <ClientFilters status={status} onStatusChange={setStatus} />
          </Stack>

          <Paper
            elevation={0}
            sx={{
              p: 0,
              border: (t) => `1px solid ${t.palette.divider}`,
              bgcolor: (t) => t.palette.background.paper,
              flexGrow: 1,
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ height: '100%', overflowY: 'auto' }}>
              <ClientsTable clients={filtered} />
            </Box>
          </Paper>
        </>
      )}
    </PageLayout>
  );
}
