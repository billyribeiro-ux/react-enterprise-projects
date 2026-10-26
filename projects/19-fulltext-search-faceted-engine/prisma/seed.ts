import { prisma } from '../src/db';

async function main(): Promise<void> {
  const doc = await prisma.searchDocument.upsert({
    where: { docSlug: 'runbook-prisma-occ' },
    update: {},
    create: {
      docSlug: 'runbook-prisma-occ',
      title: 'Prisma v6 Optimistic Concurrency & Lock Runbook',
      domain: 'Database',
      docLength: 48,
    },
  });

  await prisma.searchPosting.upsert({
    where: { documentId_term: { documentId: doc.id, term: 'prisma' } },
    update: {},
    create: { documentId: doc.id, term: 'prisma', termFrequency: 4 },
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
