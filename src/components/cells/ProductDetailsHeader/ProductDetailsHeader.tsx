"use client"

import { Button } from "@/components/atoms"
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
  wishlist,
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

  // Check if product has any valid prices in current region
  const hasAnyPrice = cheapestPrice !== null && cheapestVariant !== null

  // set default variant
  const selectedVariant = hasAnyPrice
    ? {
        ...optionsAsKeymap(cheapestVariant.options ?? null),
        ...allSearchParams,
      }
    : allSearchParams

  // get selected variant id
  const variantId =
    product.variants?.find(({ options }: { options: any }) =>
      options?.every((option: any) =>
        selectedVariant[option.option?.title.toLowerCase() || ""]?.includes(
          option.value
        )
      )
    )?.id || ""

  // get variant price
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

  // add the selected variant to the cart
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

    // Optimistic update
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

  const isAddToCartDisabled = !variantStock || !variantHasPrice || !hasAnyPrice || isVariantStockMaxLimitReached

  return (
    <div className="border rounded-sm p-5" data-testid="product-details-header">
      <div className="flex justify-between gap-4">
        <div>
          <h2 className="label-md text-secondary">
            {/* {product?.brand || "No brand"} */}
          </h2>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="label-sm rounded-sm bg-action-secondary px-2 py-1 text-action-on-secondary" title="岗位详情">
              岗位
            </span>
            <span className="label-sm rounded-sm border px-2 py-1 text-primary" title="当前可购买授权">
              可授权
            </span>
            <span className="label-sm rounded-sm border px-2 py-1 text-primary" title="购买后仍由主系统调度，执行前按风险确认">
              安全确认
            </span>
          </div>
          <h1 className="heading-lg text-primary" data-testid="product-title">{product.title}</h1>
          <div className="mt-2 label-md text-secondary" title="开发者">
            {product.seller?.name || "认证开发者"}
          </div>
          <div className="mt-2 flex gap-2 items-center" data-testid="product-price-container">
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
              <span className="label-md text-secondary pt-2 pb-4" data-testid="product-price-unavailable">
                当前区域不可授权
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2 label-sm text-secondary">
            <span title="授权费以订单确认为准">授权费</span>
            <span title="Token 单价由开发者上架时设置">Token 单价</span>
            <span title="评分和执行摘要来自安全统计">评分/执行摘要</span>
          </div>
        </div>
      </div>
      {/* Product Variants */}
      {hasAnyPrice && (
        <ProductVariants product={product} selectedVariant={selectedVariant} />
      )}
      {/* Add to Cart */}
      <Button
        onClick={handleAddToCart}
        disabled={isAddToCartDisabled}
        loading={isAddingItem}
        className="w-full mb-3 py-3 flex justify-center"
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
        <div className="label-sm text-secondary mb-4" title="再次点击才会加入授权清单">
          已停在确认点。
        </div>
      )}

      {user && product.seller && (
        <Chat
          user={user}
          seller={product.seller}
          buttonClassNames="w-full uppercase"
          product={product}
        />
      )}
    </div>
  )
}
