'use server';

import { z } from 'zod';
import { prisma } from './db';

const ReserveSchema = z.object({
  skuCode: z.string().min(2),
  quantity: z.coerce.number().int().min(1).max(5),
  idempotencyToken: z.string().min(4),
});

export async function reserveFlashInventoryAction(
  formData: FormData
): Promise<{ status: 'reserved'; remaining: number } | { status: 'sold_out' } | { status: 'error'; message: string }> {
  const parsed = ReserveSchema.safeParse({
    skuCode: formData.get('skuCode'),
    quantity: formData.get('quantity'),
    idempotencyToken: formData.get('idempotencyToken'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid reservation request' };
  }

  const { skuCode, quantity, idempotencyToken } = parsed.data;

  try {
    const res = await prisma.commerceSku.updateMany({
      where: {
        skuCode,
        availableStock: { gte: quantity },
      },
      data: {
        availableStock: { decrement: quantity },
      },
    });

    if (res.count === 0) {
      return { status: 'sold_out' };
    }

    const updated = await prisma.commerceSku.findUnique({ where: { skuCode } });
    if (updated) {
      await prisma.inventoryReservation.create({
        data: {
          skuId: updated.id,
          quantity,
          idempotencyToken,
        },
      });
    }

    return { status: 'reserved', remaining: updated?.availableStock ?? 0 };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Reservation failed',
    };
  }
}
