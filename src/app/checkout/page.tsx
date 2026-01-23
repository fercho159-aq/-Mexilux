/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PÁGINA DE CHECKOUT - Server Component Wrapper
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFrameBySlug } from '@/lib/db';
import CheckoutClient from '@/components/checkout/CheckoutClient';

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

    let initialItem = undefined;

    // Direct "Buy Now" Mode
    if (productSlug) {
        const product = await getFrameBySlug(productSlug);

        if (product) {
            const basePrice = typeof product.base_price === 'number'
                ? product.base_price
                : product.base_price?.toNumber?.() ?? 0;

            const selectedVariant = product.frame_color_variants.find(v => v.id === variantId)
                || product.frame_color_variants[0];

            const productImage = selectedVariant?.frame_images[0]?.url || '/armazon-1/1.png';

            initialItem = {
                id: variantId || 'default',
                slug: product.slug,
                name: product.name,
                brand: product.brand?.name || '',
                variant: selectedVariant?.color_name || 'Estándar',
                image: productImage,
                price: basePrice,
                quantity: 1
            };
        } else {
            // If slug provided but not found, maybe 404 is appropriate, 
            // but let's fall back to empty client which will show empty state or local storage
            console.warn(`Product slug ${productSlug} not found`);
        }
    }

    return (
        <main className="checkout-page pt-24 min-h-screen bg-gray-50 pb-12 flex justify-center w-full">
            <CheckoutClient initialItem={initialItem} />
        </main>
    );
}
