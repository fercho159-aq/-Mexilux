'use client';

import Link from 'next/link';
import Image from 'next/image';
import HomeQuiz from '@/components/home/HomeQuiz';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';
import HeroCarousel from '@/components/home/HeroCarousel';
import ProductSlider, { type SliderProduct } from '@/components/home/ProductSlider';
import { ScrollAnimate } from '@/components/ui/ScrollAnimate';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import { MexiluxButtonLink } from '@/components/ui/MexiluxButton';
import {
    Monitor,
    Laptop,
    Sun,
    Palette,
    ShieldCheck,
} from 'lucide-react';

const CATEGORIES = [
    {
        id: 'cat-mexicano',
        name: 'Mexicano',
        suffix: 'Hombre',
        description: 'Estilos modernos y clásicos',
        image: '/armazon-1/1.png',
        slug: 'hombre',
        count: 156,
    },
    {
        id: 'cat-mexicana',
        name: 'Mexicana',
        suffix: 'Mujer',
        description: 'Elegancia y tendencias',
        image: '/armazon-2/1.png',
        slug: 'mujer',
        count: 203,
    },
];

const TRUST_BADGES = [
    {
        icon: '🇲🇽',
        label: 'Lo que está hecho en México está bien hecho',
        detail: 'Página Mexa',
        useEmoji: true,
    },
    {
        icon: '🚛',
        label: 'Ya vamos, hay mucho tráfico',
        detail: '5-7 días de entrega',
        useEmoji: true,
    },
];

const TREATMENTS = [
    {
        id: 'pa-la-chamba',
        name: 'Pa la chamba',
        description: 'Antirreflejo. Ideal para 0–4 hrs frente a pantallas.',
        icon: <Monitor size={28} />,
        color: '#1a73e8',
        href: '/tratamientos/pa-la-chamba',
    },
    {
        id: 'la-maquina-de-chambear',
        name: 'La máquina de chambear',
        description: 'Filtro azul. Ideal para +4 hrs frente a pantallas.',
        icon: <Laptop size={28} />,
        color: '#6b4c9a',
        href: '/tratamientos/la-maquina-de-chambear',
    },
    {
        id: 'solazo',
        name: 'Solazo',
        description: 'Polarizado. Para carreteras, playa y flow.',
        icon: <Sun size={28} />,
        color: '#e8a01a',
        href: '/tratamientos/solazo',
    },
    {
        id: 'entituneados',
        name: 'Entituneados',
        description: 'Tintes a tu antojo: Parejito (uniforme) o Amanecido (degradado).',
        icon: <Palette size={28} />,
        color: '#e91e63',
        href: '/tratamientos/entituneados',
    },
];

const BLOG_PREVIEW = [
    {
        name: 'Mexico Mágico',
        desc: 'Lugares mexicanos para visitar',
        slug: 'mexico-magico',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
        name: 'Mexicanos de Lujo',
        desc: 'Mexicanos que vale la pena voltear a ver',
        slug: 'mexicanos-de-lujo',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
        name: "Pa' la Muela",
        desc: 'Lugares que vale la pena comer',
        slug: 'pa-la-muela',
        gradient: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
    },
    {
        name: 'Vista a las Raíces',
        desc: 'Cultura, raíces y artesanías',
        slug: 'vista-a-las-raices',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    },
];

interface FeaturedProduct {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    image: string;
    slug: string;
}

interface HomePageClientProps {
    featuredProducts?: FeaturedProduct[];
}

