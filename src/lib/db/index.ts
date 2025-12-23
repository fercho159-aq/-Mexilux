/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Database Index - Re-export all database utilities
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Prisma client
export { prisma, default as db } from './prisma';

// Frame queries
export {
    getFrames,
    getFrameBySlug,
    getFeaturedFrames,
    getBestsellerFrames,
    getNewFrames,
    searchFrames,
    type FrameFilters,
    type PaginationOptions,
} from './frames';

// Brand & Category queries
export {
    getBrands,
    getBrandBySlug,
    getCategories,
    getCategoryBySlug,
    getBrandsWithCount,
    getCategoriesWithCount,
} from './brands-categories';

// Lens queries
export {
    getLensMaterials,
    getLensTreatments,
    getPopularTreatments,
    getLensUsageOptions,
} from './lens';
