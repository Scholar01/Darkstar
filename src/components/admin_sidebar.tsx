import { Link } from '@/components/ui/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { RiHome9Line } from 'react-icons/ri';
import { TbBackground } from 'react-icons/tb';
import { SiEnvoyproxy } from 'react-icons/si';
import { FaTasks } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import PageBreadcrumb from '@/components/page_breadcrumb';
const items = [
  {
    title: '首页',
    icon: RiHome9Line,
    href: '/admin',
  },
  {
    title: '环境管理',
    icon: SiEnvoyproxy,
    href: '/admin/env',
  },
  {
    title: '后端管理',
    icon: TbBackground,
    href: '/admin/ai',
  },
  {
    title: '任务管理',
    icon: FaTasks,
    href: '/admin/task',
  },
];

/**
 * 后台管理侧边栏
 */
function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>后台管理</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

/**
 * 侧边栏面包屑
 */
const SideBarBreadcrumb: React.FC<{
  className?: string;
  page: { name: string; href?: string };
}> = ({ className, page }) => {
  return (
    <div className={cn('flex h-5 items-center gap-2 px-2', className)}>
      <SidebarTrigger />
      <Separator orientation='vertical' />
      <PageBreadcrumb
        items={[
          { name: '后台管理', href: '/admin' },
          { name: page.name, href: page.href },
        ]}
      />
    </div>
  );
};

export { AdminSidebar, SideBarBreadcrumb };
