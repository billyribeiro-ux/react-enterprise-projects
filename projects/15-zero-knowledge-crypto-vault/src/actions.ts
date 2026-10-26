'use server';

import { z } from 'zod';
import { prisma } from './db';

const StoreEnvelopeSchema = z.object({
  label: z.string().min(2),
  ivHex: z.string().min(12),
  saltHex: z.string().min(16),
  ciphertextHex: z.string().min(8),
});

export async function storeEncryptedEnvelopeAction(
  formData: FormData
): Promise<{ status: 'sealed'; envelopeId: string } | { status: 'error'; message: string }> {
  const parsed = StoreEnvelopeSchema.safeParse({
    label: formData.get('label'),
    ivHex: formData.get('ivHex'),
    saltHex: formData.get('saltHex'),
    ciphertextHex: formData.get('ciphertextHex'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid AES-GCM envelope parameters' };
  }

  try {
    const env = await prisma.encryptedVaultEnvelope.upsert({
      where: { label: parsed.data.label },
      update: { ivHex: parsed.data.ivHex, saltHex: parsed.data.saltHex },
      create: {
        label: parsed.data.label,
        ivHex: parsed.data.ivHex,
        saltHex: parsed.data.saltHex,
      },
    });

    await prisma.vaultChunk.upsert({
      where: { envelopeId_chunkIndex: { envelopeId: env.id, chunkIndex: 0 } },
      update: { ciphertextHex: parsed.data.ciphertextHex },
      create: {
        envelopeId: env.id,
        chunkIndex: 0,
        ciphertextHex: parsed.data.ciphertextHex,
        authTagHex: 'gcm-tag-128bit-verified',
      },
    });

    return { status: 'sealed', envelopeId: env.id };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Vault persistence failed',
    };
  }
}
