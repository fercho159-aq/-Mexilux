/**
 * CARRITO DE COMPRAS - Conectado a productos reales
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface CartItem {
    id: string;
    productId: string;
    name: string;
    brand: string;
    variant: string;
    variantId: string;
    image: string;
    price: number;
    quantity: number;
    slug: string;
}

function CartContent() {
    const searchParams = useSearchParams();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedCart = localStorage.getItem('mexilux_cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Error loading cart:', e);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const addSlug = searchParams.get('add');
        const variantId = searchParams.get('variant');

        if (addSlug && !loading) {
            fetchAndAddProduct(addSlug, variantId || '');
            window.history.replaceState({}, '', '/carrito');
        }
    }, [searchParams, loading]);

    useEffect(() => {
        if (!loading) {
            localStorage.setItem('mexilux_cart', JSON.stringify(cartItems));
            window.dispatchEvent(new CustomEvent('cart-updated', { detail: cartItems.length }));
        }
    }, [cartItems, loading]);

    const fetchAndAddProduct = async (slug: string, variantId: string) => {
        try {
            const response = await fetch(`/api/frames/${slug}`);
            if (!response.ok) {
                console.error('Product not found');
                return;
            }
            const product = await response.json();

            const existingIndex = cartItems.findIndex(
                item => item.slug === slug && item.variantId === variantId
            );

            if (existingIndex >= 0) {
                setCartItems(items =>
                    items.map((item, idx) =>
                        idx === existingIndex
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                );
            } else {
                const variant = product.frame_color_variants?.find(
                    (v: { id: string }) => v.id === variantId
                ) || product.frame_color_variants?.[0];

                const newItem: CartItem = {
                    id: `cart-${Date.now()}`,
                    productId: product.id,
                    name: product.name,
                    brand: product.brand?.name || '',
                    variant: variant?.color_name || 'Default',
                    variantId: variant?.id || '',
                    image: variant?.frame_images?.[0]?.url || '',
                    price: parseFloat(product.base_price) || 0,
                    quantity: 1,
                    slug: product.slug,
                };

                setCartItems(items => [...items, newItem]);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const formatPrice = (price: number) => `$${price.toLocaleString('es-MX')}`;

    const updateQuantity = (itemId: string, delta: number) => {
        setCartItems((items) =>
            items.map((item) =>
                item.id === itemId
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (itemId: string) => {
        setCartItems((items) => items.filter((item) => item.id !== itemId));
    };

    const applyPromo = () => {
        if (promoCode.toLowerCase() === 'bienvenido10') {
            setPromoApplied(true);
        }
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const discount = promoApplied ? subtotal * 0.1 : 0;
    const shipping = subtotal >= 1500 ? 0 : 200;
    const total = subtotal - discount + shipping;

    if (loading) {
        return (
            <main className="cart-page" style={{ paddingTop: '1.5rem', minHeight: '100vh' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', paddingTop: '4rem' }}>
                    <p style={{ color: '#94a3b8' }}>Cargando carrito...</p>
                </div>
            </main>
        );
    }

    if (cartItems.length === 0) {
        return (
            <main style={{ paddingTop: '1.5rem', minHeight: '100vh', background: '#fafbfc' }}>
                <div style={{
                    maxWidth: '480px',
                    margin: '0 auto',
                    padding: '6rem 1.5rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                    }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                    </div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '0.75rem',
                    }}>Tu bolsa esta vacia</h1>
                    <p style={{
                        fontSize: '1rem',
                        color: '#64748b',
                        lineHeight: 1.6,
                        marginBottom: '2rem',
                    }}>
                        Explora nuestra coleccion y encuentra tus lentes ideales
                    </p>
                    <Link href="/catalogo" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, #152132 0%, #1e293b 100%)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        borderRadius: '100px',
                        textDecoration: 'none',
                    }}>
                        Ver catalogo
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main style={{ paddingTop: '1.5rem', minHeight: '100vh', background: '#fafbfc', paddingBottom: '4rem' }}>
            {/* Breadcrumb */}
            <nav style={{
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '0 1.5rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: '#94a3b8',
            }}>
                <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Inicio</Link>
                <span>/</span>
                <span style={{ color: '#0f172a', fontWeight: 500 }}>Carrito</span>
            </nav>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: '1.5rem',
                    letterSpacing: '-0.02em',
                }}>
                    Tu carrito
                    <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#94a3b8',
                        marginLeft: '0.75rem',
                    }}>
                        {cartItems.length} {cartItems.length === 1 ? 'articulo' : 'articulos'}
                    </span>
                </h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '2rem',
                }}>
                    {/* Cart items */}
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cartItems.map((item) => (
                                <article key={item.id} style={{
                                    display: 'flex',
                                    gap: '1.25rem',
                                    padding: '1.25rem',
                                    background: 'white',
                                    borderRadius: '16px',
                                    border: '1px solid #e2e8f0',
                                }}>
                                    <div style={{
                                        position: 'relative',
                                        width: '100px',
                                        height: '100px',
                                        background: '#f8fafc',
                                        borderRadius: '12px',
                                        flexShrink: 0,
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                style={{ objectFit: 'contain', padding: '8px' }}
                                            />
                                        ) : (
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{
                                                    fontSize: '0.6875rem',
                                                    fontWeight: 700,
                                                    color: '#94a3b8',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    margin: '0 0 0.25rem',
                                                }}>{item.brand}</p>
                                                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 600 }}>
                                                    <Link href={`/catalogo/${item.slug}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                                <p style={{
                                                    fontSize: '0.8125rem',
                                                    color: '#64748b',
                                                    margin: 0,
                                                }}>Color: {item.variant}</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                aria-label="Eliminar producto"
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '0.25rem',
                                                    color: '#cbd5e1',
                                                    transition: 'color 0.2s',
                                                }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '10px',
                                                overflow: 'hidden',
                                            }}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    disabled={item.quantity <= 1}
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: '#f8fafc',
                                                        border: 'none',
                                                        cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                                        fontSize: '1.125rem',
                                                        color: item.quantity <= 1 ? '#cbd5e1' : '#475569',
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <span style={{
                                                    width: '40px',
                                                    textAlign: 'center',
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem',
                                                    color: '#0f172a',
                                                }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: '#f8fafc',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '1.125rem',
                                                        color: '#475569',
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span style={{
                                                fontSize: '1.125rem',
                                                fontWeight: 700,
                                                color: '#0f172a',
                                            }}>
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <Link href="/catalogo" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#64748b',
                                textDecoration: 'none',
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Seguir comprando
                            </Link>
                        </div>
                    </div>

                    {/* Order summary */}
                    <aside style={{
                        background: 'white',
                        borderRadius: '20px',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                    }}>
                        <div style={{ padding: '1.5rem 1.5rem 0' }}>
                            <h2 style={{
                                fontSize: '1.125rem',
                                fontWeight: 700,
                                color: '#0f172a',
                                marginBottom: '1.25rem',
                            }}>Resumen del pedido</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
                                    <span>Subtotal</span>
                                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatPrice(subtotal)}</span>
                                </div>
                                {promoApplied && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#16a34a' }}>
                                        <span>Descuento (10%)</span>
                                        <span style={{ fontWeight: 600 }}>-{formatPrice(discount)}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
                                    <span>Envio</span>
                                    <span style={{ fontWeight: 600, color: shipping === 0 ? '#16a34a' : '#0f172a' }}>
                                        {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Promo code */}
                        <div style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Codigo de descuento"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    disabled={promoApplied}
                                    style={{
                                        flex: 1,
                                        padding: '0.625rem 0.875rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '10px',
                                        fontSize: '0.8125rem',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    onClick={applyPromo}
                                    disabled={promoApplied || !promoCode}
                                    style={{
                                        padding: '0.625rem 1rem',
                                        background: promoApplied ? '#f0fdf4' : '#f8fafc',
                                        border: `1px solid ${promoApplied ? '#86efac' : '#e2e8f0'}`,
                                        borderRadius: '10px',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        color: promoApplied ? '#16a34a' : '#475569',
                                        cursor: promoApplied || !promoCode ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {promoApplied ? 'Aplicado' : 'Aplicar'}
                                </button>
                            </div>
                        </div>

                        {/* Total */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1.25rem 1.5rem',
                            background: 'linear-gradient(135deg, #152132 0%, #1e293b 100%)',
                            color: 'white',
                        }}>
                            <div>
                                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Total</span>
                                <span style={{ display: 'block', fontSize: '0.6875rem', opacity: 0.5 }}>IVA incluido</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                                <span style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{formatPrice(total)}</span>
                                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>MXN</span>
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem 1.5rem' }}>
                            <Link href="/checkout" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                width: '100%',
                                padding: '1rem',
                                background: 'linear-gradient(135deg, #152132 0%, #1e293b 100%)',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.9375rem',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                transition: 'opacity 0.2s',
                            }}>
                                Proceder al pago
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '1rem 1.5rem 1.25rem',
                            borderTop: '1px solid #f1f5f9',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                                <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 500 }}>Pago seguro</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="3" width="15" height="13" />
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                </svg>
                                <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 500 }}>Envio gratis +$1,500</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Responsive grid styles */}
            <style jsx>{`
                @media (min-width: 768px) {
                    div[style*="grid-template-columns: 1fr"] {
                        grid-template-columns: 1fr 380px !important;
                    }
                }
            `}</style>
        </main>
    );
}

export default function CarritoPage() {
    return (
        <Suspense fallback={
            <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', paddingTop: '4rem' }}>
                    <p style={{ color: '#94a3b8' }}>Cargando carrito...</p>
                </div>
            </main>
        }>
            <CartContent />
        </Suspense>
    );
}
