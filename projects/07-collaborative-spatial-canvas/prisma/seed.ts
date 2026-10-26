import { prisma } from '../src/db';

async function main(): Promise<void> {
  const scene = await prisma.spatialScene.upsert({
    where: { slug: 'system-topology-3d' },
    update: {},
    create: { slug: 'system-topology-3d', title: 'Global Mesh 3D Topology' },
  });

  await prisma.spatialNode.create({
    data: {
      sceneId: scene.id,
      label: 'Edge Gateway Cluster',
      posX: 1.5,
      posY: 0.8,
      posZ: -0.5,
      lamportTs: 10,
      peerId: 'peer-seed',
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
