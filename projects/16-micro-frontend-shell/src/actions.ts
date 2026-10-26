'use server';

import { z } from 'zod';
import { prisma } from './db';

const PromoteRemoteSchema = z.object({
  remoteScope: z.string().min(3),
  version: z.string().min(3),
  sriSha384: z.string().startsWith('sha384-'),
});

export async function promoteRemoteCanaryAction(
  formData: FormData
): Promise<{ status: 'promoted'; version: string } | { status: 'error'; message: string }> {
  const parsed = PromoteRemoteSchema.safeParse({
    remoteScope: formData.get('remoteScope'),
    version: formData.get('version'),
    sriSha384: formData.get('sriSha384'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Remote bundle must include a valid sha384- SRI digest' };
  }

  try {
    const manifest = await prisma.microAppManifest.upsert({
      where: { remoteScope: parsed.data.remoteScope },
      update: {
        activeVersion: parsed.data.version,
        sriSha384: parsed.data.sriSha384,
        healthy: true,
      },
      create: {
        remoteScope: parsed.data.remoteScope,
        entryUrl: `https://cdn.acme.internal/${parsed.data.version}/remoteEntry.js`,
        activeVersion: parsed.data.version,
        sriSha384: parsed.data.sriSha384,
      },
    });

    await prisma.remoteDeploymentHistory.create({
      data: {
        manifestId: manifest.id,
        version: parsed.data.version,
        sriSha384: parsed.data.sriSha384,
      },
    });

    return { status: 'promoted', version: parsed.data.version };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Remote promotion failed',
    };
  }
}
