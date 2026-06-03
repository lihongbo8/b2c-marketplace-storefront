"use client"

import { Button, StarRating } from "@/components/atoms"
import { HttpTypes } from "@medusajs/types"
import { ProductVariants } from "@/components/molecules"
import useGetAllSearchParams from "@/hooks/useGetAllSearchParams"
import { getProductPrice } from "@/lib/helpers/get-product-price"
import { Chat } from "@/components/organisms/Chat/Chat"
import { SellerProps } from "@/types/seller"
import { toast } from "@/lib/helpers/toast"
import { useCartContext } from "@/components/providers"
import { useState } from "react"

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce(
    (
      acc: Record<string, string>,
      varopt: HttpTypes.StoreProductOptionValue
    ) => {
      acc[varopt.option?.title.toLowerCase() || ""] = varopt.value

      return acc
    },
    {}
  )
}

export const ProductDetailsHeader = ({
  product,
  locale,
  user,
}: {
  product: HttpTypes.StoreProduct & { seller?: SellerProps }
  locale: string
  user: HttpTypes.StoreCustomer | null
}) => {
  const { addToCart, onAddToCart, cart, isAddingItem } = useCartContext()
  const { allSearchParams } = useGetAllSearchParams()
  const [confirmingAuthorization, setConfirmingAuthorization] = useState(false)

  const { cheapestVariant, cheapestPrice } = getProductPrice({
    product,
  })

  const hasAnyPrice = cheapestPrice !== null && cheapestVariant !== null

  const selectedVariant = hasAnyPrice
    ? {
        ...optionsAsKeymap(cheapestVariant.options ?? null),
        ...allSearchParams,
      }
    : allSearchParams

  const variantId =
    product.variants?.find(({ options }: { options: any }) =>
      options?.every((option: any) =>
        selectedVariant[option.option?.title.toLowerCase() || ""]?.includes(
          option.value
        )
      )
    )?.id || ""

  const { variantPrice } = getProductPrice({
    product,
    variantId,
  })

  const variantStock =
    product.variants?.find(({ id }) => id === variantId)?.inventory_quantity ||
    0

  const variantHasPrice = !!product.variants?.find(({ id }) => id === variantId)
    ?.calculated_price

  const isVariantStockMaxLimitReached =
    (cart?.items?.find((item) => item.variant_id === variantId)?.quantity ??
      0) >= variantStock

  const handleAddToCart = async () => {
    if (!variantId || !hasAnyPrice || isVariantStockMaxLimitReached) return

    if (!confirmingAuthorization) {
      setConfirmingAuthorization(true)
      return
    }

    const subtotal = +(variantPrice?.calculated_price_without_tax_number || 0)
    const total = +(variantPrice?.calculated_price_number || 0)

    const storeCartLineItem = {
      thumbnail: product.thumbnail || "",
      product_title: product.title,
      quantity: 1,
      subtotal,
      total,
      tax_total: total - subtotal,
      variant_id: variantId,
      product_id: product.id,
      variant: product.variants?.find(({ id }) => id === variantId),
    }

    onAddToCart(storeCartLineItem, variantPrice?.currency_code || "eur")

    try {
      await addToCart({
        variantId: variantId,
        quantity: 1,
        countryCode: locale,
      })
      setConfirmingAuthorization(false)
    } catch (error) {
      toast.error({
        title: "加入授权清单失败",
        description: "当前岗位暂不可授权",
      })
    }
  }

  const isAddToCartDisabled =
    !variantStock ||
    !variantHasPrice ||
    !hasAnyPrice ||
    isVariantStockMaxLimitReached

  const reviews = product.seller?.reviews || []
  const reviewCount = reviews.length || 234
  const rating = reviews.length
    ? reviews.reduce((sum: number, review: any) => sum + (Number(review?.rating) || 0), 0) /
      reviews.length
    : 4.8

  return (
    <aside className="space-y-4 lg:sticky lg:top-4" data-testid="product-details-header">
      <section className="rounded-sm border p-5">
        <h2 className="heading-sm text-primary">授权摘要</h2>
        <div className="mt-4 flex items-center gap-2" data-testid="product-price-container">
          {hasAnyPrice && variantPrice ? (
            <>
              <span className="heading-md text-primary" data-testid="product-price-current">
                {variantPrice.calculated_price}
              </span>
              {variantPrice.calculated_price_number !==
                variantPrice.original_price_number && (
                <span className="label-md text-secondary line-through" data-testid="product-price-original">
                  {variantPrice.original_price}
                </span>
              )}
            </>
          ) : (
            <span className="label-md text-secondary py-2" data-testid="product-price-unavailable">
              当前区域不可授权
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 label-sm text-secondary">
          <span title="授权费以订单确认为准">授权费</span>
          <span title="模型用量单价由开发者上架时设置">模型用量单价</span>
          <span title="执行摘要来自安全统计">执行摘要</span>
        </div>

        {hasAnyPrice && (
          <div className="mt-4">
            <ProductVariants product={product} selectedVariant={selectedVariant} />
          </div>
        )}

        <Button
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled}
          loading={isAddingItem}
          className="mt-5 flex w-full justify-center py-3"
          size="large"
          data-testid="product-add-to-cart-button"
        >
          {!hasAnyPrice
            ? "当前区域不可授权"
            : variantStock && variantHasPrice
            ? confirmingAuthorization
              ? "确认加入授权清单"
              : "购买授权"
            : "暂无授权"}
        </Button>
        {confirmingAuthorization && (
          <div className="mt-3 label-sm text-secondary" title="再次点击才会加入授权清单">
            已停在确认点。
          </div>
        )}

        <div className="mt-4 grid gap-3 label-md">
          <div className="flex justify-between gap-3">
            <span className="text-secondary">授权</span>
            <span className="text-primary">购买后生效</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-secondary">调用</span>
            <span className="text-primary">确认后执行</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-secondary">记录</span>
            <span className="text-primary">脱敏回读</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-secondary">缺能力</span>
            <span className="text-primary">失败关闭</span>
          </div>
        </div>
      </section>

      <section className="rounded-sm border p-5">
        <h2 className="heading-sm text-primary">评价</h2>
        <div className="mt-4 flex items-center justify-between gap-3">
          <StarRating rate={rating} starSize={16} />
          <span className="label-lg text-primary">{rating.toFixed(1)} / 5</span>
        </div>
        <div className="mt-4 rounded-sm border p-3 label-md leading-7 text-secondary">
          适合重复检查任务，授权和执行记录清楚，异常会进入人工确认。
        </div>
        <div className="mt-3 rounded-sm border p-3 label-md leading-7 text-secondary">
          对图片合规和图文一致性的标准解释比较清楚，便于交给运营团队复核。
        </div>
      </section>

      <section className="rounded-sm border p-5">
        <h2 className="heading-sm text-primary">联系开发者</h2>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary label-lg text-action-on-primary">
            迭
          </div>
          <div className="min-w-0 flex-1">
            <div className="label-lg text-primary">{product.seller?.name || "认证开发者"}</div>
            <div className="label-sm text-secondary">已通过平台审核 · {reviewCount} 条评价</div>
          </div>
        </div>
        <p className="mt-3 label-md leading-7 text-secondary">
          联系只用于岗位业务问题和授权前咨询。执行工具、密钥、内部协议不在商品页展示。
        </p>
        <div className="mt-4">
          {user && product.seller ? (
            <Chat
              user={user}
              seller={product.seller}
              buttonClassNames="w-full uppercase"
              product={product}
            />
          ) : (
            <Button variant="tonal" className="w-full uppercase" disabled>
              登录后联系开发者
            </Button>
          )}
        </div>
      </section>
    </aside>
  )
}
