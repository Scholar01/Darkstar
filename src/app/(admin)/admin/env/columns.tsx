'use client';

import { ColumnDef } from '@tanstack/react-table';
import { env } from '@prisma/client';
import { z } from 'zod';
import { env_variableSchema } from '@/lib/shemas';
import EnvVariableForm from '@/app/(admin)/admin/env/env_variable_form';
import EnvForm from '@/app/(admin)/admin/env/env_form';
import { deleteEnv } from '@/app/(admin)/admin/env/actions';

export const columns: ColumnDef<env>[] = [
  {
    accessorKey: 'name',
    header: '环境名称',
  },
  {
    accessorKey: 'desc',
    header: '环境描述',
  },
  {
    accessorKey: 'platform',
    header: '平台',
  },
  {
    accessorKey: 'is_active',
    header: '状态',
    cell: ({ row }) => (
      <span
        className={`${row.original.is_active ? 'text-green-500' : 'text-red-500'}`}
      >
        {row.original.is_active ? '激活' : '未激活'}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => {
      const env: any = {
        ...row.original,
        desc: row.original.desc || '',
        env_variables: (row.original as any).env_variables || [],
      };
      return (
        <div className='flex items-center gap-2'>
          <EnvForm
            title='编辑环境'
            description='编辑环境,可用于自动同步后端'
            defaultValues={env}
          >
            <button className='text-blue-500 hover:text-blue-700'>编辑</button>
          </EnvForm>
          <form action={deleteEnv}>
            <input type='hidden' name='id' value={row.original.id} />
            <button type='submit' className='text-red-500 hover:text-red-700'>
              删除
            </button>
          </form>
        </div>
      );
    },
  },
];

export const env_variable_columns: ColumnDef<
  z.infer<typeof env_variableSchema>
>[] = [
  {
    accessorKey: 'name',
    header: '名称',
  },
  {
    accessorKey: 'action',
    header: '动作',
    cell: ({ row }) => {
      return row.original.action === 'download'
        ? '下载'
        : row.original.action === 'git'
          ? 'git克隆'
          : '执行命令';
    },
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row, table }) => {
      return (
        <div className='flex items-center gap-2'>
          <EnvVariableForm
            defaultValues={row.original}
            onSuccess={(data) => {
              table.options.meta?.onEdit?.(data);
            }}
          >
            <button type='button'>编辑</button>
          </EnvVariableForm>
          <button
            type='button'
            className='text-red-500 hover:text-red-700'
            onClick={() => table.options.meta?.onDelete?.(row.original)}
          >
            删除
          </button>
        </div>
      );
    },
  },
];
