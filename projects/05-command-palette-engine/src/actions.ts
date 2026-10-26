'use server';

import { z } from 'zod';
import { prisma } from './db';

const RecordCommandSchema = z.object({
  slug: z.string().min(2),
});

export async function recordCommandExecutionAction(
  formData: FormData
): Promise<{ status: 'success'; invocations: number } | { status: 'error'; message: string }> {
  const parsed = RecordCommandSchema.safeParse({
    slug: formData.get('slug'),
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Invalid command slug' };
  }

  try {
    const updated = await prisma.omniCommand.update({
      where: { slug: parsed.data.slug },
      data: { invocations: { increment: 1 } },
    });
    await prisma.commandExecutionAudit.create({
      data: { commandId: updated.id },
    });
    return { status: 'success', invocations: updated.invocations };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Failed to log command execution',
    };
  }
}
