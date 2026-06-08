import Link from 'next/link';
import { redirect } from 'next/navigation';

import { UserNavigation } from '@/components/molecules';
import { DijieRoleUsePanel, UserModeDialog } from '@/components/organisms';
import { retrieveCustomer } from '@/lib/data/customer';
import { getDijieRoleDetail, listDijieInstalledRoles } from '@/lib/data/dijie';

const formatMoney = (cents?: number, currency = 'CNY') =>
  `${((cents ?? 0) / 100).toFixed(2)} ${currency}`;

const formatTokenFee = (cents?: number, currency = 'CNY') =>
  Number.isFinite(cents) ? `¥${((cents ?? 0) / 100).toFixed(2)}/百万 Token` : '未配置';

const SectionList = ({
  title,
  items = [],
  className = ''
}: {
  title: string;
  items?: string[];
  className?: string;
}) => (
  <section className={`rounded-sm border p-5 ${className}`}>
    <h2 className="heading-sm uppercase text-primary">{title}</h2>
    {items.length > 0 ? (
      <ul className="mt-3 grid gap-2">
        {items.map(item => (
          <li
            key={item}
            className="label-md text-secondary"
          >
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className="label-md mt-3 text-secondary">当前岗位包未公开该项说明。</p>
    )}
  </section>
);

export default async function UserRoleDetailPage({
  params
}: {
  params: Promise<{ locale: string; roleListingId: string }>;
}) {
  const user = await retrieveCustomer();
  const { locale, roleListingId } = await params;

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const [installedRoles, roleDetail] = await Promise.all([
    listDijieInstalledRoles(),
    getDijieRoleDetail(roleListingId)
  ]);
  const installed = installedRoles.find(item => item.role.id === roleListingId);
  const tokenUsageSummary = roleDetail?.tokenUsageSummary ?? installed?.role.tokenUsageSummary;
  const roleTokenPricing = roleDetail?.roleTokenPricing ?? installed?.role.roleTokenPricing;
  const tokenCurrency =
    roleTokenPricing?.currency ??
    installed?.role.authorizationSummary?.currency ??
    installed?.role.pricing?.currency ??
    'CNY';

  return (
    <main
      className="container"
      data-testid="dijie-user-role-detail-page"
    >
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-8">
        <UserNavigation />
        <div className="space-y-6 md:col-span-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="label-sm text-secondary">已授权岗位详情</p>
              <h1 className="heading-md mt-1 uppercase text-primary">
                {installed?.role.title ?? roleDetail?.title ?? '岗位详情'}
              </h1>
              {(installed?.role.subtitle || roleDetail?.subtitle) && (
                <p className="label-md mt-2 text-secondary">
                  {installed?.role.subtitle ?? roleDetail?.subtitle}
                </p>
              )}
            </div>
            <Link
              href={`/${locale}/user/wishlist`}
              className="label-md inline-flex h-10 items-center justify-center rounded-sm bg-action-secondary px-4 text-action-on-secondary"
            >
              返回我的授权
            </Link>
          </div>

          {!installed ? (
            <div
              className="rounded-sm border p-6"
              data-testid="dijie-role-not-authorized"
            >
              <h2 className="heading-sm uppercase text-primary">当前账号未授权</h2>
              <p className="label-md mt-3 text-secondary">
                使用者中心只展示并执行当前账号已有 entitlement 的岗位。请先在商城完成授权。
              </p>
              <Link
                href={`/${locale}/roles/${encodeURIComponent(roleListingId)}`}
                className="label-md mt-5 inline-flex h-10 items-center justify-center rounded-sm bg-action px-4 text-action-on-primary"
              >
                去商城查看
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-sm bg-secondary p-4">
                  <p className="label-sm text-secondary">授权编号</p>
                  <p className="label-md mt-1 truncate text-primary">{installed.entitlementId}</p>
                </div>
                <div className="rounded-sm bg-secondary p-4">
                  <p className="label-sm text-secondary">授权状态</p>
                  <p className="label-md mt-1 text-primary">已授权 / 可使用</p>
                </div>
                <div className="rounded-sm bg-secondary p-4">
                  <p className="label-sm text-secondary">授权费</p>
                  <p className="label-md mt-1 text-primary">
                    {formatMoney(
                      installed.role.authorizationSummary?.authorizationFeeCents ??
                        installed.role.pricing?.authorizationFeeCents,
                      installed.role.authorizationSummary?.currency ??
                        installed.role.pricing?.currency ??
                        'CNY'
                    )}
                  </p>
                </div>
                <div className="rounded-sm bg-secondary p-4">
                  <p className="label-sm text-secondary">输入 Token</p>
                  <p className="label-md mt-1 text-primary">
                    {tokenUsageSummary?.inputTokenFee ??
                      formatTokenFee(roleTokenPricing?.inputTokenCentsPerMillion, tokenCurrency)}
                  </p>
                </div>
                <div className="rounded-sm bg-secondary p-4">
                  <p className="label-sm text-secondary">输出 Token</p>
                  <p className="label-md mt-1 text-primary">
                    {tokenUsageSummary?.outputTokenFee ??
                      formatTokenFee(roleTokenPricing?.outputTokenCentsPerMillion, tokenCurrency)}
                  </p>
                </div>
              </div>

              <DijieRoleUsePanel
                locale={locale}
                roleListingId={installed.role.id}
                entitlementId={installed.entitlementId}
                entitlementSource={installed.entitlementSource}
                orderId={installed.orderId}
                tokenUsageSummary={tokenUsageSummary}
              />
            </>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <SectionList
              title="使用规范"
              items={roleDetail?.detailSections?.usageInstructions}
              className="lg:col-span-2"
            />
            <SectionList
              title="可执行能力"
              items={roleDetail?.detailSections?.requiredCapabilities}
            />
            <SectionList
              title="输入材料要求"
              items={roleDetail?.detailSections?.inputRequirements}
            />
            <SectionList
              title="输出结果示例"
              items={roleDetail?.detailSections?.outputExamples}
            />
            <SectionList
              title="失败边界"
              items={roleDetail?.detailSections?.failureBoundaries}
            />
          </div>
        </div>
      </div>
      <UserModeDialog
        context="岗位详情"
        actions={[
          { label: '我的授权', href: '/user/wishlist', title: '查看岗位授权' },
          { label: '执行记录', href: '/user/messages', title: '查看岗位执行记录' },
          { label: '费用记录', href: '/user/orders', title: '查看费用记录' },
          { label: '账号设置', href: '/user/settings', title: '管理账号资料' }
        ]}
      />
    </main>
  );
}
