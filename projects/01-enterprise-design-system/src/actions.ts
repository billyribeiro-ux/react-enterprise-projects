'use server';

import { z } from 'zod';
import { prisma } from './db';

export interface DesignTokenRecord {
  id: string;
  name: string;
  category: string;
  cssVar: string;
  value: string;
  roughness: number;
  metalness: number;
}

export type ActionResult<T> =
  | { status: 'idle' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

const UpdateTokenSchema = z.object({
  name: z.string().min(3),
  value: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid 6-digit hex color'),
  roughness: z.coerce.number().min(0).max(1).optional(),
  metalness: z.coerce.number().min(0).max(1).optional(),
});

export async function updateDesignTokenAction(
  _prevState: ActionResult<DesignTokenRecord>,
  formData: FormData
): Promise<ActionResult<DesignTokenRecord>> {
  const parsed = UpdateTokenSchema.safeParse({
    name: formData.get('name'),
    value: formData.get('value'),
    roughness: formData.get('roughness') ?? undefined,
    metalness: formData.get('metalness') ?? undefined,
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      status: 'error',
      message: firstIssue ? firstIssue.message : 'Invalid design token payload',
    };
  }

  try {
    const roughness = parsed.data.roughness ?? 0.2;
    const metalness = parsed.data.metalness ?? 0.8;

    const existing = await prisma.designToken.findUnique({
      where: { name: parsed.data.name },
    });

    const updated = await prisma.designToken.upsert({
      where: { name: parsed.data.name },
      update: {
        value: parsed.data.value,
        ...(parsed.data.roughness !== undefined ? { roughness: parsed.data.roughness } : {}),
        ...(parsed.data.metalness !== undefined ? { metalness: parsed.data.metalness } : {}),
      },
      create: {
        name: parsed.data.name,
        category: 'color',
        cssVar: `--ds-${parsed.data.name.replace(/\./g, '-')}`,
        value: parsed.data.value,
        roughness,
        metalness,
      },
    });

    if (existing && existing.value !== parsed.data.value) {
      await prisma.tokenRevision.create({
        data: {
          designTokenId: updated.id,
          previousValue: existing.value,
          nextValue: parsed.data.value,
        },
      });
    }

    return { status: 'success', data: updated };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Database persistence error',
    };
  }
}
