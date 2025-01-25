import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, ButtonProps, buttonVariants } from '@/components/ui/button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
  isDisabled?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<typeof Button>;

const PaginationLink = ({
  className,
  isActive,
  isDisabled,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'ghost' : 'ghost',
        size,
      }),
      'px-2 md:px-4',
      className,
    )}
    disabled={isDisabled}
    {...props}
  />
);

PaginationLink.displayName = 'PaginationLink';

const PaginationButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  React.ComponentProps<typeof Button> & {
    isActive?: boolean;
  }
>(({ className, isActive, ...props }, ref) => (
  <Button
    ref={ref}
    className={cn('flex items-center justify-center', className)}
    variant={isActive ? 'outline' : 'ghost'}
    size="icon"
    {...props}
  />
));
PaginationButton.displayName = 'PaginationButton';

const PaginationPrevious = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => (
  <PaginationButton
    aria-label="Go to previous page"
    size="icon"
    className={cn('gap-1', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    {children}
  </PaginationButton>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => (
  <PaginationButton
    aria-label="Go to next page"
    size="icon"
    className={cn('gap-1', className)}
    {...props}
  >
    {children}
    <ChevronRight className="h-4 w-4" />
  </PaginationButton>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn(
      'flex h-6 w-6 items-center justify-center md:h-9 md:w-9',
      className,
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationButton,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
