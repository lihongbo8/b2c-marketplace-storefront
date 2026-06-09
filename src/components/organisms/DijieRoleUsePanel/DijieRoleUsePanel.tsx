"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { Button } from "@/components/atoms"
import { authorizeDijieRoleListing, startDijieCloudExecution } from "@/lib/data/dijie"
import { toast } from "@/lib/helpers/toast"

export const DijieRoleUsePanel = ({
  locale,
  roleListingId,
  entitlementId,
  entitlementSource,
  orderId,
  tokenUsageSummary,
}: {
  locale: string
  roleListingId: string
  entitlementId: string
  entitlementSource?: string
  orderId?: string | null
  tokenUsageSummary?: {
    inputTokenFee?: string
    outputTokenFee?: string
    executionFeeNote?: string
  }
}) => {
  const router = useRouter()
  const [taskText, setTaskText] = useState("我需要做一张智能门锁的主图，突出安全、便捷和远程开锁。")
  const [confirmCost, setConfirmCost] = useState(false)
  const [confirmHumanCheckpoints, setConfirmHumanCheckpoints] = useState(false)
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()

  const startExecution = () => {
    setMessage("")
    startTransition(async () => {
      let activeEntitlementId = entitlementId
      if (entitlementSource && entitlementSource !== "local_entitlement") {
        const authorization = await authorizeDijieRoleListing({
          roleListingId,
          orderId: orderId ?? entitlementId,
        })

        if (!authorization.ok) {
          const nextMessage = authorization.error || "岗位授权生成失败。"
          setMessage(nextMessage)
          toast.error({ title: nextMessage })
          return
        }
        activeEntitlementId =
          authorization.entitlementId ?? authorization.entitlement?.id ?? activeEntitlementId
      }

      const result = await startDijieCloudExecution({
        roleListingId,
        entitlementId: activeEntitlementId,
        taskText,
        confirmCost,
        confirmHumanCheckpoints,
      })

      if (!result.ok) {
        const nextMessage = result.error || "岗位执行失败。"
        setMessage(nextMessage)
        toast.error({ title: nextMessage })
        return
      }

      const target = result.executionId
        ? `/${locale}/user/executions/${encodeURIComponent(result.executionId)}`
        : `/${locale}/user/messages`
      if (result.executionStatus === "failed") {
        toast.error({ title: result.failureReason || "岗位执行未完成。" })
      } else {
        toast.success({ title: "岗位执行已完成" })
      }
      router.push(target)
      router.refresh()
    })
  }

  return (
    <div className="rounded-sm border p-5" data-testid="dijie-role-use-panel">
      <h2 className="heading-sm uppercase text-primary">直接使用岗位</h2>
      <p className="mt-2 label-md text-secondary">
        提交后可在执行记录查看结果、产物、审计状态和费用明细。
      </p>
      <div className="mt-4 grid gap-2 rounded-sm bg-secondary p-3 label-md">
        <div className="flex items-center justify-between gap-3">
          <span className="text-secondary">输入 Token 单价</span>
          <span className="text-primary">{tokenUsageSummary?.inputTokenFee ?? "未配置"}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-secondary">输出 Token 单价</span>
          <span className="text-primary">{tokenUsageSummary?.outputTokenFee ?? "未配置"}</span>
        </div>
        <p className="label-sm text-secondary">
          {tokenUsageSummary?.executionFeeNote ?? "执行费用按实际输入/输出 Token 用量结算。"}
        </p>
      </div>
      <label className="mt-5 grid gap-2">
        <span className="label-sm text-secondary">任务输入</span>
        <textarea
          value={taskText}
          onChange={(event) => setTaskText(event.target.value)}
          rows={5}
          className="w-full rounded-sm border bg-primary px-3 py-2 label-md text-primary outline-none focus:border-action"
          data-testid="dijie-role-task-text"
        />
      </label>
      <div className="mt-4 grid gap-3">
        <label className="flex items-start gap-3 label-md text-primary">
          <input
            type="checkbox"
            checked={confirmCost}
            onChange={(event) => setConfirmCost(event.target.checked)}
            className="mt-1"
            data-testid="dijie-role-confirm-cost"
          />
          <span>我已确认本次使用会记录费用和审计。</span>
        </label>
        <label className="flex items-start gap-3 label-md text-primary">
          <input
            type="checkbox"
            checked={confirmHumanCheckpoints}
            onChange={(event) => setConfirmHumanCheckpoints(event.target.checked)}
            className="mt-1"
            data-testid="dijie-role-confirm-human"
          />
          <span>我理解需要人工确认时，结果会在执行记录中提示。</span>
        </label>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="button"
          onClick={startExecution}
          loading={isPending}
          disabled={isPending || !confirmCost || !confirmHumanCheckpoints}
          data-testid="dijie-role-start-execution"
        >
          发起使用
        </Button>
        {message && (
          <p className="label-sm text-secondary" data-testid="dijie-role-use-message">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
