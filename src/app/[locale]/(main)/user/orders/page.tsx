import { isEmpty } from 'lodash';

import { LoginForm, ParcelAccordion, UserNavigation } from '@/components/molecules';
import { UserModeDialog } from '@/components/organisms';
import { OrdersPagination } from '@/components/sections';
import { retrieveCustomer } from '@/lib/data/customer';
import { listDijieLedgerEntries } from '@/lib/data/dijie';
import { listOrders } from '@/lib/data/orders';
import { formatDijieSubject } from '@/lib/dijie-format';

const LIMIT = 10;
type UserOrder = any;

export default async function UserPage({
  searchParams
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const user = await retrieveCustomer();

  if (!user) return <LoginForm />;

  const ledgerEntries = await listDijieLedgerEntries();
  const orders = ledgerEntries.length > 0
    ? []
    : (((await listOrders()) ?? []) as UserOrder[]).filter(
        (order) => (order as any).order_set?.id,
      );

  const { page } = await searchParams;

  const pages = Math.ceil(orders.length / LIMIT);
  const currentPage = +page || 1;
  const offset = (+currentPage - 1) * LIMIT;

  const orderSetsGrouped = orders.reduce<Record<string, UserOrder[]>>(
    (acc, order) => {
      const orderSetId = (order as any).order_set?.id;
      if (!orderSetId) {
        return acc;
      }
      if (!acc[orderSetId]) {
        acc[orderSetId] = [];
      }
      acc[orderSetId].push(order);
      return acc;
    },
    {}
  );

  const orderSets = Object.entries(orderSetsGrouped).map(([orderSetId, groupedOrders]) => {
    const firstOrder = groupedOrders[0];
    const orderSet = (firstOrder as any).order_set;

    return {
      id: orderSetId,
      orders: groupedOrders,
      created_at: orderSet.created_at,
      display_id: orderSet.display_id,
      total: groupedOrders.reduce((sum, order) => sum + order.total, 0),
      currency_code: firstOrder.currency_code
    };
  });

  const processedOrders = orderSets.slice(offset, offset + LIMIT);

  return (
    <main
      className="container"
      data-testid="orders-page"
    >
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-8">
        <UserNavigation />
        <div
          className="space-y-8 md:col-span-3"
          data-testid="orders-container"
        >
          <h1 className="heading-md uppercase">费用记录</h1>
          {ledgerEntries.length > 0 ? (
            <div className="grid gap-4" data-testid="dijie-ledger-list">
              {ledgerEntries.map((entry) => (
                <div key={entry.id} className="rounded-sm border p-5" data-testid={`dijie-ledger-${entry.id}`}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="label-sm text-secondary">{entry.source} · {entry.usageKind}</p>
                      <h3 className="mt-1 heading-sm text-primary">
                        {formatDijieSubject(
                          entry.subject,
                          entry.roleListingId || entry.executionId || '迭界AI费用记录',
                        )}
                      </h3>
                    </div>
                    <div className="rounded-sm bg-action-secondary px-3 py-2 label-md text-primary">
                      {(entry.grossAmountCents / 100).toFixed(2)} {entry.currency}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    <div className="rounded-sm bg-secondary p-3">
                      <p className="label-sm text-secondary">计费页面</p>
                      <p className="mt-1 label-md text-primary">{entry.surface ?? '未标注'}</p>
                    </div>
                    <div className="rounded-sm bg-secondary p-3">
                      <p className="label-sm text-secondary">模型</p>
                      <p className="mt-1 label-md text-primary">{entry.modelId ?? '未调用模型'}</p>
                    </div>
                    <div className="rounded-sm bg-secondary p-3">
                      <p className="label-sm text-secondary">价格状态</p>
                      <p className="mt-1 label-md text-primary">
                        {entry.modelPricingKnown ? '已配置' : '待配置'}
                      </p>
                    </div>
                    <div className="rounded-sm bg-secondary p-3">
                      <p className="label-sm text-secondary">发生时间</p>
                      <p className="mt-1 label-md text-primary">
                        {entry.occurredAt ? new Date(entry.occurredAt).toLocaleDateString('zh-CN') : '未知'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isEmpty(orders) ? (
            <div
              className="text-center"
              data-testid="orders-empty-state"
            >
              <h3
                className="heading-lg uppercase text-primary"
                data-testid="no-orders-heading"
              >
                暂无费用
              </h3>
              <p
                className="mt-2 text-lg text-secondary"
                data-testid="no-orders-description"
              >
                暂无授权费用。迭界AI账本记录会优先显示在这里；旧订单记录仅作为兼容兜底。
              </p>
            </div>
          ) : (
            <>
              <div
                className="w-full max-w-full"
                data-testid="orders-list"
              >
                {processedOrders.map(orderSet => (
                  <ParcelAccordion
                    key={orderSet.id}
                    orderId={orderSet.id}
                    orderDisplayId={`#${orderSet.display_id}`}
                    createdAt={orderSet.created_at}
                    total={orderSet.total}
                    orders={orderSet.orders || []}
                    currency_code={orderSet.currency_code}
                  />
                ))}
              </div>
              <OrdersPagination pages={pages} />
            </>
          )}
        </div>
      </div>
      <UserModeDialog
        context="费用记录"
        status={`${ledgerEntries.length || orders.length} 项`}
        actions={[
          { label: '我的授权', href: '/user/wishlist', title: '查看岗位授权' },
          { label: '执行记录', href: '/user/messages', title: '查看岗位执行记录入口' },
          { label: '授权变更', href: '/user/returns', title: '查看授权变更' },
          { label: '账号设置', href: '/user/settings', title: '管理账号资料' }
        ]}
      />
    </main>
  );
}
