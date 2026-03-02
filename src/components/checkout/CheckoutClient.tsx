'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MercadoPagoButton from './MercadoPagoButton';
import './checkout.css';

interface CheckoutItem {
    id: string;
    slug: string;
    name: string;
    brand: string;
    variant: string;
    image: string;
    price: number;
    quantity: number;
    uvProtection?: string;
}

interface CheckoutClientProps {
    initialItem?: CheckoutItem;
}

export default function CheckoutClient({ initialItem }: CheckoutClientProps) {
    const [items, setItems] = useState<CheckoutItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (initialItem) {
            setItems([initialItem]);
            setLoading(false);
        } else {
            const savedCart = localStorage.getItem('mexilux_cart');
            if (savedCart) {
                try {
                    const cartItems = JSON.parse(savedCart);
                    setItems(cartItems.map((item: any) => ({
                        id: item.id || `${item.slug}-${Date.now()}`,
                        slug: item.slug,
                        name: item.name,
                        brand: item.brand,
                        variant: item.variant,
                        image: item.image,
                        price: item.price,
                        quantity: item.quantity,
                        uvProtection: 'UV400'
                    })));
                } catch (e) {
                    console.error('Error loading cart:', e);
                }
            }
            setLoading(false);
        }
    }, [initialItem]);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = subtotal >= 1500 ? 0 : 99;
    const total = subtotal + shippingCost;

    const formatPrice = (price: number) => `$${price.toLocaleString('es-MX')}`;

    if (loading) {
        return (
            <div className="checkout-loading">
                <div className="checkout-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring-inner"></div>
                </div>
                <p className="loading-text">Preparando tu checkout...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="checkout-empty">
                <div className="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                </div>
                <h1>Tu carrito está vacío</h1>
                <p>Parece que aún no has agregado nada. Explora nuestra colección y encuentra tus lentes ideales.</p>
                <Link href="/catalogo" className="btn-explore">
                    <span>Explorar catálogo</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>
        );
    }

    const mpItems = items.map(item => ({
        id: item.slug,
        title: `${item.brand || ''} ${item.name} (${item.variant})`.trim(),
        quantity: item.quantity,
        price: item.price
    }));

    return (
        <div className="checkout-page">
            {/* Background decorativo */}
            <div className="checkout-bg">
                <div className="bg-gradient"></div>
                <div className="bg-pattern"></div>
            </div>

            <div className="checkout-container">
                {/* Header con pasos */}
                <div className="checkout-header">
                    <div className="steps-container">
                        <div className="step completed">
                            <div className="step-number">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <span className="step-label">Carrito</span>
                        </div>
                        <div className="step-line completed"></div>
                        <div className="step active">
                            <div className="step-number">2</div>
                            <span className="step-label">Pago</span>
                        </div>
                        <div className="step-line"></div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <span className="step-label">Confirmación</span>
                        </div>
                    </div>
                </div>

                <div className="checkout-content">
                    {/* Columna izquierda - Pago */}
                    <div className="checkout-main">
                        <div className="main-header">
                            <h1>Finalizar Compra</h1>
                            <p>Elige tu método de pago preferido</p>
                        </div>

                        {/* Security badge */}
                        <div className="security-badge">
                            <div className="security-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                            </div>
                            <div className="security-text">
                                <strong>Compra 100% Segura</strong>
                                <span>Encriptación SSL de 256 bits</span>
                            </div>
                        </div>

                        {/* Payment methods */}
                        <div className="payment-section">
                            <h2>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                </svg>
                                Método de Pago
                            </h2>

                            {/* Mercado Pago Option */}
                            <div className="payment-option payment-option--primary">
                                <div className="payment-badge">Recomendado</div>
                                <div className="payment-header">
                                    <div className="payment-logo">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="mp-logo">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    </div>
                                    <div className="payment-info">
                                        <h3>Mercado Pago</h3>
                                        <div className="payment-cards">
                                            <span>Visa</span>
                                            <span>Mastercard</span>
                                            <span>Amex</span>
                                            <span>OXXO</span>
                                            <span>SPEI</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="payment-features">
                                    <div className="feature">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        <span>MSI disponibles</span>
                                    </div>
                                    <div className="feature">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        <span>Pago seguro</span>
                                    </div>
                                    <div className="feature">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        <span>Protección al comprador</span>
                                    </div>
                                </div>

                                <div className="mp-button-wrapper">
                                    <MercadoPagoButton items={mpItems} />
                                </div>

                                <p className="payment-secure-text">
                                    <span className="secure-dot"></span>
                                    Procesado de forma segura por Mercado Pago
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Columna derecha - Resumen */}
                    <div className="checkout-sidebar">
                        <div className="order-summary">
                            <div className="summary-header">
                                <h2>Tu Pedido</h2>
                                <span className="item-count">{items.length} {items.length === 1 ? 'artículo' : 'artículos'}</span>
                            </div>

                            <div className="summary-items">
                                {items.map((item) => (
                                    <div key={item.id} className="summary-item">
                                        <div className="item-image" style={{ width: '52px', height: '52px', borderRadius: '10px' }}>
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain"
                                                    sizes="52px"
                                                />
                                            ) : (
                                                <div className="item-placeholder" style={{ fontSize: '1.25rem' }}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="item-details" style={{ gap: '0.125rem' }}>
                                            <h4 className="item-name" style={{ fontSize: '0.8125rem' }}>{item.brand} {item.name}</h4>
                                            <span className="item-variant" style={{ fontSize: '0.6875rem' }}>{item.variant} &middot; {item.quantity}u</span>
                                        </div>
                                        <div className="item-price" style={{ fontSize: '0.8125rem' }}>
                                            {formatPrice(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals">
                                <div className="total-row">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Envío</span>
                                    <span className={shippingCost === 0 ? 'free-shipping' : ''}>
                                        {shippingCost === 0 ? '¡Gratis!' : formatPrice(shippingCost)}
                                    </span>
                                </div>
                                {shippingCost === 0 && (
                                    <div className="free-shipping-badge">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                        </svg>
                                        Envío gratis en compras +$1,500
                                    </div>
                                )}
                            </div>

                            <div className="summary-total-final">
                                <div className="total-label">
                                    <span>Total</span>
                                    <span className="tax-note">IVA incluido</span>
                                </div>
                                <div className="total-amount">
                                    {formatPrice(total)}
                                    <span className="currency">MXN</span>
                                </div>
                            </div>

                            <div className="summary-guarantees">
                                <div className="guarantee">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                    <Link href="/legal/garantia" style={{ color: 'inherit', textDecoration: 'none', fontSize: 'inherit' }}>
                                        Garantía
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link href="/catalogo" className="back-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Agregar otro producto
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
