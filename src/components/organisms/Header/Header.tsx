import { HttpTypes } from "@medusajs/types"

import { CartDropdown, MobileNavbar, Navbar } from "@/components/cells"
import { UserDropdown } from "@/components/cells/UserDropdown/UserDropdown"
import CountrySelector from "@/components/molecules/CountrySelector/CountrySelector"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { MessageButton } from "@/components/molecules/MessageButton/MessageButton"
import { listCategories } from "@/lib/data/categories"
import { listRegions } from "@/lib/data/regions"
import { retrieveCustomer } from "@/lib/data/customer"
import { ParentCategoryLinks } from "@/components/molecules/ParentCategoryLinks/ParentCategoryLinks"

export const Header = async ({ locale } : {
  locale: string
}) => {
  const user = await retrieveCustomer().catch(() => null)
  const isLoggedIn = Boolean(user)

  const regions = await listRegions().catch(() => [
    {
      id: "local-preview",
      name: "本地预览",
      countries: [{ iso_2: locale, display_name: locale.toUpperCase() }],
    },
  ] as HttpTypes.StoreRegion[])

  const { categories, parentCategories } = (await listCategories({ query: { include_ancestors_tree: true } }).catch(() => ({
    categories: [],
    parentCategories: [],
  }))) as {
    categories: HttpTypes.StoreProductCategory[]
    parentCategories: HttpTypes.StoreProductCategory[]
  }
  return (
    <header data-testid="header">
      <div className="flex py-2 lg:px-8 px-4 md:px-5" data-testid="header-top">
        <div className="flex items-center lg:w-1/3">
          <MobileNavbar
            parentCategories={parentCategories}
            categories={categories}
          />
          <ParentCategoryLinks
            parentCategories={parentCategories}
            categories={categories}
          />
        </div>
        <div className="flex lg:justify-center lg:w-1/3 items-center pl-4 lg:pl-0">
          <LocalizedClientLink href="/" className="text-2xl font-bold" data-testid="header-logo-link">
            迭界AI
          </LocalizedClientLink>
        </div>
        <div className="flex items-center justify-end gap-2 lg:gap-4 w-full lg:w-1/3 py-2" data-testid="header-actions">
          <CountrySelector regions={regions} />
          {isLoggedIn && <MessageButton />}
          <UserDropdown isLoggedIn={isLoggedIn} />
          {isLoggedIn && (
            <LocalizedClientLink href="/user/wishlist" className="label-md whitespace-nowrap" title="我的授权" data-testid="header-user-center-link">
              我的授权
            </LocalizedClientLink>
          )}

          <CartDropdown />
        </div>
      </div>
      <Navbar categories={categories} parentCategories={parentCategories} />
    </header>
  )
}
