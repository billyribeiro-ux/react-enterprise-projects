'use server';
import { prisma } from '../lib/prisma';

export async function sendChatMessage(conversationId: string, content: string) {
  try {
    const msg = await prisma.copilotMessage.create({
      data: { conversationId, role: 'user', content, tokensUsed: Math.ceil(content.length / 4) }
    });
    return { success: true, message: msg };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}