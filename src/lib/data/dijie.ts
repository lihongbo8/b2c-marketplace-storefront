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
      executionFeeNote?: string;
    };
    roleTokenPricing?: {
      inputTokenCentsPerMillion?: number;
      outputTokenCentsPerMillion?: number;
      currency?: string;
    };
    tokenUsageSummary?: {
      inputTokenFee?: string;
      outputTokenFee?: string;
      executionFeeNote?: string;
    };
    checkout?: DijieRoleCheckout;
  };
};

export type DijieRoleCheckout = {
  requiresCheckout?: boolean;
  productId?: string | null;
  variantId?: string | null;
};

export type DijiePublicRole = {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  usageInstructions?: string | null;
  category?: string | null;
  handle?: string | null;
  listingStatus?: string;
  reviewState?: string | null;
  developerName?: string | null;
  capabilities?: string[];
  pricing?: {
    kind?: string;
    authorizationFeeCents?: number;
    currency?: string;
  };
  roleTokenPricing?: {
    inputTokenCentsPerMillion?: number;
    outputTokenCentsPerMillion?: number;
    currency?: string;
  };
  authorizationSummary?: {
    authorizationFeeCents?: number;
    currency?: string;
    executionFeeNote?: string;
  };
  tokenUsageSummary?: {
    inputTokenFee?: string;
    outputTokenFee?: string;
    executionFeeNote?: string;
  };
  checkout?: DijieRoleCheckout;
};

export type DijieRoleDetail = DijiePublicRole & {
  detailSections?: {
    roleDetails?: string[];
    usageInstructions?: string[];
    executionStandards?: string[];
    requiredCapabilities?: string[];
    failureBoundaries?: string[];
    inputRequirements?: string[];
    outputExamples?: string[];
    humanConfirmations?: string[];
    reviewInfo?: string[];
  };
  relatedRoles?: Array<{
    id: string;
    title: string;
    subtitle?: string | null;
    handle?: string | null;
  }>;
};

export type DijieAuthorizationResult = {
  ok: boolean;
  status: number;
  code?: string;
  error?: string;
  entitlementId?: string;
  entitlement?: {
    id: string;
    roleListingId: string;
    packageId: string;
    packageVersion: string;
    status: string;
    source: string;
    orderId: string | null;
    authorizedAt: string;
    pricing?: {
      authorizationFeeCents?: number;
      currency?: string;
    };
  };
};

export type DijieBuyerDialogResult = {
  ok: boolean;
  status: number;
  error?: string;
  sessionId?: string;
  ledgerEntryId?: string;
  message?: {
    role: string;
    content: string;
  };
  grounding?: {
    roles?: Array<{
      id: string;
      title: string;
      subtitle?: string | null;
      handle?: string | null;
    }>;
    source?: string;
  };
  actions?: Array<{
    id: string;
    kind: string;
    label: string;
    description: string;
    action: string;
    target: string;
    path?: string;
    requiresConfirmation: boolean;
    risk: string;
  }>;
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

export type DijieExecutionArtifact = {
  id: string;
  type: string;
  title: string;
  sizeBytes?: number;
  sha256?: string;
};

export type DijieExecutionReadback = {
  ok?: boolean;
  executionId?: string;
  auditRecordId?: string;
  roleListingId?: string;
  packageId?: string;
  packageVersion?: string;
  status?: string;
  failureReason?: string | null;
  errorSummary?: string | null;
  artifacts?: DijieExecutionArtifact[];
  ledger?: {
    source?: string;
    roleListingId?: string;
    packageId?: string;
    packageVersion?: string;
    developerRef?: string;
    billingBeneficiaryRef?: string;
    inputTokens?: number;
    outputTokens?: number;
    currency?: string;
    platformReceivableCents?: number;
    developerReceivableCents?: number;
  } | null;
  execution?: {
    roleListingId?: string;
    packageId?: string;
    packageVersion?: string;
    developerRef?: string;
    listingOwnerRef?: string;
    billingBeneficiaryRef?: string;
    status?: string;
    toolUsage?: Record<string, number>;
    modelProxyUsage?: {
      requestCount?: number;
      inputTokens?: number;
      outputTokens?: number;
    } | null;
    roleTokenPricing?: {
      inputTokenCentsPerMillion?: number;
      outputTokenCentsPerMillion?: number;
      currency?: string;
    };
    changedFiles?: string[];
    receivedAt?: string;
  };
  audit?: {
    status?: string;
    toolUsage?: Record<string, number>;
    modelProxyUsage?: {
      requestCount?: number;
      inputTokens?: number;
      outputTokens?: number;
    } | null;
    changedFiles?: string[];
    errorSummary?: string | null;
    receivedAt?: string;
  };
};

export type DijieCloudExecutionResult = {
  ok: boolean;
  status: number;
  code?: string;
  error?: string;
  executionId?: string;
  auditRecordId?: string;
  executionStatus?: string;
  failureReason?: string | null;
  artifacts?: DijieExecutionArtifact[];
  ledger?: DijieExecutionReadback['ledger'];
};

const safeArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const executionErrorMessages: Record<string, string> = {
  cloud_unreachable: '迭界AI云端执行服务不可达，请检查云端地址、登录状态和本地网络。',
  execution_pricing_missing: '岗位授权缺少可结算价格合同，不能执行。',
  package_context_store_missing: '云端执行前无法读取岗位包上下文。',
  package_context_read_failed: '云端执行前岗位包上下文读取失败。',
  package_context_missing: '该授权岗位缺少可执行的岗位包上下文，不能发起正式执行。',
  not_authorized: '当前账号没有该岗位的有效授权，不能执行。',
  confirmation_required: '请先确认费用、审计和人工确认点。',
};

const executionErrorMessage = (code?: string, fallback?: string) =>
  (code ? executionErrorMessages[code] : undefined) || fallback || '岗位执行失败。';

export const listDijiePublicRoles = async () => {
  const response = await fetchQuery('/dijie/roles', {
    method: 'GET'
  }).catch(() => null);

  return response?.ok ? safeArray<DijiePublicRole>(response.data?.roles) : [];
};

export const getDijieRoleDetail = async (roleListingId: string) => {
  const response = await fetchQuery(`/dijie/roles/${encodeURIComponent(roleListingId)}`, {
    method: 'GET'
  }).catch(() => null);

  return response?.ok ? (response.data?.role as DijieRoleDetail) : null;
};

export const authorizeDijieRoleListing = async ({
  roleListingId,
  orderId
}: {
  roleListingId: string;
  orderId?: string;
}): Promise<DijieAuthorizationResult> => {
  const headers = await getAuthHeaders();
  const response = await fetchQuery('/dijie/authorizations', {
    headers,
    method: 'POST',
    body: {
      roleListingId,
      ...(orderId ? { orderId } : {})
    }
  }).catch(() => null);

  if (!response) {
    return { ok: false, status: 0, error: '迭界AI岗位授权服务暂时不可达。' };
  }
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      code: response.data?.code,
      error: response.error?.message || '岗位授权失败。'
    };
  }
  return {
    ok: true,
    status: response.status,
    entitlementId: response.data?.entitlementId,
    entitlement: response.data?.entitlement
  };
};

