import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.componentToken.deleteMany({});
  await prisma.designTokenAudit.deleteMany({});

  await prisma.componentToken.createMany({
    data: [
      { component: 'SpatialSphere', category: '3d-material', cssVariable: '--primary-glow', value: '#38bdf8', roughness: 0.1, metalness: 0.9 },
      { component: 'GlassCard', category: 'elevation', cssVariable: '--glass-blur', value: 'backdrop-blur-xl', roughness: 0.05, metalness: 0.2 },
      { component: 'NeonButton', category: 'color', cssVariable: '--accent-neon', value: '#ec4899', roughness: 0.3, metalness: 0.7 },
      { component: 'KineticHeading', category: 'typography', cssVariable: '--font-cinema', value: 'Cinematic Display, sans-serif', roughness: 0.5, metalness: 0.5 }
    ]
  });

  await prisma.designTokenAudit.createMany({
    data: [
      { component: 'SpatialSphere', rulePassed: true, ruleName: 'spatial-depth-ratio', severity: 'info' },
      { component: 'GlassCard', rulePassed: true, ruleName: 'contrast-wcag-aaa', severity: 'info' },
      { component: 'NeonButton', rulePassed: true, ruleName: 'touch-target-44px', severity: 'info' }
    ]
  });
  console.log('01-enterprise-design-system seeded with 3D spatial materials');
}
main().catch(console.error).finally(() => prisma.$disconnect());