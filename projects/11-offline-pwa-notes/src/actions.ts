'use server';
import { prisma } from '../lib/prisma';

export async function syncNote(id: string, title: string, content: string, version: number) {
  try {
    const note = await prisma.offlineNote.upsert({
      where: { id },
      update: { title, content, version: version + 1 },
      create: { id, title, content, version: 1 }
    });
    return { success: true, note };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}