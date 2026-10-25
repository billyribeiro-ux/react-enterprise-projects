import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.audioTrack.deleteMany({});
  await prisma.audioProject.deleteMany({});

  const p = await prisma.audioProject.create({ data: { title: 'Blade Runner 2049 Synthwave', bpm: 128 } });
  await prisma.audioTrack.createMany({
    data: [
      { projectId: p.id, name: 'Cyber Sub-Kick', steps: '1000100010001000' },
      { projectId: p.id, name: 'Hologram Snare', steps: '0000100000001000' },
      { projectId: p.id, name: 'Neon HiHat', steps: '1010101010101010' }
    ]
  });
  console.log('10-web-audio-daw seeded with 3D audio tracks');
}
main().catch(console.error).finally(() => prisma.$disconnect());