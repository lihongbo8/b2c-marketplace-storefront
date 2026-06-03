export const singleProduct = {
  id: '1',
  brand: '迭界AI',
  name: '商品图检查岗位',
  price: 399,
  originalPrice: 499,
  color: '在线运行',
  colorVariants: [
    {
      variant: '#16A34A',
      label: '在线运行',
      disabled: false,
    },
    { variant: '#2563EB', label: '人工确认', disabled: false },
    { variant: '#F7F7F7', label: '待授权', disabled: false },
  ],
  size: '标准授权',
  sizeVariants: [
    { label: '标准授权', disabled: false },
    { label: '团队授权', disabled: false },
    { label: '企业授权', disabled: false },
    { label: '待审核', disabled: true },
  ],
  condition: '可授权',
  images: [
    {
      id: '1',
      url: '/images/product/Image-1.jpg',
      alt: '商品图检查岗位',
    },
    {
      id: '2',
      url: '/images/product/Image-2.jpg',
      alt: '岗位授权摘要',
    },
    {
      id: '3',
      url: '/images/product/Image-3.jpg',
      alt: '岗位授权摘要',
    },
    {
      id: '4',
      url: '/images/product/Image-3.jpg',
      alt: '岗位授权摘要',
    },
    {
      id: '5',
      url: '/images/product/Image-3.jpg',
      alt: '岗位授权摘要',
    },
  ],
  details:
    "<p>用于检查商品图是否符合上架要求，购买授权后由主系统调度执行。</p>",
  measurements: [
    { label: '授权', inches: '标准', cm: '确认后生效' },
  ],
  seller: {
    id: 'dijie-developer',
    name: '认证开发者',
    avatar: '/images/product/seller-avatar.jpg',
    rating: 4,
    reviewCount: 234,
    verified: true,
    page: '/user',
    joinDate: '2017',
    sold: 126,
    description:
      '已通过平台审核的岗位开发者。',
  },
  reviews: [
    {
      id: '1',
      rating: 5,
      username: '运营同学',
      date: '3 天前',
      text: '岗位授权后能稳定完成商品图检查，结果清楚，交接方便。',
      image: '/images/product/review-image-1.jpg',
    },
    {
      id: '2',
      rating: 5,
      username: '电商负责人',
      date: '3 周前',
      text: '适合重复检查任务，授权和用量记录都比较清楚。',
      image: '/images/product/review-image-2.jpg',
    },
    {
      id: '3',
      rating: 5,
      username: '内容运营',
      date: '1 年前',
      text: "岗位执行结果稳定，适合接入日常审核流程。",
      image: '/images/product/review-image-3.jpg',
    },
  ],
  tags: ['图像检查', '电商', '自动化'],
  postedDate: '7 天前',
};
