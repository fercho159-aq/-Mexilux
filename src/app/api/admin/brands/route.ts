import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
    try {
        const brands = await prisma.brands.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json({ brands });
    } catch (error) {
        console.error('Error fetching brands:', error);
        return NextResponse.json({ error: 'Error fetching brands' }, { status: 500 });
    }
}
