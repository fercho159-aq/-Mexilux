/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BLOG - SECCIÓN DE CONTENIDO MEXICANO
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import BlogList from '@/components/blog/BlogList';

export const metadata: Metadata = {
    title: 'Blog | Mexilux - Viendo México',
    description: 'Redescubre el país a través de nuestra mirada. Lugares, cultura, sabor y los mexicanos que están moviendo al mundo.',
};

export default function BlogPage() {
    return <BlogList />;
}
