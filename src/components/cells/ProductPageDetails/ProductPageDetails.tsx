import { ProductPageAccordion } from "@/components/molecules"

const toPlainText = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()

export const ProductPageDetails = ({ details }: { details: string }) => {
  if (!details) return null

  const plainDetails = toPlainText(details)

  return (
    <ProductPageAccordion heading="适用场景" defaultOpen={false} data-testid="product-details-section">
      <div
        className="label-md text-secondary"
        title={plainDetails}
        data-testid="product-details-content"
      >
        查看摘要
      </div>
    </ProductPageAccordion>
  )
}
