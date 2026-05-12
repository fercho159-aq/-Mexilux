'use client';

import { useState, useEffect } from 'react';

interface CheckoutItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
}

interface MercadoPagoButtonProps {
    items: CheckoutItem[];
}

export default function MercadoPagoButton({ items }: MercadoPagoButtonProps) {
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const createPreference = async () => {
            if (items.length === 0) return;

            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/mercadopago/create_preference', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        items: items
                    }),
                });

                const data = await response.json();
                if (data.init_point) {
                    setCheckoutUrl(data.init_point);
                } else if (data.error) {
                    setError(data.error);
                } else {
                    setError('No se pudo crear la preferencia de pago.');
                }
            } catch (error) {
                console.error('Error creating preference:', error);
                setError('Error al crear la preferencia de pago. Intenta de nuevo.');
            } finally {
                setIsLoading(false);
            }
        };

        createPreference();
    }, [items]);

    const handlePay = () => {
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        }
    };

    if (isLoading) {
        return (
            <div style={{
                padding: '1rem',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.875rem',
            }}>
                <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid #e2e8f0',
                    borderTopColor: '#152132',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    marginRight: '0.5rem',
                    verticalAlign: 'middle',
                }} />
                Preparando tu pago seguro...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: '0.75rem 1rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                color: '#dc2626',
                fontSize: '0.875rem',
                textAlign: 'center',
            }}>
                {error}
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={handlePay}
                disabled={!checkoutUrl}
                style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(135deg, #009ee3 0%, #007eb5 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: checkoutUrl ? 'pointer' : 'not-allowed',
                    opacity: checkoutUrl ? 1 : 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    boxShadow: '0 4px 14px rgba(0, 158, 227, 0.3)',
                }}
                onMouseEnter={(e) => {
                    if (checkoutUrl) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 158, 227, 0.4)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 158, 227, 0.3)';
                }}
                onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Pagar ahora
            </button>

            <p style={{
                marginTop: '0.75rem',
                fontSize: '0.75rem',
                color: '#94a3b8',
                textAlign: 'center',
            }}>
                Serás redirigido a Mercado Pago para completar tu pago de forma segura.
            </p>
        </div>
    );
}
