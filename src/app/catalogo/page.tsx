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
import { getFrames, getBrandsWithCount, getCategoriesWithCount } from '@/lib/db';

// Disable caching to always show fresh data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Catálogo de Lentes | Mexilux',
    description: 'Explora nuestra colección de lentes oftálmicos y de sol de las mejores marcas. Filtros por forma, material, color y marca.',
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

const GENDER_LABELS: Record<string, string> = {
    male: 'Mexicano',
    female: 'Mexicana',
    unisex: 'Unisex',
    kids: 'Niños',
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CatalogoPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // Obtener filtros de URL
    const activeGenero = params.genero as string | undefined;
    const activeForma = params.forma as string | undefined;
    const activeMaterial = params.material as string | undefined;
    const activeMarca = params.marca as string | undefined;
    const searchQuery = params.q as string | undefined;
    const page = parseInt(params.page as string) || 1;

    // Obtener datos de la base de datos
    const [{ frames, pagination }, brands, categories] = await Promise.all([
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
        getCategoriesWithCount(),
    ]);

    const formatPrice = (price: number | { toNumber?: () => number }) => {
        const numPrice = typeof price === 'number' ? price : (price?.toNumber?.() ?? 0);
        return `$${numPrice.toLocaleString('es-MX')}`;
    };

    // Construir URL con filtros
    const buildFilterUrl = (key: string, value: string) => {
        const newParams = new URLSearchParams();
        if (activeGenero && key !== 'genero') newParams.set('genero', activeGenero);
        if (activeForma && key !== 'forma') newParams.set('forma', activeForma);
        if (activeMaterial && key !== 'material') newParams.set('material', activeMaterial);
        if (activeMarca && key !== 'marca') newParams.set('marca', activeMarca);
        if (value) newParams.set(key, value);
        const query = newParams.toString();
        return `/catalogo${query ? `?${query}` : ''}`;
    };

    const hasActiveFilters = activeGenero || activeForma || activeMaterial || activeMarca || searchQuery;

    return (
        <main className="catalog-page-clean">
            {/* ════════════════════════════════════════════════════════════════════
                HERO HEADER
            ════════════════════════════════════════════════════════════════════ */}
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

            {/* ════════════════════════════════════════════════════════════════════
                BARRA DE FILTROS SUPERIOR (Apple Style)
            ════════════════════════════════════════════════════════════════════ */}
            <section className="catalog-filter-bar">
                <div className="filter-bar-container">
                    {/* Búsqueda */}
                    <div className="filter-search">
                        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input 
                            type="search" 
                            placeholder="Buscar lentes..." 
                            defaultValue={searchQuery}
                            className="filter-search-input"
                        />
                    </div>

                    {/* Filtros dropdown */}
                    <div className="filter-dropdowns">
                        {/* Género */}
                        <div className="filter-dropdown">
                            <select 
                                defaultValue={activeGenero || ''}
                                onChange={(e) => {
                                    if (typeof window !== 'undefined') {
                                        window.location.href = buildFilterUrl('genero', e.target.value);
                                    }
                                }}
                            >
                                <option value="">Todos los estilos</option>
                                {Object.entries(GENDER_LABELS).map(([value, label]) => (
                                    <option key={value} value={value === 'male' ? 'hombre' : value === 'female' ? 'mujer' : value === 'kids' ? 'ninos' : value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Forma */}
                        <div className="filter-dropdown">
                            <select defaultValue={activeForma || ''}>
                                <option value="">Todas las formas</option>
                                {Object.entries(SHAPE_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Material */}
                        <div className="filter-dropdown">
                            <select defaultValue={activeMaterial || ''}>
                                <option value="">Todo material</option>
                                {Object.entries(MATERIAL_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Marca */}
                        <div className="filter-dropdown">
                            <select defaultValue={activeMarca || ''}>
                                <option value="">Todas las marcas</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.slug}>{brand.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Ordenar */}
                        <div className="filter-dropdown filter-sort">
                            <select defaultValue="popular">
                                <option value="popular">Más populares</option>
                                <option value="price-asc">Precio: menor a mayor</option>
                                <option value="price-desc">Precio: mayor a menor</option>
                                <option value="new">Más recientes</option>
                                <option value="rating">Mejor calificados</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Filtros activos */}
                {hasActiveFilters && (
                    <div className="active-filters-bar">
                        <span className="filters-label">Filtros activos:</span>
                        {activeGenero && (
                            <Link href={buildFilterUrl('genero', '')} className="active-filter-tag">
                                {activeGenero} <span className="remove-filter">×</span>
                            </Link>
                        )}
                        {activeForma && (
                            <Link href={buildFilterUrl('forma', '')} className="active-filter-tag">
                                {SHAPE_LABELS[activeForma] || activeForma} <span className="remove-filter">×</span>
                            </Link>
                        )}
                        {activeMaterial && (
                            <Link href={buildFilterUrl('material', '')} className="active-filter-tag">
                                {MATERIAL_LABELS[activeMaterial] || activeMaterial} <span className="remove-filter">×</span>
                            </Link>
                        )}
                        {activeMarca && (
                            <Link href={buildFilterUrl('marca', '')} className="active-filter-tag">
                                {activeMarca} <span className="remove-filter">×</span>
                            </Link>
                        )}
                        <Link href="/catalogo" className="clear-all-filters">
                            Limpiar todo
                        </Link>
                    </div>
                )}
            </section>

            {/* ════════════════════════════════════════════════════════════════════
                GRID DE PRODUCTOS
            ════════════════════════════════════════════════════════════════════ */}
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

                                        {/* Wishlist button */}
                                        <button className="btn-wishlist-clean" aria-label="Agregar a favoritos">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                            </svg>
                                        </button>

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
                            <p>Intenta ajustando los filtros o explora todo el catálogo</p>
                            <Link href="/catalogo" className="btn btn-primary">
                                Ver todo el catálogo
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <nav className="catalog-pagination-clean" aria-label="Paginación">
                            <Link
                                href={`/catalogo?page=${pagination.page - 1}`}
                                className={`pagination-btn-clean ${pagination.page <= 1 ? 'disabled' : ''}`}
                                aria-disabled={pagination.page <= 1}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m15 18-6-6 6-6"/>
                                </svg>
                                Anterior
                            </Link>
                            
                            <div className="pagination-info">
                                Página {pagination.page} de {pagination.totalPages}
                            </div>

                            <Link
                                href={`/catalogo?page=${pagination.page + 1}`}
                                className={`pagination-btn-clean ${pagination.page >= pagination.totalPages ? 'disabled' : ''}`}
                                aria-disabled={pagination.page >= pagination.totalPages}
                            >
                                Siguiente
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m9 18 6-6-6-6"/>
                                </svg>
                            </Link>
                        </nav>
                    )}
                </div>
            </section>
        </main>
    );
}
