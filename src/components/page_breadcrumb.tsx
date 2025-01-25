import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link } from '@/components/ui/link';
import { Fragment } from 'react';

export interface PageBreadcrumbItem {
  name: string;
  href?: string;
}

const PageBreadcrumb: React.FC<{
  items: PageBreadcrumbItem[];
  className?: string;
}> = ({ items, className }) => {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem key={index}>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.name}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumb;
  