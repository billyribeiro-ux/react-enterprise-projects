import { prisma } from '../src/db';

async function main(): Promise<void> {
  const sub = await prisma.tenantSubscription.upsert({
    where: { tenantSlug: 'acme-global-ai' },
    update: {},
    create: {
      tenantSlug: 'acme-global-ai',
      planTier: 'ENTERPRISE',
      seats: 120,
      mrrCents: 1440000,
      nrrPercent: 138.5,
      version: 1,
    },
  });

  await prisma.invoiceLineItem.create({
    data: {
      subscriptionId: sub.id,
      description: 'Initial Enterprise 120-Seat Provisioning',
      amountCents: 1440000,
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
