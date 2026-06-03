"use client"

import {
  Badge,
  Divider,
  LogoutButton,
  NavigationItem,
} from "@/components/atoms"
import { Dropdown } from "@/components/molecules"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { ProfileIcon } from "@/icons"
import { useUnreads } from "@talkjs/react"
import { useState } from "react"

export const UserDropdown = ({
  isLoggedIn,
}: {
  isLoggedIn: boolean
}) => {
  const [open, setOpen] = useState(false)

  const unreads = useUnreads()

  return (
    <div
      className="relative"
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
    >
      <LocalizedClientLink
        href={isLoggedIn ? "/user" : "/login"}
        className="relative"
        aria-label="商城账户"
      >
        <ProfileIcon size={20} />
      </LocalizedClientLink>
      <Dropdown show={open}>
        {isLoggedIn ? (
          <div className="p-1">
            <div className="lg:w-[200px]">
              <h3 className="uppercase heading-xs border-b p-4">
                商城账户
              </h3>
            </div>
            <NavigationItem href="/user/orders">费用</NavigationItem>
            <NavigationItem href="/user/messages" className="relative">
              执行记录
              {Boolean(unreads?.length) && (
                <Badge className="absolute top-3 left-24 w-4 h-4 p-0">
                  {unreads?.length}
                </Badge>
              )}
            </NavigationItem>
            <NavigationItem href="/user/returns">授权变更</NavigationItem>
            <NavigationItem href="/user/addresses">资料</NavigationItem>
            <NavigationItem href="/user/reviews">反馈</NavigationItem>
            <NavigationItem href="/user/wishlist">我的授权</NavigationItem>
            <Divider />
            <NavigationItem href="/user/settings">资料</NavigationItem>
            <LogoutButton />
          </div>
        ) : (
          <div className="p-1">
            <NavigationItem href="/login">登录</NavigationItem>
            <NavigationItem href="/register">注册</NavigationItem>
          </div>
        )}
      </Dropdown>
    </div>
  )
}
