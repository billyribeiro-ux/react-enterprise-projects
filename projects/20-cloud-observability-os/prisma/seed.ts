import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.traceSpan.deleteMany({});
  await prisma.microservice.deleteMany({});

  const s1 = await prisma.microservice.create({ data: { name: 'global-ingress', status: 'healthy' } });
  const s2 = await prisma.microservice.create({ data: { name: 'threejs-render-farm', status: 'healthy' } });
  const s3 = await prisma.microservice.create({ data: { name: 'prisma-edge-db', status: 'healthy' } });

  const traceId = 'trace-hollywood-999';
  await prisma.traceSpan.createMany({
    data: [
      { serviceId: s1.id, traceId, name: 'POST /v1/telemetry', durationMs: 42.4 },
      { serviceId: s2.id, traceId, name: 'CompileWebGLShaders', durationMs: 24.8 },
      { serviceId: s3.id, traceId, name: 'Prisma.BatchQuery', durationMs: 14.2 }
    ]
  });
  console.log('20-cloud-observability-os seeded with 3D APM telemetry');
}
main().catch(console.error).finally(() => prisma.$disconnect());