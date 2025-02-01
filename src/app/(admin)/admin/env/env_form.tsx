'use client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { envSchema } from '@/lib/shemas';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data_table';
import { env_variable_columns } from '@/app/(admin)/admin/env/columns';
import { useState, useTransition } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';
import EnvVariableForm from '@/app/(admin)/admin/env/env_variable_form';
import { createEnv, updateEnv } from '@/app/(admin)/admin/env/actions';
import { Loader2 } from 'lucide-react';
import { setFormErrorsFromActionError } from '@/lib/utils';
const EnvForm: React.FC<{
  children: React.ReactNode;
  title?: string;
  description?: string;
  defaultValues?: z.infer<typeof envSchema>;
}> = ({ children, title, description, defaultValues }) => {
  console.log(defaultValues);
  
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof envSchema>>({
    resolver: zodResolver(envSchema),
    defaultValues: defaultValues || {
      name: '',
      desc: '',
      platform: 'webui',
      is_active: false,
      env_variables: [],
    },
  });

  const onSubmit = (data: z.infer<typeof envSchema>) => {
    console.log(data);
    startTransition(async () => {
      let res;
      if (data.id) {
        res = await updateEnv(data);
      } else {
        res = await createEnv(data);
      }
      if (res.errors) {
        setFormErrorsFromActionError(form.setError, res.errors);
        return;
      }

      form.reset();
      setOpen(false);
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-4 space-y-4'
          >
            <FormField
              control={form.control}
              name='id'
              render={({ field }) => (
                <input type='hidden' {...field} />
              )}
            />


            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    环境名称 <span className='text-xs text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='请输入环境名称' autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='desc'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>环境描述</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入环境描述' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='platform'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>平台</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='请选择平台' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='webui'>WebUI</SelectItem>
                      <SelectItem value='comfyui'>ComfyUI</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='env_variables'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between'>
                    <FormLabel>环境变量</FormLabel>
                    <EnvVariableForm
                      onSuccess={(data) => {
                        data.id = field.value.length + 1;
                        field.onChange([...field.value, data]);
                      }}
                    >
                      <Button
                        variant='outline'
                        size='icon'
                        aria-label='添加环境变量'
                        type='button'
                      >
                        <FaCirclePlus />
                      </Button>
                    </EnvVariableForm>
                  </div>
                  <FormControl>
                    <DataTable
                      columns={env_variable_columns}
                      data={field.value}
                      onEdit={(row) => {
                        // 更新数据
                        field.onChange(
                          field.value.map((item) =>
                            item.id === row.id ? row : item,
                          ),
                        );
                      }}
                      onDelete={(row) => {
                        field.onChange(
                          field.value.filter((item) => item.id !== row.id),
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='is_active'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center gap-2 space-y-0'>
                  <FormControl>
                    <Switch
                      defaultChecked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='text-sm'>激活环境</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2'>
              <SheetClose asChild>
                <Button
                  variant='outline'
                  size='lg'
                  type='button'
                  onClick={() => form.reset()}
                >
                  取消
                </Button>
              </SheetClose>
              <Button type='submit' size='lg' disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    提交中
                  </>
                ) : (
                  '提交'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EnvForm;
