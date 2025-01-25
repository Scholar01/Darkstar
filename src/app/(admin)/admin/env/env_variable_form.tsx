import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { env_action } from '@prisma/client';
import { useState } from 'react';
import { env_variableSchema } from '@/lib/shemas';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';



/**
 * 环境变量表单
 * @param param0
 * @returns
 */
 const EnvVariableForm: React.FC<{
    children: React.ReactNode;
    defaultValues?: z.infer<typeof env_variableSchema>;
    onSuccess: (data: z.infer<typeof env_variableSchema>) => void;
  }> = ({ children, defaultValues, onSuccess }) => {
    const [open, setOpen] = useState(false);
    const [, setAction] = useState<env_action>('download');
    const form = useForm<z.infer<typeof env_variableSchema>>({
      resolver: zodResolver(env_variableSchema),
      defaultValues: defaultValues || {
        name: '',
        action: 'download',
        value: '',
        value1: '',
        value2: '',
        value3: '',
      },
    });
  
    const onSubmit = (data: z.infer<typeof env_variableSchema>) => {
      onSuccess(data);
      form.reset();
      setOpen(false);
    };
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>环境变量</DialogTitle>
            <DialogDescription>
              环境变量是用于AI后端的配置,可以用于下载模型,安装插件,执行shell等操作
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名称</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name='action'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>操作</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        setAction(value as env_action);
                        form.setValue('value1', '');
                        form.setValue('value2', '');
                        form.setValue('value3', '');
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='请选择操作' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='download'>下载任务</SelectItem>
                        <SelectItem value='git'>GIT克隆</SelectItem>
                        <SelectItem value='shell'>执行命令</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name='value'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.getValues('action') === 'download' && '下载地址'}
                      {form.getValues('action') === 'git' && 'git地址'}
                      {form.getValues('action') === 'shell' && '终端命令'}
                    </FormLabel>
                    <FormControl>
                      {form.getValues('action') === 'download' ? (
                        <Input {...field} />
                      ) : form.getValues('action') === 'git' ? (
                        <Input {...field} />
                      ) : (
                        <Textarea
                          placeholder='请输入终端命令,注意系统版本'
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              {['download', 'git'].includes(form.getValues('action')) && (
                <FormField
                  control={form.control}
                  name='value1'
                  render={({ field }) => (
                    <FormItem {...field}>
                      <FormLabel>保存路径</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
  
              <div className='flex justify-end gap-2'>
                <DialogClose asChild>
                  <Button
                    variant='outline'
                    size='lg'
                    type='button'
                    onClick={() => form.reset()}
                  >
                    取消
                  </Button>
                </DialogClose>
                <Button type='submit' size='lg'>
                  提交
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
};
export default EnvVariableForm;
