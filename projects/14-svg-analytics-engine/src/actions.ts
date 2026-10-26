'use server';

import { z } from 'zod';
import { prisma } from './db';

const MetricSchema = z.object({
  seriesKey: z.string().min(2),
  axisLabel: z.string().min(2),
  score: z.coerce.number().min(0).max(100),
});

export async function recordMetricDatapointAction(
  formData: FormData
): Promise<{ status: 'recorded'; score: number } | { status: 'error'; message: string }> {
  const parsed = MetricSchema.safeParse({
    seriesKey: formData.get('seriesKey'),
    axisLabel: formData.get('axisLabel'),
    score: formData.get('score'),
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Score must be between 0 and 100' };
  }

  const series = await prisma.metricSeries.upsert({
    where: { seriesKey: parsed.data.seriesKey },
    update: {},
    create: { seriesKey: parsed.data.seriesKey },
  });

  await prisma.metricDatapoint.create({
    data: {
      seriesId: series.id,
      axisLabel: parsed.data.axisLabel,
      score: parsed.data.score,
    },
  });

  return { status: 'recorded', score: parsed.data.score };
}
