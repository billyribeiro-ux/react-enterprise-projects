import { prisma } from '../src/db';

async function main(): Promise<void> {
  const dag = await prisma.dagPipeline.upsert({
    where: { slug: 'lakehouse-vector-etl' },
    update: {},
    create: {
      slug: 'lakehouse-vector-etl',
      name: 'Lakehouse Vector Embedding Pipeline',
      edgesJson: JSON.stringify([['INGEST', 'EMBED'], ['EMBED', 'INDEX']]),
    },
  });

  await prisma.deadLetterJob.create({
    data: {
      pipelineId: dag.id,
      stageName: 'EMBED',
      errorReason: 'Rate limit exceeded on shard 04 (isolated to DLQ)',
      retryCount: 1,
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
