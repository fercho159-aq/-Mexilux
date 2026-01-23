/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PÁGINA DE CHECKOUT - Compra rápida
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFrameBySlug } from '@/lib/db';
import MercadoPagoButton from '@/components/checkout/MercadoPagoButton';

export const metadata: Metadata = {
    title: 'Checkout | Mexilux',
    description: 'Completa tu compra en Mexilux',
};

// Disable caching to always show fresh data
export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ buy?: string; variant?: string }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const productSlug = params.buy;
    const variantId = params.variant;

    if (!productSlug) {
        notFound();
    }

    const product = await getFrameBySlug(productSlug);

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

    const selectedVariant = product.frame_color_variants.find(v => v.id === variantId)
        || product.frame_color_variants[0];

    const productImage = selectedVariant?.frame_images[0]?.url || '/armazon-1/1.png';

    // Precio de envío
    const shippingCost = basePrice >= 1300 ? 0 : 99;
    const totalPrice = basePrice + shippingCost;

    return (
        <main className="checkout-page">
            <div className="section-container">
                <header className="checkout-header">
                    <h1>⚡ Checkout rápido</h1>
                    <p>¡Ya casi son tuyos!</p>
                </header>

                <div className="checkout-layout">
                    {/* Resumen del producto */}
                    <section className="checkout-summary">
                        <h2>Tu pedido</h2>

                        <div className="checkout-product">
                            <div className="checkout-product-image">
                                <Image
                                    src={productImage}
                                    alt={product.name}
                                    width={120}
                                    height={120}
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                            <div className="checkout-product-info">
                                <span className="checkout-brand">{product.brand?.name}</span>
                                <h3>{product.name}</h3>
                                {selectedVariant && (
                                    <span className="checkout-variant">
                                        Color: {selectedVariant.color_name}
                                    </span>
                                )}
                                <span className="checkout-price">{formatPrice(basePrice)}</span>
                            </div>
                        </div>

                        <div className="checkout-totals">
                            <div className="checkout-row">
                                <span>Subtotal</span>
                                <span>{formatPrice(basePrice)}</span>
                            </div>
                            <div className="checkout-row">
                                <span>Envío</span>
                                <span style={{ color: shippingCost === 0 ? 'var(--color-success)' : undefined }}>
                                    {shippingCost === 0 ? '¡GRATIS! 🎉' : formatPrice(shippingCost)}
                                </span>
                            </div>
                            {shippingCost > 0 && (
                                <p className="checkout-shipping-note">
                                    💡 Envío gratis en compras mayores a $1,300
                                </p>
                            )}
                            <div className="checkout-row checkout-total">
                                <span>Total</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                        </div>
                    </section>

                    {/* Formulario de contacto */}
                    <section className="checkout-form-section">
                        <h2>¿Cómo te contactamos?</h2>

                        {/* Mercado Pago Section */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-semibold mb-3 text-gray-700">Paga seguro con Mercado Pago:</h3>
                            <MercadoPagoButton
                                product={{
                                    id: productSlug,
                                    title: `${product.brand?.name || ''} ${product.name}`,
                                    price: totalPrice
                                }}
                            />
                            <div className="relative my-6 text-center">
                                <span className="bg-white px-2 text-sm text-gray-500 relative z-10">O cotiza por WhatsApp</span>
                                <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 -z-0"></div>
                            </div>
                        </div>
                        <p className="checkout-subtitle">
                            Déjanos tus datos y te contactamos por WhatsApp para confirmar tu pedido 📱
                        </p>

                        <form className="checkout-form">
                            <div className="form-field">
                                <label htmlFor="name">Nombre completo *</label>
                                <input type="text" id="name" name="name" required placeholder="Tu nombre" />
                            </div>

                            <div className="form-field">
                                <label htmlFor="phone">WhatsApp *</label>
                                <input type="tel" id="phone" name="phone" required placeholder="55 1234 5678" />
                            </div>

                            <div className="form-field">
                                <label htmlFor="email">Correo electrónico</label>
                                <input type="email" id="email" name="email" placeholder="tu@correo.com" />
                            </div>

                            <div className="form-field">
                                <label htmlFor="notes">¿Algo que debamos saber?</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={3}
                                    placeholder="Ej: Necesito lentes graduados, tengo una receta..."
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg checkout-submit">
                                ¡Confirmar pedido! 🚀
                            </button>

                            <p className="checkout-legal">
                                Al confirmar, aceptas nuestros{' '}
                                <Link href="/legal/terminos">términos y condiciones</Link>
                            </p>
                        </form>

                        {/* Alternativa WhatsApp directo */}
                        <div className="checkout-whatsapp">
                            <span className="checkout-divider">o si prefieres</span>
                            <a
                                href={`https://wa.me/5215512345678?text=¡Hola! Quiero comprar: ${product.brand?.name} ${product.name} (${selectedVariant?.color_name || 'Color estándar'}) - ${formatPrice(basePrice)}`}
                                className="btn btn-whatsapp"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                💬 Escríbenos directo por WhatsApp
                            </a>
                        </div>
                    </section>
                </div>

                {/* Garantías */}
                <section className="checkout-guarantees">
                    <div className="guarantee-item">
                        <span className="guarantee-icon">🛡️</span>
                        <span>Garantía incluida</span>
                    </div>
                    <div className="guarantee-item">
                        <span className="guarantee-icon">🚚</span>
                        <span>Envío a todo México</span>
                    </div>
                    <div className="guarantee-item">
                        <span className="guarantee-icon">⏱️</span>
                        <span>5-7 días hábiles</span>
                    </div>
                </section>

                <Link href={`/catalogo/${productSlug}`} className="checkout-back">
                    ← Regresar al producto
                </Link>
            </div>
        </main>
    );
}
