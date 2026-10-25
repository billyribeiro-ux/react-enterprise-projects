import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});
  await prisma.product.createMany({
    data: [
      { name: 'Apple M4 Max Studio Workstation', priceCents: 499900, stockQty: 18 },
      { name: 'Vision Pro Spatial Spatial Rig', priceCents: 349900, stockQty: 7 }
    ]
  });
  console.log('12-ecommerce-ppr-storefront seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());