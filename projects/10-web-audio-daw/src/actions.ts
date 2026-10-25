'use server';
import { prisma } from '../lib/prisma';

export async function updateAudioSteps(trackId: string, steps: string) {
  try {
    const updated = await prisma.audioTrack.update({ where: { id: trackId }, data: { steps } });
    return { success: true, track: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}