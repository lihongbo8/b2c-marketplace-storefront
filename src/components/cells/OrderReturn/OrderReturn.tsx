"use client"

import { Button } from "@/components/atoms"
import Link from "next/link"

export const OrderReturn = ({ order }: { order: any }) => {
  return (
    <div className="md:flex justify-between items-center">
      <div className="mb-4 md:mb-0">
        <h2 className="text-primary label-lg uppercase">申请变更</h2>
        <p className="text-secondary label-md max-w-sm">
          需要变更授权时先提交申请。
        </p>
      </div>
      <Link href={`/user/orders/${order.id}/return`}>
        <Button variant="tonal" className="uppercase" onClick={() => null}>
          申请
        </Button>
      </Link>
    </div>
  )
}
