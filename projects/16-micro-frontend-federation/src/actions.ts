'use server';
import { prisma } from '../lib/prisma';

export async function toggleMicroApp(appName: string, isActive: boolean) {
  try {
    const updated = await prisma.microAppRegistry.update({ where: { appName }, data: { isActive } });
    return { success: true, app: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}