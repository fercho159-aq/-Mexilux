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

const SERVICES = [
    {
        icon: '👁️',
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
        icon: '🔬',
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
        icon: '👶',
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
        icon: '🎯',
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
                <Link href="/servicios/citas" className="btn btn-primary btn-lg">
                    📅 Agendar mi cita
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
