import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.onboardingSession.deleteMany({});
  await prisma.onboardingSession.create({
    data: {
      sessionToken: 'sess-hollywood-900',
      currentStep: 1,
      companyLegalName: 'Skydance Orbital LLC',
      countryCode: 'US',
      complianceScore: 98,
      complianceStatus: 'draft'
    }
  });
  console.log('04-multi-step-wizard seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());