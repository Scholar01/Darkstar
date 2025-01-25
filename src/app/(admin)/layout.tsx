import { AdminSidebar } from '@/components/admin_sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: '后台管理',
  description: '后台管理',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar />
      {children}
    </SidebarProvider>
  );
}
