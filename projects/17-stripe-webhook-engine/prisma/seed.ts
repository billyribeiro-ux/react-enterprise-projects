import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.stripeOrder.deleteMany({});
  await prisma.stripeOrder.create({ data: { amount: 4892000, currency: 'usd', status: 'succeeded' } });
  console.log('17-stripe-webhook-engine seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());