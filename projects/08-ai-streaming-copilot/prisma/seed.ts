import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.copilotMessage.deleteMany({});
  await prisma.copilotConversation.deleteMany({});

  const c = await prisma.copilotConversation.create({ data: { title: 'Three.js Shader Optimization' } });
  await prisma.copilotMessage.create({
    data: { conversationId: c.id, role: 'assistant', content: 'Use instanced meshes and buffer geometries to render 100,000 particles at 120fps.', tokensUsed: 24 }
  });
  console.log('08-ai-streaming-copilot seeded');
}
main().catch(console.error).finally(() => prisma.$disconnect());