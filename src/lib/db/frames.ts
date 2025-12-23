/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Database Queries - Frames (Productos)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import prisma from './prisma';
import type { product_status, gender_type, frame_shape, frame_material } from '@prisma/client';

// Tipos para filtros
export interface FrameFilters {
    status?: product_status;
    gender?: gender_type;
    shape?: frame_shape;
    material?: frame_material;
    brandSlug?: string;
    categorySlug?: string;
    isFeatured?: boolean;
    isBestseller?: boolean;
    isNew?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}

export interface PaginationOptions {
    page?: number;
    limit?: number;
    orderBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popular';
}

// Obtener todos los frames con filtros
export async function getFrames(
    filters: FrameFilters = {},
    pagination: PaginationOptions = {}
) {
    const { page = 1, limit = 12, orderBy = 'popular' } = pagination;
    const skip = (page - 1) * limit;

    // Construir where clause
    const where: any = {
        status: filters.status || 'active',
    };

    if (filters.gender) where.gender = filters.gender;
    if (filters.shape) where.shape = filters.shape;
    if (filters.material) where.material = filters.material;
    if (filters.isFeatured) where.is_featured = true;
    if (filters.isBestseller) where.is_bestseller = true;
    if (filters.isNew) where.is_new = true;

    if (filters.brandSlug) {
        where.brand = { slug: filters.brandSlug };
    }

    if (filters.categorySlug) {
        where.frame_categories = {
            some: {
                category: { slug: filters.categorySlug },
            },
        };
    }

    if (filters.minPrice || filters.maxPrice) {
        where.base_price = {};
        if (filters.minPrice) where.base_price.gte = filters.minPrice;
        if (filters.maxPrice) where.base_price.lte = filters.maxPrice;
    }

    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { brand: { name: { contains: filters.search, mode: 'insensitive' } } },
            { tags: { has: filters.search.toLowerCase() } },
        ];
    }

    // Construir orderBy
    let orderByClause: any;
    switch (orderBy) {
        case 'price_asc':
            orderByClause = { base_price: 'asc' };
            break;
        case 'price_desc':
            orderByClause = { base_price: 'desc' };
            break;
        case 'newest':
            orderByClause = { created_at: 'desc' };
            break;
        case 'rating':
            orderByClause = { average_rating: 'desc' };
            break;
        case 'popular':
        default:
            orderByClause = [{ is_bestseller: 'desc' }, { review_count: 'desc' }];
    }

    const [frames, total] = await Promise.all([
        prisma.frames.findMany({
            where,
            include: {
                brand: true,
                frame_color_variants: {
                    include: {
                        frame_images: {
                            orderBy: { sort_order: 'asc' },
                            take: 2,
                        },
                    },
                    take: 1, // Take only the first variant for catalog display
                },
                frame_categories: {
                    include: { category: true },
                },
            },
            orderBy: orderByClause,
            skip,
            take: limit,
        }),
        prisma.frames.count({ where }),
    ]);

    return {
        frames,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

// Obtener un frame por slug
export async function getFrameBySlug(slug: string) {
    return prisma.frames.findUnique({
        where: { slug },
        include: {
            brand: true,
            frame_color_variants: {
                include: {
                    frame_images: {
                        orderBy: { sort_order: 'asc' },
                    },
                },
            },
            frame_categories: {
                include: { category: true },
            },
            reviews: {
                where: { is_approved: true },
                include: { user: { select: { first_name: true, last_name: true } } },
                orderBy: { created_at: 'desc' },
                take: 10,
            },
        },
    });
}

// Obtener frames destacados
export async function getFeaturedFrames(limit = 8) {
    return prisma.frames.findMany({
        where: {
            status: 'active',
            is_featured: true,
        },
        include: {
            brand: true,
            frame_color_variants: {
                where: { is_default: true },
                include: {
                    frame_images: {
                        orderBy: { sort_order: 'asc' },
                        take: 1,
                    },
                },
            },
        },
        orderBy: { created_at: 'desc' },
        take: limit,
    });
}

// Obtener bestsellers
export async function getBestsellerFrames(limit = 8) {
    return prisma.frames.findMany({
        where: {
            status: 'active',
            is_bestseller: true,
        },
        include: {
            brand: true,
            frame_color_variants: {
                where: { is_default: true },
                include: {
                    frame_images: {
                        orderBy: { sort_order: 'asc' },
                        take: 1,
                    },
                },
            },
        },
        orderBy: { review_count: 'desc' },
        take: limit,
    });
}

// Obtener frames nuevos
export async function getNewFrames(limit = 8) {
    return prisma.frames.findMany({
        where: {
            status: 'active',
            is_new: true,
        },
        include: {
            brand: true,
            frame_color_variants: {
                where: { is_default: true },
                include: {
                    frame_images: {
                        orderBy: { sort_order: 'asc' },
                        take: 1,
                    },
                },
            },
        },
        orderBy: { created_at: 'desc' },
        take: limit,
    });
}

// Búsqueda de frames
export async function searchFrames(query: string, limit = 12) {
    return prisma.frames.findMany({
        where: {
            status: 'active',
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { brand: { name: { contains: query, mode: 'insensitive' } } },
                { short_description: { contains: query, mode: 'insensitive' } },
                { tags: { has: query.toLowerCase() } },
            ],
        },
        include: {
            brand: true,
            frame_color_variants: {
                where: { is_default: true },
                include: {
                    frame_images: {
                        orderBy: { sort_order: 'asc' },
                        take: 1,
                    },
                },
            },
        },
        take: limit,
    });
}
