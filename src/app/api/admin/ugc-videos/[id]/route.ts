import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

// PUT: Actualizar video UGC
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, video_url, thumbnail_url, is_verified, sort_order, is_active } = body;

        const video = await prisma.ugc_videos.update({
            where: { id },
            data: {
                name,
                video_url,
                thumbnail_url,
                is_verified,
                sort_order,
                is_active,
                updated_at: new Date(),
            },
        });

        return NextResponse.json({ video });
    } catch (error) {
        console.error('Error updating UGC video:', error);
        return NextResponse.json(
            { error: 'Error al actualizar video' },
            { status: 500 }
        );
    }
}

// DELETE: Eliminar video UGC
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.ugc_videos.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting UGC video:', error);
        return NextResponse.json(
            { error: 'Error al eliminar video' },
            { status: 500 }
        );
    }
}
