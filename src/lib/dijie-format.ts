type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const field = (record: UnknownRecord, key: string): string | undefined => {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

export const formatDijieSubject = (subject: unknown, fallback: string) => {
  if (typeof subject === "string" && subject.trim()) {
    return subject.trim();
  }
  if (!isRecord(subject)) {
    return fallback;
  }

  const executionId = field(subject, "executionId");
  const roleListingId = field(subject, "roleListingId");
  const entitlementId = field(subject, "entitlementId");
  const packageId = field(subject, "packageId");
  const parts = [
    executionId ? `执行 ${executionId}` : undefined,
    roleListingId ? `岗位 ${roleListingId}` : undefined,
    entitlementId ? `授权 ${entitlementId}` : undefined,
    packageId ? `包 ${packageId}` : undefined,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : fallback;
};
