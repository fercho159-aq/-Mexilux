/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Database Queries - Brands & Categories
 * ═══════════════════════════════════════════════════════════════════════════
 */

import prisma from './prisma';

// Obtener todas las marcas activas
export async function getBrands() {
    return prisma.brands.findMany({
        orderBy: { name: 'asc' },
    });
}

// Obtener marca por slug
export async function getBrandBySlug(slug: string) {
    return prisma.brands.findUnique({
        where: { slug },
    });
}

// Obtener todas las categorías
export async function getCategories() {
    return prisma.categories.findMany({
        where: { parent_id: null },
        include: {
            children: true,
        },
        orderBy: { sort_order: 'asc' },
    });
}

// Obtener categoría por slug
export async function getCategoryBySlug(slug: string) {
    return prisma.categories.findUnique({
        where: { slug },
        include: {
            parent: true,
            children: true,
        },
    });
}

// Obtener conteo de productos por marca
export async function getBrandsWithCount() {
    const brands = await prisma.brands.findMany({
        include: {
            _count: {
                select: {
                    frames: {
                        where: { status: 'active' },
                    },
                },
            },
        },
        orderBy: { name: 'asc' },
    });

    return brands.map((brand) => ({
        ...brand,
        productCount: brand._count.frames,
    }));
}

// Obtener conteo de productos por categoría
export async function getCategoriesWithCount() {
    const categories = await prisma.categories.findMany({
        include: {
            _count: {
                select: {
                    frame_categories: true,
                },
            },
        },
        orderBy: { sort_order: 'asc' },
    });

    return categories.map((category) => ({
        ...category,
        productCount: category._count.frame_categories,
    }));
}
