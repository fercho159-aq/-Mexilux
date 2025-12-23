'use server';

import prisma from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth/admin';

export async function deleteProduct(id: string) {
    const session = await getAdminSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    try {
        await prisma.frames.delete({
            where: { id },
        });
        revalidatePath('/admin/productos');
        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: 'No se pudo eliminar el producto' };
    }
}
