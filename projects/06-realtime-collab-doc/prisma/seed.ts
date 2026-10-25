import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.collabBlock.deleteMany({});
  await prisma.collabDocument.deleteMany({});

  const d = await prisma.collabDocument.create({
    data: { title: 'Hollywood Spatial Motion Architecture Blueprint' }
  });

  await prisma.collabBlock.createMany({
    data: [
      { docId: d.id, content: '# Production Grade Three.js & GSAP Engine' },
      { docId: d.id, content: 'GPU-accelerated WebGL materials paired with zero-runtime CSS tokens.' }
    ]
  });
  console.log('06-realtime-collab-doc seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());