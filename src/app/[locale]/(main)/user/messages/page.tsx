import { LoginForm } from "@/components/molecules/LoginForm/LoginForm"
import { UserNavigation } from "@/components/molecules/UserNavigation/UserNavigation"
import { UserModeDialog } from "@/components/organisms"
import { UserMessagesSection } from "@/components/sections/UserMessagesSection/UserMessagesSection"
import { retrieveCustomer } from "@/lib/data/customer"
import { listDijieDialogSessions, listDijieLedgerEntries } from "@/lib/data/dijie"

export default async function MessagesPage() {
  const user = await retrieveCustomer()

  if (!user) return <LoginForm />
  const [ledgerEntries, dialogSessions] = await Promise.all([
    listDijieLedgerEntries(),
    listDijieDialogSessions("user_center"),
  ])

  return (
    <main className="container">
      <div className="grid grid-cols-1 md:grid-cols-4 mt-6 gap-5 md:gap-8">
        <UserNavigation />
        <div className="md:col-span-3 space-y-8">
          <h1 className="heading-md uppercase">执行记录</h1>
          <UserMessagesSection ledgerEntries={ledgerEntries} dialogSessions={dialogSessions} />
        </div>
      </div>
      <UserModeDialog
        context="执行记录"
        actions={[
          { label: "我的授权", href: "/user/wishlist", title: "查看岗位授权" },
          { label: "费用记录", href: "/user/orders", title: "查看授权费用" },
          { label: "授权变更", href: "/user/returns", title: "查看授权变更" },
          { label: "账号设置", href: "/user/settings", title: "管理账号资料" },
        ]}
      />
    </main>
  )
}