export default function HomePageClient({ featuredProducts = [] }: HomePageClientProps) {
    const sliderProducts: SliderProduct[] = featuredProducts;

    return (
        <main className="home-page">
            {/* 1. Hero carrusel */}
            <HeroCarousel />

            {/* Trust badges (sellos de confianza) */}
            <section className="trust-badges-section" aria-label="Sellos de confianza">
                <div className="trust-badges-container">
                    {TRUST_BADGES.map((badge, index) => (
                        <ScrollAnimate key={index} animation="fade-up" delay={index * 100}>
                            <div className="trust-badge-item">
                                <span className="badge-icon" aria-hidden="true">
                                    {badge.useEmoji ? (
                                        <span style={{ fontSize: '1.5rem' }}>{badge.icon}</span>
                                    ) : (
                                        <ShieldCheck size={24} strokeWidth={1.5} />
                                    )}
                                </span>
                                <div className="badge-text">
                                    <span className="badge-label">{badge.label}</span>
                                    <span className="badge-detail">{badge.detail}</span>
                                </div>
                            </div>
                        </ScrollAnimate>
                    ))}
                </div>
            </section>

            {/* 2. Línea horizontal de productos: "Pues ya de una no?" */}
            <ProductSlider
                title="Pues ya de una no?"
                subtitle="Échale un ojo a lo que están pidiendo de cajón."
                products={sliderProducts}
            />

            {/* 3. Categorías */}
            <section className="categories-section" aria-labelledby="categories-title">
                <div className="section-container">
                    <ScrollAnimate animation="fade-up">
                        <div className="section-header">
                            <h2 id="categories-title" className="section-title">
                                Encuentra tu estilo perfecto
                            </h2>
                            <p className="section-description">
                                Nuestra colección está diseñada para cada persona
                            </p>
                        </div>
                    </ScrollAnimate>

                    <div className="categories-grid">
                        {CATEGORIES.map((category, index) => (
                            <ScrollAnimate key={category.id} animation="fade-up" delay={index * 150}>
                                <Link
                                    href={`/catalogo?genero=${category.slug}`}
                                    className="category-card category-card-large"
                                >
                                    <div className="category-visual">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            style={{ objectFit: 'contain' }}
                                            sizes="(max-width: 768px) 50vw, 200px"
                                        />
                                    </div>
                                    <div className="category-content">
                                        <h3 className="category-name">
                                            {category.name}
                                            <span className="category-suffix"> ({category.suffix})</span>
                                        </h3>
                                        <p className="category-description">{category.description}</p>
                                        <span className="category-cta">
                                            Ver {category.count} productos
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14m-7-7 7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            </ScrollAnimate>
                        ))}
                    </div>

                    <ScrollAnimate animation="fade-up" delay={300}>
                        <div className="category-card-centered">
                            <Link
                                href="/catalogo"
                                className="category-card category-card-large category-card-inclusive"
                            >
                                <div className="category-visual gradient-inclusive">
                                    <Image
                                        src="/armazon-3/1.png"
                                        alt="Sin etiquetas"
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        sizes="(max-width: 768px) 50vw, 200px"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                </div>
                                <div className="category-content">
                                    <h3 className="category-name">Sin etiquetas</h3>
                                    <p className="category-description">Para todos los estilos</p>
                                    <span className="category-cta">
                                        Ver toda la colección
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14m-7-7 7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </ScrollAnimate>
                </div>
            </section>

            {/* 4. Blog: Viendo México */}
            <section
                className="blog-preview-section"
                style={{ padding: '4rem 0', background: '#fafbfc' }}
                aria-labelledby="blog-section-title"
            >
                <div className="section-container">
                    <ScrollAnimate animation="fade-up">
                        <div className="section-header">
                            <h2 id="blog-section-title" className="section-title">Viendo México</h2>
                            <p className="section-description">
                                Redescubre el país a través de nuestra mirada. Lugares, Cultura, sabor y más.
                            </p>
                        </div>
                    </ScrollAnimate>

                    <ScrollAnimate animation="fade-up">
                        <div className="blog-preview-grid">
                            {BLOG_PREVIEW.map((section) => (
                                <Link
                                    key={section.slug}
                                    href={`/blog/categoria/${section.slug}`}
                                    className="blog-preview-card"
                                    style={{ background: section.gradient }}
                                >
                                    <h3>{section.name}</h3>
                                    <p>{section.desc}</p>
                                </Link>
                            ))}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <MexiluxButtonLink href="/blog" variant="primary">
                                Ver todo el blog
                            </MexiluxButtonLink>
                        </div>
                    </ScrollAnimate>
                </div>
            </section>

            {/* 5. Quiz embebido */}
            <section className="style-quiz-section" aria-labelledby="quiz-title">
                <div className="section-container">
                    <ScrollAnimate animation="fade-up">
                        <div className="section-header">
                            <h2 id="quiz-title" className="section-title">
                                ¿Godín, Patrón o Alucín?
                            </h2>
                            <p className="section-description">
                                Tenemos el armazón que define tu modo. Contesta el quiz.
                            </p>
                        </div>
                    </ScrollAnimate>
                    <ScrollAnimate animation="zoom-in">
                        <div
                            className="quiz-card"
                            style={{
                                minHeight: '500px',
                                transition: 'all 0.3s ease',
                                gridTemplateColumns: '1fr',
                                padding: 0,
                                overflow: 'hidden',
                            }}
                        >
                            <HomeQuiz
                                isOpen={true}
                                onClose={() => { }}
                                initialStyle={undefined}
                                embedded={true}
                                skipIntro={false}
                            />
                        </div>
                    </ScrollAnimate>
                </div>
            </section>

            {/* 6. Tratamientos */}
            <section className="treatments-section" aria-labelledby="treatments-title">
                <div className="section-container">
                    <ScrollAnimate animation="fade-up">
                        <div className="section-header">
                            <h2 id="treatments-title" className="section-title">
                                Nuestros Tratamientos
                            </h2>
                            <p className="section-description">
                                Mejora tu visión y dale flow a tus lentes.
                            </p>
                        </div>
                    </ScrollAnimate>

                    <ScrollAnimate animation="fade-up">
                        <div className="treatments-grid">
                            {TREATMENTS.map((treatment) => (
                                <Link
                                    key={treatment.id}
                                    href={treatment.href}
                                    className="treatment-card"
                                    style={{
                                        background: `linear-gradient(135deg, ${treatment.color}10 0%, ${treatment.color}05 100%)`,
                                        border: `1.5px solid ${treatment.color}20`,
                                    }}
                                >
                                    <div
                                        className="treatment-icon"
                                        style={{ background: `${treatment.color}15`, color: treatment.color }}
                                    >
                                        {treatment.icon}
                                    </div>
                                    <h3 className="treatment-name">{treatment.name}</h3>
                                    <p className="treatment-desc">{treatment.description}</p>
                                    <span className="treatment-cta">
                                        Saber más →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </ScrollAnimate>
                </div>

            </section>

            {/* 7. Testimonios al final */}
            <TestimonialsCarousel />

            {/* Newsletter (footer del home) */}
            <section className="newsletter" aria-labelledby="newsletter-title">
                <ScrollAnimate animation="fade-up">
                    <div className="newsletter-content">
                        <h2 id="newsletter-title" className="newsletter-title">
                            Recibe ofertas exclusivas
                        </h2>
                        <p className="newsletter-description">
                            Suscríbete y obtén un 10% de descuento en tu primera compra.
                        </p>
                        <NewsletterForm />
                        <p className="newsletter-privacy">
                            Al suscribirte aceptas nuestra <Link href="/legal/privacidad">política de privacidad</Link>
                        </p>
                    </div>
                </ScrollAnimate>
            </section>
        </main>
    );
}
