// FILE: features/clients/mocks/clientDetailsMock.ts
// PURPOSE: Centralizes mock data for the Client Details screen (client, services, jobs, invoices, messages).
// NOTES: Local to clients feature; used by ClientDetails route and its components; do not promote to shared/.

import type { Client, InvoiceSummary, JobSummary, Message, ServiceSubscription } from '../types';

export const mockClient: Client & {
  address?: string;
  jobsCompleted: number;
  lastServiceDate?: string;
  nextScheduledJob?: string;
  outstandingBalanceCents: number;
} = {
  id: '123',
  tenantId: 't_001',
  firstName: 'Danny',
  lastName: 'Rivera',
  email: 'danny@example.com',
  phoneNumber: '(555) 123-4567',
  avatarUrl: undefined,
  status: 'active',
  createdAt: '2024-06-12T00:00:00Z',
  updatedAt: '2025-11-20T00:00:00Z',
  lastJobAt: '2025-10-05T00:00:00Z',
  address: '123 Main St, Springfield, USA',
  jobsCompleted: 18,
  lastServiceDate: '2025-10-05',
  nextScheduledJob: '2025-12-03',
  outstandingBalanceCents: 0,
};

export const mockMessages: Message[] = [
  {
    id: 'm1',
    sender: 'client',
    text: 'Hi! Can we reschedule next week?',
    createdAt: '2025-11-20T09:24:00Z',
  },
  {
    id: 'm2',
    sender: 'company',
    text: 'Sure, I can look into availability.',
    createdAt: '2025-11-20T09:26:00Z',
  },
  {
    id: 'm3',
    sender: 'client',
    text: 'Tuesday morning works best for me.',
    createdAt: '2025-11-20T09:28:00Z',
  },
  {
    id: 'm4',
    sender: 'company',
    text: 'Noted. I will confirm shortly.',
    createdAt: '2025-11-20T09:30:00Z',
  },
];

export const mockServices: ServiceSubscription[] = [
  { id: 's1', name: 'Lawn mowing', cadence: 'Weekly', since: '2024-04-01' },
  { id: 's2', name: 'Fertilizer treatment', cadence: 'Monthly', since: '2024-05-15' },
];

export const mockJobs: JobSummary[] = [
  {
    id: 'j1',
    date: '2025-11-27',
    description: 'Full lawn service',
    amountCents: 8000,
    status: 'completed',
  },
  {
    id: 'j2',
    date: '2025-11-13',
    description: 'Leaf cleanup',
    amountCents: 6500,
    status: 'completed',
  },
  {
    id: 'j3',
    date: '2025-12-03',
    description: 'Scheduled lawn service',
    amountCents: 8000,
    status: 'scheduled',
  },
];

export const mockInvoices: InvoiceSummary[] = [
  { id: 'INV-001', date: '2025-11-01', amountCents: 14500, status: 'paid' },
  { id: 'INV-002', date: '2025-11-15', amountCents: 8000, status: 'unpaid' },
];
