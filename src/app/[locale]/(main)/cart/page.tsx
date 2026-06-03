import { Cart } from '@/components/sections';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '授权清单',
  description: '岗位授权清单',
};

export default function CartPage({}) {
  return (
    <main className='container grid grid-cols-12'>
      <Suspense fallback={<>加载中...</>}>
        <Cart />
      </Suspense>
    </main>
  );
}
