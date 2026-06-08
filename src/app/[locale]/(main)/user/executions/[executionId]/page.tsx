import Link from "next/link"
import { redirect } from "next/navigation"

import { UserNavigation } from "@/components/molecules"
import { UserModeDialog } from "@/components/organisms"
import { retrieveCustomer } from "@/lib/data/customer"
import { getDijieExecutionReadback } from "@/lib/data/dijie"

const formatMoney = (cents?: number, currency = "CNY") =>
  `${((cents ?? 0) / 100).toFixed(2)} ${currency}`

const formatTokenFee = (cents?: number, currency = "CNY") =>
  Number.isFinite(cents) ? `¥${((cents ?? 0) / 100).toFixed(2)}/百万 Token` : "未配置"

export default async function ExecutionReadbackPage({
  params,
}: {
  params: Promise<{ locale: string; executionId: string }>
}) {
  const user = await retrieveCustomer()
  const { locale, executionId } = await params

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const readback = await getDijieExecutionReadback(executionId)
  const roleTokenPricing = readback?.execution?.roleTokenPricing
  const tokenCurrency = roleTokenPricing?.currency ?? readback?.ledger?.currency ?? "CNY"

  return (
    <main className="container" data-testid="dijie-execution-readback-page">
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-8">
        <UserNavigation />
        <div className="space-y-6 md:col-span-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="label-sm text-secondary">执行读回</p>
              <h1 className="mt-1 heading-md uppercase text-primary">岗位执行结果</h1>
              <p className="mt-2 break-all label-md text-secondary">{executionId}</p>
            </div>
            <Link
              href={`/${locale}/user/messages`}
              className="inline-flex h-10 items-center justify-center rounded-sm bg-action-secondary px-4 label-md text-action-on-secondary"
            >
              返回执行记录
            </Link>
          </div>

          {!readback ? (
            <div className="rounded-sm border p-6" data-testid="dijie-execution-readback-empty">
              <h2 className="heading-sm uppercase text-primary">无法读取该执行</h2>
              <p className="mt-3 label-md text-secondary">
                该执行可能不存在，或当前账号没有读取权限。
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-sm bg-secondary p-4">
                  <p className="label-sm text-secondary">状态</p>
                  <p className="mt-1 label-md text-primary">{readback.status ?? readback.execution?.status ?? "未知"}</p>
                </div>
                <div className="rounded-sm bg-secondary p-4">
                  <p className="label-sm text-secondary">岗位</p>
                  <p className="mt-1 truncate label-md text-primary">
                    {readback.roleListingId ?? readback.execution?.roleListingId ?? "未标注"}
                  </p>
                </div>
                <div className="rounded-sm bg-secondary p-4">
                  <p className="label-sm text-secondary">业务产物</p>
                  <p className="mt-1 label-md text-primary">{readback.artifacts?.length ?? 0} 个</p>
                </div>
                <div className="rounded-sm bg-secondary p-4">
                  <p className="label-sm text-secondary">费用</p>
                  <p className="mt-1 label-md text-primary">
                    {readback.ledger
                      ? formatMoney(readback.ledger.developerReceivableCents, readback.ledger.currency)
                      : "未产生费用"}
                  </p>
                </div>
              </div>

              {readback.failureReason && (
                <div className="rounded-sm border p-5" data-testid="dijie-execution-failure">
                  <h2 className="heading-sm uppercase text-primary">失败原因</h2>
                  <p className="mt-3 label-md text-secondary">{readback.failureReason}</p>
                </div>
              )}

              <div className="rounded-sm border p-5" data-testid="dijie-execution-artifacts">
                <h2 className="heading-sm uppercase text-primary">业务产物</h2>
                {(readback.artifacts ?? []).length > 0 ? (
                  <div className="mt-4 grid gap-3">
                    {readback.artifacts?.map((artifact) => (
                      <div key={artifact.id} className="rounded-sm bg-secondary p-4">
                        <p className="label-md text-primary">{artifact.title}</p>
                        <p className="mt-1 label-sm text-secondary">
                          {artifact.type}
                          {artifact.sizeBytes ? ` · ${artifact.sizeBytes} 字节` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 label-md text-secondary">本次执行没有业务产物。</p>
                )}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-sm border p-5" data-testid="dijie-execution-audit">
                  <h2 className="heading-sm uppercase text-primary">审计</h2>
                  <div className="mt-3 grid gap-2 label-md text-secondary">
                    <p className="break-all">审计编号：{readback.auditRecordId ?? "未返回"}</p>
                    <p>状态：{readback.audit?.status ?? "未知"}</p>
                    <p>收到时间：{readback.audit?.receivedAt ? new Date(readback.audit.receivedAt).toLocaleString("zh-CN") : "未知"}</p>
                    <p>文件变更：{readback.audit?.changedFiles?.length ?? 0}</p>
                  </div>
                </section>
                <section className="rounded-sm border p-5" data-testid="dijie-execution-ledger">
                  <h2 className="heading-sm uppercase text-primary">账本</h2>
                  {readback.ledger ? (
                    <div className="mt-3 grid gap-2 label-md text-secondary">
                      <p>来源：岗位使用</p>
                      <p>
                        输入单价：
                        {formatTokenFee(roleTokenPricing?.inputTokenCentsPerMillion, tokenCurrency)}
                      </p>
                      <p>
                        输出单价：
                        {formatTokenFee(roleTokenPricing?.outputTokenCentsPerMillion, tokenCurrency)}
                      </p>
                      <p>输入量：{readback.ledger.inputTokens ?? 0}</p>
                      <p>输出量：{readback.ledger.outputTokens ?? 0}</p>
                      <p>费用金额：{formatMoney(readback.ledger.developerReceivableCents, readback.ledger.currency)}</p>
                    </div>
                  ) : (
                    <p className="mt-3 label-md text-secondary">失败或未产生计费用量时不生成费用记录。</p>
                  )}
                </section>
              </div>
            </>
          )}
        </div>
      </div>
      <UserModeDialog
        context="执行读回"
        actions={[
          { label: "我的授权", href: "/user/wishlist", title: "查看岗位授权" },
          { label: "执行记录", href: "/user/messages", title: "查看岗位执行记录" },
          { label: "费用记录", href: "/user/orders", title: "查看费用记录" },
          { label: "账号设置", href: "/user/settings", title: "管理账号资料" },
        ]}
      />
    </main>
  )
}
