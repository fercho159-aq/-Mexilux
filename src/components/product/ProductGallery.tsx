'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';

interface GalleryImage {
    url: string;
    alt: string | null;
}

interface ProductGalleryProps {
    images: GalleryImage[];
    productName: string;
    brandName?: string;
    material?: string;
    shape?: string;
    discount?: number;
}

// Información de slides estilo Apple
const SLIDE_INFO = [
    { title: 'Vista frontal', description: 'Diseño premium para tu estilo' },
    { title: 'Vista lateral', description: 'Perfil elegante y ligero' },
    { title: 'Detalle', description: 'Acabados de alta calidad' },
    { title: 'Perspectiva', description: 'Para que veas todos los ángulos' },
];

export default function ProductGallery({
    images,
    productName,
    discount
}: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Touch/Swipe state
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const slideRef = useRef<HTMLDivElement>(null);

    const currentImage = images[selectedIndex];
    const currentInfo = SLIDE_INFO[selectedIndex % SLIDE_INFO.length];

    // Minimum swipe distance to trigger slide change
    const minSwipeDistance = 50;

    // Auto-play del carrusel
    const nextSlide = useCallback(() => {
        if (images.length > 1) {
            setSelectedIndex((prev) => (prev + 1) % images.length);
        }
    }, [images.length]);

    useEffect(() => {
        if (!isAutoPlaying || images.length <= 1) return;

        const timer = setInterval(nextSlide, 4000);
        return () => clearInterval(timer);
    }, [isAutoPlaying, nextSlide, images.length]);

    const handlePrev = useCallback(() => {
        setIsAutoPlaying(false);
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const handleNext = useCallback(() => {
        setIsAutoPlaying(false);
        setSelectedIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const handleDotClick = (index: number) => {
        setIsAutoPlaying(false);
        setSelectedIndex(index);
    };

    // Touch handlers for swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchEndX.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }

        // Reset
        touchStartX.current = null;
        touchEndX.current = null;
    };

    // Mouse drag handlers for desktop
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef<number | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStartX.current = e.clientX;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        touchEndX.current = e.clientX;
    };

    const handleMouseUp = () => {
        if (!isDragging || !dragStartX.current) {
            setIsDragging(false);
            return;
        }

        const endX = touchEndX.current || dragStartX.current;
        const distance = dragStartX.current - endX;

        if (distance > minSwipeDistance) {
            handleNext();
        } else if (distance < -minSwipeDistance) {
            handlePrev();
        }

        setIsDragging(false);
        dragStartX.current = null;
        touchEndX.current = null;
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            dragStartX.current = null;
            touchEndX.current = null;
        }
    };

    return (
        <section className="apple-gallery" aria-label="Galería de imágenes">
            {/* Main Image Container */}
            <div className="apple-gallery-main">
                {/* Badge de descuento */}
                {discount && discount > 0 && (
                    <span className="apple-gallery-badge">-{discount}%</span>
                )}

                {/* Imagen principal con soporte de swipe */}
                <div
                    className="apple-gallery-slide"
                    ref={slideRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        cursor: images.length > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                        userSelect: 'none'
                    }}
                >
                    <div className="apple-gallery-image">
                        {currentImage?.url ? (
                            <Image
                                src={currentImage.url}
                                alt={currentImage.alt || productName}
                                fill
                                style={{ objectFit: 'contain', pointerEvents: 'none' }}
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                draggable={false}
                            />
                        ) : (
                            <span className="apple-gallery-emoji" aria-hidden="true">👓</span>
                        )}
                    </div>

                    {/* Info overlay */}
                    <div className="apple-gallery-info">
                        <span className="apple-gallery-counter">
                            {selectedIndex + 1} / {images.length}
                        </span>
                        <h3 className="apple-gallery-title">{currentInfo.title}</h3>
                        <p className="apple-gallery-description">{currentInfo.description}</p>
                    </div>
                </div>

                {/* Navigation arrows - Solo visible en desktop */}
                {images.length > 1 && (
                    <div className="gallery-nav-arrows">
                        <button
                            className="apple-gallery-nav apple-gallery-prev"
                            onClick={handlePrev}
                            aria-label="Imagen anterior"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <button
                            className="apple-gallery-nav apple-gallery-next"
                            onClick={handleNext}
                            aria-label="Siguiente imagen"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Progress dots + Play/Pause */}
            {images.length > 1 && (
                <div className="apple-gallery-controls">
                    <div className="apple-gallery-dots">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                className={`apple-gallery-dot ${idx === selectedIndex ? 'active' : ''}`}
                                onClick={() => handleDotClick(idx)}
                                aria-label={`Ir a imagen ${idx + 1}`}
                            >
                                {idx === selectedIndex && isAutoPlaying && (
                                    <span className="dot-progress" />
                                )}
                            </button>
                        ))}
                    </div>
                    <button
                        className="apple-gallery-playpause"
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        aria-label={isAutoPlaying ? 'Pausar' : 'Reproducir'}
                    >
                        {isAutoPlaying ? (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" rx="1" />
                                <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>
                </div>
            )}

            {/* CSS para ocultar flechas en móvil */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .gallery-nav-arrows {
                        display: none !important;
                    }
                }
            `}</style>
        </section>
    );
}
