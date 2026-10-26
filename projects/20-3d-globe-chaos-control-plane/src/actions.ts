'use server';

import { z } from 'zod';
import { prisma } from './db';

const ChaosInjectSchema = z.object({
  regionCode: z.string().min(3),
  faultType: z.string().min(3),
});

export async function triggerRegionalChaosFailoverAction(
  formData: FormData
): Promise<{ status: 'failover_complete'; partitionedRegion: string } | { status: 'error'; message: string }> {
  const parsed = ChaosInjectSchema.safeParse({
    regionCode: formData.get('regionCode'),
    faultType: formData.get('faultType'),
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Invalid chaos experiment parameters' };
  }

  const region = await prisma.edgeRegionCluster.upsert({
    where: { regionCode: parsed.data.regionCode },
    update: { status: 'PARTITIONED', trafficPct: 0 },
    create: { regionCode: parsed.data.regionCode, status: 'PARTITIONED', trafficPct: 0 },
  });

  await prisma.chaosExperimentLog.create({
    data: {
      regionId: region.id,
      faultType: parsed.data.faultType,
      blastRadius: 'REGIONAL_BGP_DRAIN',
    },
  });

  return { status: 'failover_complete', partitionedRegion: region.regionCode };
}
