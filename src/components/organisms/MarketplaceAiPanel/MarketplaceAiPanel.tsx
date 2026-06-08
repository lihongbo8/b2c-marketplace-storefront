"use client"

import { KeyboardEvent, useEffect, useRef, useState, useTransition } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { Button, Textarea } from "@/components/atoms"
import { sendDijieBuyerStorefrontMessage, type DijieBuyerDialogResult } from "@/lib/data/dijie"

type MarketplaceAiPanelProps = {
  statusItems: Array<{
    label: string
    value: string
    title: string
  }>
  roles: RoleSearchItem[]
  isAuthenticated: boolean
  loginPath: string
}

type RoleSearchItem = {
  id: string
  title: string
  handle: string
  category: string
  summary: string
  price: string
}

type Message = {
  author: "assistant" | "user"
  body: string
  actions?: NonNullable<DijieBuyerDialogResult["actions"]>
}

const normalizeActionPath = (path: string | undefined, locale: string) => {
  if (!path) {
    return `/${locale}/categories`
  }
  if (path.startsWith(`/${locale}/`)) {
    return path
  }
  if (path.startsWith("/us/")) {
    return `/${locale}${path.slice(3)}`
  }
  if (path.startsWith("/")) {
    return `/${locale}${path}`
  }
  return `/${locale}/${path}`
}

export const MarketplaceAiPanel = ({
  statusItems,
  roles,
  isAuthenticated,
  loginPath,
}: MarketplaceAiPanelProps) => {
  const params = useParams()
  const locale = typeof params?.locale === "string" ? params.locale : "us"
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [draft, setDraft] = useState("")
  const [sessionId, setSessionId] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()
  const [messages, setMessages] = useState<Message[]>([
    {
      author: "assistant",
      body: isAuthenticated
        ? "你需要什么岗位？我只根据已审核上架岗位给出推荐、解释和授权入口。"
        : "请先登录后咨询商城助手。登录后我只根据已审核上架岗位给出推荐、解释和授权入口。",
    },
  ])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" })
  }, [messages])

  const submit = () => {
    const text = draft.trim()
    if (!text || !isAuthenticated) {
      return
    }

    setMessages((current) => [...current, { author: "user", body: text }])
    setDraft("")
    startTransition(async () => {
      const response = await sendDijieBuyerStorefrontMessage({ message: text, sessionId })
      if (response.ok) {
        setSessionId(response.sessionId)
        setMessages((current) => [
          ...current,
          {
            author: "assistant",
            body: response.message?.content || "已根据当前商城岗位库回复。",
            actions: response.actions,
          },
        ])
        return
      }
      setMessages((current) => [
        ...current,
        {
          author: "assistant",
          body: response.error || "商城助手暂时无法回复。",
        },
      ])
    })
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
        <p className="mt-2 label-md text-secondary">真实岗位库 · 购买前咨询 · 不执行岗位</p>
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
            <p>{message.body}</p>
            {message.actions && message.actions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.actions.map((action) => (
                  <Link
                    key={action.id}
                    href={normalizeActionPath(action.path, locale)}
                    className="rounded-sm border bg-primary px-3 py-2 label-sm text-primary"
                    title={action.description}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {isPending && (
          <div className="max-w-[620px] rounded-sm border bg-secondary px-4 py-3 text-secondary">
            正在读取已审核岗位库...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex shrink-0 gap-3 border-t p-4">
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleDraftKeyDown}
          placeholder={isAuthenticated ? "输入需求" : "请先登录后咨询"}
          rows={1}
          disabled={!isAuthenticated}
          className="max-h-24 min-h-12 resize-none"
        />
        {isAuthenticated ? (
          <Button type="button" onClick={submit} disabled={!draft.trim() || isPending} className="h-12 px-6">
            {isPending ? "发送中" : "发送"}
          </Button>
        ) : (
          <Link
            href={loginPath}
            className="flex h-12 shrink-0 items-center justify-center rounded-sm bg-action px-6 button-text text-action-on-primary hover:bg-action-hover"
          >
            登录
          </Link>
        )}
      </div>

      <div className="sr-only">
        {statusItems.map((item) => (
          <span key={item.label} title={item.title}>
            {item.label} {item.value}
          </span>
        ))}
        <span>当前公开岗位 {roles.length}</span>
      </div>
    </div>
  )
}
