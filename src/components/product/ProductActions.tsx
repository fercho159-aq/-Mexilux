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
                >
                    <ShoppingBag size={20} />
                    <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <strong>Lo compro, quiero el flow mexa</strong>
                        <small style={{ fontWeight: 400, opacity: 0.75 }}>
                            Configura tus lentes · desde {formatPrice(basePrice)}
                        </small>
                    </span>
                </Link>
            </div>
        </div>
    );
}
