import { prisma } from '../src/db';

async function main(): Promise<void> {
  const svc = await prisma.serviceIngestQuota.upsert({
    where: { serviceName: 'edge-auth-gateway' },
    update: {},
    create: { serviceName: 'edge-auth-gateway', maxRps: 75000 },
  });

  await prisma.telemetryEvent.upsert({
    where: { traceId: 'trc-00001' },
    update: {},
    create: {
      serviceId: svc.id,
      traceId: 'trc-00001',
      severity: 'INFO',
      latencyMs: 1.84,
      message: 'Zero-trust mTLS handshake verified at edge PoP',
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
