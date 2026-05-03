'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MexiluxButtonLink } from '@/components/ui/MexiluxButton';

interface Slide {
    id: string;
    eyebrow?: string;
    headline: string;
    description: string;
    image?: string;
    bg: string;
    ctas: Array<{
        label: string;
        href: string;
        variant: 'primary' | 'secondary';
    }>;
}

const SLIDES: Slide[] = [
    {
        id: 'ya-te-la-sabes',
        eyebrow: 'Ya te la sabes',
        headline: 'Ya te la sabes',
        description:
            '¿O no sabes qué armazón es para ti? ¿Godín, Patrón o Alucín? Tenemos el armazón que define tu estilo.',
        image: '/glasses-hero.png',
        bg: 'linear-gradient(135deg, #EEEADE 0%, #d4c9b0 100%)',
        ctas: [
            { label: 'Hacer quiz', href: '/quiz', variant: 'primary' },
            { label: 'Nuestra historia', href: '/nosotros', variant: 'secondary' },
        ],
    },
    {
        id: 'productos-nuevos',
        eyebrow: 'Recién llegados',
        headline: 'Productos nuevos',
        description:
            'Estrenamos colección. Modelos frescos para que estrenes mirada y rompas el modo automático.',
        image: '/armazon-1/1.png',
        bg: 'linear-gradient(135deg, #1a1f2e 0%, #2d3a55 100%)',
        ctas: [
            { label: 'Ver stock nuevo', href: '/catalogo?sort=nuevo', variant: 'primary' },
        ],
    },
    {
        id: 'viendo-mexico',
        eyebrow: 'El Blog',
        headline: 'Viendo México',
        description:
            'Redescubre el país a través de nuestra mirada. Lugares, Cultura, sabor y los mexicanos que están moviendo al mundo.',
        image: '/armazon-2/1.png',
        bg: 'linear-gradient(135deg, #8A6623 0%, #c89b3f 100%)',
        ctas: [
            { label: 'Echemosle un ojo', href: '/blog', variant: 'primary' },
        ],
    },
];

const AUTOPLAY_MS = 5000;

export default function HeroCarousel() {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const goTo = useCallback((i: number) => {
        setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
    }, []);

    const next = useCallback(() => goTo(index + 1), [index, goTo]);
    const prev = useCallback(() => goTo(index - 1), [index, goTo]);

    useEffect(() => {
        if (isPaused) return;
        intervalRef.current = setInterval(() => {
            setIndex((prev) => (prev + 1) % SLIDES.length);
        }, AUTOPLAY_MS);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPaused]);

    return (
        <section
            className="hero-carousel"
            aria-label="Carrusel principal"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="hero-carousel__track">
                {SLIDES.map((slide, i) => {
                    const isActive = i === index;
                    const isDark = slide.bg.includes('#1a') || slide.bg.includes('#8A6623');
                    return (
                        <div
                            key={slide.id}
                            className={`hero-carousel__slide ${isActive ? 'is-active' : ''}`}
                            aria-hidden={!isActive}
                            style={{ background: slide.bg }}
                        >
                            <div className="hero-carousel__inner">
                                <div className={`hero-carousel__copy ${isDark ? 'is-dark' : ''}`}>
                                    {slide.eyebrow && (
                                        <span className="hero-carousel__eyebrow">{slide.eyebrow}</span>
                                    )}
                                    <h1 className="hero-carousel__title">{slide.headline}</h1>
                                    <p className="hero-carousel__desc">{slide.description}</p>
                                    <div className="hero-carousel__ctas">
                                        {slide.ctas.map((cta) => (
                                            <MexiluxButtonLink
                                                key={cta.label}
                                                href={cta.href}
                                                variant={cta.variant}
                                            >
                                                {cta.label}
                                            </MexiluxButtonLink>
                                        ))}
                                    </div>
                                </div>
                                {slide.image && (
                                    <div className="hero-carousel__visual">
                                        <Image
                                            src={slide.image}
                                            alt={slide.headline}
                                            width={600}
                                            height={500}
                                            priority={i === 0}
                                            style={{
                                                objectFit: 'contain',
                                                width: '100%',
                                                height: 'auto',
                                                maxHeight: '460px',
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                type="button"
                className="hero-carousel__nav hero-carousel__nav--prev"
                onClick={prev}
                aria-label="Slide anterior"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                type="button"
                className="hero-carousel__nav hero-carousel__nav--next"
                onClick={next}
                aria-label="Slide siguiente"
            >
                <ChevronRight size={24} />
            </button>

            <div className="hero-carousel__dots" role="tablist">
                {SLIDES.map((slide, i) => (
                    <button
                        key={slide.id}
                        type="button"
                        role="tab"
                        aria-selected={i === index}
                        aria-label={`Ir a slide ${i + 1}: ${slide.headline}`}
                        className={`hero-carousel__dot ${i === index ? 'is-active' : ''}`}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>

            <style jsx>{`
                .hero-carousel {
                    position: relative;
                    width: 100%;
                    height: clamp(520px, 70vh, 720px);
                    overflow: hidden;
                }
                .hero-carousel__track {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                .hero-carousel__slide {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    transition: opacity 600ms ease;
                    pointer-events: none;
                }
                .hero-carousel__slide.is-active {
                    opacity: 1;
                    pointer-events: auto;
                    z-index: 1;
                }
                .hero-carousel__inner {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: clamp(2rem, 5vw, 4rem);
                    height: 100%;
                    display: grid;
                    grid-template-columns: 1.1fr 1fr;
                    align-items: center;
                    gap: 2rem;
                }
                .hero-carousel__copy {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    color: #152132;
                    max-width: 560px;
                }
                .hero-carousel__copy.is-dark {
                    color: #ffffff;
                }
                .hero-carousel__eyebrow {
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    opacity: 0.7;
                    font-weight: 600;
                }
                .hero-carousel__title {
                    font-size: clamp(2.25rem, 5vw, 3.75rem);
                    font-weight: 800;
                    line-height: 1.05;
                    margin: 0;
                }
                .hero-carousel__desc {
                    font-size: clamp(1rem, 1.4vw, 1.125rem);
                    line-height: 1.6;
                    opacity: 0.9;
                    margin: 0;
                }
                .hero-carousel__ctas {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    margin-top: 0.5rem;
                }
                .hero-carousel__visual {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                }
                .hero-carousel__nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    border: none;
                    background: rgba(255, 255, 255, 0.85);
                    color: #152132;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 5;
                    transition: background 200ms;
                }
                .hero-carousel__nav:hover {
                    background: #ffffff;
                }
                .hero-carousel__nav--prev { left: 1rem; }
                .hero-carousel__nav--next { right: 1rem; }
                .hero-carousel__dots {
                    position: absolute;
                    bottom: 1.5rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 0.5rem;
                    z-index: 5;
                }
                .hero-carousel__dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    border: none;
                    background: rgba(21, 33, 50, 0.3);
                    cursor: pointer;
                    transition: all 200ms;
                    padding: 0;
                }
                .hero-carousel__dot.is-active {
                    background: #152132;
                    width: 28px;
                    border-radius: 5px;
                }
                @media (max-width: 768px) {
                    .hero-carousel {
                        height: auto;
                        min-height: 560px;
                    }
                    .hero-carousel__inner {
                        grid-template-columns: 1fr;
                        text-align: center;
                        padding: 2rem 1.25rem 4rem;
                    }
                    .hero-carousel__copy {
                        align-items: center;
                    }
                    .hero-carousel__ctas {
                        justify-content: center;
                    }
                    .hero-carousel__nav { display: none; }
                }
            `}</style>
        </section>
    );
}
