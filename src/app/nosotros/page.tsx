'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function NosotrosPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const missionRef = useRef<HTMLDivElement>(null);
    const visionRef = useRef<HTMLDivElement>(null);
    const storyRef = useRef<HTMLDivElement>(null);
    const image1Ref = useRef<HTMLDivElement>(null);
    const image2Ref = useRef<HTMLDivElement>(null);
    const image3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Hero entrance animation
            gsap.from('.hero-text', {
                opacity: 0,
                y: 100,
                duration: 1.2,
                ease: 'power3.out',
                stagger: 0.2,
            });

            // Parallax for hero
            gsap.to('.hero-bg', {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Mission section animation
            gsap.from(missionRef.current, {
                opacity: 0,
                y: 80,
                scrollTrigger: {
                    trigger: missionRef.current,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1,
                },
            });

            // Image 1 - Parallax and scale
            gsap.from(image1Ref.current, {
                scale: 0.8,
                opacity: 0,
                scrollTrigger: {
                    trigger: image1Ref.current,
                    start: 'top 85%',
                    end: 'top 40%',
                    scrub: 1,
                },
            });

            gsap.to(image1Ref.current, {
                yPercent: -15,
                scrollTrigger: {
                    trigger: image1Ref.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Vision section animation
            gsap.from(visionRef.current, {
                opacity: 0,
                x: -100,
                scrollTrigger: {
                    trigger: visionRef.current,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1,
                },
            });

            // Image 2 - Different parallax
            gsap.from(image2Ref.current, {
                scale: 1.2,
                opacity: 0,
                rotation: -5,
                scrollTrigger: {
                    trigger: image2Ref.current,
                    start: 'top 85%',
                    end: 'top 40%',
                    scrub: 1,
                },
            });

            gsap.to(image2Ref.current, {
                yPercent: -20,
                rotation: 3,
                scrollTrigger: {
                    trigger: image2Ref.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Story section - fade in paragraphs
            gsap.from('.story-paragraph', {
                opacity: 0,
                y: 50,
                stagger: 0.3,
                scrollTrigger: {
                    trigger: storyRef.current,
                    start: 'top 70%',
                    end: 'center center',
                    scrub: 1,
                },
            });

            // Image 3 - Final reveal
            gsap.from(image3Ref.current, {
                scale: 0.6,
                opacity: 0,
                y: 100,
                scrollTrigger: {
                    trigger: image3Ref.current,
                    start: 'top 90%',
                    end: 'top 40%',
                    scrub: 1,
                },
            });

            // Values cards animation
            gsap.from('.value-card', {
                opacity: 0,
                y: 60,
                scale: 0.9,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: '.values-grid',
                    start: 'top 80%',
                    end: 'top 40%',
                    scrub: 1,
                },
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="nosotros-page">
            {/* Hero Section */}
            <section ref={heroRef} className="nosotros-hero">
                <div className="hero-bg"></div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-text hero-title">Somos Mexilux</h1>
                    <p className="hero-text hero-subtitle">
                        Más que lentes, una forma de ver México
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="content-section">
                <div ref={missionRef} className="section-card mission-card">
                    <div className="section-icon">🔥</div>
                    <h2>Nuestra Misión</h2>
                    <p className="section-text">
                        Mexilux busca <strong>concientizar a las y los mexicanos</strong> de que los lentes
                        son mucho más que una herramienta visual, son un <strong>accesorio esencial</strong>,
                        capaz de potenciar tu atractivo, seguridad y expresar tu personalidad.
                    </p>
                    <p className="section-text">
                        Para ello, ofrecemos una <strong>guía personalizada</strong> para que elijas un
                        armazón ideal acorde a tu rostro, personalidad y actividades, siempre de la mano
                        de esa <strong>vibra mexicana</strong>.
                    </p>
                </div>

                {/* Glasses Image 1 */}
                <div ref={image1Ref} className="floating-image image-1">
                    <Image
                        src="/about-glasses-1.jpg"
                        alt="Armazón Mexilux Premium"
                        width={500}
                        height={350}
                        style={{ objectFit: 'contain' }}
                    />
                </div>
            </section>

            {/* Vision Section */}
            <section className="content-section reverse">
                <div ref={visionRef} className="section-card vision-card">
                    <div className="section-icon">👁️</div>
                    <h2>Nuestra Visión</h2>
                    <p className="section-text">
                        Convertirnos en la <strong>marca referente que redefine el diseño nacional</strong>,
                        logrando que cada persona que use nuestros armazones a través de ella vea y sienta
                        a México como nosotros: con ese <strong>fuego, ingenio y calidez</strong> que nos caracteriza.
                    </p>
                    <p className="section-text">
                        Aspiramos a ser una empresa <strong>100% mexicana</strong> que inspire a las nuevas
                        generaciones a recuperar el orgullo por <em>"lo que está hecho en México está bien hecho"</em>,
                        demostrando que nuestras manos y nuestra cultura pueden crear
                        <strong> accesorios de calidad mundial</strong> que nos conectan con nuestras raíces.
                    </p>
                </div>

                {/* Glasses Image 2 */}
                <div ref={image2Ref} className="floating-image image-2">
                    <Image
                        src="/about-glasses-2.jpg"
                        alt="Armazón Mexilux Anti Blue Light"
                        width={600}
                        height={400}
                        style={{ objectFit: 'contain' }}
                    />
                </div>
            </section>

            {/* Story Section */}
            <section ref={storyRef} className="story-section">
                <div className="story-header">
                    <h2>Nuestra Historia</h2>
                    <p className="story-tagline">El Corazón detrás de la Marca</p>
                </div>

                <div className="story-content">
                    <p className="story-paragraph">
                        Todo comenzó <strong>lejos de casa</strong>. Nuestro fundador, its.coronado,
                        se encontraba en un viaje por Estados Unidos; y aunque la experiencia era
                        nueva y emocionante, la distancia hizo que algo dentro de él despertara:
                        una <strong>nostalgia profunda por México</strong>.
                    </p>

                    <p className="story-paragraph">
                        Extrañaba lo que solo nosotros entendemos: el <em>"buenos días"</em> de un
                        desconocido en la calle, la tiendita de la esquina y ese <strong>ingenio surrealista</strong>
                        donde puedes ver hasta un vocho en una azotea. Pero, sobre todo, se dio cuenta de
                        algo increíble: <strong>la fuerza del mexicano en el extranjero</strong>. Al encontrar
                        a otros paisanos luchando por oportunidades, entendió que el mexicano no solo trabaja,
                        sino que abraza y hace que cualquier lugar se sienta como hogar.
                    </p>

                    {/* Glasses Image 3 */}
                    <div ref={image3Ref} className="story-image">
                        <Image
                            src="/about-glasses-3.jpg"
                            alt="Armazón Mexilux Titanium"
                            width={700}
                            height={450}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>

                    <div className="story-highlight">
                        <h3>El momento que lo cambió todo</h3>
                    </div>

                    <p className="story-paragraph">
                        Estando allá, le tocó vivir Halloween, pero su mente y su corazón estaban en el
                        <strong> Día de Muertos</strong>. Mientras allá todo era disfraces impresionantes,
                        aquí en México el aire se sentía distinto; se sentía la nostalgia de recordar
                        a los que ya no están.
                    </p>

                    <p className="story-paragraph">
                        La chispa final surgió en un evento familiar. En medio de la celebración por
                        la unión de dos vidas, hubo un detalle que lo detuvo: un <strong>homenaje a los
                            que ya habían partido</strong>. Aunque no eran sus familiares directos, sintió
                        el nudo en la garganta y los ojos llorosos de los presentes. Ese momento de
                        <strong> conexión emocional</strong>, de honrar nuestras raíces y a nuestra gente,
                        fue el abrazo que necesitaba para entender su propósito.
                    </p>

                    <div className="story-conclusion">
                        <p>
                            <strong>Así nace esta marca.</strong> No solo para vender armazones, sino para
                            buscar proyectar esa visión y sentimiento: la calidez, el ingenio y el orgullo
                            de ser mexicanos. Queremos que lleves contigo ese <strong>"fuego"</strong> y esa
                            historia que nos hace únicos en el mundo.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <h2>Nuestros Valores</h2>
                <div className="values-grid">
                    <div className="value-card">
                        <span className="value-icon">🇲🇽</span>
                        <h3>Orgullo Mexicano</h3>
                        <p>Cada armazón lleva el espíritu de México: ingenio, calidez y pasión.</p>
                    </div>
                    <div className="value-card">
                        <span className="value-icon">✨</span>
                        <h3>Calidad Mundial</h3>
                        <p>Demostramos que lo hecho en México puede competir con cualquier marca global.</p>
                    </div>
                    <div className="value-card">
                        <span className="value-icon">🤝</span>
                        <h3>Guía Personalizada</h3>
                        <p>Te ayudamos a encontrar el armazón perfecto para tu rostro y personalidad.</p>
                    </div>
                    <div className="value-card">
                        <span className="value-icon">❤️</span>
                        <h3>Conexión con Raíces</h3>
                        <p>Inspiramos a nuevas generaciones a valorar nuestra cultura y tradiciones.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <h2>¿Listo para ver el mundo con ojos mexicanos?</h2>
                <p>Descubre nuestra colección y encuentra el armazón que expresa quién eres.</p>
                <div className="cta-buttons">
                    <Link href="/catalogo" className="cta-primary">
                        Explorar Colección
                    </Link>
                </div>
            </section>

            <style jsx>{`
                .nosotros-page {
                    background: #ffffff;
                    overflow-x: hidden;
                }

                /* Hero */
                .nosotros-hero {
                    position: relative;
                    height: 100vh;
                    min-height: 600px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .hero-bg {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%);
                }

                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 30% 50%, rgba(0, 113, 227, 0.15) 0%, transparent 60%);
                }

                .hero-content {
                    position: relative;
                    z-index: 10;
                    text-align: center;
                    padding: 2rem;
                }

                .hero-title {
                    font-size: clamp(3rem, 10vw, 7rem);
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0 0 1rem 0;
                    letter-spacing: -0.03em;
                }

                .hero-subtitle {
                    font-size: clamp(1.25rem, 3vw, 2rem);
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                    max-width: 600px;
                }

                /* Content Sections */
                .content-section {
                    position: relative;
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6rem 2rem;
                    gap: 4rem;
                }

                .content-section.reverse {
                    flex-direction: row-reverse;
                }

                .section-card {
                    max-width: 550px;
                    padding: 3rem;
                    background: #f5f5f7;
                    border-radius: 28px;
                    position: relative;
                    z-index: 5;
                }

                .section-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .section-card h2 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #1d1d1f;
                    margin: 0 0 1.5rem 0;
                }

                .section-text {
                    font-size: 1.125rem;
                    line-height: 1.7;
                    color: #6e6e73;
                    margin: 0 0 1rem 0;
                }

                .section-text strong {
                    color: #1d1d1f;
                }

                .floating-image {
                    position: relative;
                    will-change: transform;
                }

                .floating-image img {
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                }

                /* Story Section */
                .story-section {
                    padding: 8rem 2rem;
                    max-width: 900px;
                    margin: 0 auto;
                }

                .story-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }

                .story-header h2 {
                    font-size: 3rem;
                    font-weight: 700;
                    color: #1d1d1f;
                    margin: 0 0 0.5rem 0;
                }

                .story-tagline {
                    font-size: 1.5rem;
                    color: #0071e3;
                    margin: 0;
                    font-style: italic;
                }

                .story-content {
                    position: relative;
                }

                .story-paragraph {
                    font-size: 1.25rem;
                    line-height: 1.8;
                    color: #6e6e73;
                    margin-bottom: 2rem;
                    text-align: justify;
                }

                .story-paragraph strong {
                    color: #1d1d1f;
                }

                .story-paragraph em {
                    color: #0071e3;
                }

                .story-image {
                    margin: 4rem auto;
                    text-align: center;
                }

                .story-image img {
                    border-radius: 24px;
                    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.12);
                }

                .story-highlight {
                    text-align: center;
                    padding: 3rem 0;
                }

                .story-highlight h3 {
                    font-size: 2rem;
                    color: #1d1d1f;
                    margin: 0;
                    position: relative;
                    display: inline-block;
                }

                .story-highlight h3::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: #0071e3;
                    border-radius: 2px;
                }

                .story-conclusion {
                    background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%);
                    padding: 2.5rem;
                    border-radius: 20px;
                    border-left: 4px solid #0071e3;
                    margin-top: 3rem;
                }

                .story-conclusion p {
                    font-size: 1.25rem;
                    line-height: 1.8;
                    color: #1d1d1f;
                    margin: 0;
                }

                /* Values Section */
                .values-section {
                    padding: 8rem 2rem;
                    background: #f5f5f7;
                    text-align: center;
                }

                .values-section h2 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #1d1d1f;
                    margin: 0 0 3rem 0;
                }

                .values-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .value-card {
                    background: #ffffff;
                    padding: 2.5rem;
                    border-radius: 20px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                    transition: transform 0.3s, box-shadow 0.3s;
                }

                .value-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
                }

                .value-icon {
                    font-size: 3rem;
                    display: block;
                    margin-bottom: 1rem;
                }

                .value-card h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1d1d1f;
                    margin: 0 0 0.75rem 0;
                }

                .value-card p {
                    font-size: 1rem;
                    color: #6e6e73;
                    margin: 0;
                    line-height: 1.6;
                }

                /* CTA Section */
                .cta-section {
                    padding: 8rem 2rem;
                    text-align: center;
                    background: linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%);
                }

                .cta-section h2 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #1d1d1f;
                    margin: 0 0 1rem 0;
                }

                .cta-section p {
                    font-size: 1.25rem;
                    color: #6e6e73;
                    margin: 0 0 2.5rem 0;
                }

                .cta-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .cta-primary {
                    padding: 1rem 2.5rem;
                    background: #0071e3;
                    color: white;
                    border-radius: 980px;
                    font-size: 1.1rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.3s;
                }

                .cta-primary:hover {
                    background: #0077ed;
                    transform: scale(1.04);
                }

                .cta-secondary {
                    padding: 1rem 2.5rem;
                    background: transparent;
                    color: #0071e3;
                    border-radius: 980px;
                    font-size: 1.1rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.3s;
                }

                .cta-secondary:hover {
                    background: #f5f5f7;
                }

                @media (max-width: 900px) {
                    .content-section {
                        flex-direction: column !important;
                        padding: 4rem 1.5rem;
                    }

                    .floating-image {
                        order: -1;
                    }

                    .section-card {
                        padding: 2rem;
                    }

                    .story-paragraph {
                        text-align: left;
                    }
                }
            `}</style>
        </div>
    );
}
