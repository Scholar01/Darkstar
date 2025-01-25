import { AdminSidebar } from '@/components/admin_sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';

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
      <main>
        {children}
      </main>
    </SidebarProvider>
  );
}
