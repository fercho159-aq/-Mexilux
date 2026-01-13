'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import HomeQuiz from '@/components/home/HomeQuiz';
import InfluencerCarousel from '@/components/home/InfluencerCarousel';
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
// 1.3 QUIZ "TU ESTILO" - Opciones rápidas
// ═══════════════════════════════════════════════════════════════════════════
const STYLE_QUIZ_OPTIONS = [
    { icon: '👔', label: 'Ejecutivo', value: 'executive' },
    { icon: '🎨', label: 'Creativo', value: 'creative' },
    { icon: '⚽', label: 'Deportivo', value: 'sporty' },
    { icon: '✨', label: 'Elegante', value: 'elegant' },
    { icon: '🌴', label: 'Casual', value: 'casual' },
    { icon: '🎸', label: 'Trendy', value: 'trendy' },
];

// ═══════════════════════════════════════════════════════════════════════════
// 1.4 TESTIMONIOS
// ═══════════════════════════════════════════════════════════════════════════
const TESTIMONIALS = [
    {
        id: 1,
        name: 'María García',
        role: 'Cliente desde 2022',
        content: 'Excelente atención y calidad. Mi examen de vista fue muy completo y los lentes quedaron perfectos. Totalmente recomendados.',
        rating: 5,
        image: '👩‍💼',
    },
    {
        id: 2,
        name: 'Carlos Hernández',
        role: 'Cliente desde 2021',
        content: 'Los lentes progresivos que me hicieron son los mejores que he tenido. El configurador online es súper fácil de usar.',
        rating: 5,
        image: '👨‍💻',
    },
    {
        id: 3,
        name: 'Ana Martínez',
        role: 'Cliente desde 2023',
        content: 'Compré lentes para toda mi familia. La atención personalizada y los precios justos hacen la diferencia.',
        rating: 5,
        image: '👩‍👧‍👦',
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
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [quizStyle, setQuizStyle] = useState<string | undefined>();

    const handleStartQuiz = (style?: string) => {
        setQuizStyle(style);
        setIsQuizOpen(true);
    };

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
                                gridTemplateColumns: isQuizOpen ? '1fr' : '1fr 1fr'
                            }}
                        >
                            {isQuizOpen ? (
                                <HomeQuiz
                                    isOpen={true}
                                    onClose={() => setIsQuizOpen(false)}
                                    initialStyle={quizStyle}
                                    embedded={true}
                                />
                            ) : (
                                <>
                                    <div className="quiz-content">
                                        <span className="quiz-badge">🎯 Encuentra tu estilo</span>
                                        <h2 id="quiz-title" className="quiz-title">
                                            ¿No sabes qué lentes te quedan?
                                        </h2>
                                        <p className="quiz-description">
                                            Responde 3 preguntas rápidas y te recomendaremos las monturas
                                            perfectas para tu tipo de rostro y estilo de vida.
                                        </p>

                                        <div className="quiz-options">
                                            <span className="quiz-label">¿Cuál es tu estilo?</span>
                                            <div className="quiz-buttons">
                                                {STYLE_QUIZ_OPTIONS.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => handleStartQuiz(option.value)}
                                                        className="quiz-option-btn"
                                                    >
                                                        <span className="option-icon">{option.icon}</span>
                                                        <span className="option-label">{option.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button onClick={() => handleStartQuiz()} className="btn btn-quiz">
                                            Hacer el quiz completo
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14m-7-7 7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="quiz-visual" aria-hidden="true">
                                        <div className="quiz-graphic">
                                            <div className="face-shape face-oval">Ovalado</div>
                                            <div className="face-shape face-square">Cuadrado</div>
                                            <div className="face-shape face-round">Redondo</div>
                                            <div className="face-shape face-heart">Corazón</div>
                                        </div>
                                    </div>
                                </>
                            )}
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
          1.4 TESTIMONIOS
          ════════════════════════════════════════════════════════════════════ */}
            <section className="testimonials-section" aria-labelledby="testimonials-title">
                <div className="section-container">
                    <ScrollAnimate animation="fade-up">
                        <div className="section-header">
                            <h2 id="testimonials-title" className="section-title">
                                Lo que dicen nuestros clientes
                            </h2>
                            <p className="section-description">
                                Miles de personas confían en Mexilux para expresar su estilo
                            </p>
                        </div>
                    </ScrollAnimate>

                    <div className="testimonials-grid">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <ScrollAnimate key={testimonial.id} animation="fade-up" delay={index * 150}>
                                <article className="testimonial-card">
                                    <div className="testimonial-rating" aria-label={`${testimonial.rating} estrellas`}>
                                        {'★'.repeat(testimonial.rating)}
                                    </div>
                                    <blockquote className="testimonial-content">
                                        "{testimonial.content}"
                                    </blockquote>
                                    <footer className="testimonial-author">
                                        <span className="author-image" aria-hidden="true">{testimonial.image}</span>
                                        <div className="author-info">
                                            <cite className="author-name">{testimonial.name}</cite>
                                            <span className="author-role">{testimonial.role}</span>
                                        </div>
                                    </footer>
                                </article>
                            </ScrollAnimate>
                        ))}
                    </div>

                    {/* Google Reviews Badge */}
                    <ScrollAnimate animation="zoom-in" delay={300}>
                        <div className="reviews-badge">
                            <div className="reviews-score">
                                <span className="score-number">4.9</span>
                                <span className="score-stars">★★★★★</span>
                            </div>
                            <div className="reviews-info">
                                <span className="reviews-source">Google Reviews</span>
                                <span className="reviews-count">Basado en 500+ reseñas</span>
                            </div>
                        </div>
                    </ScrollAnimate>
                </div>
            </section>

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
