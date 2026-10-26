import { prisma } from '../src/db';

async function main(): Promise<void> {
  const doc = await prisma.syncDocument.upsert({
    where: { docKey: 'rfc-local-first-2026' },
    update: {},
    create: {
      docKey: 'rfc-local-first-2026',
      title: 'RFC-042: Local-First Edge Replication',
      body: 'Initial committed state v1',
      globalClock: 1,
    },
  });

  await prisma.syncVectorClock.upsert({
    where: {
      documentId_replicaId: {
        documentId: doc.id,
        replicaId: 'replica-macbook-pro',
      },
    },
    update: {},
    create: {
      documentId: doc.id,
      replicaId: 'replica-macbook-pro',
      counter: 1,
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
