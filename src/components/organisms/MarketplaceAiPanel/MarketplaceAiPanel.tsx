"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { Button, Textarea } from "@/components/atoms"

type MarketplaceAiPanelProps = {
  statusItems: Array<{
    label: string
    value: string
    title: string
  }>
}

export const MarketplaceAiPanel = ({ statusItems }: MarketplaceAiPanelProps) => {
  const router = useRouter()
  const params = useParams()
  const locale = typeof params?.locale === "string" ? params.locale : "us"
  const [draft, setDraft] = useState("")
  const [reply, setReply] = useState("待命")

  const go = (path: string, message: string) => {
    setReply(message)
    router.push(`/${locale}${path}`)
  }

  const submit = () => {
    const text = draft.trim()
    if (!text) {
      return
    }

    if (text.includes("授权") || text.includes("购买记录")) {
      go("/user/wishlist", "已进入我的授权。")
    } else if (text.includes("费用") || text.includes("付款") || text.includes("结算")) {
      go("/cart", "已进入费用确认。付款前会停在确认点。")
    } else if (text.includes("岗位") || text.includes("商城") || text.includes("找")) {
      go("/categories", "已进入岗位分类。")
    } else {
      setReply("已记录。浏览和查询可以直接执行；购买、授权和付款会等待你确认。")
    }

    setDraft("")
  }

  return (
    <div className="flex h-full min-h-[390px] flex-col overflow-hidden rounded-sm border bg-primary">
      <div className="border-b px-6 py-5">
        <h2 className="heading-md text-primary">商城对话</h2>
        <p className="mt-2 label-md text-secondary">找岗位、看授权、进确认点</p>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 py-6">
        <div className="max-w-[560px] rounded-sm border bg-secondary px-4 py-3 text-primary">
          你需要什么岗位？
        </div>
        <div className="ml-auto max-w-[520px] rounded-sm border border-rose-200 bg-rose-50 px-4 py-3 text-primary">
          找一个商品图检查岗位
        </div>
        <div className="max-w-[620px] rounded-sm border bg-secondary px-4 py-3 text-primary">
          {reply === "待命" ? "已筛选：设计师、数据分析师、软件工程师相关岗位。" : reply}
        </div>
      </div>

      <div className="flex gap-3 border-t p-4">
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="输入需求"
          rows={1}
          className="min-h-12"
        />
        <Button type="button" onClick={submit} disabled={!draft.trim()} className="h-12 px-6">
          发送
        </Button>
      </div>

      <div className="sr-only">
        {statusItems.map((item) => (
          <span key={item.label} title={item.title}>
            {item.label} {item.value}
          </span>
        ))}
      </div>
    </div>
  )
}
