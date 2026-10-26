import { prisma } from '../src/db';

async function main(): Promise<void> {
  const thread = await prisma.aiThread.create({
    data: { title: 'L8+ Architecture Audit Session' },
  });

  await prisma.aiMessage.create({
    data: {
      threadId: thread.id,
      role: 'assistant',
      content: 'Copilot ready. All 20 Principal Engineer telemetry channels online.',
      tokenCount: 18,
      ttftMs: 24.1,
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
