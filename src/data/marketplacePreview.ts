import type { HttpTypes } from "@medusajs/types"
import type { SellerProps } from "@/types/seller"

const price = (amount: number) => ({
  calculated_amount: amount,
  calculated_amount_with_tax: amount,
  calculated_amount_without_tax: amount,
  original_amount: amount,
  original_amount_with_tax: amount,
  currency_code: "usd",
  calculated_price: {
    price_list_type: "sale",
  },
})

const seller: SellerProps = {
  id: "preview-developer",
  handle: "preview-developer",
  name: "认证开发者",
  description: "本地预览开发者",
  photo: "/images/product/seller-avatar.jpg",
  tax_id: "preview-tax-id",
  created_at: "2026-06-01T00:00:00.000Z",
  store_status: "ACTIVE",
  reviews: [],
}

export const previewRegions = [
  {
    id: "preview-region-us",
    name: "本地预览",
    currency_code: "usd",
    countries: [{ iso_2: "us", display_name: "United States" }],
  },
] as unknown as HttpTypes.StoreRegion[]

export const previewCategories = [
  {
    id: "preview-parent-business",
    handle: "business-roles",
    name: "业务岗位",
    rank: 0,
    parent_category_id: null,
    category_children: [
      { id: "preview-category-clothing", handle: "clothing", name: "软件工程师" },
      { id: "preview-category-footwear", handle: "footwear", name: "内容运营" },
      { id: "preview-category-bags", handle: "bags", name: "数据分析" },
      { id: "preview-category-accessories", handle: "accessories", name: "自动化执行" },
    ],
  },
  {
    id: "preview-parent-developer",
    handle: "developer-roles",
    name: "开发岗位",
    rank: 1,
    parent_category_id: null,
    category_children: [
      { id: "preview-category-brands", handle: "brands", name: "开发者" },
      { id: "preview-category-new-in", handle: "new-in", name: "新上架" },
      { id: "preview-category-sale", handle: "sale", name: "优惠授权" },
    ],
  },
  {
    id: "preview-category-clothing",
    handle: "clothing",
    name: "软件工程师",
    parent_category_id: "preview-parent-business",
    description: "工程交付、代码检查和自动化实现",
    category_children: [],
  },
  {
    id: "preview-category-footwear",
    handle: "footwear",
    name: "内容运营",
    parent_category_id: "preview-parent-business",
    description: "视觉检查、内容规范和交付评审",
    category_children: [],
  },
  {
    id: "preview-category-bags",
    handle: "bags",
    name: "数据分析",
    parent_category_id: "preview-parent-business",
    description: "数据核对、报表解释和指标巡检",
    category_children: [],
  },
  {
    id: "preview-category-accessories",
    handle: "accessories",
    name: "自动化执行",
    parent_category_id: "preview-parent-business",
    description: "需求整理、流程判断和验收标准",
    category_children: [],
  },
  {
    id: "preview-category-brands",
    handle: "brands",
    name: "开发者",
    parent_category_id: "preview-parent-developer",
    description: "开发者资料、合规说明和审核协作",
    category_children: [],
  },
  {
    id: "preview-category-new-in",
    handle: "new-in",
    name: "新上架",
    parent_category_id: "preview-parent-developer",
    description: "新发布岗位和待体验岗位",
    category_children: [],
  },
  {
    id: "preview-category-sale",
    handle: "sale",
    name: "优惠授权",
    parent_category_id: "preview-parent-developer",
    description: "限时授权、费用核对和结算摘要",
    category_children: [],
  },
] as unknown as HttpTypes.StoreProductCategory[]

export const previewProducts = [
  {
    id: "preview-role-image-check",
    title: "商品图检查岗位",
    handle: "image-review-role",
    thumbnail: "/images/product/Image-1.jpg",
    categories: [previewCategories.find((category) => category.handle === "clothing")],
    category_id: "preview-category-clothing",
    seller,
    variants: [
      {
        id: "preview-role-image-check-standard",
        title: "标准授权",
        calculated_price: price(399),
      },
    ],
  },
  {
    id: "preview-role-data-audit",
    title: "数据核对岗位",
    handle: "data-audit-role",
    thumbnail: "/images/product/Image-2.jpg",
    categories: [previewCategories.find((category) => category.handle === "bags")],
    category_id: "preview-category-bags",
    seller,
    variants: [
      {
        id: "preview-role-data-audit-standard",
        title: "标准授权",
        calculated_price: price(599),
      },
    ],
  },
  {
    id: "preview-role-content-ops",
    title: "内容运营岗位",
    handle: "content-ops-role",
    thumbnail: "/images/product/Image-3.jpg",
    categories: [previewCategories.find((category) => category.handle === "footwear")],
    category_id: "preview-category-footwear",
    seller,
    variants: [
      {
        id: "preview-role-content-ops-standard",
        title: "标准授权",
        calculated_price: price(299),
      },
    ],
  },
  {
    id: "preview-role-automation",
    title: "自动化执行岗位",
    handle: "automation-runner-role",
    thumbnail: "/images/home-products/product-1.jpg",
    categories: [previewCategories.find((category) => category.handle === "accessories")],
    category_id: "preview-category-accessories",
    seller,
    variants: [
      {
        id: "preview-role-automation-standard",
        title: "标准授权",
        calculated_price: price(799),
      },
    ],
  },
] as unknown as (HttpTypes.StoreProduct & {
  category_id?: string
  seller?: SellerProps
})[]
