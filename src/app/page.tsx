/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MEXILUX - PÁGINA DE INICIO (SITEMAP 1.0)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Estructura según sitemap:
 * 1.1 Hero Section
 * 1.2 Categorías Destacadas (Hombre, Mujer, Niños)
 * 1.3 Buscador de "Tu estilo" (Quiz rápido)
 * 1.4 Testimonios y Sellos de Confianza Médica
 */

import type { Metadata } from 'next';
import HomePageClient from '@/components/home/HomePageClient';
import { getFrames } from '@/lib/db';

// Disable caching to always show fresh data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mexilux | Óptica Premium - Lentes y Servicios de Optometría',
  description: 'Descubre nuestra colección de monturas de diseñador y lentes graduados personalizados. Agenda tu examen de la vista con nuestros optometristas certificados.',
  keywords: ['óptica', 'lentes graduados', 'monturas', 'optometría', 'examen de la vista', 'lentes de sol'],
  openGraph: {
    title: 'Mexilux | Óptica Premium',
    description: 'Monturas de diseñador y lentes graduados personalizados',
    type: 'website',
  },
};

export default async function HomePage() {
  // Obtener productos destacados de la base de datos
  const { frames } = await getFrames(
    { status: 'active' },
    { limit: 4, orderBy: 'popular' }
  );

  // Transformar frames al formato esperado por HomePageClient
  const featuredProducts = frames.map(frame => {
    const basePrice = typeof frame.base_price === 'number'
      ? frame.base_price
      : frame.base_price?.toNumber?.() ?? 0;
    const comparePrice = frame.compare_at_price
      ? (typeof frame.compare_at_price === 'number'
        ? frame.compare_at_price
        : frame.compare_at_price?.toNumber?.() ?? 0)
      : undefined;

    // Get first image from first color variant
    const defaultVariant = frame.frame_color_variants?.[0];
    const defaultImage = defaultVariant?.frame_images?.[0];

    return {
      id: frame.id,
      name: frame.name,
      brand: frame.brand?.name || 'Mexilux',
      price: basePrice,
      originalPrice: comparePrice,
      image: defaultImage?.url || '',
      slug: frame.slug,
    };
  });

  return <HomePageClient featuredProducts={featuredProducts} />;
}
