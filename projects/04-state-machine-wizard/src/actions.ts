'use server';

import { z } from 'zod';
import { prisma } from './db';

export type SagaState =
  | 'IDENTITY_CHECK'
  | 'RISK_SCORING'
  | 'COMPLIANCE_LOCK'
  | 'PROVISIONED';

const ALLOWED_TRANSITIONS: Record<SagaState, SagaState[]> = {
  IDENTITY_CHECK: ['RISK_SCORING'],
  RISK_SCORING: ['COMPLIANCE_LOCK', 'IDENTITY_CHECK'],
  COMPLIANCE_LOCK: ['PROVISIONED', 'RISK_SCORING'],
  PROVISIONED: [],
};

const TransitionSchema = z.object({
  instanceId: z.string().min(1),
  fromState: z.enum(['IDENTITY_CHECK', 'RISK_SCORING', 'COMPLIANCE_LOCK', 'PROVISIONED']),
  toState: z.enum(['IDENTITY_CHECK', 'RISK_SCORING', 'COMPLIANCE_LOCK', 'PROVISIONED']),
  idempotencyKey: z.string().min(4),
});

export async function triggerSagaTransitionAction(
  formData: FormData
): Promise<{ status: 'success'; nextState: SagaState } | { status: 'error'; message: string }> {
  const parsed = TransitionSchema.safeParse({
    instanceId: formData.get('instanceId'),
    fromState: formData.get('fromState'),
    toState: formData.get('toState'),
    idempotencyKey: formData.get('idempotencyKey'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Malformed state transition payload' };
  }

  const { instanceId, fromState, toState, idempotencyKey } = parsed.data;
  const legalTargets = ALLOWED_TRANSITIONS[fromState];
  if (!legalTargets.includes(toState)) {
    return {
      status: 'error',
      message: `Illegal DFA transition from ${fromState} to ${toState}`,
    };
  }

  try {
    await prisma.$transaction([
      prisma.workflowInstance.update({
        where: { id: instanceId },
        data: { currentState: toState },
      }),
      prisma.workflowTransitionLog.create({
        data: { instanceId, fromState, toState, idempotencyKey },
      }),
    ]);

    return { status: 'success', nextState: toState };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Transaction failed',
    };
  }
}
