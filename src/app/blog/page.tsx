/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BLOG - SECCIÓN DE CONTENIDO MEXICANO
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import BlogList from '@/components/blog/BlogList';

export const metadata: Metadata = {
    title: 'Blog | Mexilux - Cosas Mexas',
    description: 'Descubre lo mejor de México: cultura, lugares mágicos, y mexicanos que valen la pena conocer.',
};

export default function BlogPage() {
    return <BlogList />;
}
