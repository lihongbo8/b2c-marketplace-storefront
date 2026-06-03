import { ProductDetails, UserModeDialog } from "@/components/organisms"
import { listProducts } from "@/lib/data/products"
import { HomeProductSection } from "../HomeProductSection/HomeProductSection"
import NotFound from "@/app/not-found"
import Link from "next/link"

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
      <div data-testid="product-details-page">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 label-md">
          <div className="flex flex-wrap items-center gap-2 text-secondary">
            <Link href={`/${locale}`} className="hover:text-primary" title="返回岗位商城">
              返回岗位商城
            </Link>
            <span>/</span>
            <Link href={`/${locale}/categories`} className="hover:text-primary" title="查看全部岗位">
              全部岗位
            </Link>
            <span>/</span>
            <span className="text-primary">{prod.title}</span>
          </div>
          <Link
            href={`/${locale}/categories`}
            className="text-secondary hover:text-primary"
            title="继续浏览岗位"
          >
            继续浏览岗位
          </Link>
        </div>
        <ProductDetails product={prod} locale={locale} />
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
