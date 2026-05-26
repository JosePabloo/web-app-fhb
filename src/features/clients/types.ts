// FILE: src/features/clients/types.ts
// PURPOSE: Declares client domain model types consumed by table, metrics, filters, and forms.
// NOTES: Mirrors anticipated backend contract; extended with contact and billing unions for form reuse.

export type ClientStatus = 'active' | 'prospect' | 'paused' | 'inactive';

export type ContactMethod = 'email' | 'phone' | 'sms';
export type LeadSource = 'google' | 'facebook' | 'referral' | 'returning' | 'door_hanger' | 'other';
export type BillingPreference = 'invoice_email' | 'autopay' | 'manual';

export interface Client {
  id: string;
  tenantId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt?: string;
  lastJobAt?: string;
}

export type ClientKpi = {
  label: string;
  value: number;
};

export type Message = {
  id: string;
  sender: 'client' | 'company';
  text: string;
  createdAt: string;
};

export type ServiceSubscription = {
  id: string;
  name: string;
  cadence: string;
  since: string;
};

export type JobSummary = {
  id: string;
  date: string;
  description: string;
  amountCents: number;
  status: 'completed' | 'scheduled';
};

export type InvoiceSummary = {
  id: string;
  date: string;
  amountCents: number;
  status: 'paid' | 'unpaid' | 'overdue';
};
