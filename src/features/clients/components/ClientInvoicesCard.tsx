// FILE: features/clients/components/ClientInvoicesCard.tsx
// PURPOSE: Displays invoices list for the client with date, amount, and status color.
// NOTES: Preserves original status color mapping and layout.

import { Box, Paper, Stack, Typography } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EmptyState from '../../../shared/components/ui/EmptyState';
import type { InvoiceSummary } from '../types';
import { formatIsoDate, formatCurrency } from '../utils/clientFormatting';

const CLIENT_INVOICES_EMPTY_ICON_SIZE_PX = 40;

export interface ClientInvoicesCardProps {
  invoices: InvoiceSummary[];
  onCreateInvoice?: () => void;
}

export default function ClientInvoicesCard({
  invoices,
  onCreateInvoice,
}: ClientInvoicesCardProps) {
  return (
    <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Invoices
      </Typography>

      {invoices.length === 0 ? (
        <EmptyState
          icon={<ReceiptLongIcon sx={{ fontSize: CLIENT_INVOICES_EMPTY_ICON_SIZE_PX }} />}
          title="No invoices yet"
          description="Create an invoice to track billing for this client."
          action={
            onCreateInvoice ? { label: 'Create invoice', onClick: onCreateInvoice } : undefined
          }
        />
      ) : (
        <Stack spacing={1.5}>
          {invoices.map((inv) => (
            <Stack key={inv.id} direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                  {inv.id}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatIsoDate(inv.date)}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2">{formatCurrency(inv.amountCents)}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: 'capitalize',
                    color:
                      inv.status === 'paid'
                        ? 'success.main'
                        : inv.status === 'overdue'
                          ? 'error.main'
                          : 'warning.main',
                  }}
                >
                  {inv.status}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
