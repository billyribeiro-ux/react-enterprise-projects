'use server';
import { prisma } from '../lib/prisma';

export async function getTranslation(slug: string, locale: string) {
  try {
    const art = await prisma.localizedArticle.findFirst({ where: { slug, locale } });
    return { success: true, article: art };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}