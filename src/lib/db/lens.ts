/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Database Queries - Lens Materials & Treatments
 * ═══════════════════════════════════════════════════════════════════════════
 */

import prisma from './prisma';

// Obtener todos los materiales de lentes activos
export async function getLensMaterials() {
    return prisma.lens_materials.findMany({
        where: { is_active: true },
        orderBy: { sort_order: 'asc' },
    });
}

// Obtener todos los tratamientos activos
export async function getLensTreatments() {
    return prisma.lens_treatments.findMany({
        where: { is_active: true },
        orderBy: { sort_order: 'asc' },
    });
}

// Obtener tratamientos populares
export async function getPopularTreatments() {
    return prisma.lens_treatments.findMany({
        where: {
            is_active: true,
            is_popular: true,
        },
        orderBy: { sort_order: 'asc' },
    });
}

// Obtener opciones de uso de lentes
export async function getLensUsageOptions() {
    return prisma.lens_usage_options.findMany({
        where: { is_active: true },
        orderBy: { sort_order: 'asc' },
    });
}
