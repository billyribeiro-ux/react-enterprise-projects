'use server';
import { prisma } from '../lib/prisma';

export async function moveKineticTask(taskId: string, targetColId: string) {
  try {
    const task = await prisma.kanbanTask.update({
      where: { id: taskId },
      data: { columnId: targetColId }
    });
    return { success: true, task };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}