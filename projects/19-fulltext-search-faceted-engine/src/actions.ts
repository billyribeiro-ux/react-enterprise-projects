'use server';

import { z } from 'zod';
import { prisma } from './db';

export function computeBm25Score(tf: number, docLen: number, avgDocLen = 50, idf = 1.8): number {
  const k1 = 1.5;
  const b = 0.75;
  const numerator = tf * (k1 + 1);
  const denominator = tf + k1 * (1 - b + b * (docLen / Math.max(avgDocLen, 1)));
  return Number((idf * (numerator / Math.max(denominator, 0.001))).toFixed(3));
}

const IndexDocSchema = z.object({
  docSlug: z.string().min(2),
  title: z.string().min(2),
  domain: z.string().min(2),
});

export async function indexSearchDocumentAction(
  formData: FormData
): Promise<{ status: 'indexed'; docSlug: string } | { status: 'error'; message: string }> {
  const parsed = IndexDocSchema.safeParse({
    docSlug: formData.get('docSlug'),
    title: formData.get('title'),
    domain: formData.get('domain'),
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Invalid document indexing payload' };
  }

  const terms = parsed.data.title.toLowerCase().split(/\W+/).filter(Boolean);
  await prisma.searchDocument.upsert({
    where: { docSlug: parsed.data.docSlug },
    update: { title: parsed.data.title, domain: parsed.data.domain, docLength: terms.length },
    create: {
      docSlug: parsed.data.docSlug,
      title: parsed.data.title,
      domain: parsed.data.domain,
      docLength: terms.length,
    },
  });

  return { status: 'indexed', docSlug: parsed.data.docSlug };
}
