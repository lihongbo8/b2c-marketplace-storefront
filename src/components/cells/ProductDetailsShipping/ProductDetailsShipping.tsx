import { ProductPageAccordion } from '@/components/molecules';

export const ProductDetailsShipping = () => {
  return (
    <ProductPageAccordion
      heading='授权说明'
      defaultOpen={false}
    >
      <div className='product-details'>
        <ul>
          <li>购买后进入授权流程。</li>
          <li>执行或变更前需要确认。</li>
        </ul>
      </div>
    </ProductPageAccordion>
  );
};
