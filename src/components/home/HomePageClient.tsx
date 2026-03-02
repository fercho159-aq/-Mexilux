'use client';

import Link from 'next/link';
import Image from 'next/image';
import HomeQuiz from '@/components/home/HomeQuiz';
import InfluencerCarousel from '@/components/home/InfluencerCarousel';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';
import { ScrollAnimate } from '@/components/ui/ScrollAnimate';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import HeroGSAP from './HeroGSAP';
import { Heart, Glasses, Moon, Sparkles, Palette } from 'lucide-react';

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
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>, label: 'Página Mexicana', detail: 'Lo que está hecho en México está bien hecho' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>, label: "Pa' que no te preocupes", detail: 'Todos los armazones tienen garantía' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, label: 'Ya vamos, hay mucho tráfico', detail: '5-7 días de entrega' },
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

                    <ScrollAnimate animation="fade-up">
                        <div
                            className="treatments-carousel"
                            onMouseDown={(e) => {
                                const el = e.currentTarget;
                                el.dataset.isDown = 'true';
                                el.dataset.startX = String(e.pageX - el.offsetLeft);
                                el.dataset.scrollLeft = String(el.scrollLeft);
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.dataset.isDown = 'false';
                            }}
                            onMouseUp={(e) => {
                                e.currentTarget.dataset.isDown = 'false';
                            }}
                            onMouseMove={(e) => {
                                const el = e.currentTarget;
                                if (el.dataset.isDown !== 'true') return;
                                e.preventDefault();
                                const x = e.pageX - el.offsetLeft;
                                const walk = (x - Number(el.dataset.startX)) * 2;
                                el.scrollLeft = Number(el.dataset.scrollLeft) - walk;
                            }}
                        >
                            {[
                                {
                                    id: 'blueray',
                                    name: 'Blue Ray',
                                    description: 'Protección contra luz azul de pantallas',
                                    emoji: <Heart size={28} />,
                                    color: '#1a73e8'
                                },
                                {
                                    id: 'polarizado',
                                    name: 'Polarizado',
                                    description: 'Reduce reflejos, ideal para manejar',
                                    emoji: <Glasses size={28} />,
                                    color: '#2d2d2d'
                                },
                                {
                                    id: 'fotocromatico',
                                    name: 'Fotocromático',
                                    description: 'Se oscurece con el sol automáticamente',
                                    emoji: <Moon size={28} />,
                                    color: '#6b4c9a'
                                },
                                {
                                    id: 'antirreflejante',
                                    name: 'Antirreflejante',
                                    description: 'Elimina reflejos y mejora claridad',
                                    emoji: <Sparkles size={28} />,
                                    color: '#00a67d'
                                },
                                {
                                    id: 'tinte',
                                    name: 'Tintes de Color',
                                    description: 'Personaliza tus lentes con estilo',
                                    emoji: <Palette size={28} />,
                                    color: '#e91e63'
                                },
                            ].map((treatment) => (
                                <div
                                    key={treatment.id}
                                    className="treatment-card"
                                    style={{
                                        background: `linear-gradient(135deg, ${treatment.color}10 0%, ${treatment.color}05 100%)`,
                                        border: `1.5px solid ${treatment.color}20`,
                                    }}
                                >
                                    <div className="treatment-icon" style={{
                                        background: `${treatment.color}15`,
                                    }}>
                                        {treatment.emoji}
                                    </div>
                                    <h3 className="treatment-name">
                                        {treatment.name}
                                    </h3>
                                    <p className="treatment-desc">
                                        {treatment.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ScrollAnimate>

                    <style jsx>{`
                        .treatments-carousel {
                            display: flex;
                            gap: 16px;
                            overflow-x: auto;
                            padding: 16px 4px 24px;
                            scroll-snap-type: x mandatory;
                            scroll-behavior: smooth;
                            cursor: grab;
                            user-select: none;
                            -webkit-overflow-scrolling: touch;
                            scrollbar-width: none;
                            -ms-overflow-style: none;
                        }
                        .treatments-carousel::-webkit-scrollbar {
                            display: none;
                        }
                        .treatments-carousel:active {
                            cursor: grabbing;
                        }
                        .treatment-card {
                            min-width: 260px;
                            flex-shrink: 0;
                            scroll-snap-align: start;
                            border-radius: '20px';
                            padding: 24px;
                            display: flex;
                            flex-direction: column;
                            gap: 14px;
                            transition: transform 0.3s ease, box-shadow 0.3s ease;
                            border-radius: 20px;
                        }
                        .treatment-card:hover {
                            transform: translateY(-4px);
                            box-shadow: 0 12px 24px rgba(0,0,0,0.1);
                        }
                        .treatment-icon {
                            width: 56px;
                            height: 56px;
                            border-radius: 16px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 28px;
                        }
                        .treatment-name {
                            font-size: 18px;
                            font-weight: 700;
                            color: #152132;
                            margin: 0;
                        }
                        .treatment-desc {
                            font-size: 14px;
                            color: #666;
                            margin: 0;
                            line-height: 1.5;
                        }
                        @media (max-width: 768px) {
                            .treatment-card {
                                min-width: 220px;
                                padding: 20px;
                            }
                            .treatment-icon {
                                width: 48px;
                                height: 48px;
                                font-size: 24px;
                            }
                            .treatment-name {
                                font-size: 16px;
                            }
                            .treatment-desc {
                                font-size: 13px;
                            }
                        }
                    `}</style>

                    <p style={{
                        textAlign: 'center',
                        fontSize: '13px',
                        color: '#999',
                        marginTop: '4px'
                    }}>
                        ← Arrastra para ver más →
                    </p>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════════
          1.4 TESTIMONIOS - CARRUSEL
          ════════════════════════════════════════════════════════════════════ */}
            <TestimonialsCarousel />

            {/* ════════════════════════════════════════════════════════════════════
          BLOG - Sección con enlaces
          ════════════════════════════════════════════════════════════════════ */}
            <section style={{ padding: '4rem 0', background: '#fafbfc' }} aria-labelledby="blog-section-title">
                <div className="section-container">
                    <ScrollAnimate animation="fade-up">
                        <div className="section-header">
                            <h2 id="blog-section-title" className="section-title">Cosas Mexas</h2>
                            <p className="section-description">Historias, lugares y personas que hacen grande a Mexico</p>
                        </div>
                    </ScrollAnimate>

                    <ScrollAnimate animation="fade-up">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: '1rem',
                            marginBottom: '2rem',
                        }}>
                            {[
                                { name: 'Mexico Magico', desc: 'Lugares mexicanos para visitar', slug: 'mexico-magico', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                                { name: 'Mexicanos de Lujo', desc: 'Mexicanos que vale la pena voltear a ver', slug: 'mexicanos-de-lujo', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
                                { name: "Pa' la Muela", desc: 'Lugares que vale la pena comer', slug: 'pa-la-muela', gradient: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)' },
                                { name: 'Vista a las Raices', desc: 'Cultura, raices y artesanias', slug: 'vista-a-las-raices', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
                            ].map((section) => (
                                <Link
                                    key={section.slug}
                                    href={`/blog/categoria/${section.slug}`}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        padding: '1.5rem',
                                        borderRadius: '16px',
                                        background: section.gradient,
                                        color: 'white',
                                        textDecoration: 'none',
                                        minHeight: '140px',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    }}
                                >
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.25rem' }}>
                                        {section.name}
                                    </h3>
                                    <p style={{ fontSize: '0.8125rem', opacity: 0.8, margin: 0 }}>
                                        {section.desc}
                                    </p>
                                </Link>
                            ))}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <Link
                                href="/blog"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    background: '#152132',
                                    color: 'white',
                                    borderRadius: '100px',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                }}
                            >
                                Ver todo el blog
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
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
