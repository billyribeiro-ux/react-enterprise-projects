'use server';
import { prisma } from '../lib/prisma';

export async function requeueJob(jobId: string) {
  try {
    const updated = await prisma.backgroundJob.update({
      where: { id: jobId },
      data: { status: 'queued', attempts: 0 }
    });
    return { success: true, job: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}