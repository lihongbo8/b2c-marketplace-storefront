import Link from "next/link"

import type { DijieDialogSession, DijieLedgerEntry } from "@/lib/data/dijie"
import { formatDijieSubject } from "@/lib/dijie-format"

export const UserMessagesSection = ({
  ledgerEntries = [],
  dialogSessions = [],
  locale = "us",
}: {
  ledgerEntries?: DijieLedgerEntry[]
  dialogSessions?: DijieDialogSession[]
  locale?: string
}) => {
  const executionEntries = ledgerEntries.filter((entry) => entry.executionId || entry.source === "role_usage")

  return (
    <div className="max-w-[760px] rounded-sm border p-6" data-testid="user-messages-safe-summary">
      <h2 className="heading-sm uppercase text-primary">记录摘要</h2>
      <p className="mt-3 label-md text-secondary">
        执行记录仅显示授权调用、费用关联、对话会话和状态摘要；内部提示词、密钥和本地路径不会展示。
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-sm bg-action-secondary p-4">
          <p className="label-sm text-secondary">授权调用</p>
          <p className="mt-1 label-lg text-primary">{executionEntries.length || "待同步"}</p>
        </div>
        <div className="rounded-sm bg-action-secondary p-4">
          <p className="label-sm text-secondary">费用关联</p>
          <p className="mt-1 label-lg text-primary">{ledgerEntries.length || "待同步"}</p>
        </div>
        <div className="rounded-sm bg-action-secondary p-4">
          <p className="label-sm text-secondary">对话会话</p>
          <p className="mt-1 label-lg text-primary">{dialogSessions.length || "待同步"}</p>
        </div>
      </div>
      {executionEntries.length > 0 && (
        <div className="mt-6 space-y-3" data-testid="user-execution-ledger-list">
          {executionEntries.slice(0, 6).map((entry) => (
            <div key={entry.id} className="rounded-sm bg-secondary p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="label-sm text-secondary">执行编号</p>
                  <p className="mt-1 truncate label-md text-primary">{entry.executionId ?? "未生成"}</p>
                </div>
                <div className="label-md text-primary">
                  {(entry.grossAmountCents / 100).toFixed(2)} {entry.currency}
                </div>
              </div>
              <p className="mt-2 label-sm text-secondary">
                {formatDijieSubject(entry.subject, entry.roleListingId || "岗位执行费用记录")}
              </p>
              {entry.executionId && (
                <Link
                  href={`/${locale}/user/executions/${encodeURIComponent(entry.executionId)}`}
                  className="mt-3 inline-flex h-9 items-center justify-center rounded-sm bg-action px-3 label-sm text-action-on-primary"
                >
                  查看读回
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
      {dialogSessions.length > 0 && (
        <div className="mt-6 space-y-3" data-testid="user-dialog-session-list">
          <h3 className="label-lg text-primary">最近对话</h3>
          {dialogSessions.slice(0, 4).map((session) => (
            <div key={session.id} className="rounded-sm bg-secondary p-4">
              <p className="label-md text-primary">{session.title || "使用者对话"}</p>
              <p className="mt-1 label-sm text-secondary">
                {session.surface} · {session.mode} · {session.lastMessageAt ? new Date(session.lastMessageAt).toLocaleDateString("zh-CN") : "未知时间"}
              </p>
            </div>
          ))}
        </div>
      )}
      {executionEntries.length === 0 && dialogSessions.length === 0 && (
        <p className="mt-4 label-sm text-secondary">
          暂无可显示的执行摘要；正式执行后这里应从迭界AI账本和会话记录同步。
        </p>
      )}
    </div>
  )
}
