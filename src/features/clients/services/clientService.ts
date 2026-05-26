import { spreadSyncApi } from '../../../shared/services/apiClient';
import type { Client, ClientStatus, ContactMethod, LeadSource, BillingPreference } from '../types';

interface ApiResponse<T> {
  message: string;
  data: T;
}

const statusMap: Record<string, ClientStatus> = {
  ACTIVE: 'active',
  PROSPECT: 'prospect',
  PAUSED: 'paused',
  INACTIVE: 'inactive',
};

const toUpperCase = (s?: string) => s?.toUpperCase();

function mapApiUserToClient(apiUser: {
  id: string;
  tenantId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
}): Client {
  return {
    id: apiUser.id,
    tenantId: apiUser.tenantId,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    email: apiUser.email,
    phoneNumber: apiUser.phoneNumber,
    avatarUrl: apiUser.avatarUrl,
    status: statusMap[apiUser.status] || 'active',
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
  };
}

export async function getClients(): Promise<Client[]> {
  const response = await spreadSyncApi.get<ApiResponse<Client[]>>('/casa-norte/users', {
    params: { role: 'TENANT_CLIENT' },
  });
  return response.data.data.map(mapApiUserToClient);
}

export async function getClient(id: string): Promise<Client> {
  const response = await spreadSyncApi.get<ApiResponse<Client>>(`/casa-norte/users/${id}`);
  return mapApiUserToClient(response.data.data);
}

interface CreateClientPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  status: ClientStatus;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  accessNotes?: string;
  preferredContactMethod?: ContactMethod;
  allowEmail?: boolean;
  allowSms?: boolean;
  allowPromotions?: boolean;
  leadSource?: LeadSource;
  billingPreference?: BillingPreference;
  internalNotes?: string;
}

function toApiPayload(values: CreateClientPayload) {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phoneNumber: values.phoneNumber,
    role: 'TENANT_CLIENT',
    status: values.status.toUpperCase(),
    addressLine1: values.addressLine1,
    addressLine2: values.addressLine2,
    city: values.city,
    state: values.state,
    postalCode: values.postalCode,
    accessNotes: values.accessNotes,
    preferredContactMethod: toUpperCase(values.preferredContactMethod),
    allowEmail: values.allowEmail,
    allowSms: values.allowSms,
    allowPromotions: values.allowPromotions,
    leadSource: toUpperCase(values.leadSource),
    billingPreference: toUpperCase(values.billingPreference),
    internalNotes: values.internalNotes,
    createIamAccount: false,
  };
}

export async function createClient(values: CreateClientPayload): Promise<Client> {
  const response = await spreadSyncApi.post<ApiResponse<Client>>(
    '/casa-norte/users',
    toApiPayload(values),
  );
  return mapApiUserToClient(response.data.data);
}
