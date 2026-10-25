'use server';
import { prisma } from '../lib/prisma';

export async function snapshotOrderBook(symbol: string, bid: number, ask: number) {
  try {
    const pair = await prisma.tradingPair.findUnique({ where: { symbol } });
    if (!pair) throw new Error('Pair not found');
    const snap = await prisma.marketSnapshot.create({
      data: { pairId: pair.id, highestBid: bid, lowestAsk: ask, spread: ask - bid }
    });
    return { success: true, snap };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}