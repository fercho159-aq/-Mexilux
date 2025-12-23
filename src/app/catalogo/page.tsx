/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CATÁLOGO - PÁGINA PRINCIPAL (SITEMAP 2.0)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Conectado a base de datos PostgreSQL (Neon)
 * Estructura:
 * 2.1 Filtros (Forma, Material, Color, Marca)
 * 2.2 Grid de Productos
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
    const activeTipo = params.tipo as string | undefined;
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
                <span className="breadcrumb-current">Catálogo</span>
            </nav>

            <div className="catalog-container">
                {/* ════════════════════════════════════════════════════════════════════
            2.1 SIDEBAR - FILTROS
            ════════════════════════════════════════════════════════════════════ */}
                <aside className="catalog-sidebar" aria-label="Filtros">
                    <div className="sidebar-header">
                        <h2>Filtros</h2>
                        <Link href="/catalogo" className="btn-clear-filters">Limpiar todo</Link>
                    </div>

                    {/* Filtro: Categoría/Tipo */}
                    <div className="filter-section">
                        <h3 className="filter-title">Categoría</h3>
                        <div className="filter-options">
                            {categories.map((cat) => (
                                <label key={cat.id} className="filter-option">
                                    <input
                                        type="checkbox"
                                        name="categoria"
                                        value={cat.slug}
                                    />
                                    <span className="option-label">{cat.name}</span>
                                    <span className="option-count">({cat.productCount})</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filtro: Género */}
                    <div className="filter-section">
                        <h3 className="filter-title">Género</h3>
                        <div className="filter-options">
                            {(['male', 'female', 'unisex', 'kids'] as const).map((gender) => (
                                <label key={gender} className="filter-option">
                                    <input
                                        type="checkbox"
                                        name="genero"
                                        value={gender}
                                        defaultChecked={
                                            (gender === 'male' && activeGenero === 'hombre') ||
                                            (gender === 'female' && activeGenero === 'mujer') ||
                                            (gender === 'kids' && activeGenero === 'ninos')
                                        }
                                    />
                                    <span className="option-label">{GENDER_LABELS[gender]}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filtro: Forma */}
                    <div className="filter-section">
                        <h3 className="filter-title">Forma</h3>
                        <div className="filter-options">
                            {Object.entries(SHAPE_LABELS).map(([value, label]) => (
                                <label key={value} className="filter-option">
                                    <input type="checkbox" name="forma" value={value} />
                                    <span className="option-label">{label}</span>
                                    {shapeCounts[value] && (
                                        <span className="option-count">({shapeCounts[value]})</span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filtro: Material */}
                    <div className="filter-section">
                        <h3 className="filter-title">Material</h3>
                        <div className="filter-options">
                            {Object.entries(MATERIAL_LABELS).map(([value, label]) => (
                                <label key={value} className="filter-option">
                                    <input type="checkbox" name="material" value={value} />
                                    <span className="option-label">{label}</span>
                                    {materialCounts[value] && (
                                        <span className="option-count">({materialCounts[value]})</span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filtro: Marca */}
                    <div className="filter-section">
                        <h3 className="filter-title">Marca</h3>
                        <div className="filter-options">
                            {brands.map((brand) => (
                                <label key={brand.id} className="filter-option">
                                    <input type="checkbox" name="marca" value={brand.slug} />
                                    <span className="option-label">{brand.name}</span>
                                    <span className="option-count">({brand.productCount})</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ════════════════════════════════════════════════════════════════════
            2.2 GRID DE PRODUCTOS
            ════════════════════════════════════════════════════════════════════ */}
                <section className="catalog-main" aria-labelledby="catalog-title">
                    <div className="catalog-header">
                        <h1 id="catalog-title">
                            {activeGenero ? `Lentes para ${activeGenero}` : 'Todos los lentes'}
                        </h1>
                        <p className="results-count">{pagination.total} productos</p>
                    </div>

                    {/* Toolbar */}
                    <div className="catalog-toolbar">
                        <div className="active-filters">
                            {activeGenero && (
                                <span className="active-filter">
                                    {activeGenero}
                                    <Link href="/catalogo" aria-label={`Quitar filtro ${activeGenero}`}>×</Link>
                                </span>
                            )}
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
                            const avgRating = typeof frame.average_rating === 'number'
                                ? frame.average_rating
                                : frame.average_rating?.toNumber?.() ?? 0;

                            return (
                                <article key={frame.id} className="product-card">
                                    {/* Badges */}
                                    <div className="product-badges">
                                        {frame.is_new && <span className="badge badge-new">Nuevo</span>}
                                        {frame.is_bestseller && <span className="badge badge-bestseller">Bestseller</span>}
                                        {comparePrice && basePrice < comparePrice && (
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
                                                <span className="product-emoji" aria-hidden="true">
                                                    {frame.sunglasses_only ? '🕶️' : '👓'}
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Color variants */}
                                    <div className="product-colors">
                                        {frame.frame_color_variants.slice(0, 4).map((variant) => (
                                            <span
                                                key={variant.id}
                                                className="product-color-dot"
                                                style={{ backgroundColor: variant.color_hex }}
                                                title={variant.color_name}
                                            />
                                        ))}
                                        {frame.frame_color_variants.length > 4 && (
                                            <span className="product-color-more">+{frame.frame_color_variants.length - 4}</span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="product-info">
                                        <span className="product-brand">{frame.brand.name}</span>
                                        <h3 className="product-name">
                                            <Link href={`/catalogo/${frame.slug}`}>{frame.name}</Link>
                                        </h3>

                                        {/* Rating */}
                                        <div className="product-rating" aria-label={`${avgRating} de 5 estrellas`}>
                                            <span className="stars" aria-hidden="true">
                                                {'★'.repeat(Math.floor(avgRating))}
                                                {'☆'.repeat(5 - Math.floor(avgRating))}
                                            </span>
                                            <span className="reviews-count">({frame.review_count})</span>
                                        </div>

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

                    {/* Empty state */}
                    {frames.length === 0 && (
                        <div className="catalog-empty">
                            <span className="empty-icon">🔍</span>
                            <h3>No encontramos productos</h3>
                            <p>Intenta ajustando los filtros o explora todo el catálogo</p>
                            <Link href="/catalogo" className="btn btn-primary">
                                Ver todo el catálogo
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <nav className="catalog-pagination" aria-label="Paginación">
                            <Link
                                href={`/catalogo?page=${pagination.page - 1}`}
                                className={`pagination-btn ${pagination.page <= 1 ? 'disabled' : ''}`}
                                aria-disabled={pagination.page <= 1}
                            >
                                ← Anterior
                            </Link>
                            <div className="pagination-pages">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <Link
                                            key={pageNum}
                                            href={`/catalogo?page=${pageNum}`}
                                            className={`pagination-page ${pageNum === pagination.page ? 'active' : ''}`}
                                        >
                                            {pageNum}
                                        </Link>
                                    );
                                })}
                                {pagination.totalPages > 5 && (
                                    <>
                                        <span className="pagination-ellipsis">...</span>
                                        <Link
                                            href={`/catalogo?page=${pagination.totalPages}`}
                                            className="pagination-page"
                                        >
                                            {pagination.totalPages}
                                        </Link>
                                    </>
                                )}
                            </div>
                            <Link
                                href={`/catalogo?page=${pagination.page + 1}`}
                                className={`pagination-btn ${pagination.page >= pagination.totalPages ? 'disabled' : ''}`}
                                aria-disabled={pagination.page >= pagination.totalPages}
                            >
                                Siguiente →
                            </Link>
                        </nav>
                    )}
                </section>
            </div>
        </main>
    );
}
