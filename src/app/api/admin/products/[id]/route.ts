import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getAdminSession } from '@/lib/auth/admin';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single product
export async function GET(request: Request, { params }: RouteParams) {
    const { id } = await params;

    try {
        const product = await prisma.frames.findUnique({
            where: { id },
            include: {
                brand: true,
                frame_categories: { include: { category: true } }
            },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Transform to include category_id for the form
        const response = {
            ...product,
            category_id: product.frame_categories[0]?.category_id || null,
        };

        return NextResponse.json({ product: response });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Error fetching product' }, { status: 500 });
    }
}

// PUT update product
export async function PUT(request: Request, { params }: RouteParams) {
    const { id } = await params;
    const session = await getAdminSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Update product
        const product = await prisma.frames.update({
            where: { id },
            data: {
                name: body.name,
                slug: body.slug,
                brand_id: body.brand_id,
                base_price: parseFloat(body.base_price),
                compare_at_price: body.compare_at_price ? parseFloat(body.compare_at_price) : null,
                short_description: body.description || null,
                material: body.frame_material || 'acetate',
                shape: body.frame_shape || 'rectangular',
                gender: body.gender || 'unisex',
                status: body.status || 'draft',
                sunglasses_only: body.sunglasses_only || false,
                is_featured: body.is_featured || false,
            },
        });

        // Update category relationship
        if (body.category_id) {
            // Remove existing category links
            await prisma.frame_categories.deleteMany({
                where: { frame_id: id },
            });

            // Add new category link
            await prisma.frame_categories.create({
                data: {
                    frame_id: id,
                    category_id: body.category_id,
                },
            });
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
    }
}

// DELETE product
export async function DELETE(request: Request, { params }: RouteParams) {
    const { id } = await params;
    const session = await getAdminSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.frames.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
    }
}
