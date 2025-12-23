/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CATÁLOGO - LENTES DE SOL (POLARIZADOS) - Apple Style
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getFrames, getBrandsWithCount } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Polarizados | Mexilux',
    description: 'Descubre nuestra colección de lentes de sol polarizados de las mejores marcas. Protección UV y estilo premium mexicano.',
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

export default async function LentesDeSolPage() {
    const [{ frames, pagination }, brands] = await Promise.all([
        getFrames(
            { status: 'active', categorySlug: 'lentes-de-sol' },
            { page: 1, limit: 24, orderBy: 'popular' }
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
            <section className="catalog-hero" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)' }}>
                <div className="catalog-hero-content">
                    <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>☀️</span>
                    <h1 className="catalog-hero-title" style={{ color: 'white' }}>
                        Lentes Polarizados
                    </h1>
                    <p className="catalog-hero-subtitle" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {pagination.total} productos con protección UV400 certificada
                    </p>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="catalog-filter-bar">
                <div className="filter-bar-container">
                    <div className="filter-search">
                        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input type="search" placeholder="Buscar polarizados..." className="filter-search-input" />
                    </div>

                    <div className="filter-dropdowns">
                        <div className="filter-dropdown">
                            <select defaultValue="">
                                <option value="">Todas las formas</option>
                                {Object.entries(SHAPE_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-dropdown">
                            <select defaultValue="">
                                <option value="">Todo material</option>
                                {Object.entries(MATERIAL_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-dropdown">
                            <select defaultValue="">
                                <option value="">Todas las marcas</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.slug}>{brand.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-dropdown filter-sort">
                            <select defaultValue="popular">
                                <option value="popular">Más populares</option>
                                <option value="price-asc">Precio: menor a mayor</option>
                                <option value="price-desc">Precio: mayor a menor</option>
                                <option value="new">Más recientes</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="active-filters-bar" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                    <span className="filters-label">Categoría:</span>
                    <Link href="/catalogo" className="active-filter-tag">
                        Polarizados <span className="remove-filter">×</span>
                    </Link>
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
                                    ? frame.base_price : frame.base_price?.toNumber?.() ?? 0;
                                const comparePrice = frame.compare_at_price
                                    ? (typeof frame.compare_at_price === 'number'
                                        ? frame.compare_at_price : frame.compare_at_price?.toNumber?.() ?? 0)
                                    : null;

                                return (
                                    <article key={frame.id} className="product-card-clean">
                                        <div className="product-badges-clean">
                                            {frame.is_new && <span className="badge-clean badge-new">Nuevo</span>}
                                            {frame.is_bestseller && <span className="badge-clean badge-bestseller">Bestseller</span>}
                                            {comparePrice && basePrice < comparePrice && (
                                                <span className="badge-clean badge-sale">
                                                    -{Math.round((1 - basePrice / comparePrice) * 100)}%
                                                </span>
                                            )}
                                        </div>

                                        <button className="btn-wishlist-clean" aria-label="Agregar a favoritos">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                            </svg>
                                        </button>

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
                                                    <span className="product-emoji-clean">🕶️</span>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="product-info-clean">
                                            <span className="product-brand-clean">{frame.brand?.name}</span>
                                            <h3 className="product-name-clean">
                                                <Link href={`/catalogo/${frame.slug}`}>{frame.name}</Link>
                                            </h3>
                                            <div className="product-price-clean">
                                                <span className="price-current-clean">{formatPrice(basePrice)}</span>
                                                {comparePrice && comparePrice > basePrice && (
                                                    <span className="price-original-clean">{formatPrice(comparePrice)}</span>
                                                )}
                                            </div>
                                        </div>

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
                        <div className="catalog-empty-clean">
                            <div className="empty-icon-clean">🕶️</div>
                            <h3>No hay polarizados disponibles</h3>
                            <p>Pronto tendremos nuevos modelos</p>
                            <Link href="/catalogo" className="btn btn-primary">Ver todo el catálogo</Link>
                        </div>
                    )}

                    {pagination.totalPages > 1 && (
                        <nav className="catalog-pagination-clean" aria-label="Paginación">
                            <button className="pagination-btn-clean" disabled={pagination.page <= 1}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m15 18-6-6 6-6"/>
                                </svg>
                                Anterior
                            </button>
                            <div className="pagination-info">
                                Página {pagination.page} de {pagination.totalPages}
                            </div>
                            <button className="pagination-btn-clean" disabled={pagination.page >= pagination.totalPages}>
                                Siguiente
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m9 18 6-6-6-6"/>
                                </svg>
                            </button>
                        </nav>
                    )}
                </div>
            </section>
        </main>
    );
}
