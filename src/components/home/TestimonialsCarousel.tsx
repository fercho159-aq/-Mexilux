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

        </section>
    );
}
