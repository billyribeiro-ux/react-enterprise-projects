'use server';
import { prisma } from '../lib/prisma';

export async function fetchAuditLogs(take = 50) {
  try {
    const logs = await prisma.securityAuditLog.findMany({
      take,
      orderBy: { timestamp: 'desc' }
    });
    return { success: true, logs };
  } catch (err: any) {
    return { success: false, error: err.message, logs: [] };
  }
}