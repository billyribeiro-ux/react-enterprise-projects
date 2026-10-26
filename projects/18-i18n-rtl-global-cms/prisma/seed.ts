import { prisma } from '../src/db';

async function main(): Promise<void> {
  const ns = await prisma.contentNamespace.upsert({
    where: { nsKey: 'enterprise-docs' },
    update: {},
    create: { nsKey: 'enterprise-docs' },
  });

  await prisma.localizedArticle.upsert({
    where: { slug_locale: { slug: 'cloud-2026', locale: 'en-US' } },
    update: {},
    create: {
      namespaceId: ns.id,
      slug: 'cloud-2026',
      locale: 'en-US',
      dir: 'ltr',
      headline: 'Global Edge Mesh Architecture 2026',
    },
  });

  await prisma.localizedArticle.upsert({
    where: { slug_locale: { slug: 'cloud-2026', locale: 'ar-SA' } },
    update: {},
    create: {
      namespaceId: ns.id,
      slug: 'cloud-2026',
      locale: 'ar-SA',
      dir: 'rtl',
      headline: 'هندسة الشبكة السحابية العالمية ٢٠٢٦',
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
