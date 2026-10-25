'use server';
import { prisma } from '../lib/prisma';

export async function verifyRole(email: string) {
  try {
    const u = await prisma.user.findUnique({
      where: { email },
      include: { userRoles: { include: { role: true } } }
    });
    return { success: true, roles: u?.userRoles.map((ur) => ur.role.name) || [] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}