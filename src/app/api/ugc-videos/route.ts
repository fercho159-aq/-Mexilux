import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

// GET: Obtener videos UGC activos para el carrusel público
export async function GET() {
    try {
        const videos = await prisma.ugc_videos.findMany({
            where: { is_active: true },
            orderBy: { sort_order: 'asc' },
            select: {
                id: true,
                name: true,
                video_url: true,
                thumbnail_url: true,
                is_verified: true,
            },
        });

        return NextResponse.json({ videos });
    } catch (error) {
        console.error('Error fetching UGC videos:', error);
        return NextResponse.json(
            { error: 'Error al obtener videos' },
            { status: 500 }
        );
    }
}
