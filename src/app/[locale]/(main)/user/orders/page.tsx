import { isEmpty } from 'lodash';

import { LoginForm, ParcelAccordion, UserNavigation } from '@/components/molecules';
import { UserModeDialog } from '@/components/organisms';
import { OrdersPagination } from '@/components/sections';
import { retrieveCustomer } from '@/lib/data/customer';
import { listOrders } from '@/lib/data/orders';

const LIMIT = 10;
type UserOrder = any;

export default async function UserPage({
  searchParams
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const user = await retrieveCustomer();

  if (!user) return <LoginForm />;

  const orders = ((await listOrders()) ?? []) as UserOrder[];

  const { page } = await searchParams;

  const pages = Math.ceil(orders.length / LIMIT);
  const currentPage = +page || 1;
  const offset = (+currentPage - 1) * LIMIT;

  const orderSetsGrouped = orders.reduce<Record<string, UserOrder[]>>(
    (acc, order) => {
      const orderSetId = (order as any).order_set.id;
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
          {isEmpty(orders) ? (
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
                暂无授权费用
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
        status={`${orders.length} 项`}
        actions={[
          { label: '我的授权', href: '/user/wishlist', title: '查看已保存授权' },
          { label: '执行记录', href: '/user/messages', title: '查看岗位执行记录入口' },
          { label: '授权变更', href: '/user/returns', title: '查看授权变更' },
          { label: '账号设置', href: '/user/settings', title: '管理账号资料' }
        ]}
      />
    </main>
  );
}
