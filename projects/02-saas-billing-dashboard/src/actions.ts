'use server';

import { z } from 'zod';
import { prisma } from './db';

export interface BillingSnapshot {
  tenantSlug: string;
  planTier: 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  seats: number;
  mrrCents: number;
  version: number;
}

export type BillingActionResult =
  | { status: 'idle' }
  | { status: 'success'; data: BillingSnapshot }
  | { status: 'conflict'; message: string }
  | { status: 'error'; message: string };

const UpgradeSchema = z.object({
  tenantSlug: z.string().min(2),
  planTier: z.enum(['STARTER', 'GROWTH', 'ENTERPRISE']),
  seats: z.coerce.number().int().min(1).max(10000),
  expectedVersion: z.coerce.number().int().min(1),
});

const TIER_RATE_CENTS: Record<'STARTER' | 'GROWTH' | 'ENTERPRISE', number> = {
  STARTER: 4900,
  GROWTH: 8900,
  ENTERPRISE: 12000,
};

export async function upgradeTenantPlanAction(
  _prev: BillingActionResult,
  formData: FormData
): Promise<BillingActionResult> {
  const parsed = UpgradeSchema.safeParse({
    tenantSlug: formData.get('tenantSlug'),
    planTier: formData.get('planTier'),
    seats: formData.get('seats'),
    expectedVersion: formData.get('expectedVersion'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid billing allocation parameters' };
  }

  const { tenantSlug, planTier, seats, expectedVersion } = parsed.data;
  const mrrCents = seats * TIER_RATE_CENTS[planTier];

  try {
    const result = await prisma.tenantSubscription.updateMany({
      where: { tenantSlug, version: expectedVersion },
      data: {
        planTier,
        seats,
        mrrCents,
        version: { increment: 1 },
      },
    });

    if (result.count === 0) {
      return {
        status: 'conflict',
        message: 'OCC Version Conflict: Another administrator modified this subscription.',
      };
    }

    const updated = await prisma.tenantSubscription.findUnique({
      where: { tenantSlug },
    });

    if (updated) {
      await prisma.invoiceLineItem.create({
        data: {
          subscriptionId: updated.id,
          description: `Upgraded to ${planTier} (${seats} seats)`,
          amountCents: mrrCents,
        },
      });
    }

    return {
      status: 'success',
      data: {
        tenantSlug,
        planTier,
        seats,
        mrrCents,
        version: expectedVersion + 1,
      },
    };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Billing mutation failed',
    };
  }
}
