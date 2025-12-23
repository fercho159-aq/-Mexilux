/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CARRITO DE COMPRAS - Conectado a productos reales
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Type for cart items
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

// Cart content component (uses useSearchParams)
function CartContent() {
    const searchParams = useSearchParams();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load cart from localStorage on mount
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

    // Check for add parameter in URL
    useEffect(() => {
        const addSlug = searchParams.get('add');
        const variantId = searchParams.get('variant');

        if (addSlug && !loading) {
            // Fetch product info and add to cart
            fetchAndAddProduct(addSlug, variantId || '');
            // Clear the URL params
            window.history.replaceState({}, '', '/carrito');
        }
    }, [searchParams, loading]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('mexilux_cart', JSON.stringify(cartItems));
            // Update cart count in header (if applicable)
            window.dispatchEvent(new CustomEvent('cart-updated', { detail: cartItems.length }));
        }
    }, [cartItems, loading]);

    const fetchAndAddProduct = async (slug: string, variantId: string) => {
        try {
            // Fetch product from API
            const response = await fetch(`/api/frames/${slug}`);
            if (!response.ok) {
                console.error('Product not found');
                return;
            }
            const product = await response.json();

            // Check if already in cart
            const existingIndex = cartItems.findIndex(
                item => item.slug === slug && item.variantId === variantId
            );

            if (existingIndex >= 0) {
                // Increment quantity
                setCartItems(items =>
                    items.map((item, idx) =>
                        idx === existingIndex
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                );
            } else {
                // Get variant info
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

    // Calculate totals
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const discount = promoApplied ? subtotal * 0.1 : 0;
    const shipping = subtotal >= 1500 ? 0 : 200;
    const total = subtotal - discount + shipping;

    if (loading) {
        return (
            <main className="cart-page">
                <div className="section-container">
                    <div className="empty-cart">
                        <p>Cargando carrito...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (cartItems.length === 0) {
        return (
            <main className="cart-page">
                <div className="section-container">
                    <div className="empty-cart">
                        <span className="empty-icon">🛒</span>
                        <h1>Tu carrito está vacío</h1>
                        <p>Parece que aún no has agregado productos a tu carrito</p>
                        <Link href="/catalogo" className="btn btn-primary btn-lg">
                            Explorar catálogo
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            {/* Breadcrumb */}
            <nav className="breadcrumb" aria-label="Navegación">
                <Link href="/">Inicio</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">Carrito</span>
            </nav>

            <div className="section-container">
                <h1>Tu carrito ({cartItems.length})</h1>

                <div className="cart-layout">
                    {/* Cart items */}
                    <section className="cart-items">
                        {cartItems.map((item) => (
                            <article key={item.id} className="cart-item">
                                <div className="item-image" style={{ position: 'relative', width: '80px', height: '80px' }}>
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            style={{ objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <span className="item-emoji">👓</span>
                                    )}
                                </div>
                                <div className="item-details">
                                    <div className="item-header">
                                        <div>
                                            <h3>
                                                <Link href={`/catalogo/${item.slug}`}>{item.name}</Link>
                                            </h3>
                                            <p className="item-brand">{item.brand}</p>
                                            <p className="item-variant">Color: {item.variant}</p>
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeItem(item.id)}
                                            aria-label="Eliminar producto"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="item-pricing">
                                        <div className="item-controls">
                                            <div className="quantity-selector">
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className="qty-value">{item.quantity}</span>
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="item-total">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>

                    {/* Order summary */}
                    <aside className="cart-summary">
                        <h2>Resumen del pedido</h2>

                        <div className="summary-lines">
                            <div className="summary-line">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            {promoApplied && (
                                <div className="summary-line discount">
                                    <span>Descuento (10%)</span>
                                    <span>-{formatPrice(discount)}</span>
                                </div>
                            )}
                            <div className="summary-line">
                                <span>Envío</span>
                                <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                            </div>
                        </div>

                        {/* Promo code */}
                        <div className="promo-section">
                            <div className="promo-input">
                                <input
                                    type="text"
                                    placeholder="Código de descuento"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    disabled={promoApplied}
                                />
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={applyPromo}
                                    disabled={promoApplied || !promoCode}
                                >
                                    {promoApplied ? '✓ Aplicado' : 'Aplicar'}
                                </button>
                            </div>
                            {promoApplied && (
                                <p className="promo-success">✓ Código BIENVENIDO10 aplicado</p>
                            )}
                        </div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>

                        <button className="btn btn-primary btn-lg btn-block">
                            Proceder al pago
                        </button>

                        <div className="payment-methods">
                            <p>Aceptamos:</p>
                            <div className="payment-icons">
                                <span title="Visa">💳</span>
                                <span title="MasterCard">💳</span>
                                <span title="PayPal">💰</span>
                            </div>
                        </div>

                        <div className="cart-guarantees">
                            <div className="guarantee-item">
                                <span>🔒</span>
                                <span>Pago 100% seguro</span>
                            </div>
                            <div className="guarantee-item">
                                <span>🚚</span>
                                <span>Envío gratis +$1,500</span>
                            </div>
                            <div className="guarantee-item">
                                <span>↩️</span>
                                <span>30 días para devolución</span>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Continue shopping */}
                <div className="continue-shopping">
                    <Link href="/catalogo" className="btn btn-outline">
                        ← Seguir comprando
                    </Link>
                </div>
            </div>
        </main>
    );
}

// Main page component with Suspense
export default function CarritoPage() {
    return (
        <Suspense fallback={
            <main className="cart-page">
                <div className="section-container">
                    <div className="empty-cart">
                        <p>Cargando carrito...</p>
                    </div>
                </div>
            </main>
        }>
            <CartContent />
        </Suspense>
    );
}
