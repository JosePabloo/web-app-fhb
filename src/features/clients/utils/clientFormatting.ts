// FILE: features/clients/utils/clientFormatting.ts
// PURPOSE: Client feature-local formatting helpers for currency and full name; date formatting imported from shared.
// NOTES: Reuses shared/utils/date for ISO date formatting to keep a single source of truth.

import type { Client } from '../types';
import { formatIsoDate } from '../../../shared/utils/date';

export { formatIsoDate };

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function formatClientStatus(status: Client['status']): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function fullNameOf(c: Client): string {
  return `${c.firstName} ${c.lastName}`;
}
