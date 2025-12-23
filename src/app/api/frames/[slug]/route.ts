/**
 * API Route: Get frame by slug
 * GET /api/frames/[slug]
 */

import { NextResponse } from 'next/server';
import { getFrameBySlug } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { error: 'Slug is required' },
                { status: 400 }
            );
        }

        const frame = await getFrameBySlug(slug);

        if (!frame) {
            return NextResponse.json(
                { error: 'Frame not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(frame);
    } catch (error) {
        console.error('Error fetching frame:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
