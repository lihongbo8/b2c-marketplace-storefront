"use client"

import { HttpTypes } from "@medusajs/types"

import { Chip } from "@/components/atoms"
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams"

const optionLabels: Record<string, string> = {
  size: "岗位类型",
  color: "运行方式",
  condition: "授权状态",
}

export const ProductVariants = ({
  product,
  selectedVariant,
}: {
  product: HttpTypes.StoreProduct
  selectedVariant: Record<string, string>
}) => {
  const updateSearchParams = useUpdateSearchParams()

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    if (value) updateSearchParams(optionId, value)
  }

  return (
    <div className="my-4 space-y-2" data-testid="product-variants">
      {(product.options || []).map(
        ({ id, title, values }: HttpTypes.StoreProductOption) => {
          const optionKey = title.toLowerCase()
          const label = optionLabels[optionKey] || title

          return (
          <div key={id} data-testid={`product-variant-${optionKey}`}>
            <span className="label-md text-secondary">{label}: </span>
            <span className="label-md text-primary" data-testid={`product-variant-selected-${optionKey}`}>
              {selectedVariant[optionKey]}
            </span>
            <div className="flex gap-2 mt-2" data-testid={`product-variant-options-${optionKey}`}>
              {(values || []).map(
                ({
                  id,
                  value,
                }: Partial<HttpTypes.StoreProductOptionValue>) => (
                  <Chip
                    key={id}
                    selected={selectedVariant[optionKey] === value}
                    color={optionKey === "color"}
                    value={value}
                    onSelect={() =>
                      setOptionValue(optionKey, value || "")
                    }
                    data-testid={`product-variant-chip-${optionKey}-${value?.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                )
              )}
            </div>
          </div>
        )}
      )}
    </div>
  )
}
