"use client"

import { Accordion, FilterCheckboxOption } from "@/components/molecules"
import useFilters from "@/hooks/useFilters"

const filters = [
  { label: "可购买", amount: 78 },
  { label: "已授权", amount: 40 },
  { label: "可更新", amount: 7 },
  { label: "需确认", amount: 16 },
]

export const ConditionFilter = () => {
  const { updateFilters, isFilterActive } = useFilters("condition")

  const selectHandler = (option: string) => {
    updateFilters(option)
  }

  return (
    <Accordion heading="授权状态" data-testid="filter-condition">
      <ul className="px-4" data-testid="filter-condition-options">
        {filters.map(({ label, amount }) => (
          <li key={label} className="mb-4">
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!amount)}
              onCheck={selectHandler}
              label={label}
              amount={amount}
              data-testid={`filter-condition-checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}
