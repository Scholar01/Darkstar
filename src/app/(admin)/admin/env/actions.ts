'use server';

import prisma from '@/lib/prisma';
import { envSchema } from '@/lib/shemas';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function createEnv(data: z.infer<typeof envSchema>) {
  const validatedFields = envSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 判断环境名称是否存在
  if (
    await prisma.env.findFirst({
      where: {
        name: data.name,
      },
    })
  ) {
    return {
      errors: { name: ['环境名称已存在'] },
    };
  }

  // 创建环境
  const env = await prisma.env.create({
    data: {
      name: data.name,
      desc: data.desc || null,
      platform: data.platform,
      is_active: data.is_active,
    },
  });

  // 创建环境变量
  await prisma.env_variable.createMany({
    data: data.env_variables.map((item) => ({
      ...item,
      env_id: env.id,
    })),
  });

  revalidatePath('/admin/env');

  return {
    errors: null,
  };
}
