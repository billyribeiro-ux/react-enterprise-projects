import { prisma } from '../src/db';

async function main(): Promise<void> {
  const role = await prisma.iamRole.upsert({
    where: { roleSlug: 'principal-security-architect' },
    update: {},
    create: {
      roleSlug: 'principal-security-architect',
      displayName: 'Principal Security Architect',
      capabilityMask: 7, // READ (1) | MUTATE (2) | ROTATE_KEYS (4)
    },
  });

  await prisma.iamPermissionGrant.upsert({
    where: {
      roleId_permissionCode: {
        roleId: role.id,
        permissionCode: 'ROTATE_KEYS',
      },
    },
    update: {},
    create: {
      roleId: role.id,
      permissionCode: 'ROTATE_KEYS',
      bitValue: 4,
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
