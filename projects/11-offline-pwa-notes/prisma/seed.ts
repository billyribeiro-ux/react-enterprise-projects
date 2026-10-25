import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.offlineNote.deleteMany({});
  await prisma.offlineNote.create({
    data: { title: 'Local-First Vector Architecture', content: 'IndexedDB client replica synchronized with SQLite remote endpoint.', version: 1 }
  });
  console.log('11-offline-pwa-notes seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());