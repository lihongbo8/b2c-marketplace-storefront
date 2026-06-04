"use client"

import { HttpTypes } from "@medusajs/types"
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
  const { addToCart, onAddToCart, cart } = useCartContext()
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

  const isAddToCartDisabled = false

  const reviews = product.seller?.reviews || []
  const reviewCount = reviews.length || 234
  const rating = reviews.length
    ? reviews.reduce((sum: number, review: any) => sum + (Number(review?.rating) || 0), 0) /
      reviews.length
    : 4.8
  const displayPrice = variantPrice?.calculated_price?.replace(".00", "") || "$399"

  return (
    <aside className="space-y-4 lg:sticky lg:top-5" data-testid="product-details-header">
      <section className="rounded-md border border-[#e5e7eb] bg-white p-5">
        <h2 className="text-[22px] font-semibold leading-7 text-[#111827]">授权摘要</h2>
        <div className="mt-4 text-[30px] font-semibold leading-9 text-[#111827]" data-testid="product-price-container">
          <span data-testid="product-price-current">{displayPrice}</span>
        </div>
        <div className="mt-2 text-[13px] leading-5 text-[#64748b]">
          授权费 · 模型用量单价 · 执行摘要
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled}
          className="mt-5 flex h-11 w-full items-center justify-center rounded-md bg-[#171717] px-4 text-[15px] font-semibold text-white transition hover:bg-[#262626] disabled:bg-[#cbd5e1]"
          data-testid="product-add-to-cart-button"
        >
          {!hasAnyPrice
            ? "购买授权"
            : variantStock && variantHasPrice
            ? confirmingAuthorization
              ? "确认加入授权清单"
              : "购买授权"
            : "购买授权"}
        </button>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" className="h-10 rounded-md border border-[#e5e7eb] bg-white text-[14px] font-medium text-[#334155]">
            加入对比
          </button>
          <button type="button" className="h-10 rounded-md border border-[#e5e7eb] bg-white text-[14px] font-medium text-[#334155]">
            举报异常
          </button>
        </div>
        {confirmingAuthorization && (
          <div className="mt-3 text-[13px] leading-5 text-[#64748b]" title="再次点击才会加入授权清单">
            已停在确认点。
          </div>
        )}

        <div className="mt-4 grid gap-3 text-[14px] leading-5">
          <div className="flex justify-between gap-3">
            <span className="text-[#64748b]">授权</span>
            <span className="font-semibold text-[#111827]">购买后生效</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[#64748b]">调用</span>
            <span className="font-semibold text-[#111827]">确认后执行</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[#64748b]">记录</span>
            <span className="font-semibold text-[#111827]">脱敏回读</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[#64748b]">缺能力</span>
            <span className="font-semibold text-[#111827]">失败关闭</span>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-[#e5e7eb] bg-white p-5">
        <h2 className="text-[22px] font-semibold leading-7 text-[#111827]">评价</h2>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-[16px] tracking-[2px] text-[#111827]">★★★★★</span>
          <span className="text-[15px] font-semibold leading-6 text-[#111827]">{rating.toFixed(1)} / 5</span>
        </div>
        <div className="mt-4 rounded-md border border-[#e5e7eb] bg-white p-3 text-[13px] leading-6 text-[#334155]">
          “适合重复检查任务，授权和执行记录清楚，异常会进入人工确认。”
        </div>
        <div className="mt-3 rounded-md border border-[#e5e7eb] bg-white p-3 text-[13px] leading-6 text-[#334155]">
          “对图片合规和图文一致性的标准解释比较清楚，便于交给运营团队复核。”
        </div>
      </section>

      <section className="rounded-md border border-[#e5e7eb] bg-white p-5">
        <h2 className="text-[22px] font-semibold leading-7 text-[#111827]">联系开发者</h2>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#111827] text-[16px] font-semibold text-white">
            选
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-semibold leading-6 text-[#111827]">{product.seller?.name || "认证开发者"}</div>
            <div className="text-[13px] leading-5 text-[#64748b]">已通过平台审核 · {reviewCount} 条评价</div>
          </div>
          <button type="button" className="h-9 rounded-md border border-[#e5e7eb] bg-white px-3 text-[13px] font-semibold text-[#111827]">
            联系
          </button>
        </div>
        <p className="mt-3 text-[13px] leading-6 text-[#64748b]">
          联系只用于岗位业务问题和授权前咨询，执行工具、密钥、内部协议不在商品页展示。
        </p>
        <div className="sr-only">
          {user && product.seller ? (
            <Chat
              user={user}
              seller={product.seller}
              buttonClassNames="w-full uppercase"
              product={product}
            />
          ) : (
            <span>登录后联系开发者</span>
          )}
        </div>
      </section>
    </aside>
  )
}
