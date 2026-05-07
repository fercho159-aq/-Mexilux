'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollAnimate } from '@/components/ui/ScrollAnimate';
import { User, UserRound } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    image: React.ReactNode;
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: 'María García',
        role: 'Cliente desde 2022',
        content: 'Excelente atención y calidad. Mi examen de vista fue muy completo y los lentes quedaron perfectos. Totalmente recomendados.',
        rating: 5,
        image: <UserRound size={32} />,
    },
    {
        id: 2,
        name: 'Carlos Hernández',
        role: 'Cliente desde 2021',
        content: 'Los lentes progresivos que me hicieron son los mejores que he tenido. El configurador online es súper fácil de usar.',
        rating: 5,
        image: <User size={32} />,
    },
    {
        id: 3,
        name: 'Ana Martínez',
        role: 'Cliente desde 2023',
        content: 'Compré lentes para toda mi familia. La atención personalizada y los precios justos hacen la diferencia.',
        rating: 5,
        image: <UserRound size={32} />,
    },
    {
        id: 4,
        name: 'Roberto Sánchez',
        role: 'Cliente desde 2022',
        content: 'Increíble servicio. Me ayudaron a elegir los armazones perfectos para mi tipo de rostro. ¡Super recomendado!',
        rating: 5,
        image: <User size={32} />,
    },
    {
        id: 5,
        name: 'Laura Ramírez',
        role: 'Cliente desde 2023',
        content: 'Los precios son muy accesibles y la calidad es excelente. Ya recomendé Mexilux a todos mis amigos.',
        rating: 5,
        image: <UserRound size={32} />,
    },
];

export default function TestimonialsCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [prevTranslate, setPrevTranslate] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, []);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    }, []);

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying || isDragging) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, isDragging, nextSlide]);

    const handleInteraction = () => {
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    // Touch/Mouse handlers
    const handleDragStart = (clientX: number) => {
        setIsDragging(true);
        setStartX(clientX);
        setPrevTranslate(activeIndex * -100);
        setCurrentTranslate(activeIndex * -100);
        handleInteraction();
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging || !trackRef.current) return;
        const diff = clientX - startX;
        const containerWidth = trackRef.current.parentElement?.offsetWidth || 1;
        const percentMove = (diff / containerWidth) * 100;
        setCurrentTranslate(prevTranslate + percentMove);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const threshold = 15; // percentage
        const diff = currentTranslate - prevTranslate;

        if (diff < -threshold && activeIndex < TESTIMONIALS.length - 1) {
            setActiveIndex(activeIndex + 1);
        } else if (diff > threshold && activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }

        setCurrentTranslate(activeIndex * -100);
    };

    const getTransform = () => {
        if (isDragging) {
            return `translateX(${currentTranslate}%)`;
        }
        return `translateX(-${activeIndex * 100}%)`;
    };

    return (
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

                <div className="testimonials-carousel-wrapper">
                    {/* Navigation Left */}
                    <button
                        className="testimonial-nav testimonial-nav-left"
                        onClick={() => { prevSlide(); handleInteraction(); }}
                        aria-label="Testimonio anterior"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    {/* Carousel Track */}
                    <div
                        className="testimonials-carousel"
                        onMouseDown={(e) => handleDragStart(e.clientX)}
                        onMouseMove={(e) => handleDragMove(e.clientX)}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                        onTouchEnd={handleDragEnd}
                    >
                        <div
                            ref={trackRef}
                            className="testimonials-track"
                            style={{
                                transform: getTransform(),
                                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            {TESTIMONIALS.map((testimonial) => (
                                <article key={testimonial.id} className="testimonial-slide">
                                    <div className="testimonial-card-carousel">
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
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Right */}
                    <button
                        className="testimonial-nav testimonial-nav-right"
                        onClick={() => { nextSlide(); handleInteraction(); }}
                        aria-label="Siguiente testimonio"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className="testimonials-dots">
                    {TESTIMONIALS.map((_, index) => (
                        <button
                            key={index}
                            className={`testimonial-dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => { setActiveIndex(index); handleInteraction(); }}
                            aria-label={`Ir al testimonio ${index + 1}`}
                        />
                    ))}
                </div>

                <p className="swipe-hint">← Desliza para ver más →</p>

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

            <style jsx>{`
                .testimonials-carousel-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin: 32px 0 16px;
                }

                .testimonials-carousel {
                    flex: 1;
                    overflow: hidden;
                    border-radius: 20px;
                    cursor: grab;
                    touch-action: pan-y pinch-zoom;
                    user-select: none;
                }

                .testimonials-carousel:active {
                    cursor: grabbing;
                }

                .testimonials-track {
                    display: flex;
                }

                .testimonial-slide {
                    flex: 0 0 100%;
                    min-width: 100%;
                    padding: 0 8px;
                    box-sizing: border-box;
                }

                .testimonial-card-carousel {
                    background: white;
                    border-radius: 20px;
                    padding: 32px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    pointer-events: none;
                }

                .testimonial-rating {
                    color: #fbbf24;
                    font-size: 1.25rem;
                    margin-bottom: 16px;
                }

                .testimonial-content {
                    font-size: 1.125rem;
                    line-height: 1.7;
                    color: #1a1a1a;
                    margin: 0 0 24px 0;
                    font-style: italic;
                }

                .testimonial-author {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .author-image {
                    font-size: 2.5rem;
                }

                .author-info {
                    display: flex;
                    flex-direction: column;
                }

                .author-name {
                    font-weight: 600;
                    font-style: normal;
                    color: #1a1a1a;
                }

                .author-role {
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .testimonial-nav {
                    flex-shrink: 0;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: white;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .testimonial-nav:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                }

                .testimonial-nav:active {
                    transform: scale(0.95);
                }

                .testimonial-nav svg {
                    width: 24px;
                    height: 24px;
                    color: #152132;
                }

                .testimonials-dots {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 16px;
                }

                .testimonial-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #e5e7eb;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    padding: 0;
                }

                .testimonial-dot.active {
                    background: #152132;
                    width: 24px;
                    border-radius: 5px;
                }

                .testimonial-dot:hover:not(.active) {
                    background: #9ca3af;
                }

                .swipe-hint {
                    text-align: center;
                    font-size: 13px;
                    color: #999;
                    margin: 12px 0 24px;
                    display: none;
                }

                @media (max-width: 768px) {
                    .testimonial-nav {
                        display: none;
                    }

                    .testimonials-carousel-wrapper {
                        margin: 24px 0 12px;
                    }

                    .testimonial-card-carousel {
                        padding: 24px;
                    }

                    .testimonial-content {
                        font-size: 1rem;
                    }

                    .swipe-hint {
                        display: block;
                    }
                }
            `}</style>
        </section>
    );
}
