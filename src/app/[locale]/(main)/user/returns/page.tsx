import { UserNavigation } from '@/components/molecules/UserNavigation/UserNavigation';
import { UserModeDialog } from '@/components/organisms';
import { OrderReturnRequests } from '@/components/sections/OrderReturnRequests/OrderReturnRequests';
import { retrieveCustomer } from '@/lib/data/customer';
import { getReturns, retrieveReturnReasons } from '@/lib/data/orders';

export default async function ReturnsPage({
  searchParams
}: {
  searchParams: Promise<{ page: string; return: string }>;
}) {
  const { order_return_requests } = await getReturns();
  const returnReasons = await retrieveReturnReasons();

  const user = await retrieveCustomer();

  const { page, return: returnId } = await searchParams;

  return (
    <main className="container">
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-8">
        <UserNavigation />
        <div className="md:col-span-3">
          <h1 className="heading-md uppercase" data-testid="returns-heading">授权变更</h1>
          <OrderReturnRequests
            returns={order_return_requests.sort(
              (a, b) =>
                new Date(b.line_items[0].created_at).getTime() -
                new Date(a.line_items[0].created_at).getTime()
            )}
            user={user}
            page={page}
            currentReturn={returnId || ''}
            returnReasons={returnReasons}
          />
        </div>
      </div>
      <UserModeDialog
        context="授权变更"
        actions={[
          { label: '我的授权', href: '/user/wishlist', title: '查看已保存授权' },
          { label: '费用记录', href: '/user/orders', title: '查看授权费用' },
          { label: '执行记录', href: '/user/messages', title: '查看岗位执行记录入口' },
          { label: '账号设置', href: '/user/settings', title: '管理账号资料' }
        ]}
      />
    </main>
  );
}
