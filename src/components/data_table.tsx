'use client';

import {
  Column,
  ColumnDef,
  getCoreRowModel,
  SortingState,
} from '@tanstack/table-core';
import { flexRender, useReactTable } from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialSorting?: SortingState;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
}

declare module '@tanstack/table-core' {
  interface TableMeta<TData> {
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
  }
}

function DataTable<TData, TValue>({
  columns,
  data,
  initialSorting = [],
  onEdit,
  onDelete,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true, //自行服务端排序
    state: {
      sorting,
    },
    onSortingChange: (newSorting) => setSorting(newSorting),
    meta: {
      onEdit,
      onDelete,
    },
  });

  return (
    <div className='w-full rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.column.columnDef.size,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      width: cell.column.columnDef.size,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

function DataTableColumnSortHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <Button
      className={cn('font-medium', className)}
      variant='ghost'
      size='sm'
      onClick={() => {
        const isDesc = column.getIsSorted() === 'asc';
        column.toggleSorting(column.getIsSorted() === 'asc');
        const search = new URLSearchParams(searchParams);
        search.set('order', isDesc ? 'desc' : 'asc');
        search.set('orderBy', column.id);
        const url = `${pathname}?${search.toString()}`;
        router.replace(url);
      }}
    >
      {title}
      {column.getIsSorted() === 'asc' ? <ArrowDown /> : <ArrowUp />}
    </Button>
  );
}

function DataTableColumnFilterHeader<TData, TValue>({
  column,
  title,
  items,
  className,
}: DataTableColumnHeaderProps<TData, TValue> & {
  items: { value: string; label: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleFilter = (value: string) => {
    column.setFilterValue(value);
    const search = new URLSearchParams(searchParams);
    search.set('filter', value);
    search.set('filterBy', column.id);
    const url = `${pathname}?${search.toString()}`;
    router.replace(url);
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='-ml-3 h-8 data-[state=open]:bg-accent'
          >
            <span>{title}</span>
            <ChevronsUpDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          {items.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => handleFilter(item.value)}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export { DataTable, DataTableColumnSortHeader, DataTableColumnFilterHeader };
