import { z } from 'zod';

export const env_variableSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, '名称不能为空').max(20, '名称不能超过20个字符'),
    action: z.enum(['download', 'git', 'shell']),
    value: z.string().min(1, '值不能为空'),
    value1: z.string().optional(),
    value2: z.string().optional(),
    value3: z.string().optional(),
  })
  .refine(
    (data) => {
      if (['download', 'git'].includes(data.action)) {
        if (!data.value1) {
          return false;
        }
      }
      return true;
    },
    {
      message: '路径不能为空',
      path: ['value1'],
    },
  );

export const envSchema = z.object({
  name: z.string().min(1, '名称不能为空').max(20, '名称不能超过20个字符'),
  desc: z.string().max(100, '描述不能超过100个字符').optional(),
  platform: z.enum(['webui', 'comfyui'], {
    required_error: '平台不能为空',
  }),
  is_active: z.boolean(),
  env_variables: z.array(env_variableSchema),
});
