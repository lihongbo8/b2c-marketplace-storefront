"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/atoms"
import { Modal } from "@/components/molecules"
import { AlertIcon, ArrowRightIcon, AwardIcon } from "@/icons"
import { cn } from "@/lib/utils"

type UserModeAction = {
  label: string
  title: string
  type?: "navigate" | "show_summary" | "prepare_confirmation" | "sync_status"
  risk?: "low" | "high"
  href?: string
  status?: string
  summary?: string
  requiresHumanConfirm?: boolean
  disabled?: boolean
}

export const UserModeDialog = ({
  context,
  status = "可操作",
  actions,
  highRiskAction,
  className,
}: {
  context: string
  status?: string
  actions: UserModeAction[]
  highRiskAction?: UserModeAction
  className?: string
}) => {
  const router = useRouter()
  const params = useParams()
  const locale = typeof params?.locale === "string" ? params.locale : "en"
  const [open, setOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const openDialog = () => {
    setPendingAction(null)
    setResult(null)
    setOpen(true)
  }

  const executeAction = (action: UserModeAction) => {
    if (action.disabled) {
      return
    }

    const type = action.type ?? (action.href ? "navigate" : "show_summary")
    const highRisk = action.risk === "high" || action.requiresHumanConfirm
    if (highRisk || type === "prepare_confirmation") {
      setPendingAction(action.label)
      setResult(action.summary ?? "已准备，等待确认。")
      return
    }

    if (type === "navigate" && action.href) {
      router.push(`/${locale}${action.href}`)
      setOpen(false)
      return
    }

    if (type === "sync_status") {
      setResult(action.summary ?? "状态已刷新。")
      return
    }

    setResult(action.summary ?? action.status ?? "已完成。")
  }

  return (
    <>
      <Button
        type="button"
        variant="tonal"
        onClick={openDialog}
        className={cn("fixed bottom-5 right-5 z-20 flex items-center gap-2 shadow-lg", className)}
        title="打开当前页面的商城操作入口"
        data-testid="user-mode-dialog-trigger"
      >
        <AwardIcon size={16} />
        操作入口
      </Button>
      {open && (
        <Modal
          heading="操作入口"
          onClose={() => setOpen(false)}
          data-testid="user-mode-dialog"
        >
          <div className="space-y-4 px-4">
            <div className="rounded-sm border p-4" title="当前页面">
              <div className="label-md text-secondary">当前页面</div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <div className="heading-sm truncate text-primary">{context}</div>
                <span className="label-sm rounded-sm bg-action-secondary px-2 py-1 text-action-on-secondary">
                  {status}
                </span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2" title="可用入口">
              {actions.map((action) => {
                const content = (
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="truncate">{action.label}</span>
                    {action.status ? (
                      <span className="label-sm text-secondary">{action.status}</span>
                    ) : (
                      <ArrowRightIcon size={16} />
                    )}
                  </span>
                )

                return (
                  <button
                    key={action.label}
                    type="button"
                    disabled={action.disabled}
                    title={action.title}
                    onClick={() => executeAction(action)}
                    className="rounded-sm border px-3 py-2 text-left text-primary disabled:bg-disabled disabled:text-disabled"
                    data-testid="user-mode-dialog-action-button"
                  >
                    {content}
                  </button>
                )
              })}
            </div>

            {highRiskAction && (
              <div className="rounded-sm border p-3" title={highRiskAction.title}>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={highRiskAction.disabled}
                  onClick={() => executeAction({
                    ...highRiskAction,
                    type: "prepare_confirmation",
                    risk: "high",
                    requiresHumanConfirm: true,
                  })}
                  className="flex w-full items-center justify-center gap-2"
                  data-testid="user-mode-dialog-risk-action"
                >
                  <AlertIcon size={16} color="#fff" />
                  {highRiskAction.label}
                </Button>
                {pendingAction && (
                  <div
                    className="mt-3 flex items-center justify-between gap-3 rounded-sm bg-action-secondary px-3 py-2"
                    data-testid="user-mode-dialog-pending-confirmation"
                  >
                    <span className="label-md text-primary truncate">{pendingAction}</span>
                    <span className="label-sm text-secondary">待确认</span>
                  </div>
                )}
              </div>
            )}

            {result && (
              <div
                className="flex items-center justify-between gap-3 rounded-sm bg-action-secondary px-3 py-2"
                data-testid="user-mode-dialog-action-result"
              >
                <span className="label-md text-primary truncate">{result}</span>
                <span className="label-sm text-secondary">{pendingAction ? "待确认" : "完成"}</span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
