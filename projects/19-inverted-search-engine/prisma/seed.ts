import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.searchDoc.deleteMany({});
  await prisma.searchDoc.createMany({
    data: [
      { title: 'Three.js Shaders in React 19', content: 'Compile WebGL vertex and fragment shaders for real-time 3D telemetry.' },
      { title: 'Prisma v6 Client Singleton Pattern', content: 'Preserve database connection pools during Next.js App Router hot reloads.' }
    ]
  });
  console.log('19-inverted-search-engine seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());