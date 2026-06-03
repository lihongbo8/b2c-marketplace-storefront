import {
  ProductDetailsFooter,
  ProductDetailsHeader,
  ProductPageDetails,
} from "@/components/cells"

import { retrieveCustomer } from "@/lib/data/customer"
import { AdditionalAttributeProps } from "@/types/product"
import { SellerProps } from "@/types/seller"
import { HttpTypes } from "@medusajs/types"

export const ProductDetails = async ({
  product,
  locale,
}: {
  product: HttpTypes.StoreProduct & {
    seller?: SellerProps
    attribute_values?: AdditionalAttributeProps[]
  }
  locale: string
}) => {
  const user = await retrieveCustomer()

  return (
    <div>
      <ProductDetailsHeader
        product={product}
        locale={locale}
        user={user}
      />
      <ProductPageDetails details={product?.description || ""} />
      <div className="my-4 grid grid-cols-3 gap-3" title="岗位授权摘要">
        <div className="rounded-sm border p-3">
          <div className="label-sm text-secondary">授权</div>
          <div className="label-md text-primary">购买后生效</div>
        </div>
        <div className="rounded-sm border p-3">
          <div className="label-sm text-secondary">费用</div>
          <div className="label-md text-primary">订单内查看</div>
        </div>
        <div className="rounded-sm border p-3">
          <div className="label-sm text-secondary">调用</div>
          <div className="label-md text-primary">确认后执行</div>
        </div>
      </div>
      <ProductDetailsFooter
        tags={product?.tags || []}
        posted={product?.created_at}
      />
    </div>
  )
}
