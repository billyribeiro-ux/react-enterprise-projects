import { prisma } from '../src/db';

async function main(): Promise<void> {
  await prisma.commerceSku.upsert({
    where: { skuCode: 'NV-BLACKWELL-ULTRA' },
    update: {},
    create: {
      skuCode: 'NV-BLACKWELL-ULTRA',
      title: 'Blackwell Ultra AI Workstation Node',
      priceCents: 2850000,
      availableStock: 4,
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
