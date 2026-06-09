'use client';

import { Button } from '@/components/atoms';
import LocalizedClientLink from '@/components/molecules/LocalizedLink/LocalizedLink';
import { CartEmpty, CartItems, CartSummary } from '@/components/organisms';
import { UserModeDialog } from '@/components/organisms/UserModeDialog/UserModeDialog';
import { useCartContext } from '@/components/providers';

export const Cart = () => {
  const { cart } = useCartContext();

  if (!cart || !cart.items?.length) {
    return (
      <>
        <CartEmpty />
        <UserModeDialog
          context="授权清单"
          status="空"
          actions={[
            { label: '岗位', href: '/categories', title: '返回岗位' },
            { label: '我的授权', href: '/user/wishlist', title: '查看我的岗位授权' }
          ]}
        />
      </>
    );
  }

  return (
    <>
      <div className="col-span-12 lg:col-span-6">
        <CartItems cart={cart} />
      </div>
      <div className="lg:col-span-2"></div>
      <div className="col-span-12 lg:col-span-4">
        <div className="h-fit rounded-sm border p-4">
          <CartSummary
            item_total={cart?.item_subtotal || 0}
            shipping_total={cart?.shipping_subtotal || 0}
            total={cart?.total || 0}
            currency_code={cart?.currency_code || ''}
            tax={cart?.tax_total || 0}
            discount_total={cart?.discount_subtotal || 0}
          />
          <LocalizedClientLink href="/checkout?step=address">
            <Button className="flex w-full items-center justify-center py-3">购买授权</Button>
          </LocalizedClientLink>
        </div>
      </div>
      <UserModeDialog
        context="授权清单"
        status={`${cart.items.length} 项`}
        actions={[
          { label: '继续筛选', href: '/categories', title: '回到岗位筛选' },
          { label: '我的授权', href: '/user/wishlist', title: '查看我的岗位授权' }
        ]}
        highRiskAction={{
          label: '提交授权',
          title: '停在确认前，不提交订单'
        }}
      />
    </>
  );
};
