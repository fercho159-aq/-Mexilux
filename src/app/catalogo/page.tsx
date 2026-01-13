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
    const page = parseInt(params.page as string) || 1;

    const [{ frames, pagination }, brands] = await Promise.all([
        getFrames(
            {
                status: 'active',
                gender: activeGenero === 'hombre' ? 'male' :
                    activeGenero === 'mujer' ? 'female' :
                        activeGenero === 'ninos' ? 'kids' : undefined,
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
                    {/* Quick filters as links */}
                    <div className="filter-links">
                        <Link
                            href="/catalogo"
                            className={`filter-link ${!activeGenero ? 'active' : ''}`}
                        >
                            Todos
                        </Link>
                        <Link
                            href="/catalogo?genero=hombre"
                            className={`filter-link ${activeGenero === 'hombre' ? 'active' : ''}`}
                        >
                            Mexicano
                        </Link>
                        <Link
                            href="/catalogo?genero=mujer"
                            className={`filter-link ${activeGenero === 'mujer' ? 'active' : ''}`}
                        >
                            Mexicana
                        </Link>
                    </div>

                    {/* Sort and search */}
                    <div className="filter-actions">
                        <Link href="/buscar" className="filter-search-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            Buscar
                        </Link>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="catalog-products-section">
                <div className="catalog-products-container">
                    {frames.length > 0 ? (
                        <div className="products-grid-clean">
                            {frames.map((frame) => {
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
                                                    />
                                                ) : (
                                                    <span className="product-emoji-clean" aria-hidden="true">
                                                        {frame.sunglasses_only ? '🕶️' : '👓'}
                                                    </span>
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
                            <div className="empty-icon-clean">🔍</div>
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
