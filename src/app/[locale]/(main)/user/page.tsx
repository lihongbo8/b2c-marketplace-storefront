import { UserNavigation } from "@/components/molecules"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { UserModeDialog } from "@/components/organisms"
import { retrieveCustomer } from "@/lib/data/customer"
import { redirect } from "next/navigation"

export default async function UserPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const user = await retrieveCustomer()

  if (!user) {
    redirect(`/${locale}/login`)
  }
  
  return (
    <main className="container">
      <div className="grid grid-cols-1 md:grid-cols-4 mt-6 gap-5 md:gap-8">
        <UserNavigation />
        <div className="md:col-span-3">
          <h1 className="heading-xl uppercase">商城账户</h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "我的授权", href: "/user/wishlist", title: "查看岗位授权" },
              { label: "费用记录", href: "/user/orders", title: "查看授权费用" },
              { label: "执行记录", href: "/user/messages", title: "查看岗位执行记录入口" },
              { label: "授权变更", href: "/user/returns", title: "查看授权变更" },
              { label: "账号设置", href: "/user/settings", title: "管理账号资料" },
            ].map((item) => (
              <LocalizedClientLink
                key={item.label}
                href={item.href}
                title={item.title}
                className="rounded-sm border p-4 label-md text-primary hover:bg-action-secondary-hover"
              >
                {item.label}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </div>
      <UserModeDialog
        context="商城账户"
        actions={[
          { label: "我的授权", href: "/user/wishlist", title: "查看岗位授权" },
          { label: "费用记录", href: "/user/orders", title: "查看授权费用" },
          { label: "执行记录", href: "/user/messages", title: "查看岗位执行记录入口" },
          { label: "授权变更", href: "/user/returns", title: "查看授权变更" },
          { label: "账号设置", href: "/user/settings", title: "管理账号资料" },
        ]}
      />
    </main>
  )
}
