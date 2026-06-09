'use client';

import {
  Accordion,
  FilterCheckboxOption,
} from '@/components/molecules';
import { cn } from '@/lib/utils';
import useFilters from '@/hooks/useFilters';

const colorFilters = [
  {
    label: '云端',
    amount: 40,
    color: 'bg-[rgba(9,9,9,1)]',
  },
  {
    label: '本机',
    amount: 78,
    color: 'bg-[rgba(82,82,82,1)]',
  },
  {
    label: '混合',
    amount: 7,
    color: 'bg-[rgba(255,255,255,1)]',
  },
];

export const ColorFilter = () => {
  const { updateFilters, isFilterActive } =
    useFilters('color');

  const selectHandler = (option: string) => {
    updateFilters(option);
  };

  return (
    <Accordion heading='运行方式' data-testid="filter-color">
      <ul className='px-4' data-testid="filter-color-options">
        {colorFilters.map(({ label, amount, color }) => (
          <li
            key={label}
            className='mb-4 flex items-center justify-between'
          >
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!amount)}
              onCheck={selectHandler}
              label={label}
              amount={amount}
              data-testid={`filter-color-checkbox-${label.toLowerCase()}`}
            />
            <div
              className={cn(
                'w-5 h-5 border border-primary rounded-xs',
                color,
                Boolean(!amount) && 'opacity-30'
              )}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  );
};
