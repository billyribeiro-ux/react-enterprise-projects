'use server';

import { z } from 'zod';
import { prisma } from './db';

const IngestLogSchema = z.object({
  serviceName: z.string().min(2),
  traceId: z.string().min(4),
  severity: z.enum(['INFO', 'WARN', 'ERROR']),
  latencyMs: z.coerce.number().min(0),
  message: z.string().min(2),
});

export async function ingestTelemetryEventAction(
  formData: FormData
): Promise<{ status: 'success'; traceId: string } | { status: 'error'; message: string }> {
  const parsed = IngestLogSchema.safeParse({
    serviceName: formData.get('serviceName'),
    traceId: formData.get('traceId'),
    severity: formData.get('severity'),
    latencyMs: formData.get('latencyMs'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid telemetry event payload' };
  }

  try {
    const svc = await prisma.serviceIngestQuota.upsert({
      where: { serviceName: parsed.data.serviceName },
      update: {},
      create: { serviceName: parsed.data.serviceName },
    });

    await prisma.telemetryEvent.create({
      data: {
        serviceId: svc.id,
        traceId: parsed.data.traceId,
        severity: parsed.data.severity,
        latencyMs: parsed.data.latencyMs,
        message: parsed.data.message,
      },
    });
    return { status: 'success', traceId: parsed.data.traceId };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Telemetry ingestion failed',
    };
  }
}
