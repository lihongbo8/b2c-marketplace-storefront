"use client"
import { Chip } from "@/components/atoms"
import { Accordion } from "@/components/molecules"
import useFilters from "@/hooks/useFilters"

const sizeOptions = [
  "资料处理",
  "内容审核",
  "客服运营",
  "数据分析",
  "自动化执行",
  "本机工具",
]

export const SizeFilter = () => {
  const { updateFilters, isFilterActive } = useFilters("size")

  const selectSizeHandler = (size: string) => {
    updateFilters(size)
  }
  return (
    <Accordion heading="岗位类型" data-testid="filter-size">
      <ul className="grid grid-cols-2 mt-2 gap-2" data-testid="filter-size-options">
        {sizeOptions.map((option) => (
          <li key={option}>
            <Chip
              selected={isFilterActive(option)}
              onSelect={() => selectSizeHandler(option)}
              value={option}
              className="w-full !justify-center !py-2 !font-normal"
              data-testid={`filter-size-chip-${option.toLowerCase().replace(/\s+/g, '-')}`}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}
