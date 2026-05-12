'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { buttonClassNames } from '@/components/ui/MexiluxButton';

interface ProductActionsProps {
    slug: string;
    variantId: string;
    basePrice: number;
}

const formatPrice = (price: number) => `$${price.toLocaleString('es-MX')}`;

export default function ProductActions({ slug, variantId, basePrice }: ProductActionsProps) {
    return (
        <div className="lens-config-section">
            <div className="config-options">
                <Link
                    href={`/configurador/${slug}?variant=${variantId}`}
                    className={buttonClassNames({ variant: 'primary', size: 'lg', fullWidth: true })}
                    style={{ padding: '0.875rem 1.5rem', gap: '0.75rem' }}
                >
                    <ShoppingBag size={22} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                    <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.3 }}>
                        <strong style={{ fontSize: '1rem' }}>Comprar con flow mexa</strong>
                        <small style={{ fontWeight: 400, opacity: 0.7, fontSize: '0.8125rem' }}>
                            Desde {formatPrice(basePrice)}
                        </small>
                    </span>
                </Link>
            </div>
        </div>
    );
}
