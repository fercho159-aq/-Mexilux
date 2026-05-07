import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getAdminSession } from '@/lib/auth/admin';

// GET all products
export async function GET() {
    try {
        const products = await prisma.frames.findMany({
            include: { brand: true, frame_categories: { include: { category: true } } },
            orderBy: { created_at: 'desc' },
        });
        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
    }
}

// POST create new product
export async function POST(request: Request) {
    const session = await getAdminSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Create product
        const product = await prisma.frames.create({
            data: {
                name: body.name,
                slug: body.slug,
                brand_id: body.brand_id,
                base_price: parseFloat(body.base_price),
                compare_at_price: body.compare_at_price ? parseFloat(body.compare_at_price) : null,
                short_description: body.description || null,
                material: body.frame_material || 'acetate',
                shape: body.frame_shape || 'rectangular',
                frame_type: 'full_rim',
                gender: body.gender || 'unisex',
                status: body.status || 'draft',
                sunglasses_only: body.sunglasses_only || false,
                is_featured: body.is_featured || false,
            },
        });

        // Link to category if provided
        if (body.category_id) {
            await prisma.frame_categories.create({
                data: {
                    frame_id: product.id,
                    category_id: body.category_id,
                },
            });
        }

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
    }
}
