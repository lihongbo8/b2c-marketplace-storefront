import { LoginForm, ProfileDetails } from "@/components/molecules"
import { UserNavigation } from "@/components/molecules"
import { ProfilePassword } from "@/components/molecules/ProfileDetails/ProfilePassword"
import { UserModeDialog } from "@/components/organisms"
import { retrieveCustomer } from "@/lib/data/customer"

export default async function SettingsPage() {
  const user = await retrieveCustomer()

  if (!user) return <LoginForm />

  return (
    <main className="container" data-testid="profile-settings-page">
      <div className="grid grid-cols-1 md:grid-cols-4 mt-6 gap-5 md:gap-8">
        <UserNavigation />
        <div className="md:col-span-3" data-testid="profile-settings-container">
          <h1 className="heading-md uppercase mb-8">账号设置</h1>
          <ProfileDetails user={user} />
          <ProfilePassword user={user} />
        </div>
      </div>
      <UserModeDialog
        context="账号设置"
        actions={[
          { label: "我的授权", href: "/user/wishlist", title: "查看岗位授权" },
          { label: "费用记录", href: "/user/orders", title: "查看授权费用" },
          { label: "执行记录", href: "/user/messages", title: "查看岗位执行记录入口" },
          { label: "授权变更", href: "/user/returns", title: "查看授权变更" },
        ]}
      />
    </main>
  )
}
