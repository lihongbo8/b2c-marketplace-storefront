'use server';

import { fetchQuery } from '../config';
import { getAuthHeaders } from './cookies';

export type DijieInstalledRole = {
  entitlementId: string;
  entitlementSource?: string;
  orderId: string | null;
  authorizedAt: string | null;
  role: {
    id: string;
    title: string;
    subtitle?: string;
    handle?: string;
    category?: string;
    status?: string;
    pricing?: {
      authorizationFeeCents?: number;
      currency?: string;
    };
    authorizationSummary?: {
      authorizationFeeCents?: number;
      currency?: string;
      inputTokenCentsPerMillion?: number;
      outputTokenCentsPerMillion?: number;
    };
  };
};

export type DijiePublicRole = {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  handle?: string | null;
  listingStatus?: string;
  reviewState?: string | null;
  developerName?: string | null;
  capabilities?: string[];
  pricing?: {
    authorizationFeeCents?: number;
    currency?: string;
  };
  authorizationSummary?: {
    authorizationFeeCents?: number;
    currency?: string;
    inputTokenCentsPerMillion?: number;
    outputTokenCentsPerMillion?: number;
  };
};

export type DijieLedgerEntry = {
  id: string;
  source: string;
  usageKind: string;
  surface: string | null;
  mode: string | null;
  subject: unknown;
  currency: string;
  grossAmountCents: number;
  platformReceivableCents: number;
  developerReceivableCents: number;
  modelProvider: string | null;
  modelId: string | null;
  modelPricingKnown: boolean;
  modelPricingSource: string | null;
  roleListingId: string | null;
  executionId: string | null;
  entitlementId: string | null;
  occurredAt: string;
};

export type DijieDialogSession = {
  id: string;
  surface: string;
  mode: string;
  title: string;
  subject: string | null;
  lastMessageAt: string;
};

const safeArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

export const listDijiePublicRoles = async () => {
  const response = await fetchQuery('/dijie/roles', {
    method: 'GET',
  }).catch(() => null);

  return response?.ok ? safeArray<DijiePublicRole>(response.data?.roles) : [];
};

export const listDijieInstalledRoles = async () => {
  const headers = await getAuthHeaders();
  const response = await fetchQuery('/dijie/my-roles', {
    headers,
    method: 'GET',
  }).catch(() => null);

  return response?.ok ? safeArray<DijieInstalledRole>(response.data?.roles) : [];
};

export const listDijieLedgerEntries = async () => {
  const headers = await getAuthHeaders();
  const response = await fetchQuery('/dijie/ledger/entries', {
    headers,
    method: 'GET',
  }).catch(() => null);

  return response?.ok ? safeArray<DijieLedgerEntry>(response.data?.entries) : [];
};

export const listDijieDialogSessions = async (surface?: string) => {
  const headers = await getAuthHeaders();
  const response = await fetchQuery('/dijie/dialog/sessions', {
    headers,
    method: 'GET',
    query: surface ? { surface } : undefined,
  }).catch(() => null);

  return response?.ok ? safeArray<DijieDialogSession>(response.data?.sessions) : [];
};
