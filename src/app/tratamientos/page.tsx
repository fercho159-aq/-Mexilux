/**
 * TRATAMIENTOS DE LENTES - Página de tratamientos disponibles
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tratamientos para Lentes | Mexilux',
    description: 'Conoce nuestros tratamientos para lentes: Blue Ray, Polarizado, Fotocromático, Antirreflejante y más. Protege tu visión con Mexilux.',
};

const TREATMENTS = [
    {
        id: 'blueray',
        name: 'Filtro de Luz Azul',
        shortName: 'Blue Ray',
        description: 'Protege tus ojos de la luz azul dañina emitida por pantallas digitales. Ideal para quienes pasan muchas horas frente a computadoras, tablets o celulares.',
        benefits: [
            'Reduce la fatiga visual digital',
            'Mejora la calidad del sueño',
            'Protección continua para uso de pantallas',
            'Ideal para trabajo de oficina y gamers',
        ],
        price: 450,
        color: '#1a73e8',
        iconSvg: (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="14" fill="#1a73e810" />
                <circle cx="24" cy="24" r="10" stroke="#1a73e8" strokeWidth="2" fill="#1a73e820" />
                <path d="M24 14v20M14 24h20" stroke="#1a73e8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <circle cx="24" cy="24" r="4" fill="#1a73e8" opacity="0.3" />
            </svg>
        ),
    },
    {
        id: 'polarizado',
        name: 'Polarizado',
        shortName: 'Polarizado',
        description: 'Elimina reflejos molestos del agua, nieve y superficies brillantes. La mejor opción para conducir y actividades al aire libre.',
        benefits: [
            'Ideal para conducir con seguridad',
            'Perfecto para deportes acuáticos',
            'Reduce la fatiga visual en exteriores',
            'Colores más vibrantes y naturales',
        ],
        price: 1200,
        color: '#2d2d2d',
        iconSvg: (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="14" fill="#2d2d2d10" />
                <ellipse cx="24" cy="24" rx="14" ry="8" stroke="#2d2d2d" strokeWidth="2" fill="#2d2d2d10" />
                <path d="M10 24h28" stroke="#2d2d2d" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
                <circle cx="24" cy="24" r="3" fill="#2d2d2d" opacity="0.4" />
            </svg>
        ),
    },
    {
        id: 'fotocromatico',
        name: 'Fotocromático (Transitions)',
        shortName: 'Transitions',
        description: 'Lentes inteligentes que se oscurecen automáticamente con la luz solar y se aclaran en interiores. Dos lentes en uno.',
        benefits: [
            'Adaptación automática a la luz',
            '100% protección UV garantizada',
            'Comodidad en interiores y exteriores',
            'Sin necesidad de cambiar de lentes',
        ],
        price: 1800,
        color: '#6b4c9a',
        iconSvg: (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="14" fill="#6b4c9a10" />
                <circle cx="24" cy="24" r="10" stroke="#6b4c9a" strokeWidth="2" />
                <path d="M24 14a10 10 0 010 20" fill="#6b4c9a" opacity="0.3" />
                <path d="M20 18l8 12M28 18l-8 12" stroke="#6b4c9a" strokeWidth="1" opacity="0.3" />
            </svg>
        ),
    },
    {
        id: 'antirreflejante',
        name: 'Antirreflejante Premium',
        shortName: 'AR Premium',
        description: 'Elimina reflejos de tus lentes para una visión más clara y natural. Mejora tu apariencia en fotos y videollamadas.',
        benefits: [
            'Reduce la fatiga visual significativamente',
            'Mejor apariencia en fotos y video',
            'Visión nocturna más clara al conducir',
            'Fácil de limpiar y mantener',
        ],
        price: 350,
        color: '#00a67d',
        iconSvg: (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="14" fill="#00a67d10" />
                <circle cx="24" cy="24" r="10" stroke="#00a67d" strokeWidth="2" fill="none" />
                <path d="M18 24c2-3 4-4 6-4s4 1 6 4" stroke="#00a67d" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <circle cx="24" cy="22" r="2" fill="#00a67d" opacity="0.4" />
            </svg>
        ),
    },
    {
        id: 'tinte',
        name: 'Tintes de Color',
        shortName: 'Tintes',
        description: 'Personaliza tus lentes con tintes de color para un estilo único. Disponible en múltiples tonalidades para combinar con cualquier outfit.',
        benefits: [
            'Personalización total del estilo',
            'Múltiples tonalidades disponibles',
            'Protección solar adicional',
            'Ideal para sol y moda',
        ],
        price: 300,
        color: '#e91e63',
        iconSvg: (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="14" fill="#e91e6310" />
                <circle cx="20" cy="22" r="6" fill="#e91e6320" stroke="#e91e63" strokeWidth="1.5" />
                <circle cx="28" cy="22" r="6" fill="#6b4c9a20" stroke="#6b4c9a" strokeWidth="1.5" />
                <circle cx="24" cy="28" r="6" fill="#1a73e820" stroke="#1a73e8" strokeWidth="1.5" />
            </svg>
        ),
    },
    {
        id: 'antirayado',
        name: 'Anti-Rayado Premium',
        shortName: 'Anti-Rayado',
        description: 'Capa extra de protección que mantiene tus lentes libres de rayones por más tiempo. Mayor durabilidad para uso diario intensivo.',
        benefits: [
            'Mayor durabilidad de tus lentes',
            'Garantía extendida incluida',
            'Ideal para uso diario intensivo',
            'Protección contra rayones accidentales',
        ],
        price: 200,
        color: '#f59e0b',
        iconSvg: (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="14" fill="#f59e0b10" />
                <path d="M16 32l16-16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <path d="M32 16l-4 1 3 3 1-4z" fill="#f59e0b" opacity="0.6" />
                <circle cx="24" cy="24" r="8" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
            </svg>
        ),
    },
    {
        id: 'hidrofobico',
        name: 'Hidrofóbico + Oleofóbico',
        shortName: 'Hidrofóbico',
        description: 'Tratamiento que repele agua, grasa y manchas de dedos. Tus lentes siempre limpios con mínimo esfuerzo.',
        benefits: [
            'Limpieza ultra fácil',
            'Repele agua de lluvia al instante',
            'Menos manchas de dedos',
            'Ideal para climas húmedos',
        ],
        price: 250,
        color: '#0ea5e9',
        iconSvg: (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="14" fill="#0ea5e910" />
                <path d="M24 16c-4 6-6 9-6 12a6 6 0 0012 0c0-3-2-6-6-12z" stroke="#0ea5e9" strokeWidth="2" fill="#0ea5e920" />
                <path d="M22 26a2 2 0 012-2" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
        ),
    },
];

const formatPrice = (price: number) => `$${price.toLocaleString('es-MX')}`;

export default function TratamientosPage() {
    return (
        <main style={{ paddingTop: '1.5rem', minHeight: '100vh', background: '#fafbfc' }}>
            {/* Hero */}
            <section style={{
                textAlign: 'center',
                padding: '4rem 1.5rem 3rem',
                background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)',
            }}>
                <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontWeight: 800,
                    color: '#152132',
                    marginBottom: '1rem',
                    letterSpacing: '-0.03em',
                }}>
                    Tratamientos para Lentes
                </h1>
                <p style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                    color: '#64748b',
                    maxWidth: '600px',
                    margin: '0 auto 2rem',
                    lineHeight: 1.6,
                }}>
                    Protege y mejora tu visión con nuestros tratamientos especializados.
                    Combina varios para obtener la protección completa.
                </p>
                <Link
                    href="/catalogo"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.875rem 2rem',
                        background: 'linear-gradient(135deg, #152132 0%, #1e293b 100%)',
                        color: 'white',
                        borderRadius: '100px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                >
                    Explorar lentes
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </Link>
            </section>

            {/* Treatments Grid */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {TREATMENTS.map((treatment) => (
                        <article
                            key={treatment.id}
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                padding: '2rem',
                                border: `1.5px solid ${treatment.color}15`,
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            }}
                        >
                            {/* Icon + Header */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                                    {treatment.iconSvg}
                                </div>
                                <div>
                                    <h2 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 700,
                                        color: '#152132',
                                        margin: 0,
                                        lineHeight: 1.3,
                                    }}>
                                        {treatment.name}
                                    </h2>
                                    <span style={{
                                        display: 'inline-block',
                                        marginTop: '0.375rem',
                                        fontSize: '0.8125rem',
                                        fontWeight: 700,
                                        color: treatment.color,
                                        background: `${treatment.color}10`,
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '100px',
                                    }}>
                                        Desde {formatPrice(treatment.price)}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p style={{
                                fontSize: '0.9375rem',
                                color: '#475569',
                                lineHeight: 1.6,
                                margin: '0 0 1.25rem',
                            }}>
                                {treatment.description}
                            </p>

                            {/* Benefits */}
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                            }}>
                                {treatment.benefits.map((benefit, idx) => (
                                    <li key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.8125rem',
                                        color: '#64748b',
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={treatment.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                background: 'linear-gradient(135deg, #152132 0%, #1e293b 100%)',
                color: 'white',
            }}>
                <h2 style={{
                    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                    fontWeight: 800,
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em',
                }}>
                    Combina tratamientos para la protección perfecta
                </h2>
                <p style={{
                    fontSize: '1rem',
                    opacity: 0.7,
                    maxWidth: '500px',
                    margin: '0 auto 2rem',
                    lineHeight: 1.6,
                }}>
                    Elige tus lentes favoritos y agrega los tratamientos que necesites
                    directamente en el configurador
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link
                        href="/catalogo"
                        style={{
                            padding: '0.875rem 2rem',
                            background: 'white',
                            color: '#152132',
                            borderRadius: '100px',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                        }}
                    >
                        Ver catálogo
                    </Link>
                    <Link
                        href="/contacto"
                        style={{
                            padding: '0.875rem 2rem',
                            background: 'transparent',
                            color: 'white',
                            borderRadius: '100px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            border: '1.5px solid rgba(255,255,255,0.3)',
                        }}
                    >
                        Solicitar asesoría
                    </Link>
                </div>
            </section>
        </main>
    );
}
