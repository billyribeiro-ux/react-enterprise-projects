import { prisma } from '../src/db';

async function main(): Promise<void> {
  await prisma.omniCommand.upsert({
    where: { slug: 'deploy-prod-canary' },
    update: {},
    create: {
      slug: 'deploy-prod-canary',
      title: 'Deploy Production Canary (Edge Region)',
      shortcut: '⌘+Shift+D',
      category: 'Release Engineering',
      invocations: 42,
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
