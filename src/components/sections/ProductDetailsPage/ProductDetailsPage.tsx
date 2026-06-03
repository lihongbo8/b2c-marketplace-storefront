import { ProductDetails, ProductGallery, UserModeDialog } from "@/components/organisms"
import { listProducts } from "@/lib/data/products"
import { HomeProductSection } from "../HomeProductSection/HomeProductSection"
import NotFound from "@/app/not-found"

export const ProductDetailsPage = async ({
  handle,
  locale,
}: {
  handle: string
  locale: string
}) => {
  const prod = await listProducts({
    countryCode: locale,
    queryParams: { handle: [handle], limit: 1 },
    forceCache: true,
  }).then(({ response }) => response.products[0])

  if (!prod) return null

  if (prod.seller?.store_status === "SUSPENDED") {
    return NotFound()
  }

  return (
    <>
      <div className="flex flex-col md:flex-row lg:gap-12" data-testid="product-details-page">
        <div className="md:w-1/2 md:px-2" data-testid="product-gallery-container">
          <ProductGallery images={prod?.images || []} />
        </div>
        <div className="md:w-1/2 md:px-2" data-testid="product-details-container">
          <ProductDetails product={prod} locale={locale} />
        </div>
      </div>
      <div className="my-8">
        <HomeProductSection
          heading="更多岗位"
          products={prod.seller?.products}
          // seller_handle={prod.seller?.handle}
          locale={locale}
        />
      </div>
      <UserModeDialog
        context={prod.title || "岗位详情"}
        status="岗位详情"
        actions={[
          { label: "我的授权", href: "/user/wishlist", title: "查看我的岗位授权" },
          { label: "查看费用", href: "/user/orders", title: "查看授权订单费用" },
          { label: "执行记录", href: "/user/messages", title: "查看岗位执行记录入口" },
          { label: "回到岗位", href: "/categories", title: "返回岗位" },
        ]}
        highRiskAction={{
          label: "购买授权",
          title: "停在确认前，不提交订单",
        }}
      />
    </>
  )
}
