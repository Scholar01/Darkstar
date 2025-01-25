import { columns } from '@/app/(admin)/admin/env/columns';
import { SideBarBreadcrumb } from '@/components/admin_sidebar';
import { DataTable } from '@/components/data_table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaCirclePlus } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { type env } from '@prisma/client';
import PagePagination from '@/components/page_pagination';
import prisma from '@/lib/prisma';
import EnvForm from '@/app/(admin)/admin/env/env_form';

export default async function EnvPage() {
  //查找已经激活的环境,并区分sd和comfy
  const envs = await prisma.env.findMany();
  const total = await prisma.env.count();

  const active_sd = envs.find(
    (env) => env.platform === 'webui' && env.is_active,
  );
  const active_comfy = envs.find(
    (env) => env.platform === 'comfyui' && env.is_active,
  );

  return (
    <main className='w-full py-4'>
      <SideBarBreadcrumb page={{ name: '环境管理' }} className='mb-4' />

      <div className='container mx-auto px-4'>
        {/* 已激活环境区域 */}
        <section className='mb-8'>
          <h2 className='mb-4 text-2xl font-semibold text-muted-foreground'>
            已激活环境
          </h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <ActiveEnvCard env={active_sd} title='Stable Diffusion' />
            <ActiveEnvCard env={active_comfy} title='ComfyUI' />
          </div>
        </section>

        {/* 环境列表区域 */}
        <section>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-2xl font-semibold text-muted-foreground'>
              环境列表
            </h2>
            <EnvForm
              title='创建新环境'
              description='创建新环境,可用于自动同步后端'
            >
              <Button
                variant='outline'
                size='icon'
                className='hover:bg-primary/10 [&_svg]:size-4'
                aria-label='添加环境'
              >
                <FaCirclePlus />
              </Button>
            </EnvForm>
          </div>
          <DataTable columns={columns} data={envs} />
          <PagePagination page={1} size={10} total={total} className='mt-6' />
        </section>
      </div>
    </main>
  );
}
const ActiveEnvCard = ({ env, title }: { env?: env; title: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className='flex items-center justify-between gap-4 overflow-hidden text-nowrap'>
        <div className='flex flex-col gap-2'>
          <p className='text-sm text-muted-foreground'>状态</p>
          <p className={cn({ 'text-destructive': !env?.is_active })}>
            {env?.is_active ? '已激活' : '未激活'}
          </p>
        </div>

        {env?.name && (
          <div className='flex flex-col gap-2'>
            <p className='text-sm text-muted-foreground'>名称</p>
            <p className='line-clamp-1'>{env?.name.slice(0, 20)}</p>
          </div>
        )}

        {env?.desc && (
          <div className='flex flex-col gap-2'>
            <p className='text-sm text-muted-foreground'>描述</p>
            <p className='line-clamp-1'>{env?.desc.slice(0, 20)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

