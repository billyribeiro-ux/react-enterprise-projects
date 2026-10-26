'use server';

import { z } from 'zod';
import { prisma } from './db';

const UpsertLocaleSchema = z.object({
  slug: z.string().min(2),
  locale: z.enum(['en-US', 'ar-SA', 'ja-JP']),
  headline: z.string().min(2),
});

export async function upsertLocalizedArticleAction(
  formData: FormData
): Promise<{ status: 'saved'; locale: string; dir: 'ltr' | 'rtl' } | { status: 'error'; message: string }> {
  const parsed = UpsertLocaleSchema.safeParse({
    slug: formData.get('slug'),
    locale: formData.get('locale'),
    headline: formData.get('headline'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid locale or headline payload' };
  }

  const dir: 'ltr' | 'rtl' = parsed.data.locale === 'ar-SA' ? 'rtl' : 'ltr';
  const ns = await prisma.contentNamespace.upsert({
    where: { nsKey: 'enterprise-docs' },
    update: {},
    create: { nsKey: 'enterprise-docs' },
  });

  await prisma.localizedArticle.upsert({
    where: {
      slug_locale: {
        slug: parsed.data.slug,
        locale: parsed.data.locale,
      },
    },
    update: { headline: parsed.data.headline, dir },
    create: {
      namespaceId: ns.id,
      slug: parsed.data.slug,
      locale: parsed.data.locale,
      dir,
      headline: parsed.data.headline,
    },
  });

  return { status: 'saved', locale: parsed.data.locale, dir };
}
