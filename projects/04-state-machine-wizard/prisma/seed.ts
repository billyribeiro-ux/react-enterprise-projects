import { prisma } from '../src/db';

async function main(): Promise<void> {
  const wf = await prisma.workflowInstance.create({
    data: {
      entityName: 'Citadel Quantum Treasury LLC',
      currentState: 'IDENTITY_CHECK',
      riskScore: 8,
    },
  });

  await prisma.workflowTransitionLog.create({
    data: {
      instanceId: wf.id,
      fromState: 'INIT',
      toState: 'IDENTITY_CHECK',
      idempotencyKey: 'seed-init-001',
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
