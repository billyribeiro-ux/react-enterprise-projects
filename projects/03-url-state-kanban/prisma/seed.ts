import { prisma } from '../src/db';

async function main(): Promise<void> {
  const board = await prisma.sprintBoard.upsert({
    where: { slug: 'q4-platform-architecture' },
    update: {},
    create: {
      slug: 'q4-platform-architecture',
      title: 'Q4 Principal Architecture Sprint',
    },
  });

  await prisma.kanbanTask.createMany({
    data: [
      { boardId: board.id, title: 'Zero-Allocation Ring Buffer', status: 'BACKLOG', orderRank: 1000, storyPoints: 8 },
      { boardId: board.id, title: 'React 19 Optimistic Kanban', status: 'IN_PROGRESS', orderRank: 2000, storyPoints: 5 },
      { boardId: board.id, title: 'Prisma v6 Multi-Model Schema', status: 'DONE', orderRank: 3000, storyPoints: 5 },
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
