'use server';
import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function switchSaaSTier(tenantId: string, newTier: string) {
  try {
    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: { planTier: newTier }
    });
    revalidatePath('/dashboard');
    return { success: true, tenant: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}