import NextLink from 'next/link';
import React from 'react';

/**
 * 自定义 Link 组件，用于替代 Next.js 的 Link 组件  
 * 默认禁用 prefetch
 */
const Link = React.forwardRef<
  React.ComponentRef<typeof NextLink>,
  React.ComponentPropsWithoutRef<typeof NextLink>
>(({ children, ...props }, ref) => {
  return (
    <NextLink ref={ref} prefetch={false} {...props}>
      {children}
    </NextLink>
  );
});

Link.displayName = 'Link';

export { Link };
