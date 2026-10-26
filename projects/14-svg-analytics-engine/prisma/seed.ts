import { prisma } from '../src/db';

async function main(): Promise<void> {
  const series = await prisma.metricSeries.upsert({
    where: { seriesKey: 'cluster-health-radar' },
    update: {},
    create: { seriesKey: 'cluster-health-radar', unit: 'pct' },
  });

  await prisma.metricDatapoint.createMany({
    data: [
      { seriesId: series.id, axisLabel: 'Throughput', score: 96 },
      { seriesId: series.id, axisLabel: 'Security', score: 100 },
      { seriesId: series.id, axisLabel: 'CacheHit', score: 92 },
    ],
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
