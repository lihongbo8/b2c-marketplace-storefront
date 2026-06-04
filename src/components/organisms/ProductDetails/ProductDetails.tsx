import {
  ProductDetailsHeader,
} from "@/components/cells"

import { retrieveCustomer } from "@/lib/data/customer"
import { AdditionalAttributeProps } from "@/types/product"
import { SellerProps } from "@/types/seller"
import { HttpTypes } from "@medusajs/types"

const businessStandards = [
  {
    title: "主体完整清晰",
    description: "商品主体无遮挡、不糊、不被过度裁切。",
    label: "基础标准",
  },
  {
    title: "图文一致",
    description: "标题、类目、规格和图片内容互相匹配。",
    label: "业务标准",
  },
  {
    title: "风险拦截",
    description: "敏感内容、误导文字、禁用水印进入人工确认。",
    label: "安全标准",
  },
  {
    title: "结果可交接",
    description: "输出通过建议、风险点、补充材料和执行摘要。",
    label: "验收标准",
  },
]

const capabilityNeeds = [
  "读取商品资料和图片素材",
  "检查图片内容和文字一致性",
  "生成补充材料清单",
  "高风险结论进入人工确认",
]

const failureBoundaries = [
  "资料不足时必须说明缺口",
  "不能承诺自动上架或退款",
  "不展示本地路径、密钥、历史对话或内部结构",
]

export const ProductDetails = async ({
  product,
  locale,
}: {
  product: HttpTypes.StoreProduct & {
    seller?: SellerProps
    attribute_values?: AdditionalAttributeProps[]
  }
  locale: string
}) => {
  const user = await retrieveCustomer()

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
      <div className="space-y-4">
        <section className="overflow-hidden rounded-md border border-[#e5e7eb] bg-white">
          <div className="p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-md border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 text-[13px] font-medium leading-5 text-[#2563eb]">
                岗位
              </span>
              <span className="rounded-md border border-[#e5e7eb] bg-white px-3 py-1 text-[13px] font-medium leading-5 text-[#111827]">
                可授权
              </span>
              <span className="rounded-md border border-[#e5e7eb] bg-white px-3 py-1 text-[13px] font-medium leading-5 text-[#111827]">
                安全确认
              </span>
              <span className="rounded-md border border-[#e5e7eb] bg-white px-3 py-1 text-[13px] font-medium leading-5 text-[#111827]">
                本地 OpenClaw 执行
              </span>
            </div>
            <p className="text-[14px] font-medium leading-6 text-[#64748b]">认证开发者 · 电商运营审核方向</p>
            <h1 className="mt-2 text-[32px] font-semibold leading-[40px] tracking-normal text-[#111827]" data-testid="product-title">
              {product.title}
            </h1>
            <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#334155]">
              面向电商上架前的图片合规和图文一致性检查。岗位包提供业务流程、
              判断经验、常见失败模式和验收标准；真实执行由本地 OpenClaw 工具协议完成，
              授权后仍保留人工确认点。
            </p>
          </div>

          <div className="grid border-t border-[#e5e7eb] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["主打业务", "商品图上架前检查"],
              ["适用团队", "运营 / 商家 / 审核"],
              ["执行方式", "确认后本地执行"],
              ["输出结果", "建议、风险、补充材料"],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-[#e5e7eb] p-4 sm:border-r lg:border-b-0 last:border-r-0">
                <div className="text-[13px] leading-5 text-[#64748b]">{label}</div>
                <div className="mt-2 text-[15px] font-semibold leading-6 text-[#111827]">{value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-[#e5e7eb] bg-white p-5">
          <h2 className="text-[22px] font-semibold leading-7 text-[#111827]">岗位详情</h2>
          <p className="mt-2 text-[14px] leading-6 text-[#64748b]">左侧承担主要介绍，不再把内容挤到右边。</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-[#e5e7eb] bg-white p-4">
              <h3 className="text-[16px] font-semibold leading-6 text-[#111827]">主打什么业务</h3>
              <p className="mt-3 text-[14px] leading-7 text-[#334155]">
                帮商家在发布前检查商品图主体是否清晰、图片是否符合平台规范、
                标题和图片是否匹配，并把异常项转成人工确认任务。
              </p>
            </div>
            <div className="rounded-md border border-[#e5e7eb] bg-white p-4">
              <h3 className="text-[16px] font-semibold leading-6 text-[#111827]">适合什么场景</h3>
              <p className="mt-3 text-[14px] leading-7 text-[#334155]">
                新品上架、批量改图、活动前复核、外包素材验收，
                以及需要把重复检查流程沉淀成岗位经验的团队。
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-md border border-[#e5e7eb] bg-white p-5">
          <h2 className="text-[22px] font-semibold leading-7 text-[#111827]">执行标准</h2>
          <p className="mt-2 text-[14px] leading-6 text-[#64748b]">买家一眼能看到这个岗位按照什么标准工作。</p>
          <div className="mt-4 space-y-3">
            {businessStandards.map((standard, index) => (
              <div key={standard.title} className="grid gap-3 rounded-md border border-[#e5e7eb] bg-white px-4 py-3 sm:grid-cols-[32px_1fr_96px] sm:items-center">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#eff6ff] text-[13px] font-semibold leading-5 text-[#2563eb]">
                  {index + 1}
                </div>
                <div>
                  <div className="text-[15px] font-semibold leading-6 text-[#111827]">{standard.title}</div>
                  <div className="mt-1 text-[13px] leading-5 text-[#64748b]">{standard.description}</div>
                </div>
                <div className="text-[13px] font-semibold leading-5 text-[#16a34a] sm:text-right">{standard.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-[#e5e7eb] bg-white p-5">
          <h2 className="text-[22px] font-semibold leading-7 text-[#111827]">能力需求与失败边界</h2>
          <p className="mt-2 text-[14px] leading-6 text-[#64748b]">只展示本地能力需求，不展示执行实现细节。</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-[#e5e7eb] bg-white p-4">
              <h3 className="text-[16px] font-semibold leading-6 text-[#111827]">本地能力需求</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-6 text-[#334155]">
                {capabilityNeeds.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-[#e5e7eb] bg-white p-4">
              <h3 className="text-[16px] font-semibold leading-6 text-[#111827]">失败边界</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-6 text-[#334155]">
                {failureBoundaries.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <ProductDetailsHeader product={product} locale={locale} user={user} />
    </div>
  )
}
