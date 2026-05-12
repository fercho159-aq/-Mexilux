/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CATÁLOGO - PÁGINA PRINCIPAL (Apple Style - Sin Sidebar)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Diseño limpio estilo Apple con barra de filtros superior
 */

import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getFrames, getBrandsWithCount } from '@/lib/db';
import CatalogFilters from '@/components/catalog/CatalogFilters';

// Disable caching to always show fresh data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Catálogo de Lentes | Mexilux',
    description: 'Explora nuestra colección de lentes oftálmicos y de sol de las mejores marcas.',
};

const SHAPE_LABELS: Record<string, string> = {
    rectangular: 'Rectangular',
    round: 'Redondo',
    cat_eye: 'Cat Eye',
    aviator: 'Aviador',
    square: 'Cuadrado',
    oval: 'Ovalado',
};

const MATERIAL_LABELS: Record<string, string> = {
    acetate: 'Acetato',
    metal: 'Metal',
    titanium: 'Titanio',
    tr90: 'TR90',
    mixed: 'Mixto',
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CatalogoPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const activeGenero = params.genero as string | undefined;
    const activeShape = params.forma as string | undefined;
    const activeMaterial = params.material as string | undefined;
    const page = parseInt(params.page as string) || 1;

    const [{ frames, pagination }, brands] = await Promise.all([
        getFrames(
            {
                status: 'active',
                gender: activeGenero === 'hombre' ? 'male' :
                    activeGenero === 'mujer' ? 'female' :
                        activeGenero === 'ninos' ? 'kids' : undefined,
                shape: (activeShape || undefined) as any,
                material: (activeMaterial || undefined) as any,
            },
            { page, limit: 12, orderBy: 'popular' }
        ),
        getBrandsWithCount(),
    ]);

    const formatPrice = (price: number | { toNumber?: () => number }) => {
        const numPrice = typeof price === 'number' ? price : (price?.toNumber?.() ?? 0);
        return `$${numPrice.toLocaleString('es-MX')}`;
    };

    return (
        <main className="catalog-page-clean">
            {/* Hero Header */}
            <section className="catalog-hero">
                <div className="catalog-hero-content">
                    <h1 className="catalog-hero-title">
                        {activeGenero ? `Lentes para ${activeGenero}` : 'Nuestra Colección'}
                    </h1>
                    <p className="catalog-hero-subtitle">
                        {pagination.total} productos para expresar tu estilo
                    </p>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="catalog-filter-bar">
                <div className="filter-bar-container">
                    {/* Gender filter links with character illustrations */}
                    <div className="filter-links">
                        <Link
                            href="/catalogo?genero=hombre"
                            className={`filter-link filter-link-character ${activeGenero === 'hombre' ? 'active' : ''}`}
                        >
                            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Sombrero */}
                                <ellipse cx="20" cy="11" rx="14" ry="3" fill="currentColor" opacity="0.15"/>
                                <path d="M12 11c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.25" strokeLinecap="round"/>
                                <line x1="6" y1="11" x2="34" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                {/* Face */}
                                <circle cx="20" cy="21" r="6" stroke="currentColor" strokeWidth="1.8" fill="none"/>
                                {/* Bigote */}
                                <path d="M15 23.5c1-1.2 2.5-1.5 5-0.5M25 23.5c-1-1.2-2.5-1.5-5-0.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                                {/* Body */}
                                <path d="M12 36c0-4.5 3.5-8 8-8s8 3.5 8 8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                            </svg>
                            <span>Mexicano</span>
                        </Link>
                        <Link
                            href="/catalogo?genero=mujer"
                            className={`filter-link filter-link-character ${activeGenero === 'mujer' ? 'active' : ''}`}
                        >
                            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Hair */}
                                <path d="M13 18c-1-6 2-12 7-13s8 3 8 8" stroke="currentColor" strokeWidth="1.8" fill="currentColor" opacity="0.15" strokeLinecap="round"/>
                                {/* Flower in hair */}
                                <circle cx="28" cy="12" r="2.5" fill="currentColor" opacity="0.4"/>
                                <circle cx="28" cy="12" r="1" fill="currentColor" opacity="0.7"/>
                                {/* Face */}
                                <circle cx="20" cy="19" r="6" stroke="currentColor" strokeWidth="1.8" fill="none"/>
                                {/* Braids */}
                                <path d="M14 19c-1 3-1.5 7-1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                                <path d="M26 19c1 3 1.5 7 1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                                {/* Body */}
                                <path d="M12 36c0-4.5 3.5-8 8-8s8 3.5 8 8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                            </svg>
                            <span>Mexicana</span>
                        </Link>
                        <Link
                            href="/catalogo"
                            className={`filter-link filter-link-character ${!activeGenero ? 'active' : ''}`}
                        >
                            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="18" fill={!activeGenero ? '#fff' : '#e8ecf1'} opacity="0.5"/>
                                <circle cx="20" cy="16" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <path d="M10 34c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                            </svg>
                            <span>Sin etiquetas</span>
                        </Link>
                    </div>

                    {/* Filter toggle */}
                    <CatalogFilters
                        activeShape={activeShape}
                        activeMaterial={activeMaterial}
                        activeGenero={activeGenero}
                    />
                </div>
            </section>

            {/* Products Grid */}
            <section className="catalog-products-section">
                <div className="catalog-products-container">
                    {frames.length > 0 ? (
                        <div className="products-grid-clean">
                            {frames.map((frame, frameIdx) => {
                                const defaultVariant = frame.frame_color_variants[0];
                                const defaultImage = defaultVariant?.frame_images[0];
                                const basePrice = typeof frame.base_price === 'number'
                                    ? frame.base_price
                                    : frame.base_price?.toNumber?.() ?? 0;
                                const comparePrice = frame.compare_at_price
                                    ? (typeof frame.compare_at_price === 'number'
                                        ? frame.compare_at_price
                                        : frame.compare_at_price?.toNumber?.() ?? 0)
                                    : null;
                                const avgRating = typeof frame.average_rating === 'number'
                                    ? frame.average_rating
                                    : frame.average_rating?.toNumber?.() ?? 0;

                                return (
                                    <article key={frame.id} className="product-card-clean">
                                        {/* Badges */}
                                        <div className="product-badges-clean">
                                            {frame.is_new && <span className="badge-clean badge-new">Nuevo</span>}
                                            {frame.is_bestseller && <span className="badge-clean badge-bestseller">Bestseller</span>}
                                            {comparePrice && basePrice < comparePrice && (
                                                <span className="badge-clean badge-sale">
                                                    -{Math.round((1 - basePrice / comparePrice) * 100)}%
                                                </span>
                                            )}
                                        </div>

                                        {/* Image */}
                                        <Link href={`/catalogo/${frame.slug}`} className="product-image-link-clean">
                                            <div className="product-image-clean">
                                                {defaultImage?.url ? (
                                                    <Image
                                                        src={defaultImage.url}
                                                        alt={frame.name}
                                                        fill
                                                        style={{ objectFit: 'contain' }}
                                                        sizes="(max-width: 768px) 50vw, 25vw"
                                                        priority={frameIdx === 0}
                                                    />
                                                ) : (
                                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" aria-hidden="true">
                                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Color variants */}
                                        {frame.frame_color_variants.length > 1 && (
                                            <div className="product-colors-clean">
                                                {frame.frame_color_variants.slice(0, 5).map((variant) => (
                                                    <span
                                                        key={variant.id}
                                                        className="color-dot"
                                                        style={{ backgroundColor: variant.color_hex }}
                                                        title={variant.color_name}
                                                    />
                                                ))}
                                                {frame.frame_color_variants.length > 5 && (
                                                    <span className="color-more">+{frame.frame_color_variants.length - 5}</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="product-info-clean">
                                            <span className="product-brand-clean">{frame.brand.name}</span>
                                            <h3 className="product-name-clean">
                                                <Link href={`/catalogo/${frame.slug}`}>{frame.name}</Link>
                                            </h3>

                                            {/* Rating */}
                                            {avgRating > 0 && (
                                                <div className="product-rating-clean">
                                                    <span className="stars-clean">
                                                        {'★'.repeat(Math.floor(avgRating))}
                                                        {'☆'.repeat(5 - Math.floor(avgRating))}
                                                    </span>
                                                    <span className="reviews-count-clean">({frame.review_count})</span>
                                                </div>
                                            )}

                                            {/* Price */}
                                            <div className="product-price-clean">
                                                <span className="price-current-clean">{formatPrice(basePrice)}</span>
                                                {comparePrice && comparePrice > basePrice && (
                                                    <span className="price-original-clean">{formatPrice(comparePrice)}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quick action */}
                                        <div className="product-actions-clean">
                                            <Link href={`/catalogo/${frame.slug}`} className="btn-view-product">
                                                Ver producto
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty state */
                        <div className="catalog-empty-clean">
                            <div className="empty-icon-clean">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3>No encontramos productos</h3>
                            <p>Intenta con otra categoría</p>
                            <Link href="/catalogo" className="btn btn-primary">
                                Ver todo el catálogo
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <nav className="catalog-pagination-clean" aria-label="Paginación">
                            <Link
                                href={`/catalogo?page=${pagination.page - 1}${activeGenero ? `&genero=${activeGenero}` : ''}`}
                                className={`pagination-btn-clean ${pagination.page <= 1 ? 'disabled' : ''}`}
                                aria-disabled={pagination.page <= 1}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                                Anterior
                            </Link>

                            <div className="pagination-info">
                                Página {pagination.page} de {pagination.totalPages}
                            </div>

                            <Link
                                href={`/catalogo?page=${pagination.page + 1}${activeGenero ? `&genero=${activeGenero}` : ''}`}
                                className={`pagination-btn-clean ${pagination.page >= pagination.totalPages ? 'disabled' : ''}`}
                                aria-disabled={pagination.page >= pagination.totalPages}
                            >
                                Siguiente
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </Link>
                        </nav>
                    )}
                </div>
            </section>
        </main>
    );
}
