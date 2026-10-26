import { prisma } from '../src/db';

async function main(): Promise<void> {
  const ep = await prisma.webhookEndpoint.upsert({
    where: { targetUrl: 'https://api.ledger.internal/v2/webhooks' },
    update: {},
    create: {
      targetUrl: 'https://api.ledger.internal/v2/webhooks',
      circuitState: 'CLOSED',
      consecutiveFails: 0,
    },
  });

  await prisma.webhookEventLog.create({
    data: {
      endpointId: ep.id,
      httpStatus: 200,
      backoffMs: 0,
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
