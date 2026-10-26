'use server';

import { z } from 'zod';
import { prisma } from './db';

export function kahnTopologicalSort(nodes: string[], edges: [string, string][]): string[] | null {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of nodes) {
    inDegree.set(n, 0);
    adj.set(n, []);
  }
  for (const [u, v] of edges) {
    adj.get(u)?.push(v);
    inDegree.set(v, (inDegree.get(v) ?? 0) + 1);
  }
  const queue: string[] = [];
  for (const [n, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(n);
  }
  const order: string[] = [];
  while (queue.length > 0) {
    const curr = queue.shift();
    if (!curr) break;
    order.push(curr);
    for (const nxt of adj.get(curr) ?? []) {
      const nextDeg = (inDegree.get(nxt) ?? 1) - 1;
      inDegree.set(nxt, nextDeg);
      if (nextDeg === 0) queue.push(nxt);
    }
  }
  return order.length === nodes.length ? order : null;
}

const SaveDagSchema = z.object({
  slug: z.string().min(2),
  edgesJson: z.string().min(2),
});

export async function saveDagTopologyAction(
  formData: FormData
): Promise<{ status: 'saved'; order: string[] } | { status: 'cycle_error'; message: string }> {
  const parsed = SaveDagSchema.safeParse({
    slug: formData.get('slug'),
    edgesJson: formData.get('edgesJson'),
  });
  if (!parsed.success) {
    return { status: 'cycle_error', message: 'Invalid DAG payload' };
  }

  const edges = JSON.parse(parsed.data.edgesJson) as [string, string][];
  const nodeSet = new Set<string>();
  for (const [u, v] of edges) {
    nodeSet.add(u);
    nodeSet.add(v);
  }
  const order = kahnTopologicalSort(Array.from(nodeSet), edges);
  if (!order) {
    return { status: 'cycle_error', message: 'Cycle detected by Kahn O(V+E) verifier!' };
  }

  await prisma.dagPipeline.upsert({
    where: { slug: parsed.data.slug },
    update: { edgesJson: parsed.data.edgesJson },
    create: { slug: parsed.data.slug, name: parsed.data.slug, edgesJson: parsed.data.edgesJson },
  });

  return { status: 'saved', order };
}
