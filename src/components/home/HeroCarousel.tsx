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
            '¿No sabes qué armazón va contigo? ¿Godín, Patrón o Alucín? Aquí encontramos el que define tu estilo.',
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
                            data-theme={isDark ? 'dark' : 'light'}
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
                                                className={`hero-carousel-cta hero-carousel-cta--${cta.variant}`}
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

        </section>
    );
}
