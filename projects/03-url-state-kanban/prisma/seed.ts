import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.kanbanTask.deleteMany({});
  await prisma.kanbanColumn.deleteMany({});
  await prisma.kanbanBoard.deleteMany({});

  const b = await prisma.kanbanBoard.create({ data: { title: 'Cinematic Motion Architecture' } });
  const c1 = await prisma.kanbanColumn.create({ data: { boardId: b.id, title: 'In Concept', order: 0 } });
  const c2 = await prisma.kanbanColumn.create({ data: { boardId: b.id, title: 'Three.js Shaders', order: 1 } });
  const c3 = await prisma.kanbanColumn.create({ data: { boardId: b.id, title: 'Production Ready', order: 2 } });

  await prisma.kanbanTask.createMany({
    data: [
      { columnId: c1.id, title: 'Volumetric bloom shader integration', priority: 'critical', order: 0 },
      { columnId: c2.id, title: 'GSAP smooth layout flip transitions', priority: 'high', order: 0 },
      { columnId: c3.id, title: 'WCAG AAA contrast audit automation', priority: 'medium', order: 0 }
    ]
  });
  console.log('03-url-state-kanban seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());