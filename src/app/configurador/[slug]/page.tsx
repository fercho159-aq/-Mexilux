/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PÁGINA DEL CONFIGURADOR DE LENTES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Ruta: /configurador/[slug]
 * 
 * Esta página carga el frame por su slug y renderiza el wizard de configuración.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LensConfiguratorWizard from '@/components/lens-configurator';
import type { Frame, FrameShape, FrameMaterial, FrameType, Gender, ProductStatus, LensIndex } from '@/types';

// ═══════════════════════════════════════════════════════════════════════════
// METADATA
// ═══════════════════════════════════════════════════════════════════════════

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    // En producción, cargar el frame de la API
    const frame = await getFrameBySlug(slug);

    if (!frame) {
        return {
            title: 'Producto no encontrado | Mexilux',
        };
    }

    return {
        title: `Configurar lentes para ${frame.name} | Mexilux`,
        description: `Personaliza tus lentes para ${frame.name} de ${frame.brand.name}. Elige tipo de lente, material y tratamientos.`,
        openGraph: {
            title: `Configurar ${frame.name}`,
            description: frame.shortDescription,
            images: [frame.colorVariants[0]?.images[0]?.url || ''],
        },
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA FETCHING (MOCK)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * En producción, esto sería una llamada a la API
 */
async function getFrameBySlug(slug: string): Promise<Frame | null> {
    // Mock data para desarrollo
    const mockFrames: Record<string, Frame> = {
        'ray-ban-aviator-classic': {
            id: 'frame-001',
            name: 'Aviator Classic',
            slug: 'ray-ban-aviator-classic',
            shortDescription: 'El icónico diseño aviador que nunca pasa de moda',
            fullDescription: `
        Los lentes Ray-Ban Aviator son un símbolo de estilo atemporal.
        Originalmente diseñados para pilotos militares, hoy son un ícono de la moda mundial.
        
        Características:
        - Marco de metal de alta calidad
        - Puente de doble barra
        - Plaquetas de silicona ajustables
        - Bisagras reforzadas
      `,
            brand: {
                id: 'brand-001',
                name: 'Ray-Ban',
                slug: 'ray-ban',
                isLuxury: true,
                logoUrl: '/brands/ray-ban.svg',
            },
            categories: [
                {
                    id: 'cat-001',
                    name: 'Lentes de Sol',
                    slug: 'lentes-de-sol',
                    sortOrder: 1,
                },
                {
                    id: 'cat-002',
                    name: 'Aviador',
                    slug: 'aviador',
                    parentId: 'cat-001',
                    sortOrder: 1,
                },
            ],
            tags: ['clásico', 'aviador', 'metal', 'unisex', 'bestseller'],
            shape: 'aviator' as FrameShape,
            material: 'metal' as FrameMaterial,
            frameType: 'full_rim' as FrameType,
            dimensions: {
                lensWidth: 58,
                lensHeight: 51,
                bridgeWidth: 14,
                templeLength: 135,
                totalWidth: 140,
            },
            weight: 30,
            gender: 'unisex' as Gender,
            faceSizeRecommendation: ['medium', 'large'],
            colorVariants: [
                {
                    id: 'variant-001',
                    colorName: 'Oro con Verde G-15',
                    colorHex: '#C9A227',
                    sku: 'RB3025-L0205',
                    images: [
                        {
                            url: '/products/aviator-gold-front.jpg',
                            alt: 'Ray-Ban Aviator dorado vista frontal',
                            type: 'front',
                            sortOrder: 1,
                        },
                        {
                            url: '/products/aviator-gold-side.jpg',
                            alt: 'Ray-Ban Aviator dorado vista lateral',
                            type: 'side',
                            sortOrder: 2,
                        },
                    ],
                    stockQuantity: 15,
                    isDefault: true,
                },
                {
                    id: 'variant-002',
                    colorName: 'Plata con Azul Degradado',
                    colorHex: '#C0C0C0',
                    secondaryColorHex: '#4A90D9',
                    sku: 'RB3025-003/3F',
                    images: [
                        {
                            url: '/products/aviator-silver-front.jpg',
                            alt: 'Ray-Ban Aviator plateado vista frontal',
                            type: 'front',
                            sortOrder: 1,
                        },
                    ],
                    stockQuantity: 8,
                    isDefault: false,
                },
            ],
            defaultColorVariantId: 'variant-001',
            basePrice: 3499,
            compareAtPrice: 4199,
            currency: 'MXN',
            supportsGraduatedLenses: true,
            sunglassesOnly: false,
            compatibleLensIndexes: ['1.50', '1.56', '1.60', '1.67', '1.74'] as LensIndex[],
            status: 'active' as ProductStatus,
            isNew: false,
            isBestseller: true,
            isFeatured: true,
            averageRating: 4.8,
            reviewCount: 234,
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-12-01T00:00:00Z',
        },
    };

    // Simular latencia de red
    await new Promise((resolve) => setTimeout(resolve, 100));

    return mockFrames[slug] || null;
}

/**
 * Obtener recetas guardadas del usuario (mock)
 */
async function getUserPrescriptions(userId?: string) {
    if (!userId) return [];

    // Mock data
    return [
        {
            id: 'rx-001',
            name: 'Receta Dr. García 2024',
            issueDate: '2024-06-15',
            isExpired: false,
        },
        {
            id: 'rx-002',
            name: 'Receta anterior',
            issueDate: '2022-03-10',
            isExpired: true,
        },
    ];
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTES
// ═══════════════════════════════════════════════════════════════════════════

function LoadingState() {
    return (
        <div className="configurator-loading">
            <div className="loading-spinner" aria-hidden="true" />
            <p>Cargando configurador...</p>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// PÁGINA
// ═══════════════════════════════════════════════════════════════════════════

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ConfiguradorPage({ params }: PageProps) {
    const { slug } = await params;
    const frame = await getFrameBySlug(slug);

    if (!frame) {
        notFound();
    }

    // En producción, verificar sesión y obtener recetas del usuario
    const isAuthenticated = false; // Placeholder
    const savedPrescriptions = await getUserPrescriptions(
        isAuthenticated ? 'user-123' : undefined
    );

    const handleComplete = async (configurationId: string) => {
        'use server';
        // En producción, agregar al carrito
        console.log('Configuración completada:', configurationId);
    };

    return (
        <Suspense fallback={<LoadingState />}>
            <LensConfiguratorWizard
                frame={frame}
                savedPrescriptions={savedPrescriptions}
                isAuthenticated={isAuthenticated}
            // onComplete se manejaría con client component wrapper
            // onCancel={() => router.push(`/producto/${frame.slug}`)}
            />
        </Suspense>
    );
}
