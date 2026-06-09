'use client';

import {
  Accordion,
  FilterCheckboxOption,
} from '@/components/molecules';
import useFilters from '@/hooks/useFilters';

const filters = [
  { label: '资料处理', amount: 140 },
  { label: '内容运营', amount: 100 },
  { label: '客服协作', amount: 100 },
  { label: '数据分析', amount: 31 },
  { label: '自动化执行', amount: 1 },
];

export const ProductFilter = () => {
  const { updateFilters, isFilterActive } =
    useFilters('product');

  const selectHandler = (option: string) => {
    updateFilters(option);
  };

  return (
    <Accordion heading='岗位'>
      <ul className='px-4'>
        {filters.map(({ label, amount }) => (
          <li key={label} className='mb-4'>
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!amount)}
              onCheck={selectHandler}
              label={label}
              amount={amount}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  );
};
