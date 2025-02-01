'use server';

import prisma from '@/lib/prisma';
import { envSchema } from '@/lib/shemas';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

/**
 * 激活环境
 * @param id 环境id
 */
async function activeEnv(id: number) {
  await prisma.env.update({
    where: { id },
    data: { is_active: true },
  });

  // 把其他环境设置为未激活
  await prisma.env.updateMany({
    where: { id: { not: id } },
    data: { is_active: false },
  });
}

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

  if (data.is_active) {
    await activeEnv(env.id);
  }

  revalidatePath('/admin/env');

  return {
    errors: null,
  };
}

export async function updateEnv(data: z.infer<typeof envSchema>) {
  const validatedFields = envSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  if (!data.id) {
    return {
      errors: { id: ['id不能为空'] },
    };
  }

  await prisma.env.update({
    where: { id: data.id },
    data: {
      name: data.name,
      desc: data.desc || null,
      platform: data.platform,
      is_active: data.is_active,
    },
  });

  // 更新环境变量
  await prisma.env_variable.deleteMany({
    where: { env_id: data.id },
  });
  await prisma.env_variable.createMany({
    data: data.env_variables.map((item) => ({
      ...item,
      env_id: data.id!,
    })),
  });

  if (data.is_active) {
    await activeEnv(data.id);
  }

  revalidatePath('/admin/env');

  return {
    errors: null,
  };
}


export async function deleteEnv(formData: FormData) {
  const id = formData.get('id');
  
  await prisma.env.delete({
    where: { id: Number(id) },
  });

  revalidatePath('/admin/env');
}
