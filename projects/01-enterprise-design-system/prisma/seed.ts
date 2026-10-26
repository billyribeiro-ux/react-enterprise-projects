import { prisma } from '../src/db';

async function main(): Promise<void> {
  const primary = await prisma.designToken.upsert({
    where: { name: 'color.primary.accent' },
    update: {},
    create: {
      name: 'color.primary.accent',
      category: 'color',
      cssVar: '--ds-color-primary',
      value: '#38bdf8',
      roughness: 0.15,
      metalness: 0.85,
    },
  });

  await prisma.designToken.upsert({
    where: { name: 'color.surface.elevated' },
    update: {},
    create: {
      name: 'color.surface.elevated',
      category: 'color',
      cssVar: '--ds-surface-elevated',
      value: '#6366f1',
      roughness: 0.32,
      metalness: 0.65,
    },
  });

  await prisma.tokenRevision.create({
    data: {
      designTokenId: primary.id,
      previousValue: '#0284c7',
      nextValue: '#38bdf8',
      author: 'system-seed',
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
