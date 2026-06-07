"use client"

import { KeyboardEvent, useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { Button, Textarea } from "@/components/atoms"

type MarketplaceAiPanelProps = {
  statusItems: Array<{
    label: string
    value: string
    title: string
  }>
  roles: RoleSearchItem[]
}

type RoleSearchItem = {
  title: string
  handle: string
  category: string
  summary: string
  price: string
}

const stopWords = [
  "有没有",
  "有",
  "没有",
  "哪些",
  "什么",
  "一下",
  "帮我",
  "我想",
  "需要",
  "岗位",
  "商城",
  "吗",
  "呢",
  "？",
  "?",
]

const synonyms: Record<string, string[]> = {
  美工: ["美工", "设计", "视觉", "图片", "商品图", "内容", "修图", "作图", "海报"],
  设计: ["设计", "视觉", "图片", "商品图", "内容", "修图", "作图", "海报"],
  修图: ["修图", "图片", "商品图", "视觉", "美工", "设计"],
  图片: ["图片", "商品图", "视觉", "内容", "美工", "设计"],
  数据: ["数据", "核对", "报表", "指标"],
  内容: ["内容", "运营", "文案", "视觉"],
  自动化: ["自动化", "执行", "流程"],
}

const normalizeQuery = (value: string) =>
  stopWords.reduce((current, word) => current.replaceAll(word, " "), value).replace(/\s+/g, " ").trim()

const roleSearchText = (role: RoleSearchItem) =>
  `${role.title} ${role.category} ${role.summary}`.toLowerCase()

const searchRoles = (roles: RoleSearchItem[], query: string) => {
  const normalized = normalizeQuery(query)
  const queryTerms = normalized.split(" ").filter(Boolean)
  const expandedTerms = new Set(queryTerms)

  queryTerms.forEach((term) => {
    Object.entries(synonyms).forEach(([key, values]) => {
      if (term.includes(key) || values.some((value) => term.includes(value))) {
        values.forEach((value) => expandedTerms.add(value))
      }
    })
  })

  return roles
    .map((role) => {
      const searchable = roleSearchText(role)
      const exactTitle = normalized && role.title.includes(normalized)
      const score =
        (exactTitle ? 8 : 0) +
        Array.from(expandedTerms).reduce((total, term) => {
          if (!term) return total
          if (role.title.includes(term)) return total + 4
          if (role.category.includes(term)) return total + 3
          if (searchable.includes(term.toLowerCase())) return total + 2
          return total
        }, 0)

      return { role, score, exactTitle }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
}

const formatRoleList = (roles: RoleSearchItem[]) =>
  roles
    .slice(0, 3)
    .map((role) => `「${role.title}」(${role.category}，${role.price})`)
    .join("、")

export const MarketplaceAiPanel = ({ statusItems, roles }: MarketplaceAiPanelProps) => {
  const router = useRouter()
  const params = useParams()
  const locale = typeof params?.locale === "string" ? params.locale : "us"
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [draft, setDraft] = useState("")
  const [messages, setMessages] = useState([
    { author: "assistant", body: "你需要什么岗位？" },
    { author: "user", body: "找一个商品图检查岗位" },
    { author: "assistant", body: "已找到商品图检查岗位。你可以查看详情、授权记录和费用确认；购买和授权会停在人工确认点。" },
  ])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" })
  }, [messages])

  const go = (path: string, message: string) => {
    setMessages((current) => [...current, { author: "assistant", body: message }])
    router.push(`/${locale}${path}`)
  }

  const reply = (message: string) => {
    setMessages((current) => [...current, { author: "assistant", body: message }])
  }

  const submit = () => {
    const text = draft.trim()
    if (!text) {
      return
    }

    setMessages((current) => [...current, { author: "user", body: text }])

    const wantsNavigation = text.includes("打开") || text.includes("进入") || text.includes("跳转")
    const results = searchRoles(roles, text)
    const asksAllRoles =
      text.includes("有哪些岗位") ||
      text.includes("所有岗位") ||
      text.includes("全部岗位") ||
      text.includes("岗位列表")

    if (text.includes("授权") || text.includes("购买记录")) {
      if (wantsNavigation) {
        go("/user/wishlist", "已进入我的授权。")
      } else {
        reply("授权记录在「我的授权」里。你也可以问我某个岗位是否已经授权。")
      }
    } else if (text.includes("费用") || text.includes("付款") || text.includes("结算")) {
      if (wantsNavigation) {
        go("/cart", "已进入费用确认。付款前会停在确认点。")
      } else {
        reply("费用确认会在付款前停住。当前商品图检查岗位授权费为 0 CNY，模型调用费以后端实际执行记录为准。")
      }
    } else if (text.includes("岗位") || text.includes("商城") || text.includes("找")) {
      if (results.length > 0 && wantsNavigation && results[0].role.handle) {
        go(`/products/${results[0].role.handle}`, `已打开最接近的岗位：${results[0].role.title}。`)
      } else if (wantsNavigation) {
        go("/categories", "已进入岗位分类。")
      } else if (asksAllRoles) {
        reply(`我查了当前商城 ${roles.length} 个岗位：${formatRoleList(roles)}。`)
      } else if (results.length > 0) {
        const hasExact = results.some((result) => result.exactTitle)
        reply(
          hasExact
            ? `我查了当前商城 ${roles.length} 个岗位，找到：${formatRoleList(results.map((result) => result.role))}。`
            : `我查了当前商城 ${roles.length} 个岗位，没有精确匹配这个名称。最接近的是：${formatRoleList(results.map((result) => result.role))}。`,
        )
      } else {
        reply(`我查了当前商城 ${roles.length} 个岗位，暂时没有匹配这个需求的岗位。你可以换个关键词，或进入全部岗位查看。`)
      }
    } else {
      reply("已记录。现在商城对话先做岗位咨询和入口引导；购买、授权和付款会等待你确认。")
    }

    setDraft("")
  }

  const handleDraftKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return
    }

    event.preventDefault()
    submit()
  }

  return (
    <div className="flex h-[520px] max-h-[70vh] min-h-[390px] flex-col overflow-hidden rounded-sm border bg-primary">
      <div className="shrink-0 border-b px-6 py-5">
        <h2 className="heading-md text-primary">商城对话</h2>
        <p className="mt-2 label-md text-secondary">找岗位、看授权、进确认点</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-6">
        {messages.map((message, index) => (
          <div
            key={`${message.author}-${index}`}
            className={
              message.author === "user"
                ? "ml-auto max-w-[520px] rounded-sm border border-rose-200 bg-rose-50 px-4 py-3 text-primary"
                : "max-w-[620px] rounded-sm border bg-secondary px-4 py-3 text-primary"
            }
          >
            {message.body}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex shrink-0 gap-3 border-t p-4">
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleDraftKeyDown}
          placeholder="输入需求"
          rows={1}
          className="max-h-24 min-h-12 resize-none"
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
