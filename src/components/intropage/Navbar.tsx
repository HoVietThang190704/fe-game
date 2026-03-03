"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { MenuIcon } from "lucide-react"

import { Sheet, SheetTrigger, SheetContent } from "@/src/components/ui/sheet"
import { cn } from "@/src/lib/utils"
import { LOGO_SIZE, ICON_MENU } from "@/src/lib/shared/constants/size"

const NAV_ITEMS: Array<{ label: string; href: string }> = [
  { label: "Trang chủ", href: "/" },
  { label: "Bảng xếp hạng", href: "/leaderboard" },
  { label: "Cộng đồng", href: "/community" },
]

export function Navbar() {
  return (
    <header className="w-full bg-background border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={LOGO_SIZE.WIDTH}
            height={LOGO_SIZE.HEIGHT}
            priority
          />
        </Link>

        {/* desktop links */}
        <nav className="hidden md:flex space-x-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* login button desktop */}
        <div className="hidden md:block">
          <Link
            href="/login"
            className="ml-4 inline-flex items-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Đăng nhập
          </Link>
        </div>

        {/* mobile menu trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-gray-900"
              >
                <MenuIcon
                  style={{ width: ICON_MENU.WIDTH, height: ICON_MENU.HEIGHT }}
                />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4">
              <nav className="flex flex-col space-y-4">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-base font-medium text-gray-700 hover:text-gray-900"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="mt-4 text-base font-medium text-orange-500 hover:text-orange-600"
                >
                  Đăng nhập
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Navbar
