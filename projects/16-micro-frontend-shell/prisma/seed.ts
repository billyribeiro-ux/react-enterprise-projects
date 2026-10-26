import { prisma } from '../src/db';

async function main(): Promise<void> {
  const manifest = await prisma.microAppManifest.upsert({
    where: { remoteScope: '@acme/checkout-remote' },
    update: {},
    create: {
      remoteScope: '@acme/checkout-remote',
      entryUrl: 'https://cdn.acme.internal/checkout/2.4.0/remoteEntry.js',
      sriSha384: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
      activeVersion: '2.4.0',
      healthy: true,
    },
  });

  await prisma.remoteDeploymentHistory.create({
    data: {
      manifestId: manifest.id,
      version: '2.4.0',
      sriSha384: manifest.sriSha384,
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
