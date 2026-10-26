'use server';

import { z } from 'zod';
import { prisma } from './db';

export type TaskStatus = 'BACKLOG' | 'IN_PROGRESS' | 'DONE';

export interface MoveTaskPayload {
  taskId: string;
  targetStatus: TaskStatus;
  newOrderRank: number;
}

const MoveTaskSchema = z.object({
  taskId: z.string().min(1),
  targetStatus: z.enum(['BACKLOG', 'IN_PROGRESS', 'DONE']),
  prevRank: z.coerce.number(),
  nextRank: z.coerce.number(),
});

export async function moveKanbanTaskAction(
  formData: FormData
): Promise<{ status: 'success'; data: MoveTaskPayload } | { status: 'error'; message: string }> {
  const parsed = MoveTaskSchema.safeParse({
    taskId: formData.get('taskId'),
    targetStatus: formData.get('targetStatus'),
    prevRank: formData.get('prevRank'),
    nextRank: formData.get('nextRank'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid task movement coordinates' };
  }

  const newOrderRank = (parsed.data.prevRank + parsed.data.nextRank) / 2;

  try {
    await prisma.kanbanTask.update({
      where: { id: parsed.data.taskId },
      data: {
        status: parsed.data.targetStatus,
        orderRank: newOrderRank,
      },
    });
    return {
      status: 'success',
      data: {
        taskId: parsed.data.taskId,
        targetStatus: parsed.data.targetStatus,
        newOrderRank,
      },
    };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Failed to move task',
    };
  }
}
