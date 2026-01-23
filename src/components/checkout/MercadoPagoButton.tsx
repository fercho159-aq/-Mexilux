
'use client';

import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Initialize Mercado Pago with the public key
// Ensure you have NEXT_PUBLIC_MP_PUBLIC_KEY in your .env.local
initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
    locale: 'es-MX',
});

interface MercadoPagoButtonProps {
    product: {
        id: string;
        title: string;
        price: number;
    };
}

export default function MercadoPagoButton({ product }: MercadoPagoButtonProps) {
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Create preference when component mounts or product changes
        const createPreference = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/mercadopago/create_preference', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        quantity: 1,
                    }),
                });

                const data = await response.json();
                if (data.id) {
                    setPreferenceId(data.id);
                }
            } catch (error) {
                console.error('Error creating preference:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (product.price > 0) {
            createPreference();
        }
    }, [product]);

    if (isLoading) {
        return <div className="mp-loading">Cargando opciones de pago...</div>;
    }

    return (
        <div className="mp-container">
            {preferenceId && (
                <Wallet
                    initialization={{ preferenceId: preferenceId }}
                />
            )}
        </div>
    );
}
