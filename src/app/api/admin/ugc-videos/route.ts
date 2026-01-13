import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

// GET: Obtener todos los videos UGC (admin)
export async function GET() {
    try {
        const videos = await prisma.ugc_videos.findMany({
            orderBy: { sort_order: 'asc' },
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

// POST: Crear nuevo video UGC
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, video_url, thumbnail_url, is_verified, sort_order, is_active } = body;

        if (!name || !video_url) {
            return NextResponse.json(
                { error: 'Nombre y URL del video son requeridos' },
                { status: 400 }
            );
        }

        const video = await prisma.ugc_videos.create({
            data: {
                name,
                video_url,
                thumbnail_url: thumbnail_url || null,
                is_verified: is_verified ?? false,
                sort_order: sort_order ?? 0,
                is_active: is_active ?? true,
            },
        });

        return NextResponse.json({ video }, { status: 201 });
    } catch (error) {
        console.error('Error creating UGC video:', error);
        return NextResponse.json(
            { error: 'Error al crear video' },
            { status: 500 }
        );
    }
}
