import { prisma } from '../src/db';

async function main(): Promise<void> {
  const env = await prisma.encryptedVaultEnvelope.upsert({
    where: { label: 'root-signing-seed-enclave' },
    update: {},
    create: {
      label: 'root-signing-seed-enclave',
      ivHex: 'a1b2c3d4e5f60718293a4b5c',
      saltHex: '00112233445566778899aabbccddeeff',
      kdfIterations: 310000,
    },
  });

  await prisma.vaultChunk.upsert({
    where: {
      envelopeId_chunkIndex: {
        envelopeId: env.id,
        chunkIndex: 0,
      },
    },
    update: {},
    create: {
      envelopeId: env.id,
      chunkIndex: 0,
      ciphertextHex: '8f9e7d6c5b4a39281706f5e4d3c2b1a0',
      authTagHex: 'ffeeddccbbaa99887766554433221100',
    },
  });
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
