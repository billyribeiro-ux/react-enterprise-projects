import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.microAppRegistry.deleteMany({});
  await prisma.microAppRegistry.createMany({
    data: [
      { appName: 'analytics-remote', entryUrl: 'https://cdn.mfe.corp/analytics/remoteEntry.js', version: '2.4.0' },
      { appName: 'billing-remote', entryUrl: 'https://cdn.mfe.corp/billing/remoteEntry.js', version: '1.9.1' }
    ]
  });
  console.log('16-micro-frontend-federation seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());