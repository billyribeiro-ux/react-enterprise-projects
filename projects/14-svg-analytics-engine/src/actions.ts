'use server';
import { prisma } from '../lib/prisma';

export async function fetchMetrics() {
  try {
    const data = await prisma.metricTimeSeries.findMany({ take: 24, orderBy: { timestamp: 'asc' } });
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}