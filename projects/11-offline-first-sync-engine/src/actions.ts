'use server';

import { z } from 'zod';
import { prisma } from './db';

const DrainOutboxSchema = z.object({
  docKey: z.string().min(2),
  replicaId: z.string().min(2),
  body: z.string().min(1),
  deltaCount: z.coerce.number().int().min(1),
});

export async function drainOfflineOutboxAction(
  formData: FormData
): Promise<{ status: 'synced'; globalClock: number } | { status: 'error'; message: string }> {
  const parsed = DrainOutboxSchema.safeParse({
    docKey: formData.get('docKey'),
    replicaId: formData.get('replicaId'),
    body: formData.get('body'),
    deltaCount: formData.get('deltaCount'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid outbox sync payload' };
  }

  try {
    const doc = await prisma.syncDocument.upsert({
      where: { docKey: parsed.data.docKey },
      update: {
        body: parsed.data.body,
        globalClock: { increment: parsed.data.deltaCount },
      },
      create: {
        docKey: parsed.data.docKey,
        title: 'Synced Document',
        body: parsed.data.body,
        globalClock: parsed.data.deltaCount,
      },
    });

    await prisma.syncVectorClock.upsert({
      where: {
        documentId_replicaId: {
          documentId: doc.id,
          replicaId: parsed.data.replicaId,
        },
      },
      update: { counter: { increment: parsed.data.deltaCount } },
      create: {
        documentId: doc.id,
        replicaId: parsed.data.replicaId,
        counter: parsed.data.deltaCount,
      },
    });

    return { status: 'synced', globalClock: doc.globalClock };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Outbox drain failed',
    };
  }
}
