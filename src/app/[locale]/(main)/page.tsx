import type { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import Script from "next/script"
import { MarketplaceAiPanel } from "@/components/organisms"
import { DijieRoleAuthorizationButton } from "@/components/organisms/DijieRoleAuthorizationButton/DijieRoleAuthorizationButton"
import { retrieveCustomer } from "@/lib/data/customer"
import { listDijieInstalledRoles, listDijiePublicRoles } from "@/lib/data/dijie"
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
          .map((r) => r.countries?.map((c: { iso_2?: string }) => c.iso_2) || [])
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

  const [dijieRoles, customer] = await Promise.all([
    listDijiePublicRoles(),
    retrieveCustomer(),
  ])
  const installedRoles = customer ? await listDijieInstalledRoles() : []
  const authorizedRoleIds = new Set(installedRoles.map((item) => item.role.id))
  const formatRoleFee = (cents?: number, currency = "CNY") =>
    typeof cents === "number" && Number.isFinite(cents)
      ? `${(cents / 100).toFixed(2)} ${currency}`
      : "费用待确认"

  const searchableRoles = dijieRoles.map((role) => ({
    id: role.id,
    title: role.title ?? "未命名岗位",
    handle: role.handle ?? role.id,
    category: role.capabilities?.[0] ?? "已审核岗位",
    summary: role.subtitle ?? role.description ?? "暂无简介",
    price: formatRoleFee(
      role.authorizationSummary?.authorizationFeeCents ?? role.pricing?.authorizationFeeCents,
      role.authorizationSummary?.currency ?? role.pricing?.currency ?? "CNY",
    ),
  }))

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
    { label: "费用记录", href: `/${locale}/user/orders` },
    { label: "账户设置", href: `/${locale}/user/settings` },
  ]
  const roleCategories = [
    ["电商美工", "主图、详情页、视觉巡检"],
    ["数据核对", "表格、指标、异常摘要"],
    ["内容运营", "文案、卖点、发布检查"],
    ["自动化执行", "授权后进入正式执行链路"],
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
              <span className="rounded-full border bg-primary px-3 py-2 label-md">已上架 {dijieRoles.length}</span>
              <span className="rounded-full border bg-primary px-3 py-2 label-md">费用待确认</span>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <MarketplaceAiPanel
              statusItems={statusItems}
              roles={searchableRoles}
              isAuthenticated={Boolean(customer)}
              loginPath={`/${locale}/login?sessionRequired=true`}
            />
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
              {roleCategories.map(([name, detail]) => (
                <a
                  key={name}
                  href={`/${locale}/categories`}
                  className="min-h-20 rounded-sm border px-4 py-4 hover:bg-secondary"
                  title={name}
                >
                  <span className="heading-xs text-primary">{name}</span>
                  <span className="mt-2 block label-md text-secondary">{detail}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-sm border bg-primary" data-testid="dijie-home-approved-roles">
            <div className="flex flex-col gap-2 border-b px-6 py-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="heading-md text-primary">已审核岗位</h2>
                <p className="mt-1 label-md text-secondary">只展示 approved + published 的可授权岗位。</p>
              </div>
              <span className="label-md text-secondary">{dijieRoles.length} 个岗位</span>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              {dijieRoles.length > 0 ? (
                dijieRoles.map((role) => (
                  <article key={role.id} className="rounded-sm border p-4" data-testid={`dijie-home-role-${role.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="label-sm text-secondary">审核通过 · 可授权</p>
                        <h3 className="mt-1 heading-sm text-primary">{role.title}</h3>
                        {role.subtitle && <p className="mt-2 label-md text-secondary">{role.subtitle}</p>}
                      </div>
                      <span className="shrink-0 rounded-sm bg-action-secondary px-2 py-1 label-sm text-action-on-secondary">
                        {authorizedRoleIds.has(role.id) ? "已授权" : "可授权"}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(role.capabilities ?? []).slice(0, 4).map((capability) => (
                        <span key={capability} className="rounded-sm border px-2 py-1 label-sm text-secondary">
                          {capability}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                      <span className="label-md text-primary">
                        {formatRoleFee(
                          role.authorizationSummary?.authorizationFeeCents ?? role.pricing?.authorizationFeeCents,
                          role.authorizationSummary?.currency ?? role.pricing?.currency ?? "CNY",
                        )}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/${locale}/roles/${encodeURIComponent(role.id)}`}
                          className="rounded-sm border px-3 py-2 label-md text-primary"
                        >
                          查看详情
                        </Link>
                        <DijieRoleAuthorizationButton
                          roleListingId={role.id}
                          locale={locale}
                          authorizationFeeCents={
                            role.authorizationSummary?.authorizationFeeCents ?? role.pricing?.authorizationFeeCents
                          }
                          initiallyAuthorized={authorizedRoleIds.has(role.id)}
                        />
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-sm border p-5 label-md text-secondary">暂无已审核可授权岗位。</div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
