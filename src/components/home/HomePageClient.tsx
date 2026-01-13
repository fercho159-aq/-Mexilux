'use client';

import Link from 'next/link';
import Image from 'next/image';
import HomeQuiz from '@/components/home/HomeQuiz';
import InfluencerCarousel from '@/components/home/InfluencerCarousel';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';
import { ScrollAnimate } from '@/components/ui/ScrollAnimate';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import HeroGSAP from './HeroGSAP';

// ═══════════════════════════════════════════════════════════════════════════
// 1.2 CATEGORÍAS DESTACADAS (Mexicano, Mexicana)
// ═══════════════════════════════════════════════════════════════════════════
const CATEGORIES = [
    {
        id: 'cat-mexicano',
        name: 'Mexicano',
        description: 'Estilos modernos y clásicos',
        image: '/armazon-1/1.png',
        slug: 'hombre',
        count: 156,
        featured: 'Ray-Ban, Oakley, Tommy',
    },
    {
        id: 'cat-mexicana',
        name: 'Mexicana',
        description: 'Elegancia y tendencias',
        image: '/armazon-2/1.png',
        slug: 'mujer',
        count: 203,
        featured: 'Gucci, Prada, Dior',
    },
];

// ═══════════════════════════════════════════════════════════════════════════
// SELLOS DE CONFIANZA MÉDICA
// ═══════════════════════════════════════════════════════════════════════════
const TRUST_BADGES = [
    { icon: '🇲🇽', label: 'Página Mexicana', detail: 'Lo que está hecho en México está bien hecho' },
    { icon: '✅', label: "Pa' que no te preocupes", detail: 'Todos los armazones tienen garantía' },
    { icon: '🚚', label: 'Ya vamos, hay mucho tráfico', detail: '5-7 días de entrega' },
];

