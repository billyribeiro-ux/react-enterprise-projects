import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.vaultFile.deleteMany({});
  await prisma.vaultFile.create({
    data: { fileName: 'quantum-cryptographic-ledger.bin', fileSize: 524288000, sha256Hash: 'a9f4c3...102', status: 'uploading' }
  });
  console.log('15-resumable-file-vault seeded with 3D vault file');
}
main().catch(console.error).finally(() => prisma.$disconnect());