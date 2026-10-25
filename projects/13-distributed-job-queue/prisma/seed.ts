import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.backgroundJob.deleteMany({});
  await prisma.backgroundJob.createMany({
    data: [
      { queueName: 'video-render-4k', status: 'completed', attempts: 1 },
      { queueName: 'ai-embedding-gen', status: 'running', attempts: 1 },
      { queueName: 'stripe-payout', status: 'failed', attempts: 3 }
    ]
  });
  console.log('13-distributed-job-queue seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());