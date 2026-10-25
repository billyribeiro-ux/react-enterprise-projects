import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.marketSnapshot.deleteMany({});
  await prisma.tradingPair.deleteMany({});

  const p = await prisma.tradingPair.create({ data: { symbol: 'BTC-USD' } });
  await prisma.marketSnapshot.create({
    data: { pairId: p.id, highestBid: 98450.0, lowestAsk: 98450.5, spread: 0.5 }
  });
  console.log('07-crypto-order-book seeded with 3D trading models');
}
main().catch(console.error).finally(() => prisma.$disconnect());