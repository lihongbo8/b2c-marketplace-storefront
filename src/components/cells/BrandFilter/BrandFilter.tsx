'use client';

import { Input } from '@/components/atoms';
import {
  Accordion,
  FilterCheckboxOption,
} from '@/components/molecules';
import useFilters from '@/hooks/useFilters';
import { SearchIcon } from '@/icons';
import { useEffect, useState } from 'react';

const brandFilters = [
  { label: '迭界AI', amount: 40 },
  { label: '认证开发者', amount: 78 },
  { label: '企业开发者', amount: 7 },
  { label: '个人开发者', amount: 16 },
  { label: '平台精选', amount: 7 },
];

export const BrandFilter = () => {
  const [brandsSearch, setBrandSearch] = useState('');
  const [filteredOptions, setFilteredOptions] =
    useState(brandFilters);
  const { updateFilters, isFilterActive } =
    useFilters('brand');

  useEffect(() => {
    if (!brandFilters) {
      setFilteredOptions(brandFilters);
    } else {
      setFilteredOptions(
        brandFilters.filter(({ label }) =>
          label
            .toLowerCase()
            .includes(brandsSearch.toLowerCase())
        )
      );
    }
  }, [brandsSearch]);

  const selectHandler = (option: string) => {
    updateFilters(option);
  };

  const searchBrandsHandler = (value: string) => {
    setBrandSearch(value);
  };

  return (
    <Accordion heading='开发者'>
      <Input
        placeholder='搜索开发者'
        icon={<SearchIcon size={20} />}
        value={brandsSearch}
        onChange={(e) =>
          searchBrandsHandler(e.target.value)
        }
      />
      <ul className='px-4 mt-4'>
        {filteredOptions.map(({ label, amount }) => (
          <li key={label} className='mb-4'>
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={!Boolean(amount)}
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
