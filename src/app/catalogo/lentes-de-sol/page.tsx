/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CATÁLOGO - LENTES DE SOL (POLARIZADOS)
 * Conectado a base de datos PostgreSQL (Neon)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getFrames, getBrandsWithCount } from '@/lib/db';

// Disable caching to always show fresh data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Polarizados | Mexilux',
    description: 'Descubre nuestra colección de lentes de sol polarizados de las mejores marcas. Protección UV y estilo premium mexicano.',
};

// Mapeo de formas para display
const SHAPE_LABELS: Record<string, string> = {
    rectangular: 'Rectangular',
    round: 'Redondo',
    cat_eye: 'Cat Eye',
    aviator: 'Aviador',
    square: 'Cuadrado',
    oval: 'Ovalado',
    geometric: 'Geométrico',
    browline: 'Browline',
    wrap: 'Envolvente',
};

const MATERIAL_LABELS: Record<string, string> = {
    acetate: 'Acetato',
    metal: 'Metal',
    titanium: 'Titanio',
    tr90: 'Plástico TR90',
    wood: 'Madera',
    mixed: 'Mixto',
};

export default async function LentesDeSolPage() {
    // Obtener datos de la base de datos - solo lentes de sol (sunglasses)
    const [{ frames, pagination }, brands] = await Promise.all([
        getFrames(
            {
                status: 'active',
                categorySlug: 'lentes-de-sol',
            },
            { page: 1, limit: 24, orderBy: 'popular' }
        ),
        getBrandsWithCount(),
    ]);

    const formatPrice = (price: number | { toNumber?: () => number }) => {
        const numPrice = typeof price === 'number' ? price : (price?.toNumber?.() ?? 0);
        return `$${numPrice.toLocaleString('es-MX')}`;
    };

    // Agrupar frames por forma y material para conteos
    const shapeCounts: Record<string, number> = {};
    const materialCounts: Record<string, number> = {};

    frames.forEach(frame => {
        shapeCounts[frame.shape] = (shapeCounts[frame.shape] || 0) + 1;
        materialCounts[frame.material] = (materialCounts[frame.material] || 0) + 1;
    });

    return (
        <main className="catalog-page">
            {/* Breadcrumb */}
            <nav className="breadcrumb" aria-label="Navegación">
                <Link href="/">Inicio</Link>
                <span className="breadcrumb-separator">/</span>
                <Link href="/catalogo">Catálogo</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">Lentes de Sol</span>
            </nav>

            <div className="catalog-container">
                {/* SIDEBAR - FILTROS */}
                <aside className="catalog-sidebar" aria-label="Filtros">
                    <div className="sidebar-header">
                        <h2>Filtros</h2>
                        <Link href="/catalogo/lentes-de-sol" className="btn-clear-filters">Limpiar todo</Link>
                    </div>

                    {/* Filtro: Forma */}
                    <div className="filter-section">
                        <h3 className="filter-title">Forma</h3>
                        <div className="filter-options">
                            {Object.entries(SHAPE_LABELS).map(([value, label]) => (
                                shapeCounts[value] ? (
                                    <label key={value} className="filter-option">
                                        <input type="checkbox" name="forma" value={value} />
                                        <span className="option-label">{label}</span>
                                        <span className="option-count">({shapeCounts[value]})</span>
                                    </label>
                                ) : null
                            ))}
                        </div>
                    </div>

                    {/* Filtro: Material */}
                    <div className="filter-section">
                        <h3 className="filter-title">Material</h3>
                        <div className="filter-options">
                            {Object.entries(MATERIAL_LABELS).map(([value, label]) => (
                                materialCounts[value] ? (
                                    <label key={value} className="filter-option">
                                        <input type="checkbox" name="material" value={value} />
                                        <span className="option-label">{label}</span>
                                        <span className="option-count">({materialCounts[value]})</span>
                                    </label>
                                ) : null
                            ))}
                        </div>
                    </div>

                    {/* Filtro: Marca */}
                    <div className="filter-section">
                        <h3 className="filter-title">Marca</h3>
                        <div className="filter-options">
                            {brands.filter(b => b.productCount > 0).map((brand) => (
                                <label key={brand.id} className="filter-option">
                                    <input type="checkbox" name="marca" value={brand.slug} />
                                    <span className="option-label">{brand.name}</span>
                                    <span className="option-count">({brand.productCount})</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* GRID DE PRODUCTOS */}
                <section className="catalog-main" aria-labelledby="catalog-title">
                    <div className="catalog-header">
                        <h1 id="catalog-title">Lentes de Sol</h1>
                        <p className="results-count">{pagination.total} productos</p>
                    </div>

                    {/* Banner promocional */}
                    <div className="category-banner" style={{
                        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
                        borderRadius: '16px',
                        padding: '2rem',
                        marginBottom: '2rem',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem'
                    }}>
                        <div style={{ fontSize: '4rem' }}>☀️</div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                                Protección UV 100%
                            </h2>
                            <p style={{ margin: '0.5rem 0 0', opacity: 0.9 }}>
                                Todos nuestros lentes de sol incluyen protección UV400 certificada
                            </p>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="catalog-toolbar">
                        <div className="active-filters">
                            <span className="active-filter">
                                Lentes de Sol
                                <Link href="/catalogo" aria-label="Quitar filtro">×</Link>
                            </span>
                        </div>
                        <div className="sort-options">
                            <label htmlFor="sort">Ordenar por:</label>
                            <select id="sort" name="sort" defaultValue="popular">
                                <option value="popular">Más populares</option>
                                <option value="price-asc">Precio: menor a mayor</option>
                                <option value="price-desc">Precio: mayor a menor</option>
                                <option value="new">Más recientes</option>
                                <option value="rating">Mejor calificados</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {frames.length === 0 ? (
                        <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                            <p style={{ fontSize: '1.25rem', color: '#6e6e73' }}>
                                No hay lentes de sol disponibles en este momento.
                            </p>
                            <Link href="/catalogo" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                Ver todo el catálogo
                            </Link>
                        </div>
                    ) : (
                        <div className="products-grid catalog-grid">
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

                                return (
                                    <article key={frame.id} className="product-card">
                                        {/* Badges */}
                                        <div className="product-badges">
                                            {frame.is_new && <span className="badge badge-new">Nuevo</span>}
                                            {frame.is_bestseller && <span className="badge badge-bestseller">Bestseller</span>}
                                            {comparePrice && comparePrice > basePrice && (
                                                <span className="badge badge-sale">
                                                    -{Math.round((1 - basePrice / comparePrice) * 100)}%
                                                </span>
                                            )}
                                        </div>

                                        {/* Wishlist button */}
                                        <button className="btn-wishlist" aria-label="Agregar a favoritos">
                                            ♡
                                        </button>

                                        {/* Image */}
                                        <Link href={`/catalogo/${frame.slug}`} className="product-image-link">
                                            <div className="product-image">
                                                {defaultImage?.url ? (
                                                    <Image
                                                        src={defaultImage.url}
                                                        alt={frame.name}
                                                        fill
                                                        style={{ objectFit: 'contain' }}
                                                        sizes="(max-width: 768px) 50vw, 25vw"
                                                    />
                                                ) : (
                                                    <span className="product-emoji" aria-hidden="true">🕶️</span>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Info */}
                                        <div className="product-info">
                                            <span className="product-brand">{frame.brand?.name}</span>
                                            <h3 className="product-name">
                                                <Link href={`/catalogo/${frame.slug}`}>{frame.name}</Link>
                                            </h3>

                                            {/* Price */}
                                            <div className="product-price">
                                                <span className="price-current">{formatPrice(basePrice)}</span>
                                                {comparePrice && comparePrice > basePrice && (
                                                    <span className="price-original">{formatPrice(comparePrice)}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="product-actions">
                                            <Link href={`/catalogo/${frame.slug}`} className="btn btn-product">
                                                Ver detalles
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <nav className="catalog-pagination" aria-label="Paginación">
                            <button className="pagination-btn" disabled={pagination.page === 1}>
                                ← Anterior
                            </button>
                            <div className="pagination-pages">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        className={`pagination-page ${pageNum === pagination.page ? 'active' : ''}`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>
                            <button className="pagination-btn" disabled={pagination.page === pagination.totalPages}>
                                Siguiente →
                            </button>
                        </nav>
                    )}
                </section>
            </div>
        </main>
    );
}
