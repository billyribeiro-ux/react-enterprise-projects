'use server';
import { prisma } from '../lib/prisma';

export async function recordWebhook(amount: number) {
  try {
    const o = await prisma.stripeOrder.create({ data: { amount, currency: 'usd' } });
    return { success: true, order: o };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}