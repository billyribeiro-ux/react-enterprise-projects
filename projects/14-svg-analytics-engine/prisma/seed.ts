import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.metricTimeSeries.deleteMany({});
  const rows = [];
  for (let i = 0; i < 24; i++) {
    rows.push({
      metric: 'cluster_p99_latency',
      timestamp: new Date(Date.now() - (24 - i) * 3600000),
      value: 14.2 + Math.sin(i / 2) * 5
    });
  }
  await prisma.metricTimeSeries.createMany({ data: rows });
  console.log('14-svg-analytics-engine seeded with vector metrics');
}
main().catch(console.error).finally(() => prisma.$disconnect());