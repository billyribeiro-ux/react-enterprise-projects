import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.userRole.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.user.deleteMany({});

  const r = await prisma.role.create({ data: { name: 'SUPER_ADMIN' } });
  const u = await prisma.user.create({ data: { email: 'secops@enterprise.corp', name: 'Billy Ribeiro' } });
  await prisma.userRole.create({ data: { userId: u.id, roleId: r.id } });
  console.log('09-enterprise-rbac-auth seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());