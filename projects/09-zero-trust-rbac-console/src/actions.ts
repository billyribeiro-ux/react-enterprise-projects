'use server';

import { z } from 'zod';
import { prisma } from './db';

const UpdateMaskSchema = z.object({
  roleSlug: z.string().min(2),
  nextMask: z.coerce.number().int().min(0).max(63),
  actor: z.string().min(2),
});

export async function updateRoleBitmaskAction(
  formData: FormData
): Promise<{ status: 'success'; capabilityMask: number } | { status: 'error'; message: string }> {
  const parsed = UpdateMaskSchema.safeParse({
    roleSlug: formData.get('roleSlug'),
    nextMask: formData.get('nextMask'),
    actor: formData.get('actor'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid RBAC capability mask' };
  }

  try {
    const existing = await prisma.iamRole.findUnique({
      where: { roleSlug: parsed.data.roleSlug },
    });
    if (!existing) {
      return { status: 'error', message: 'IAM Role not found' };
    }

    const [updated] = await prisma.$transaction([
      prisma.iamRole.update({
        where: { id: existing.id },
        data: { capabilityMask: parsed.data.nextMask },
      }),
      prisma.securityAuditEntry.create({
        data: {
          roleId: existing.id,
          actor: parsed.data.actor,
          previousMask: existing.capabilityMask,
          nextMask: parsed.data.nextMask,
        },
      }),
    ]);

    return { status: 'success', capabilityMask: updated.capabilityMask };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'RBAC update failed',
    };
  }
}
