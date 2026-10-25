'use server';
import { prisma } from '../lib/prisma';

export async function searchDocs(query: string) {
  try {
    const docs = await prisma.searchDoc.findMany({
      where: { content: { contains: query } }
    });
    return { success: true, results: docs };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}