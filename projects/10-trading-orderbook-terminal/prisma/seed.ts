import { prisma } from '../src/db';

async function main(): Promise<void> {
  const inst = await prisma.tradingInstrument.upsert({
    where: { symbol: 'BTC-USD-PERP' },
    update: {},
    create: { symbol: 'BTC-USD-PERP', tickSize: 0.5 },
  });

  await prisma.limitOrderFill.create({
    data: {
      instrumentId: inst.id,
      side: 'BUY',
      price: 98450.0,
      quantity: 2.5,
    },
  });
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
