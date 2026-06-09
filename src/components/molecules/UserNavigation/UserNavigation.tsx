"use client"
import {
  Badge,
  Card,
  Divider,
  LogoutButton,
  NavigationItem,
} from "@/components/atoms"
import { useUnreads } from "@talkjs/react"
import { usePathname } from "next/navigation"

const navigationItems = [
  {
    label: "我的授权",
    href: "/user/wishlist",
  },
  {
    label: "费用记录",
    href: "/user/orders",
  },
  {
    label: "执行记录",
    href: "/user/messages",
  },
  {
    label: "授权变更",
    href: "/user/returns",
  },
  {
    label: "账号设置",
    href: "/user/settings",
  },
]

export const UserNavigation = () => {
  const unreads = useUnreads()
  const path = usePathname()

  return (
    <Card className="h-min">
      {navigationItems.map((item) => (
        <NavigationItem
          key={item.label}
          href={item.href}
          active={path === item.href}
          className="relative"
        >
          {item.label}
          {item.label === "执行记录" && Boolean(unreads?.length) && (
            <Badge className="absolute top-3 left-24 w-4 h-4 p-0">
              {unreads?.length}
            </Badge>
          )}
        </NavigationItem>
      ))}
      <Divider className="my-2" />
      <LogoutButton className="w-full text-left" />
    </Card>
  )
}
