/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FICHA DE PRODUCTO - Conectado a Base de Datos
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFrameBySlug } from '@/lib/db';
import ProductGallery from '@/components/product/ProductGallery';
import ProductActions from '@/components/product/ProductActions';

// Disable caching to always show fresh data
export const dynamic = 'force-dynamic';

// Mapeos para display
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
    tr90: 'TR90',
    wood: 'Madera',
    mixed: 'Mixto',
};

const GENDER_LABELS: Record<string, string> = {
    male: 'Mexicano',
    female: 'Mexicana',
    unisex: 'Unisex',
    kids: 'Niños',
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const product = await getFrameBySlug(slug);

    if (!product) {
        return { title: 'Producto no encontrado | Mexilux' };
    }

    return {
        title: `${product.brand?.name} ${product.name} | Mexilux`,
        description: product.short_description || product.full_description || '',
        openGraph: {
            title: `${product.brand?.name} ${product.name}`,
            description: product.short_description || '',
            type: 'website',
        },
    };
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const product = await getFrameBySlug(slug);

    if (!product) {
        notFound();
    }

    const formatPrice = (price: number | { toNumber?: () => number }) => {
        const numPrice = typeof price === 'number' ? price : (price?.toNumber?.() ?? 0);
        return `$${numPrice.toLocaleString('es-MX')}`;
    };

    const basePrice = typeof product.base_price === 'number'
        ? product.base_price
        : product.base_price?.toNumber?.() ?? 0;

    const comparePrice = product.compare_at_price
        ? (typeof product.compare_at_price === 'number'
            ? product.compare_at_price
            : product.compare_at_price?.toNumber?.() ?? 0)
        : null;

    const discount = comparePrice && comparePrice > basePrice
        ? Math.round((1 - basePrice / comparePrice) * 100)
        : 0;

    const defaultVariant = product.frame_color_variants[0];
    const allImages = product.frame_color_variants.flatMap(v => v.frame_images);
    const rating = parseFloat(product.average_rating?.toString() || '0');

    return (
        <main className="product-page">
            {/* Breadcrumb */}
            <nav className="breadcrumb" aria-label="Navegación">
                <Link href="/">Inicio</Link>
                <span className="breadcrumb-separator">/</span>
                <Link href="/catalogo">Catálogo</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{product.name}</span>
            </nav>

            <div className="product-container">
                {/* GALERÍA INTERACTIVA */}
                <ProductGallery
                    images={allImages.map(img => ({ url: img.url, alt: img.alt }))}
                    productName={product.name}
                    discount={discount}
                />

                {/* INFORMACIÓN DEL PRODUCTO */}
                <section className="product-details" aria-labelledby="product-title">
                    <div className="product-header">
                        <span className="product-brand-tag">{product.brand?.name}</span>
                        <h1 id="product-title" className="product-title">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="product-rating-large">
                            <span className="stars" aria-hidden="true">
                                {'★'.repeat(Math.floor(rating))}
                                {'☆'.repeat(5 - Math.floor(rating))}
                            </span>
                            <span className="rating-number">{rating.toFixed(1)}</span>
                            <Link href="#reviews" className="reviews-link">
                                ({product.review_count} reseñas)
                            </Link>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="product-price-large">
                        <span className="price-current-large">{formatPrice(basePrice)}</span>
                        {comparePrice && comparePrice > basePrice && (
                            <>
                                <span className="price-original-large">{formatPrice(comparePrice)}</span>
                                <span className="price-discount">Ahorras {formatPrice(comparePrice - basePrice)}</span>
                            </>
                        )}
                    </div>

                    {/* Color selector */}
                    {product.frame_color_variants.length > 0 && (
                        <div className="option-section">
                            <h3 className="option-title">
                                Color: <span className="option-selected">{defaultVariant?.color_name}</span>
                            </h3>
                            <div className="color-options">
                                {product.frame_color_variants.map((variant, idx) => (
                                    <button
                                        key={variant.id}
                                        className={`color-option-btn ${idx === 0 ? 'selected' : ''}`}
                                        style={{ backgroundColor: variant.color_hex }}
                                        aria-label={`Color ${variant.color_name}`}
                                        title={variant.color_name}
                                    >
                                        {idx === 0 && <span className="check-icon">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN DE COMPRA CON OPCIONES DE LENTES */}
                    <ProductActions
                        slug={product.slug}
                        variantId={defaultVariant?.id || ''}
                        basePrice={basePrice}
                    />

                    {/* Delivery info con humor mexicano */}
                    <div className="delivery-info">
                        <div className="delivery-item">
                            <span className="delivery-icon">🚚</span>
                            <div className="delivery-text">
                                <strong>Envío gratis 🎉</strong>
                                <span>Sí llegamos, no somos tu prima (+$1,500)</span>
                            </div>
                        </div>
                        <div className="delivery-item">
                            <span className="delivery-icon">⏱️</span>
                            <div className="delivery-text">
                                <strong>5-7 días</strong>
                                <span>Ya vamos, es que hay mucho tráfico 🏃</span>
                            </div>
                        </div>
                        <div className="delivery-item">
                            <span className="delivery-icon">🛡️</span>
                            <div className="delivery-text">
                                <strong>Garantía 1 año</strong>
                                <span>Pa&apos; que estés tranquilo, compa</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* DESCRIPCIÓN Y ESPECIFICACIONES */}
            <section className="product-info-tabs">
                <div className="tabs-container">
                    <div className="tab-content">
                        <h2>Descripción</h2>
                        <p>{product.full_description || product.short_description || 'Sin descripción disponible.'}</p>
                    </div>

                    <div className="tab-content">
                        <h3>Especificaciones</h3>
                        <dl className="specs-list">
                            {product.lens_width && (
                                <div className="spec-row">
                                    <dt>Ancho del lente</dt>
                                    <dd>{product.lens_width.toString()}mm</dd>
                                </div>
                            )}
                            {product.bridge_width && (
                                <div className="spec-row">
                                    <dt>Ancho del puente</dt>
                                    <dd>{product.bridge_width.toString()}mm</dd>
                                </div>
                            )}
                            {product.temple_length && (
                                <div className="spec-row">
                                    <dt>Largo de la varilla</dt>
                                    <dd>{product.temple_length.toString()}mm</dd>
                                </div>
                            )}
                            {product.weight && (
                                <div className="spec-row">
                                    <dt>Peso</dt>
                                    <dd>{product.weight.toString()}g</dd>
                                </div>
                            )}
                            <div className="spec-row">
                                <dt>Material</dt>
                                <dd>{MATERIAL_LABELS[product.material] || product.material}</dd>
                            </div>
                            <div className="spec-row">
                                <dt>Forma</dt>
                                <dd>{SHAPE_LABELS[product.shape] || product.shape}</dd>
                            </div>
                            <div className="spec-row">
                                <dt>Género</dt>
                                <dd>{GENDER_LABELS[product.gender] || product.gender}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            {/* RESEÑAS */}
            <section id="reviews" className="reviews-section">
                <h2>Reseñas de clientes</h2>
                <div className="reviews-summary">
                    <div className="rating-big">
                        <span className="rating-number-big">{rating.toFixed(1)}</span>
                        <div>
                            <span className="stars-big">{'★'.repeat(Math.floor(rating))}</span>
                            <span className="reviews-total">{product.review_count} reseñas</span>
                        </div>
                    </div>
                </div>

                {/* Reviews list */}
                {product.reviews && product.reviews.length > 0 && (
                    <div className="reviews-list">
                        {product.reviews.map((review) => (
                            <div key={review.id} className="review-item">
                                <div className="review-header">
                                    <strong>{review.user?.first_name} {review.user?.last_name?.charAt(0)}.</strong>
                                    <span className="review-stars">{'★'.repeat(review.rating)}</span>
                                </div>
                                {review.title && <h4>{review.title}</h4>}
                                <p>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
