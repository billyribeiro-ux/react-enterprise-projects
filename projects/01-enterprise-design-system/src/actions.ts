'use server';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const UpdateTokenSchema = z.object({
  id: z.string(),
  value: z.string().min(1, 'Token value required'),
  roughness: z.number().min(0).max(1).optional(),
  metalness: z.number().min(0).max(1).optional()
});

export async function updateDesignToken(prevState: any, formData: FormData) {
  const parsed = UpdateTokenSchema.safeParse({
    id: formData.get('id'),
    value: formData.get('value'),
    roughness: formData.get('roughness') ? Number(formData.get('roughness')) : 0.2,
    metalness: formData.get('metalness') ? Number(formData.get('metalness')) : 0.8
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    const updated = await prisma.componentToken.update({
      where: { id: parsed.data.id },
      data: {
        value: parsed.data.value,
        roughness: parsed.data.roughness,
        metalness: parsed.data.metalness
      }
    });
    return { success: true, token: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}