import { BlogPost } from '@/types/blog';
import { BlogCard } from '@/components/organisms';

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "岗位上新",
    excerpt: "查看最新可授权岗位。",
    image: '/images/blog/post-1.jpg',
    category: '上新',
    href: '#',
  },
  {
    id: 2,
    title: '能力榜单',
    excerpt: '查看热门岗位能力。',
    image: '/images/blog/post-2.jpg',
    category: '榜单',
    href: '#',
  },
  {
    id: 3,
    title: '费用摘要',
    excerpt: '查看授权和用量。',
    image: '/images/blog/post-3.jpg',
    category: '费用',
    href: '#',
  },
];

export function BlogSection() {
  return (
    <section className='bg-tertiary container'>
      <div className='flex items-center justify-between mb-12'>
        <h2 className='heading-lg text-tertiary'>
          岗位动态
        </h2>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3'>
        {blogPosts.map((post, index) => (
          <BlogCard
            key={post.id}
            index={index}
            post={post}
          />
        ))}
      </div>
    </section>
  );
}
