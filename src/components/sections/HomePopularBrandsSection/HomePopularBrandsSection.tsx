import { Brand } from '@/types/brands';
import { BrandCard } from '@/components/organisms';
import { Carousel } from '@/components/cells';

const brands: Brand[] = [
  {
    id: 1,
    name: '内容岗位',
    logo: '/images/brands/Balenciaga.svg',
    href: '/categories',
  },
  {
    id: 2,
    name: '运营岗位',
    logo: '/images/brands/Prada.svg',
    href: '/categories',
  },
  {
    id: 3,
    name: '分析岗位',
    logo: '/images/brands/Prada.svg',
    href: '/categories',
  },
  {
    id: 4,
    name: '客服岗位',
    logo: '/images/brands/Miu-Miu.svg',
    href: '/categories',
  },
];

export function HomePopularBrandsSection() {
  return (
    <section className='bg-action px-4 py-8 md:px-6 lg:px-8 w-full'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='heading-lg text-tertiary'>
          岗位分类
        </h2>
      </div>
      <Carousel
        variant='dark'
        items={brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      />
    </section>
  );
}
