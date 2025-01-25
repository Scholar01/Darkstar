import { SideBarBreadcrumb } from '@/components/admin_sidebar';

export default function AdminPage() {
  return (
    <main className='py-2'>
      <SideBarBreadcrumb page={{ name: '首页' }} />
      <div className='p-2'>
        <h1>后台管理</h1>
      </div>
    </main>
  );
}
