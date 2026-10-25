'use server';
import { prisma } from '../lib/prisma';

export async function completeVaultFile(id: string) {
  try {
    const f = await prisma.vaultFile.update({ where: { id }, data: { status: 'completed' } });
    return { success: true, file: f };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}