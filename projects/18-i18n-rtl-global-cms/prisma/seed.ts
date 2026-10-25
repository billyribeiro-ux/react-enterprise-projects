import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.localizedArticle.deleteMany({});
  await prisma.localizedArticle.createMany({
    data: [
      { slug: 'cloud-2026', locale: 'en-US', title: 'Global Cloud Security & Resilience', body: 'Modern enterprise systems mandate end-to-end zero-trust architecture.' },
      { slug: 'cloud-2026', locale: 'ar-SA', title: 'أمن السحابة العالمية والمرونة', body: 'تفرض أنظمة المؤسسات الحديثة بنية انعدام الثقة الشاملة.' }
    ]
  });
  console.log('18-i18n-rtl-global-cms seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());