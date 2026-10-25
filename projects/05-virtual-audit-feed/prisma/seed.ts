import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.securityAuditLog.deleteMany({});
  const rows = [];
  for (let i = 1; i <= 200; i++) {
    rows.push({
      actorEmail: `security-eng-${i}@cyber.corp`,
      actionType: i % 3 === 0 ? 'SSH_KEY_ROTATE' : i % 2 === 0 ? 'DATABASE_SNAPSHOT' : 'POLICY_ENFORCE',
      ipAddress: `192.168.10.${(i % 254) + 1}`,
      severity: i % 10 === 0 ? 'critical' : i % 4 === 0 ? 'warn' : 'info',
      timestamp: new Date(Date.now() - i * 600000)
    });
  }
  await prisma.securityAuditLog.createMany({ data: rows });
  console.log('05-virtual-audit-feed seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());