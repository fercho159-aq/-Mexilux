/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PÁGINA DE MARCAS
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { Glasses, Zap, Sparkles, Gem, Eye, Flower2, Car, Star, Bird, Check } from 'lucide-react';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Marcas | Mexilux',
    description: 'Explora las mejores marcas de lentes: Ray-Ban, Oakley, Gucci, Prada, Tom Ford y más. Monturas originales con garantía.',
};

const BRANDS = [
    {
        name: 'Ray-Ban',
        slug: 'ray-ban',
        description: 'El ícono del estilo desde 1937. Diseños clásicos que nunca pasan de moda.',
        logo: <Glasses size={24} />,
        productCount: 45,
        featured: true,
        isLuxury: false,
    },
    {
        name: 'Oakley',
        slug: 'oakley',
        description: 'Innovación y rendimiento. La mejor opción para deportistas y amantes del outdoor.',
        logo: <Zap size={24} />,
        productCount: 38,
        featured: true,
        isLuxury: false,
    },
    {
        name: 'Gucci',
        slug: 'gucci',
        description: 'Alta moda italiana. Diseños extravagantes y sofisticados.',
        logo: <Sparkles size={24} />,
        productCount: 22,
        featured: true,
        isLuxury: true,
    },
    {
        name: 'Tom Ford',
        slug: 'tom-ford',
        description: 'Elegancia contemporánea. Monturas de lujo para el conocedor.',
        logo: <Gem size={24} />,
        productCount: 15,
        featured: true,
        isLuxury: true,
    },
    {
        name: 'Prada',
        slug: 'prada',
        description: 'Moda vanguardista italiana. Diseño moderno con tradición artesanal.',
        logo: <Eye size={24} />,
        productCount: 18,
        featured: false,
        isLuxury: true,
    },
    {
        name: 'Carolina Herrera',
        slug: 'carolina-herrera',
        description: 'Elegancia latina. Diseños sofisticados para la mujer moderna.',
        logo: <Flower2 size={24} />,
        productCount: 25,
        featured: false,
        isLuxury: true,
    },
    {
        name: 'Carrera',
        slug: 'carrera',
        description: 'Espíritu deportivo y aventurero. Estilo audaz para personalidades dinámicas.',
        logo: <Car size={24} />,
        productCount: 20,
        featured: false,
        isLuxury: false,
    },
    {
        name: 'Persol',
        slug: 'persol',
        description: 'Artesanía italiana desde 1917. Calidad y elegancia atemporal.',
        logo: <Gem size={32} />,
        productCount: 16,
        featured: false,
        isLuxury: true,
    },
    {
        name: 'Vogue Eyewear',
        slug: 'vogue-eyewear',
        description: 'Tendencias accesibles. Moda actual para todos los estilos.',
        logo: <Star size={24} />,
        productCount: 30,
        featured: false,
        isLuxury: false,
    },
    {
        name: 'Emporio Armani',
        slug: 'emporio-armani',
        description: 'Estilo italiano moderno. Diseños contemporáneos con tradición de calidad.',
        logo: <Bird size={24} />,
        productCount: 22,
        featured: false,
        isLuxury: true,
    },
];

export default function MarcasPage() {
    const featuredBrands = BRANDS.filter((b) => b.featured);
    const allBrands = BRANDS.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <main className="brands-page">
            {/* Hero */}
            <header className="brands-hero">
                <h1>Nuestras Marcas</h1>
                <p>Trabajamos con las mejores marcas del mundo. Todas nuestras monturas son 100% originales con garantía de autenticidad.</p>
            </header>

            <div className="section-container">
                {/* Featured brands */}
                <section className="featured-brands">
                    <h2>Marcas destacadas</h2>
                    <div className="brands-featured-grid">
                        {featuredBrands.map((brand) => (
                            <Link
                                key={brand.slug}
                                href={`/catalogo?marca=${brand.slug}`}
                                className="brand-card-large"
                            >
                                <span className="brand-logo">{brand.logo}</span>
                                <div className="brand-content">
                                    <h3>{brand.name}</h3>
                                    {brand.isLuxury && <span className="luxury-badge">Premium</span>}
                                    <p>{brand.description}</p>
                                    <span className="brand-count">{brand.productCount} productos</span>
                                </div>
                                <span className="brand-cta">
                                    Ver colección →
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* All brands alphabetically */}
                <section className="all-brands">
                    <h2>Todas las marcas</h2>
                    <div className="brands-grid">
                        {allBrands.map((brand) => (
                            <Link
                                key={brand.slug}
                                href={`/catalogo?marca=${brand.slug}`}
                                className="brand-card"
                            >
                                <span className="brand-logo-small">{brand.logo}</span>
                                <span className="brand-name">{brand.name}</span>
                                {brand.isLuxury && <span className="luxury-dot" title="Premium">✦</span>}
                                <span className="brand-product-count">{brand.productCount}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Trust section */}
                <section className="brands-trust">
                    <div className="trust-card">
                        <h3><Check className="inline-block" size={16} /> 100% Originales</h3>
                        <p>Todas nuestras monturas provienen directamente de los distribuidores oficiales. Garantía de autenticidad en cada producto.</p>
                    </div>
                    <div className="trust-card">
                        <h3><Check className="inline-block" size={16} /> Garantía de 1 año</h3>
                        <p>Todas las monturas incluyen garantía de fabricación por defectos durante 12 meses.</p>
                    </div>
                    <div className="trust-card">
                        <h3><Check className="inline-block" size={16} /> Certificado de autenticidad</h3>
                        <p>Cada producto incluye su certificado de autenticidad y estuche original de la marca.</p>
                    </div>
                </section>

                {/* CTA */}
                <section className="brands-cta">
                    <h2>¿No encuentras tu marca favorita?</h2>
                    <p>Contáctanos y te ayudamos a conseguirla</p>
                    <Link href="/contacto" className="btn btn-primary">
                        Contactar →
                    </Link>
                </section>
            </div>
        </main>
    );
}
