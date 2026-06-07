const links = {
  customerServices: [
    { label: '帮助', path: '/user/messages' },
    { label: '授权记录', path: '/user/wishlist' },
    { label: '费用记录', path: '/user/orders' },
    { label: '执行记录', path: '/user/messages' },
  ],
  about: [
    { label: '关于迭界AI', path: '/' },
    { label: '隐私', path: '/user/settings' },
    { label: '条款', path: '/user/settings' },
  ],
  connect: [
    {
      label: '开发者中心',
      path: process.env.NEXT_PUBLIC_AICS_VENDOR_CENTER_URL ?? 'http://127.0.0.1:7014/seller/preview-home',
    },
    {
      label: '审核中心',
      path: process.env.NEXT_PUBLIC_AICS_REVIEW_CENTER_URL ?? 'http://127.0.0.1:7013/dashboard/preview-home',
    },
    { label: '联系支持', path: '/user/messages' },
  ],
};

export default links;
