import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { Suspense } from "react"

import { Breadcrumbs } from "@/components/atoms"
import { UserModeDialog } from "@/components/organisms"
import { AlgoliaProductsListing, ProductListing } from "@/components/sections"
import { getRegion } from "@/lib/data/regions"
import isBot from "@/lib/helpers/isBot"
import { headers } from "next/headers"
import type { Metadata } from "next"
import Script from "next/script"
import { listRegions } from "@/lib/data/regions"
import { listProducts } from "@/lib/data/products"
import { toHreflang } from "@/lib/helpers/hreflang"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  let languages: Record<string, string> = {}
  try {
    const regions = await listRegions()
    const locales = Array.from(
      new Set(
        (regions || []).flatMap((r) => r.countries?.map((c) => c.iso_2) || [])
      )
    ) as string[]
    languages = locales.reduce<Record<string, string>>((acc, code) => {
      acc[toHreflang(code)] = `${baseUrl}/${code}/categories`
      return acc
    }, {})
  } catch {
    languages = { [toHreflang(locale)]: `${baseUrl}/${locale}/categories` }
  }

  const title = "岗位"
  const description = "AI岗位"
  const canonical = `${baseUrl}/${locale}/categories`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { ...languages, "x-default": `${baseUrl}/categories` },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} | ${process.env.NEXT_PUBLIC_SITE_NAME || "迭界AI"}`,
      description,
      url: canonical,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || "迭界AI",
      type: "website",
    },
  }
}

const ALGOLIA_ID = process.env.NEXT_PUBLIC_ALGOLIA_ID
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
const roleCategoryLinks = [
  ["软件工程师", "clothing", "工程交付、代码检查和自动化实现"],
  ["产品经理", "accessories", "需求整理、流程判断和验收标准"],
  ["项目经理", "bags", "任务拆解、进度同步和风险提醒"],
  ["设计师", "footwear", "视觉检查、内容规范和交付评审"],
  ["数据分析师", "bags", "数据核对、报表解释和指标巡检"],
  ["云架构师", "accessories", "部署检查、成本提示和架构建议"],
  ["安全工程师", "clothing", "风险扫描、敏感信息和合规核查"],
  ["客户成功", "footwear", "客户问题分流和交接记录"],
  ["销售经理", "sale", "线索整理、报价辅助和跟进计划"],
  ["财务分析", "sale", "费用核对、授权成本和结算摘要"],
  ["法务合规", "brands", "合同条款、审核意见和风险提示"],
  ["人力运营", "new-in", "招聘筛选、入职流程和员工问答"],
]

async function AllCategories({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const ua = (await headers()).get("user-agent") || ""
  const bot = isBot(ua)

  const breadcrumbsItems = [
    {
      path: "/",
      label: "岗位",
    },
  ]

  const currency_code = (await getRegion(locale))?.currency_code || "usd"

  // Fetch a small cached list for ItemList JSON-LD
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`
  const {
    response: { products: jsonLdProducts },
  } = await listProducts({
    countryCode: locale,
    queryParams: { limit: 8, order: "created_at", fields: "id,title,handle" },
  })

  const itemList = jsonLdProducts.slice(0, 8).map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `${baseUrl}/${locale}/products/${p.handle}`,
    name: p.title,
  }))

  return (
    <main className="container">
      <Script
        id="ld-breadcrumbs-categories"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "岗位",
                item: `${baseUrl}/${locale}/categories`,
              },
            ],
          }),
        }}
      />
      <Script
        id="ld-itemlist-categories"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: itemList,
          }),
        }}
      />
      <div className="hidden md:block mb-2">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h1 className="heading-xl uppercase">岗位</h1>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/${locale}/user/wishlist`}
            className="rounded-sm border px-3 py-2 label-md text-primary"
            title="查看我的岗位授权"
          >
            我的授权
          </a>
        </div>
      </div>

      <section className="my-6 rounded-sm border bg-primary" aria-label="岗位分类">
        <div className="border-b px-5 py-4">
          <h2 className="heading-md text-primary">岗位分类</h2>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
          {roleCategoryLinks.map(([name, handle, detail]) => (
            <a
              key={name}
              href={`/${locale}/categories/${handle}`}
              className="min-h-24 rounded-sm border p-4 hover:bg-secondary"
              title={detail}
            >
              <span className="heading-xs text-primary">{name}</span>
              <span className="mt-2 block label-md text-secondary">{detail}</span>
            </a>
          ))}
        </div>
      </section>

      <Suspense fallback={<div data-testid="all-categories-page-loading"><ProductListingSkeleton /></div>}>
        {bot || !ALGOLIA_ID || !ALGOLIA_SEARCH_KEY ? (
          <ProductListing showSidebar locale={locale} />
        ) : (
          <AlgoliaProductsListing
            locale={locale}
            currency_code={currency_code}
          />
        )}
      </Suspense>
      <UserModeDialog
        context="岗位"
        actions={[
          { label: "筛选", href: "/categories", title: "回到岗位筛选入口" },
          { label: "我的授权", href: "/user/wishlist", title: "查看我的岗位授权" },
        ]}
      />
    </main>
  )
}

export default AllCategories
