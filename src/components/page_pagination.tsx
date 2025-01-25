'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PageRange {
  prev: number | undefined;
  next: number | undefined;
  pages: (number | string)[];
}

function calcPageRange(total: number, current: number, around: number): PageRange {
  const result: PageRange = {
    prev: undefined,
    next: undefined,
    pages: [],
  };

  const baseCount = around * 2 + 1 + 2 + 2 + 2;
  const surplus = baseCount - 4;
  const startPosition = 1 + 2 * around + 1;
  const endPosition = total - 2 - around - 1;

  // 计算页码数组
  result.pages = total <= baseCount - 2
    ? Array.from({ length: total }, (_, i) => i + 1)
    : current < startPosition
    ? [...Array.from({ length: surplus }, (_, i) => i + 1), '...', total]
    : current > endPosition
    ? [1, '...', ...Array.from({ length: surplus }, (_, i) => total - surplus + i + 1)]
    : [1, '...', ...Array.from({ length: around * 2 + 1 }, (_, i) => current - around + i), '...', total];

  // 设置上一页和下一页
  result.prev = current > 1 ? current - 1 : undefined;
  result.next = current < total ? current + 1 : undefined;

  return result;
}

interface PagePaginationProps {
  page: number | string;
  size: number | string;
  total: number | string;
  maxPage?: number;
  className?: string;
}

const PagePagination: React.FC<PagePaginationProps> = ({ 
  page: initialPage, 
  size: initialSize, 
  total: initialTotal, 
  maxPage, 
  className 
}) => {
  // 转换输入参数
  const page = Number(initialPage);
  const size = Number(initialSize);
  const total = Number(initialTotal);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const around = 1;
  const totalPage = Math.min(
    Math.ceil(total / size),
    maxPage ?? Infinity
  );
  
  const pageRange = calcPageRange(totalPage, page, around);

  const onPageChange = (newPage: number) => {
    if (newPage <= 0) return;
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* 上一页 */}
        <PaginationItem>
          <PaginationPrevious
            disabled={!pageRange.prev}
            onClick={() => onPageChange(pageRange.prev ?? 0)}
          ></PaginationPrevious>
        </PaginationItem>

        {/* 页码 */}
        {pageRange.pages.map((item, index) => (
          <PaginationItem key={index}>
            {typeof item === 'number' ? (
              <PaginationButton
                isActive={item === page}
                size={item > 999 ? 'default' : 'icon'}
                onClick={() => onPageChange(item)}
              >
                {item}
              </PaginationButton>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        {/* 下一页 */}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(pageRange.next ?? 0)}
            disabled={!pageRange.next}
          ></PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PagePagination;
