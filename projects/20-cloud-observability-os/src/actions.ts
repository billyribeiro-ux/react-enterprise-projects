'use server';
import { prisma } from '../lib/prisma';

export async function fetchTraceSpans(traceId: string) {
  try {
    const spans = await prisma.traceSpan.findMany({
      where: { traceId },
      include: { service: true }
    });
    return { success: true, spans };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}