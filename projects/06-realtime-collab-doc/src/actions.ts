'use server';
import { prisma } from '../lib/prisma';

export async function updateCollabBlock(blockId: string, content: string) {
  try {
    const updated = await prisma.collabBlock.update({
      where: { id: blockId },
      data: { content }
    });
    return { success: true, block: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}