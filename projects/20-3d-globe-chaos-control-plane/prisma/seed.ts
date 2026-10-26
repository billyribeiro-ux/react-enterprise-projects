import { prisma } from '../src/db';

async function main(): Promise<void> {
  const reg = await prisma.edgeRegionCluster.upsert({
    where: { regionCode: 'us-east-va' },
    update: {},
    create: { regionCode: 'us-east-va', status: 'HEALTHY', trafficPct: 40 },
  });

  await prisma.chaosExperimentLog.create({
    data: {
      regionId: reg.id,
      faultType: 'BGP_BLACKHOLE_DRILL',
      blastRadius: 'SINGLE_AZ_ISOLATED',
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
