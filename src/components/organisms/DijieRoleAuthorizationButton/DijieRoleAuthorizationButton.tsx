"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState, useTransition } from "react"

import { Button } from "@/components/atoms"
import { addDijieRoleToCart } from "@/lib/data/cart"
import { authorizeDijieRoleListing } from "@/lib/data/dijie"
import { toast } from "@/lib/helpers/toast"

export const DijieRoleAuthorizationButton = ({
  roleListingId,
  locale,
  authorizationFeeCents,
  initiallyAuthorized = false,
  className,
}: {
  roleListingId: string
  locale: string
  authorizationFeeCents?: number
  initiallyAuthorized?: boolean
  className?: string
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [authorized, setAuthorized] = useState(initiallyAuthorized)
  const [message, setMessage] = useState("")
  const [attemptedCheckoutOrderId, setAttemptedCheckoutOrderId] = useState("")
  const [isPending, startTransition] = useTransition()
  const isPaid = typeof authorizationFeeCents === "number" && authorizationFeeCents > 0
  const checkoutOrderId = useMemo(() => {
    return (
      searchParams.get("dijieOrderId") ||
      searchParams.get("orderId") ||
      searchParams.get("order_id") ||
      ""
    ).trim()
  }, [searchParams])

  const runAuthorization = useCallback((orderId?: string) => {
    setMessage("")
    startTransition(async () => {
      const result = await authorizeDijieRoleListing({ roleListingId, orderId })
      if (result.ok) {
        setAuthorized(true)
        toast.success({ title: "岗位授权已生效" })
        router.refresh()
        return
      }

      const nextMessage =
        result.code === "checkout_required"
          ? "该岗位需要先完成结算。结算完成后将订单编号带回本页，系统会生成授权。"
          : result.error || "岗位授权失败。"
      setMessage(nextMessage)
      toast.error({ title: nextMessage })
    })
  }, [roleListingId, router])

  const startCheckout = useCallback(() => {
    setMessage("")
    startTransition(async () => {
      const result = await addDijieRoleToCart({
        roleListingId,
        countryCode: locale,
      })
      if (!result.ok) {
        const nextMessage = result.error || "该岗位暂时不能进入结算。"
        setMessage(nextMessage)
        toast.error({ title: nextMessage })
        return
      }

      toast.success({ title: "已加入岗位授权清单" })
      const checkoutCountryCode = result.countryCode || locale
      router.push(
        `/${checkoutCountryCode}/checkout?step=address&dijieRoleListingId=${encodeURIComponent(roleListingId)}`
      )
    })
  }, [locale, roleListingId, router])

  useEffect(() => {
    if (
      !isPaid ||
      authorized ||
      isPending ||
      !checkoutOrderId ||
      attemptedCheckoutOrderId === checkoutOrderId
    ) {
      return
    }
    setAttemptedCheckoutOrderId(checkoutOrderId)
    runAuthorization(checkoutOrderId)
  }, [
    attemptedCheckoutOrderId,
    authorized,
    checkoutOrderId,
    isPaid,
    isPending,
    runAuthorization,
  ])

  if (authorized) {
    return (
      <Link
        href={`/${locale}/user/wishlist`}
        className={className ?? "inline-flex h-10 items-center justify-center rounded-sm bg-action px-4 label-md text-action-on-primary"}
        data-testid={`dijie-role-authorized-${roleListingId}`}
      >
        已授权/去使用
      </Link>
    )
  }

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        onClick={() => {
          if (isPaid && !checkoutOrderId) {
            startCheckout()
            return
          }
          runAuthorization(checkoutOrderId || undefined)
        }}
        loading={isPending}
        disabled={isPending}
        className={className}
        data-testid={`dijie-role-authorize-${roleListingId}`}
      >
        {isPaid && checkoutOrderId ? "完成授权" : isPaid ? "购买/授权" : "授权"}
      </Button>
      {message && (
        <p className="label-sm text-secondary" data-testid={`dijie-role-authorize-message-${roleListingId}`}>
          {message}
        </p>
      )}
    </div>
  )
}
