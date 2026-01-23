
'use client';

import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Initialize Mercado Pago with the public key
// Ensure you have NEXT_PUBLIC_MP_PUBLIC_KEY in your .env.local
initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
    locale: 'es-MX',
});

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
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Create preference when component mounts or items change
        const createPreference = async () => {
            if (items.length === 0) return;

            setIsLoading(true);
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
                if (data.id) {
                    setPreferenceId(data.id);
                }
            } catch (error) {
                console.error('Error creating preference:', error);
            } finally {
                setIsLoading(false);
            }
        };

        createPreference();
    }, [items]);

    if (isLoading) {
        return <div className="mp-loading animate-pulse h-12 bg-gray-100 rounded-md text-center flex items-center justify-center text-gray-500 text-sm">Cargando opciones de pago...</div>;
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