// Tipo para productos que vienen de props
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
    const formatPrice = (price: number) => `$${price.toLocaleString('es-MX')}`;

    return (
        <main className="home-page">
            {/* ════════════════════════════════════════════════════════════════════
          1.1 HERO SECTION - GSAP ScrollTrigger Parallax
          ════════════════════════════════════════════════════════════════════ */}
            <HeroGSAP />

            {/* ════════════════════════════════════════════════════════════════════
          TRUST BADGES (Sellos de Confianza Médica)
          ════════════════════════════════════════════════════════════════════ */}
            <section className="trust-badges-section" aria-label="Sellos de confianza">
                <div className="trust-badges-container">
                    {TRUST_BADGES.map((badge, index) => (
                        <ScrollAnimate key={index} animation="fade-up" delay={index * 100}>
                            <div className="trust-badge-item">
                                <span className="badge-icon" aria-hidden="true">{badge.icon}</span>
                                <div className="badge-text">
                                    <span className="badge-label">{badge.label}</span>
                                    <span className="badge-detail">{badge.detail}</span>
                                </div>
                            </div>
                        </ScrollAnimate>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════════
          1.2 CATEGORÍAS DESTACADAS (Hombre, Mujer, Niños)
          ════════════════════════════════════════════════════════════════════ */}
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
                                        <h3 className="category-name">{category.name}</h3>
                                        <p className="category-description">{category.description}</p>
                                        <span className="category-featured">{category.featured}</span>
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

                    {/* Tercera tarjeta: Sin etiquetas / Todos los estilos - Centrada debajo */}
                    <ScrollAnimate animation="fade-up" delay={300}>
                        <div className="category-card-centered">
                            <Link
                                href="/catalogo"
                                className="category-card category-card-large category-card-inclusive"
                            >
                                <div className="category-visual gradient-inclusive">
                                    <Image
                                        src="/armazon-3/1.png"
                                        alt="Todos los estilos"
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        sizes="(max-width: 768px) 50vw, 200px"
                                        onError={(e) => {
                                            // Fallback si no existe la imagen
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                </div>
                                <div className="category-content">
                                    <h3 className="category-name">Sin etiquetas</h3>
                                    <p className="category-description">Para todos los estilos</p>
                                    <span className="category-featured">Toda la colección disponible</span>
                                    <span className="category-cta">
                                        Ver todos los estilos
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

            {/* ════════════════════════════════════════════════════════════════════
          CARRUSEL DE INFLUENCERS - "Descubre cómo luce"
          ════════════════════════════════════════════════════════════════════ */}
            <InfluencerCarousel />

            {/* ════════════════════════════════════════════════════════════════════
          1.3 QUIZ DE ESTILO RÁPIDO
          ════════════════════════════════════════════════════════════════════ */}
            <section className="style-quiz-section" aria-labelledby="quiz-title">
                <div className="section-container">
                    <ScrollAnimate animation="zoom-in">
                        <div
                            className="quiz-card"
                            style={{
                                minHeight: '500px',
                                transition: 'all 0.3s ease',
                                gridTemplateColumns: '1fr',
                                padding: 0,
                                overflow: 'hidden'
                            }}
                        >
                            <HomeQuiz
                                isOpen={true}
                                onClose={() => { }} // No closing needed as it's permanent
                                initialStyle={undefined}
                                embedded={true}
                                skipIntro={false} // Show the 'How do you want to discover...' screen
                            />
                        </div>
                    </ScrollAnimate>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════════
          TRATAMIENTOS - Carrusel deslizable
          ════════════════════════════════════════════════════════════════════ */}
            <section className="treatments-section" aria-labelledby="treatments-title">
                <div className="section-container">
                    <ScrollAnimate animation="fade-up">
                        <div className="section-header">
                            <h2 id="treatments-title" className="section-title">
                                Nuestros Tratamientos
                            </h2>
                            <p className="section-description">
                                Mejora tu visión con nuestros tratamientos especializados
                            </p>
                        </div>
                    </ScrollAnimate>

                    <div
                        className="treatments-carousel"
                        style={{
                            display: 'flex',
                            gap: '16px',
                            overflowX: 'auto',
                            scrollSnapType: 'x mandatory',
                            scrollBehavior: 'smooth',
                            paddingBottom: '16px',
                            WebkitOverflowScrolling: 'touch',
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none'
                        }}
                    >
                        {[
                            {
                                id: 'blueray',
                                name: 'Blue Ray',
                                description: 'Protección contra luz azul de pantallas',
                                emoji: '💙',
                                color: '#1a73e8'
                            },
                            {
                                id: 'polarizado',
                                name: 'Polarizado',
                                description: 'Reduce reflejos, ideal para manejar',
                                emoji: '🕶️',
                                color: '#2d2d2d'
                            },
                            {
                                id: 'fotocromatico',
                                name: 'Fotocromático',
                                description: 'Se oscurece con el sol automáticamente',
                                emoji: '🌓',
                                color: '#6b4c9a'
                            },
                            {
                                id: 'antirreflejante',
                                name: 'Antirreflejante',
                                description: 'Elimina reflejos y mejora claridad',
                                emoji: '✨',
                                color: '#00a67d'
                            },
                            {
                                id: 'tinte',
                                name: 'Tintes de Color',
                                description: 'Personaliza tus lentes con estilo',
                                emoji: '🎨',
                                color: '#e91e63'
                            },
                        ].map((treatment, index) => (
                            <ScrollAnimate key={treatment.id} animation="fade-up" delay={index * 100}>
                                <div
                                    className="treatment-card"
                                    style={{
                                        minWidth: '280px',
                                        maxWidth: '280px',
                                        scrollSnapAlign: 'start',
                                        background: `linear-gradient(135deg, ${treatment.color}15 0%, ${treatment.color}05 100%)`,
                                        border: `2px solid ${treatment.color}30`,
                                        borderRadius: '20px',
                                        padding: '24px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '16px',
                                        background: `${treatment.color}20`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '28px'
                                    }}>
                                        {treatment.emoji}
                                    </div>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        color: '#152132',
                                        margin: 0
                                    }}>
                                        {treatment.name}
                                    </h3>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#666',
                                        margin: 0,
                                        lineHeight: '1.5'
                                    }}>
                                        {treatment.description}
                                    </p>
                                </div>
                            </ScrollAnimate>
                        ))}
                    </div>

                    <p style={{
                        textAlign: 'center',
                        fontSize: '13px',
                        color: '#999',
                        marginTop: '8px'
                    }}>
                        ← Desliza para ver más →
                    </p>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════════
          1.4 TESTIMONIOS - CARRUSEL
          ════════════════════════════════════════════════════════════════════ */}
            <TestimonialsCarousel />

            {/* ════════════════════════════════════════════════════════════════════
          NEWSLETTER
          ════════════════════════════════════════════════════════════════════ */}
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
