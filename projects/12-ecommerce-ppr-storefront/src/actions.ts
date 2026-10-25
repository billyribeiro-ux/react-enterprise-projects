'use server';
import { prisma } from '../lib/prisma';

export async function buyProduct(productId: string) {
  try {
    const p = await prisma.product.update({
      where: { id: productId },
      data: { stockQty: { decrement: 1 } }
    });
    return { success: true, product: p };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}