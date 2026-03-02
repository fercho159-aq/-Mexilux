/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVICIOS CLÍNICOS - PÁGINA PRINCIPAL (SITEMAP 3.0)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Servicios de Optometría | Mexilux',
    description: 'Descubre nuestros servicios clínicos: exámenes de la vista, adaptación de lentes de contacto y más. Optometristas certificados.',
};

const SvgEye = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
);
const SvgLens = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const SvgChild = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M12 8v4"/><path d="M9 12l3 8 3-8"/><path d="M8 14h8"/></svg>
);
const SvgTarget = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
);
const SvgCalendar = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);

const SERVICES = [
    {
        icon: <SvgEye />,
        title: 'Examen de la Vista Completo',
        description: 'Evaluación integral de tu salud visual con tecnología de última generación.',
        features: [
            'Refracción computarizada',
            'Topografía corneal',
            'Fondo de ojo',
            'Tonometría',
            'Campimetría',
        ],
        duration: '45-60 min',
        price: 'Desde $350',
        slug: 'examen-vista',
    },
    {
        icon: <SvgLens />,
        title: 'Lentes de Contacto',
        description: 'Adaptación profesional de lentes de contacto con seguimiento personalizado.',
        features: [
            'Evaluación de adaptabilidad',
            'Prueba sin compromiso',
            'Capacitación de uso y cuidado',
            'Seguimiento post-adaptación',
            'Todas las marcas premium',
        ],
        duration: '30-45 min',
        price: 'Desde $500',
        slug: 'lentes-contacto',
    },
    {
        icon: <SvgChild />,
        title: 'Examen Pediátrico',
        description: 'Evaluación visual especializada para niños con métodos adaptados a su edad.',
        features: [
            'Técnicas no invasivas',
            'Detección temprana de problemas',
            'Orientación a padres',
            'Ambiente amigable para niños',
        ],
        duration: '30-45 min',
        price: 'Desde $400',
        slug: 'examen-pediatrico',
    },
    {
        icon: <SvgTarget />,
        title: 'Control de Miopía',
        description: 'Programa especializado para frenar la progresión de la miopía en niños y jóvenes.',
        features: [
            'Ortoqueratología (Ortho-K)',
            'Lentes de control de miopía',
            'Seguimiento mensual',
            'Reportes de progreso',
        ],
        duration: 'Programa continuo',
        price: 'Consultar',
        slug: 'control-miopia',
    },
];

export default function ServiciosPage() {
    return (
        <main className="services-page">
            {/* Hero */}
            <section className="services-hero">
                <h1>Servicios de Salud Visual</h1>
                <p>Tu visión en manos de expertos certificados</p>
                <Link href="/servicios/citas" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <SvgCalendar /> Agendar mi cita
                </Link>
            </section>

            {/* Services Grid */}
            <section className="services-grid-section">
                <div className="section-container">
                    <div className="services-list">
                        {SERVICES.map((service) => (
                            <article key={service.slug} className="service-detail-card">
                                <div className="service-icon-large">{service.icon}</div>
                                <div className="service-content">
                                    <h2>{service.title}</h2>
                                    <p className="service-description">{service.description}</p>

                                    <ul className="service-features-list">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx}>✓ {feature}</li>
                                        ))}
                                    </ul>

                                    <div className="service-meta">
                                        <span className="meta-item">
                                            <strong>Duración:</strong> {service.duration}
                                        </span>
                                        <span className="meta-item">
                                            <strong>Precio:</strong> {service.price}
                                        </span>
                                    </div>

                                    <div className="service-actions">
                                        <Link href={`/servicios/${service.slug}`} className="btn btn-outline">
                                            Más información
                                        </Link>
                                        <Link href="/servicios/citas" className="btn btn-primary">
                                            Agendar cita
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="services-cta-section">
                <h2>¿Tienes dudas sobre qué servicio necesitas?</h2>
                <p>Contáctanos y te orientamos sin compromiso</p>
                <div className="cta-buttons">
                    <Link href="/servicios/citas" className="btn btn-primary btn-lg">
                        Agendar cita
                    </Link>
                    <Link href="/contacto" className="btn btn-secondary">
                        Contactar por WhatsApp
                    </Link>
                </div>
            </section>
        </main>
    );
}
