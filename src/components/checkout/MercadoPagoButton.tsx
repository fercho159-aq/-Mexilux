'use client';

import { useState } from 'react';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
    locale: 'es-MX',
});

interface MercadoPagoButtonProps {
    amount: number;
    description?: string;
    onSuccess?: (paymentId: string) => void;
    onError?: (message: string) => void;
}

export default function MercadoPagoButton({
    amount,
    description = 'Compra en Mexilux',
    onSuccess,
    onError,
}: MercadoPagoButtonProps) {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (formData: any) => {
        setStatus('processing');

        try {
            const response = await fetch('/api/mercadopago/process_payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    transaction_amount: amount,
                    description,
                }),
            });

            const data = await response.json();

            if (data.success && data.status === 'approved') {
                setStatus('success');
                setMessage('¡Pago aprobado! Gracias por tu compra.');
                onSuccess?.(data.payment_id);
            } else if (data.success && data.status === 'pending') {
                setStatus('success');
                setMessage(data.message);
                onSuccess?.(data.payment_id);
            } else {
                setStatus('error');
                setMessage(data.error || data.message || 'El pago no pudo ser procesado.');
                onError?.(data.message || 'Error en el pago');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Error de conexión. Intenta de nuevo.');
            onError?.('Error de conexión');
        }
    };

    if (status === 'success') {
        return (
            <div style={{
                padding: '1.5rem',
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '16px',
                textAlign: 'center',
            }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" style={{ margin: '0 auto 0.75rem' }}>
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                </svg>
                <p style={{ color: '#166534', fontWeight: 600, fontSize: '1rem', margin: 0 }}>
                    {message}
                </p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div>
                <div style={{
                    padding: '1rem 1.25rem',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    textAlign: 'center',
                }}>
                    {message}
                </div>
                <CardPayment
                    initialization={{ amount: amount }}
                    onSubmit={handleSubmit}
                />
            </div>
        );
    }

    return (
        <div>
            {status === 'processing' && (
                <div style={{
                    padding: '1rem',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
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
                    Procesando tu pago seguro...
                </div>
            )}
            <CardPayment
                initialization={{ amount: amount }}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
