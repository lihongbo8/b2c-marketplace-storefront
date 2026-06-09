import { listRegions } from "../data/regions"

export const checkRegion = async (locale: string) => {
  const defaultRegion = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

  if (locale === defaultRegion) {
    return true
  }

  if (!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    return locale === defaultRegion
  }

  const regions = await listRegions().catch(() => [])
  const countries = regions
    ?.map((r) => {
      return r.countries?.map((c) => c.iso_2)
    })
    .flat()

  return countries.includes(locale) ? true : false
}
