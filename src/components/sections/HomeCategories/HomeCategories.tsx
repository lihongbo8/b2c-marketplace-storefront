import { Carousel } from "@/components/cells"
import { CategoryCard } from "@/components/organisms"

export const categories: { id: number; name: string; handle: string }[] = [
  {
    id: 1,
    name: "资料处理",
    handle: "data-work",
  },
  {
    id: 2,
    name: "内容运营",
    handle: "content-ops",
  },
  {
    id: 3,
    name: "客服协作",
    handle: "service-ops",
  },
  {
    id: 4,
    name: "数据分析",
    handle: "analytics",
  },
  {
    id: 5,
    name: "自动化执行",
    handle: "automation",
  },
]

export const HomeCategories = async ({ heading }: { heading: string }) => {
  return (
    <section className="bg-primary py-8 w-full">
      <div className="mb-6">
        <h2 className="heading-lg text-primary uppercase">{heading}</h2>
      </div>
      <Carousel
        items={categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      />
    </section>
  )
}
