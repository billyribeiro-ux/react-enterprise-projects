'use server';

import { z } from 'zod';
import { prisma } from './db';

const OrderSchema = z.object({
  symbol: z.string().min(3),
  side: z.enum(['BUY', 'SELL']),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
});

export async function executeLimitOrderAction(
  formData: FormData
): Promise<{ status: 'filled'; fillId: string } | { status: 'error'; message: string }> {
  const parsed = OrderSchema.safeParse({
    symbol: formData.get('symbol'),
    side: formData.get('side'),
    price: formData.get('price'),
    quantity: formData.get('quantity'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid limit order parameters' };
  }

  try {
    const inst = await prisma.tradingInstrument.upsert({
      where: { symbol: parsed.data.symbol },
      update: {},
      create: { symbol: parsed.data.symbol },
    });

    const fill = await prisma.limitOrderFill.create({
      data: {
        instrumentId: inst.id,
        side: parsed.data.side,
        price: parsed.data.price,
        quantity: parsed.data.quantity,
      },
    });
    return { status: 'filled', fillId: fill.id };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Order execution failed',
    };
  }
}
