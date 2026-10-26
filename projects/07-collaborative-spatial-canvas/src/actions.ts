'use server';

import { z } from 'zod';
import { prisma } from './db';

const SpatialTransformSchema = z.object({
  nodeId: z.string().min(1),
  posX: z.coerce.number(),
  posY: z.coerce.number(),
  posZ: z.coerce.number(),
  lamportTs: z.coerce.number().int().min(1),
  peerId: z.string().min(2),
});

export async function commitSpatialTransformAction(
  formData: FormData
): Promise<{ status: 'merged'; lamportTs: number } | { status: 'ignored_stale' } | { status: 'error'; message: string }> {
  const parsed = SpatialTransformSchema.safeParse({
    nodeId: formData.get('nodeId'),
    posX: formData.get('posX'),
    posY: formData.get('posY'),
    posZ: formData.get('posZ'),
    lamportTs: formData.get('lamportTs'),
    peerId: formData.get('peerId'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid 3D transform vector' };
  }

  const { nodeId, posX, posY, posZ, lamportTs, peerId } = parsed.data;

  try {
    const result = await prisma.spatialNode.updateMany({
      where: {
        id: nodeId,
        lamportTs: { lt: lamportTs },
      },
      data: { posX, posY, posZ, lamportTs, peerId },
    });

    if (result.count === 0) {
      return { status: 'ignored_stale' };
    }
    return { status: 'merged', lamportTs };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Spatial CRDT persistence failed',
    };
  }
}
