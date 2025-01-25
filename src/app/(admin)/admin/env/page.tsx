import { columns } from '@/app/(admin)/admin/env/columns';
import { SideBarBreadcrumb } from '@/components/admin_sidebar';
import { DataTable } from '@/components/data_table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type env } from '@prisma/client';

async function getData(): Promise<env[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      name: 'test',
      desc: 'test',
      platform: 'webui',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: 'test2',
      desc: 'test2,这是一个超长的描述，用来测试表格的显示效果,啊啊是发烧发烧发烧发烧发烧发烧发烧',
      platform: 'comfyui',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      name: 'test3',
      desc: 'test3',
      platform: 'webui',
      is_active: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 4,
      name: 'test4',
      desc: 'test4',
      platform: 'comfyui',
      is_active: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
}

export default async function EnvPage() {
  //查找已经激活的环境,并区分sd和comfy
  const envs = await getData();

  const active_sd = envs.find((env) => env.platform === 'webui');
  const active_comfy = envs.find((env) => env.platform === 'comfyui');

  return (
    <main className='w-full py-2'>
      <SideBarBreadcrumb page={{ name: '环境管理' }} />
      <div className='mt-4 p-2'>
        {/* 查看已激活的环境 */}

        <h2 className='mb-2 text-2xl font-medium text-muted-foreground'>
          已激活环境
        </h2>
        <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
          <ActiveEnvCard env={active_sd} title='Stable Diffusion' />
          <ActiveEnvCard env={active_comfy} title='ComfyUI' />
        </div>

        {/* 环境列表 */}
        <h2 className='my-4 text-2xl font-medium text-muted-foreground'>
          环境列表
        </h2>
        <DataTable columns={columns} data={envs} />
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
