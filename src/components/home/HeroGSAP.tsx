'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function HeroGSAP() {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const sublineRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Initial state - image starts scaled up
            gsap.set(imageRef.current, {
                scale: 1.2,
                opacity: 0,
            });

            gsap.set([headlineRef.current, sublineRef.current, ctaRef.current], {
                opacity: 0,
                y: 60,
            });

            // Entrance animation
            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' }
            });

            tl.to(imageRef.current, {
                scale: 1,
                opacity: 1,
                duration: 1.5,
            })
                .to(headlineRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                }, '-=0.8')
                .to(sublineRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                }, '-=0.6')
                .to(ctaRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                }, '-=0.6');

            // Scroll-triggered parallax effect
            gsap.to(imageRef.current, {
                yPercent: -20,
                scale: 0.95,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
            });

            // Text parallax - moves slower
            gsap.to(textRef.current, {
                yPercent: -50,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="gsap-hero">
            {/* Background Image with Parallax */}
            <div ref={imageRef} className="gsap-hero-image">
                <Image
                    src="/glasses-hero.png"
                    alt="Lentes Premium"
                    fill
                    priority
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 100vw, 80vw"
                />
            </div>

            {/* Content Overlay */}
            <div ref={textRef} className="gsap-hero-content">
                <h1 ref={headlineRef} className="gsap-hero-headline">
                    Visión Premium
                </h1>
                <p ref={sublineRef} className="gsap-hero-subline">
                    Descubre la perfección en cada detalle.<br />
                    Diseño que define tu estilo.
                </p>
                <div ref={ctaRef} className="gsap-hero-cta">
                    <Link href="/catalogo" className="gsap-btn-primary">
                        Explorar Colección
                    </Link>
                    <Link href="/nosotros" className="gsap-btn-secondary">
                        Conócenos
                    </Link>
                </div>
            </div>

            {/* Animated Gradient Background */}
            <div className="gradient-bg">
                <div className="gradient-blob blob-1"></div>
                <div className="gradient-blob blob-2"></div>
                <div className="gradient-blob blob-3"></div>
            </div>

            {/* Scroll Indicator */}
            <div className="gsap-scroll-indicator">
                <div className="scroll-mouse">
                    <div className="scroll-wheel"></div>
                </div>
                <span>Desliza</span>
            </div>

            <style jsx>{`
                .gsap-hero {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    overflow: hidden;
                }

                .gradient-bg {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    z-index: 0;
                }

                .gradient-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.6;
                    animation: blobFloat 20s ease-in-out infinite;
                }

                .blob-1 {
                    width: 600px;
                    height: 600px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    top: -20%;
                    left: -10%;
                    animation-delay: 0s;
                }

                .blob-2 {
                    width: 500px;
                    height: 500px;
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    top: 50%;
                    right: -15%;
                    animation-delay: -7s;
                }

                .blob-3 {
                    width: 450px;
                    height: 450px;
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    bottom: -20%;
                    left: 30%;
                    animation-delay: -14s;
                }

                @keyframes blobFloat {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    25% {
                        transform: translate(30px, -50px) scale(1.05);
                    }
                    50% {
                        transform: translate(-20px, 20px) scale(0.95);
                    }
                    75% {
                        transform: translate(50px, 30px) scale(1.02);
                    }
                }

                .gsap-hero-image {
                    position: absolute;
                    width: 60%;
                    height: 60%;
                    max-width: 800px;
                    will-change: transform;
                    z-index: 2;
                }

                .gsap-hero-content {
                    position: relative;
                    z-index: 10;
                    text-align: center;
                    padding: 2rem;
                    margin-top: 50vh;
                }

                .gsap-hero-headline {
                    font-size: clamp(3rem, 10vw, 7rem);
                    font-weight: 700;
                    color: #1d1d1f;
                    letter-spacing: -0.03em;
                    margin: 0 0 1rem 0;
                    line-height: 1.05;
                }

                .gsap-hero-subline {
                    font-size: clamp(1.25rem, 3vw, 1.75rem);
                    color: #6e6e73;
                    margin: 0 0 2.5rem 0;
                    line-height: 1.4;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .gsap-hero-cta {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .gsap-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    padding: 1rem 2rem;
                    background: #0071e3;
                    color: white;
                    border-radius: 980px;
                    font-size: 1.1rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
                }

                .gsap-btn-primary:hover {
                    background: #0077ed;
                    transform: scale(1.04);
                }

                .gsap-btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    padding: 1rem 2rem;
                    background: transparent;
                    color: #0071e3;
                    border-radius: 980px;
                    font-size: 1.1rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
                }

                .gsap-btn-secondary:hover {
                    background: #f5f5f7;
                }

                .gsap-scroll-indicator {
                    position: absolute;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    opacity: 0.6;
                    animation: fadeInUp 1s ease 2s forwards;
                    opacity: 0;
                }

                @keyframes fadeInUp {
                    to {
                        opacity: 0.6;
                    }
                }

                .scroll-mouse {
                    width: 24px;
                    height: 40px;
                    border: 2px solid #1d1d1f;
                    border-radius: 12px;
                    position: relative;
                }

                .scroll-wheel {
                    width: 4px;
                    height: 8px;
                    background: #1d1d1f;
                    border-radius: 2px;
                    position: absolute;
                    top: 8px;
                    left: 50%;
                    transform: translateX(-50%);
                    animation: scrollWheel 2s ease infinite;
                }

                @keyframes scrollWheel {
                    0%, 100% {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                    50% {
                        opacity: 0.3;
                        transform: translateX(-50%) translateY(12px);
                    }
                }

                .gsap-scroll-indicator span {
                    font-size: 0.75rem;
                    color: #6e6e73;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                @media (max-width: 768px) {
                    .gsap-hero {
                        min-height: 100svh;
                        flex-direction: column;
                        justify-content: flex-start;
                        padding-top: 80px;
                    }

                    .gsap-hero-image {
                        position: relative;
                        width: 85%;
                        height: 280px;
                        margin: 0 auto 1rem;
                    }

                    .gsap-hero-content {
                        margin-top: 0;
                        padding: 1rem 1.5rem 2rem;
                    }

                    .gsap-hero-headline {
                        font-size: 2.5rem;
                        margin-bottom: 0.75rem;
                    }

                    .gsap-hero-subline {
                        font-size: 1rem;
                        margin-bottom: 1.5rem;
                    }

                    .gsap-btn-primary,
                    .gsap-btn-secondary {
                        padding: 0.875rem 1.5rem;
                        font-size: 1rem;
                        width: 100%;
                        justify-content: center;
                    }

                    .gsap-hero-cta {
                        flex-direction: column;
                        gap: 0.75rem;
                        width: 100%;
                    }

                    .gradient-blob {
                        filter: blur(60px);
                        opacity: 0.4;
                    }

                    .blob-1 {
                        width: 300px;
                        height: 300px;
                        top: -10%;
                        left: -20%;
                    }

                    .blob-2 {
                        width: 250px;
                        height: 250px;
                        top: 30%;
                        right: -20%;
                    }

                    .blob-3 {
                        width: 200px;
                        height: 200px;
                        bottom: 10%;
                        left: 10%;
                    }

                    .gsap-scroll-indicator {
                        bottom: 1rem;
                    }
                }
            `}</style>
        </section>
    );
}
