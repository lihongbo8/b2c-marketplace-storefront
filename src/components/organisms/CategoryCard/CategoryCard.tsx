import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export function CategoryCard({
  category,
}: {
  category: { name: string; handle: string }
}) {
  return (
    <LocalizedClientLink
      href={`/categories/${category.handle}`}
      title={`查看${category.name}岗位`}
      className="relative flex flex-col justify-between border rounded-sm bg-component p-5 transition-colors hover:bg-action-secondary w-[233px] aspect-square"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-secondary text-xl font-semibold text-primary">
        {category.name.slice(0, 1)}
      </div>
      <h3 className="label-lg text-primary">
        {category.name}
      </h3>
    </LocalizedClientLink>
  )
}
