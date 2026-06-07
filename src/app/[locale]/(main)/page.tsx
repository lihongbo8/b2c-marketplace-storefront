import type { Metadata } from "next"
import { headers } from "next/headers"
import Script from "next/script"
import { MarketplaceAiPanel } from "@/components/organisms"
import { previewProducts } from "@/data/marketplacePreview"
import { listProducts } from "@/lib/data/products"
import { listRegions } from "@/lib/data/regions"
import { toHreflang } from "@/lib/helpers/hreflang"

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

  // Build alternates based on available regions (locales)
  let languages: Record<string, string> = {}
  try {
    const regions = await listRegions()
    const locales = Array.from(
      new Set(
        (regions || [])
          .map((r) => r.countries?.map((c) => c.iso_2) || [])
          .flat()
          .filter(Boolean)
      )
    ) as string[]

    languages = locales.reduce<Record<string, string>>((acc, code) => {
      const hrefLang = toHreflang(code)
      acc[hrefLang] = `${baseUrl}/${code}`
      return acc
    }, {})
  } catch {
    // Fallback: only current locale
    languages = { [toHreflang(locale)]: `${baseUrl}/${locale}` }
  }

  const title = "迭界AI"
  const description = "AI岗位"
  const ogImage = "/images/hero/Image.jpg"
  const canonical = `${baseUrl}/${locale}`

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title: `${title} | ${
        process.env.NEXT_PUBLIC_SITE_NAME ||
        "迭界AI"
      }`,
      description,
      url: canonical,
      siteName:
        process.env.NEXT_PUBLIC_SITE_NAME ||
        "迭界AI",
      type: "website",
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt:
            process.env.NEXT_PUBLIC_SITE_NAME ||
            "迭界AI",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`],
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  const siteName =
    process.env.NEXT_PUBLIC_SITE_NAME ||
    "迭界AI"

  const roleProducts = await listProducts({
    countryCode: locale,
    queryParams: { limit: 24 },
  })
    .then(({ response }) => response.products)
    .catch(() => previewProducts)

  const searchableRoles = roleProducts.map((product) => {
    const category = product.categories?.[0]
    const variant = product.variants?.[0]
    const amount = variant?.calculated_price?.calculated_amount
    const currency = variant?.calculated_price?.currency_code?.toUpperCase()

    return {
      title: product.title ?? "未命名岗位",
      handle: product.handle ?? "",
      category: category?.name ?? "未分类",
      summary:
        product.description ??
        category?.description ??
        "暂无简介",
      price:
        typeof amount === "number" && currency
          ? `${amount / 100} ${currency}`
          : "待确认",
    }
  })

  const statusItems = [
    {
      label: "授权",
      value: "待确认",
      title: "购买或续费会停在人工确认点",
    },
    {
      label: "执行",
      value: "可追溯",
      title: "岗位执行结果会形成安全回读",
    },
    {
      label: "费用",
      value: "可核对",
      title: "授权费和使用量进入费用摘要",
    },
    {
      label: "风险",
      value: "先拦截",
      title: "高风险动作不会自动提交",
    },
  ]
  const sideNav = [
    { label: "商城对话", href: `/${locale}` },
    { label: "岗位分类", href: `/${locale}/categories` },
    { label: "岗位商品", href: `/${locale}/categories` },
    { label: "我的授权", href: `/${locale}/user/wishlist` },
    { label: "订单记录", href: `/${locale}/user/orders` },
    { label: "费用记录", href: `/${locale}/user/orders` },
    { label: "账户设置", href: `/${locale}/user/settings` },
  ]
  const roleCategories = [
    ["软件工程师", "18"],
    ["产品经理", "9"],
    ["项目经理", "7"],
    ["设计师", "11"],
    ["数据分析师", "12"],
    ["云架构师", "6"],
    ["安全工程师", "5"],
    ["客户成功", "8"],
    ["销售经理", "4"],
    ["财务分析", "3"],
    ["法务合规", "3"],
    ["人力运营", "4"],
  ]

  return (
    <main className="row-start-2 w-full text-primary">
      {/* Organization JSON-LD */}
      <Script
        id="ld-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteName,
            url: `${baseUrl}/${locale}`,
            logo: `${baseUrl}/favicon.ico`,
          }),
        }}
      />
      {/* WebSite JSON-LD */}
      <Script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            url: `${baseUrl}/${locale}`,
            inLanguage: toHreflang(locale),
          }),
        }}
      />

      <section className="grid min-h-[calc(100vh-88px)] w-full bg-secondary lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden border-r bg-primary px-4 py-6 lg:block">
          <div className="mb-7 flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-sm bg-black text-white">
              迭
            </div>
            <div>
              <div className="heading-xs text-primary">迭界AI</div>
              <div className="label-md text-secondary">岗位商城</div>
            </div>
          </div>
          <nav className="grid gap-1" aria-label="岗位商城导航">
            {sideNav.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={`rounded-sm px-3 py-2 label-md ${
                  index === 0
                    ? "border border-rose-200 bg-rose-50 text-rose-600"
                    : "text-secondary hover:bg-secondary"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="grid gap-5 p-4 lg:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div className="label-md text-secondary">
              迭界AI <span className="px-2">›</span> 岗位商城 <span className="px-2">›</span>
              <span className="text-rose-600">商城对话</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border bg-primary px-3 py-2 label-md">使用者模式</span>
              <span className="rounded-full border bg-primary px-3 py-2 label-md">待确认 0</span>
              <span className="rounded-full border bg-primary px-3 py-2 label-md">费用待确认</span>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <MarketplaceAiPanel statusItems={statusItems} roles={searchableRoles} />
            <aside className="overflow-hidden rounded-sm border bg-primary">
              <div className="border-b px-6 py-5">
                <h2 className="heading-md text-primary">确认状态</h2>
              </div>
              <div className="divide-y">
                {statusItems.map((item) => (
                  <div key={item.label} className="flex min-h-16 items-center justify-between px-6" title={item.title}>
                    <span className="label-lg text-primary">{item.label}</span>
                    <span className="label-md text-secondary">{item.value}</span>
                  </div>
                ))}
                <div className="flex min-h-16 items-center justify-between px-6" title="下一步动作">
                  <span className="label-lg text-primary">下一步</span>
                  <span className="label-md text-secondary">选岗位</span>
                </div>
              </div>
            </aside>
          </div>

          <section className="overflow-hidden rounded-sm border bg-primary">
            <div className="border-b px-6 py-5">
              <h2 className="heading-md text-primary">岗位分类</h2>
            </div>
            <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
              {roleCategories.map(([name, count]) => (
                <a
                  key={name}
                  href={`/${locale}/categories`}
                  className="flex min-h-20 items-center justify-between rounded-sm border px-4 hover:bg-secondary"
                  title={name}
                >
                  <span className="heading-xs text-primary">{name}</span>
                  <span className="label-md text-secondary">{count}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
