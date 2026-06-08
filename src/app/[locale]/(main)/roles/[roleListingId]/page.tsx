import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DijieRoleAuthorizationButton } from '@/components/organisms/DijieRoleAuthorizationButton/DijieRoleAuthorizationButton';
import { getDijieRoleDetail, listDijieInstalledRoles } from '@/lib/data/dijie';

const formatRoleFee = (cents?: number, currency = 'CNY') => {
  if (typeof cents !== 'number' || !Number.isFinite(cents)) {
    return '费用待确认';
  }
  return `${(cents / 100).toFixed(2)} ${currency}`;
};

const formatTokenFee = (cents?: number, currency = 'CNY') => {
  if (typeof cents !== 'number' || !Number.isFinite(cents)) {
    return '未配置';
  }
  return `${(cents / 100).toFixed(2)} ${currency}/百万 Token`;
};

const SectionList = ({ title, items }: { title: string; items?: string[] }) => {
  const visibleItems = (items ?? []).filter(Boolean);
  if (visibleItems.length === 0) {
    return null;
  }
  return (
    <section className="rounded-sm border bg-primary p-5">
      <h2 className="heading-sm text-primary">{title}</h2>
      <div className="mt-4 grid gap-3">
        {visibleItems.map(item => (
          <p
            key={item}
            className="label-md text-secondary"
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ roleListingId: string }>;
}): Promise<Metadata> {
  const { roleListingId } = await params;
  const role = await getDijieRoleDetail(roleListingId);
  return {
    title: role?.title ?? '岗位详情',
    description: role?.subtitle ?? role?.description ?? '迭界AI岗位详情'
  };
}

export default async function DijieRoleDetailPage({
  params
}: {
  params: Promise<{ locale: string; roleListingId: string }>;
}) {
  const { locale, roleListingId } = await params;
  const role = await getDijieRoleDetail(roleListingId);
  if (!role) {
    notFound();
  }

  const installedRoles = await listDijieInstalledRoles();
  const authorized = installedRoles.some(item => item.role.id === role.id);
  const feeCents =
    role.authorizationSummary?.authorizationFeeCents ?? role.pricing?.authorizationFeeCents;
  const currency = role.authorizationSummary?.currency ?? role.pricing?.currency ?? 'CNY';

  return (
    <main
      className="container py-6"
      data-testid="dijie-role-detail-page"
    >
      <div className="label-md mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-secondary">
          <Link
            href={`/${locale}`}
            className="hover:text-primary"
          >
            岗位商城
          </Link>
          <span>/</span>
          <Link
            href={`/${locale}/categories`}
            className="hover:text-primary"
          >
            已审核岗位
          </Link>
          <span>/</span>
          <span className="text-primary">{role.title}</span>
        </div>
        <Link
          href={`/${locale}/categories`}
          className="text-secondary hover:text-primary"
        >
          继续浏览岗位
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-5">
          <section className="rounded-sm border bg-primary p-6">
            <p className="label-sm text-secondary">审核通过 · 可购买/授权</p>
            <h1 className="heading-xl mt-2 text-primary">{role.title}</h1>
            {role.subtitle && <p className="mt-3 text-lg text-secondary">{role.subtitle}</p>}
            {role.description && <p className="label-lg mt-3 text-secondary">{role.description}</p>}
            <div className="mt-5 flex flex-wrap gap-2">
              {(role.capabilities ?? []).map(capability => (
                <span
                  key={capability}
                  className="label-sm rounded-sm border px-2 py-1 text-secondary"
                >
                  {capability}
                </span>
              ))}
            </div>
          </section>

          <SectionList
            title="岗位能做什么"
            items={role.detailSections?.roleDetails}
          />
          <SectionList
            title="使用规范"
            items={role.detailSections?.usageInstructions}
          />
          <SectionList
            title="输入材料要求"
            items={role.detailSections?.inputRequirements}
          />
          <SectionList
            title="输出结果示例"
            items={role.detailSections?.outputExamples}
          />
          <SectionList
            title="执行与失败边界"
            items={role.detailSections?.failureBoundaries}
          />
          <SectionList
            title="人工确认点"
            items={role.detailSections?.humanConfirmations}
          />
          <SectionList
            title="审核通过信息"
            items={role.detailSections?.reviewInfo}
          />
        </div>

        <aside className="grid h-fit gap-4 lg:sticky lg:top-5">
          <section className="rounded-sm border bg-primary p-5">
            <h2 className="heading-sm text-primary">授权摘要</h2>
            <p className="heading-lg mt-4 text-primary">{formatRoleFee(feeCents, currency)}</p>
            <div className="mt-4 grid gap-2 rounded-sm bg-secondary p-3">
              <div className="label-md flex items-center justify-between gap-3">
                <span className="text-secondary">输入 Token</span>
                <span className="text-primary">
                  {role.tokenUsageSummary?.inputTokenFee ??
                    formatTokenFee(
                      role.roleTokenPricing?.inputTokenCentsPerMillion,
                      role.roleTokenPricing?.currency ?? currency
                    )}
                </span>
              </div>
              <div className="label-md flex items-center justify-between gap-3">
                <span className="text-secondary">输出 Token</span>
                <span className="text-primary">
                  {role.tokenUsageSummary?.outputTokenFee ??
                    formatTokenFee(
                      role.roleTokenPricing?.outputTokenCentsPerMillion,
                      role.roleTokenPricing?.currency ?? currency
                    )}
                </span>
              </div>
            </div>
            <p className="label-md mt-2 text-secondary">
              {role.tokenUsageSummary?.executionFeeNote ??
                role.authorizationSummary?.executionFeeNote ??
                '正式执行费用以授权后的 ledger/readback 为准。'}
            </p>
            <div className="mt-5">
              <DijieRoleAuthorizationButton
                roleListingId={role.id}
                locale={locale}
                authorizationFeeCents={feeCents}
                initiallyAuthorized={authorized}
                className="w-full"
              />
            </div>
          </section>

          <section className="rounded-sm border bg-primary p-5">
            <h2 className="heading-sm text-primary">开发者</h2>
            <p className="label-md mt-3 text-secondary">{role.developerName ?? '认证开发者'}</p>
            <p className="label-md mt-2 text-secondary">
              商品页不展示执行工具、密钥、内部协议或私有执行记录。
            </p>
          </section>

          {(role.relatedRoles ?? []).length > 0 && (
            <section className="rounded-sm border bg-primary p-5">
              <h2 className="heading-sm text-primary">相关岗位</h2>
              <div className="mt-4 grid gap-3">
                {role.relatedRoles?.map(item => (
                  <Link
                    key={item.id}
                    href={`/${locale}/roles/${encodeURIComponent(item.id)}`}
                    className="label-md rounded-sm border px-3 py-2 text-primary"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
