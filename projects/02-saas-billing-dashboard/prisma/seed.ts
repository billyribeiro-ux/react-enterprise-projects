import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.invoice.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.tenant.deleteMany({});

  const t = await prisma.tenant.create({
    data: {
      name: 'OmniCorp Global Holdings',
      slug: 'omnicorp',
      planTier: 'enterprise',
      mrrCents: 4892100,
      netRetention: 138.4
    }
  });

  await prisma.subscription.create({
    data: { tenantId: t.id, status: 'active', priceCents: 4892100, renewsAt: new Date(Date.now() + 365*24*3600*1000) }
  });

  await prisma.invoice.createMany({
    data: [
      { tenantId: t.id, amountDue: 4892100, amountPaid: 4892100, status: 'paid', pdfUrl: 'https://cdn.saas.io/inv-omni-01.pdf' },
      { tenantId: t.id, amountDue: 4892100, amountPaid: 4892100, status: 'paid', pdfUrl: 'https://cdn.saas.io/inv-omni-02.pdf' }
    ]
  });
  console.log('02-saas-billing-dashboard seeded with cinematic KPI metrics');
}
main().catch(console.error).finally(() => prisma.$disconnect());