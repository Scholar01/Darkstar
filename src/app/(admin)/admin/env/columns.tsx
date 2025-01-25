'use client';

import { ColumnDef } from '@tanstack/react-table';
import { env } from '@prisma/client';

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
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <button
          onClick={() => console.log('编辑', row.original.id)}
          className='text-blue-500 hover:text-blue-700'
        >
          编辑
        </button>
        <button
          onClick={() => console.log('删除', row.original.id)}
          className='text-red-500 hover:text-red-700'
        >
          删除
        </button>
        <button
          onClick={() => console.log('切换状态', row.original.id)}
          className='text-gray-500 hover:text-gray-700'
        >
          {row.original.is_active ? '停用' : '启用'}
        </button>
      </div>
    ),
  },
];
