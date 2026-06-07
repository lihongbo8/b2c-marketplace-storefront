import { HttpTypes } from '@medusajs/types';
import { isEmpty } from 'lodash';
import { redirect } from 'next/navigation';

import { WishlistItem } from '@/components/cells';
import { UserNavigation } from '@/components/molecules';
import { UserModeDialog } from '@/components/organisms';
import { retrieveCustomer } from '@/lib/data/customer';
import { listDijieInstalledRoles } from '@/lib/data/dijie';
import { getUserWishlists } from '@/lib/data/wishlist';
import { Wishlist as WishlistType } from '@/types/wishlist';

export default async function Wishlist({ params }: { params: Promise<{ locale: string }> }) {
  const user = await retrieveCustomer();
  const { locale } = await params;

  let wishlist: WishlistType = { products: [] };
  if (user) {
    wishlist = await getUserWishlists({ countryCode: locale });
  }
  const installedRoles = user ? await listDijieInstalledRoles() : [];

  const count = installedRoles.length || wishlist?.products?.length || 0;

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="container" data-testid="wishlist-page">
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-8">
        <UserNavigation />
        <div className="space-y-8 md:col-span-3" data-testid="wishlist-container">
          {installedRoles.length > 0 ? (
            <div className="flex flex-col gap-6">
              <h2 className="heading-lg uppercase text-primary" data-testid="wishlist-heading">我的岗位授权</h2>
              <div className="grid gap-4">
                {installedRoles.map((item) => (
                  <div key={item.entitlementId} className="rounded-sm border p-5" data-testid={`dijie-role-${item.entitlementId}`}>
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="label-sm text-secondary">已授权岗位</p>
                        <h3 className="mt-1 heading-sm text-primary">{item.role.title}</h3>
                        {item.role.subtitle && (
                          <p className="mt-2 label-md text-secondary">{item.role.subtitle}</p>
                        )}
                      </div>
                      <div className="rounded-sm bg-action-secondary px-3 py-2 label-sm text-primary">
                        {item.authorizedAt ? `授权时间 ${new Date(item.authorizedAt).toLocaleDateString('zh-CN')}` : '已授权'}
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-sm bg-secondary p-3">
                        <p className="label-sm text-secondary">授权编号</p>
                        <p className="mt-1 truncate label-md text-primary">{item.entitlementId}</p>
                      </div>
                      <div className="rounded-sm bg-secondary p-3">
                        <p className="label-sm text-secondary">授权来源</p>
                        <p className="mt-1 label-md text-primary">{item.entitlementSource ?? 'local_entitlement'}</p>
                      </div>
                      <div className="rounded-sm bg-secondary p-3">
                        <p className="label-sm text-secondary">授权费</p>
                        <p className="mt-1 label-md text-primary">
                          {(
                            (item.role.authorizationSummary?.authorizationFeeCents
                              ?? item.role.pricing?.authorizationFeeCents
                              ?? 0) / 100
                          ).toFixed(2)}
                          {' '}
                          {item.role.authorizationSummary?.currency ?? item.role.pricing?.currency ?? 'CNY'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isEmpty(wishlist?.products) ? (
            <div className="mx-auto flex w-96 flex-col items-center justify-center" data-testid="wishlist-empty-state">
              <h2 className="heading-lg mb-2 uppercase text-primary" data-testid="wishlist-empty-heading">我的岗位授权</h2>
              <p className="mb-6 text-lg text-secondary" data-testid="wishlist-empty-description">暂无已授权岗位</p>
              <p className="max-w-sm text-center label-md text-secondary">
                当前账号没有从迭界AI授权接口同步到岗位；收藏的待授权岗位也会显示在这里。
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <h2 className="heading-lg uppercase text-primary" data-testid="wishlist-heading">待授权岗位</h2>
              <div className="flex items-center justify-between">
                <p data-testid="wishlist-count">{wishlist?.products?.length || 0} 项</p>
                <p className="label-sm text-secondary">这些是本地收藏/待授权岗位，不等同于已授权 entitlement。</p>
              </div>
              <div className="flex flex-wrap gap-4 max-md:justify-center" data-testid="wishlist-products-list">
                {wishlist?.products?.map(product => (
                  <WishlistItem
                    key={product.id}
                    product={
                      product as HttpTypes.StoreProduct & {
                        calculated_amount: number;
                        currency_code: string;
                      }
                    }
                    wishlist={wishlist}
                    user={user}
                    testIdPrefix={`wishlist-item-${product.id}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <UserModeDialog
        context="我的授权"
        status={`${count} 项`}
        actions={[
          { label: '费用记录', href: '/user/orders', title: '查看授权费用' },
          { label: '执行记录', href: '/user/messages', title: '查看岗位执行记录入口' },
          { label: '授权变更', href: '/user/returns', title: '查看授权变更' },
          { label: '账号设置', href: '/user/settings', title: '管理账号资料' }
        ]}
      />
    </main>
  );
}
