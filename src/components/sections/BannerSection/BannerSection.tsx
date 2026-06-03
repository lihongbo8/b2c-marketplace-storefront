import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"

export const BannerSection = () => {
  return (
    <section className="bg-tertiary container text-tertiary">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        <div className="py-6 px-6 flex flex-col h-full justify-between border border-secondary rounded-sm">
          <div className="mb-8 lg:mb-48">
            <span className="text-sm inline-block px-4 py-1 border border-secondary rounded-sm">
              岗位市场
            </span>
            <h2 className="display-sm">
              可信岗位，确认后调用
            </h2>
            <p className="text-lg text-tertiary max-w-lg">
              先购买授权，再由主系统调度。
            </p>
          </div>
          <LocalizedClientLink href="/categories">
            <Button size="large" className="w-fit bg-secondary/10">
              查看岗位
            </Button>
          </LocalizedClientLink>
        </div>
        <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full flex justify-end rounded-sm">
          <Image
            loading="lazy"
            fetchPriority="high"
            src="/images/banner-section/Image.jpg"
            alt="岗位市场"
            width={700}
            height={600}
            className="object-cover object-top rounded-sm"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  )
}
