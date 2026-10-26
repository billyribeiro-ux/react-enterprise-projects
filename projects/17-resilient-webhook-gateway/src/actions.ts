'use server';

import { z } from 'zod';
import { prisma } from './db';

export function computeFullJitterBackoffMs(attempt: number, baseMs = 100, capMs = 10000): number {
  const exp = Math.min(capMs, baseMs * Math.pow(2, attempt));
  return Math.floor( exp * 0.75 );
}

const DeliverySchema = z.object({
  targetUrl: z.string().url(),
  httpStatus: z.coerce.number().int(),
  attempt: z.coerce.number().int().min(0),
});

export async function recordWebhookDeliveryAction(
  formData: FormData
): Promise<{ status: 'logged'; circuitState: string; backoffMs: number } | { status: 'error'; message: string }> {
  const parsed = DeliverySchema.safeParse({
    targetUrl: formData.get('targetUrl'),
    httpStatus: formData.get('httpStatus'),
    attempt: formData.get('attempt'),
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Invalid webhook delivery telemetry' };
  }

  const isSuccess = parsed.data.httpStatus >= 200 && parsed.data.httpStatus < 300;
  const backoffMs = isSuccess ? 0 : computeFullJitterBackoffMs(parsed.data.attempt);
  const nextState = isSuccess ? 'CLOSED' : parsed.data.attempt >= 3 ? 'OPEN' : 'CLOSED';

  const ep = await prisma.webhookEndpoint.upsert({
    where: { targetUrl: parsed.data.targetUrl },
    update: {
      circuitState: nextState,
      consecutiveFails: isSuccess ? 0 : { increment: 1 },
    },
    create: {
      targetUrl: parsed.data.targetUrl,
      circuitState: nextState,
      consecutiveFails: isSuccess ? 0 : 1,
    },
  });

  await prisma.webhookEventLog.create({
    data: {
      endpointId: ep.id,
      httpStatus: parsed.data.httpStatus,
      backoffMs,
    },
  });

  return { status: 'logged', circuitState: nextState, backoffMs };
}