export const sendDijieBuyerStorefrontMessage = async ({
  message,
  roleListingId,
  sessionId
}: {
  message: string;
  roleListingId?: string;
  sessionId?: string;
}): Promise<DijieBuyerDialogResult> => {
  const headers = await getAuthHeaders();
  const response = await fetchQuery('/dijie/dialog/messages', {
    headers,
    method: 'POST',
    body: {
      surface: 'buyer_storefront',
      message,
      ...(sessionId ? { sessionId } : {}),
      ...(roleListingId ? { subject: { roleListingId } } : {})
    }
  }).catch(() => null);

  if (!response) {
    return { ok: false, status: 0, error: '迭界AI商城助手暂时不可达。' };
  }
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error:
        response.status === 401
          ? '请先登录后咨询商城助手。'
          : response.error?.message || '商城助手暂时无法回复。'
    };
  }
  return {
    ok: true,
    status: response.status,
    sessionId: response.data?.sessionId,
    ledgerEntryId: response.data?.ledgerEntryId,
    message: response.data?.message,
    grounding: response.data?.grounding,
    actions: response.data?.actions
  };
};

export const listDijieInstalledRoles = async () => {
  const headers = await getAuthHeaders();
  const response = await fetchQuery('/dijie/my-roles', {
    headers,
    method: 'GET'
  }).catch(() => null);

  return response?.ok ? safeArray<DijieInstalledRole>(response.data?.roles) : [];
};

export const listDijieLedgerEntries = async () => {
  const headers = await getAuthHeaders();
  const response = await fetchQuery('/dijie/ledger/entries', {
    headers,
    method: 'GET'
  }).catch(() => null);

  return response?.ok ? safeArray<DijieLedgerEntry>(response.data?.entries) : [];
};

export const listDijieDialogSessions = async (surface?: string) => {
  const headers = await getAuthHeaders();
  const response = await fetchQuery('/dijie/dialog/sessions', {
    headers,
    method: 'GET',
    query: surface ? { surface } : undefined
  }).catch(() => null);

  return response?.ok ? safeArray<DijieDialogSession>(response.data?.sessions) : [];
};

export const startDijieCloudExecution = async ({
  roleListingId,
  entitlementId,
  taskText,
  confirmCost,
  confirmHumanCheckpoints
}: {
  roleListingId: string;
  entitlementId?: string;
  taskText: string;
  confirmCost: boolean;
  confirmHumanCheckpoints?: boolean;
}): Promise<DijieCloudExecutionResult> => {
  const headers = await getAuthHeaders();
  const response = await fetchQuery('/dijie/executions', {
    headers,
    method: 'POST',
    body: {
      roleListingId,
      ...(entitlementId ? { entitlementId } : {}),
      taskText,
      confirmCost,
      confirmHumanCheckpoints: confirmHumanCheckpoints === true
    }
  }).catch(() => null);

  if (!response) {
    return {
      ok: false,
      status: 0,
      code: 'cloud_unreachable',
      error: executionErrorMessage('cloud_unreachable')
    };
  }
  if (!response.ok) {
    const code = response.data?.code;
    return {
      ok: false,
      status: response.status,
      code,
      error: executionErrorMessage(code, response.error?.message)
    };
  }

  return {
    ok: true,
    status: response.status,
    executionId: response.data?.executionId,
    auditRecordId: response.data?.auditRecordId,
    executionStatus: response.data?.status,
    failureReason: response.data?.failureReason ?? null,
    artifacts: safeArray<DijieExecutionArtifact>(response.data?.artifacts),
    ledger: response.data?.ledger ?? null
  };
};

export const getDijieExecutionReadback = async (executionId: string) => {
  const headers = await getAuthHeaders();
  const response = await fetchQuery(`/dijie/executions/${encodeURIComponent(executionId)}`, {
    headers,
    method: 'GET'
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  return {
    ...(response.data as DijieExecutionReadback),
    executionId
  };
};
