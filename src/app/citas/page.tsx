/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AGENDAR CITA - PÁGINA PRINCIPAL
 * ═══════════════════════════════════════════════════════════════════════════
 * Ruta directa: /citas
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Agendar Cita | Mexilux',
    description: 'Agenda tu examen de la vista con nuestros optometristas certificados. Selecciona fecha, hora y tipo de servicio en línea.',
};

const SERVICES_OPTIONS = [
    {
        id: 'examen-vista',
        name: 'Examen de la Vista',
        description: 'Evaluación completa de tu salud visual con equipo de última generación',
        duration: '45 min',
        price: '$350',
        icon: '👁️',
        popular: true,
    },
    {
        id: 'lentes-contacto',
        name: 'Adaptación Lentes de Contacto',
        description: 'Asesoría personalizada para encontrar el lente de contacto ideal para ti',
        duration: '30 min',
        price: '$500',
        icon: '🔘',
        popular: false,
    },
    {
        id: 'examen-pediatrico',
        name: 'Examen Pediátrico',
        description: 'Evaluación visual especializada para niños en un ambiente amigable',
        duration: '45 min',
        price: '$400',
        icon: '👶',
        popular: false,
    },
    {
        id: 'seguimiento',
        name: 'Cita de Seguimiento',
        description: 'Revisión de tu progreso y ajustes a tu tratamiento visual',
        duration: '20 min',
        price: '$200',
        icon: '📋',
        popular: false,
    },
];

const AVAILABLE_TIMES = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00',
];

const FEATURES = [
    { icon: '✓', text: 'Optometristas certificados' },
    { icon: '✓', text: 'Equipo de última generación' },
    { icon: '✓', text: 'Resultados en el momento' },
    { icon: '✓', text: 'Sin costo con compra de lentes' },
];

export default function CitasPage() {
    return (
        <main className="booking-page">
            {/* Breadcrumb */}
            <nav className="breadcrumb" aria-label="Navegación">
                <Link href="/">Inicio</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">Agendar Cita</span>
            </nav>

            <div className="booking-container">
                {/* Hero Section */}
                <header className="booking-header" style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                        Agenda tu Cita
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
                        Cuida tu salud visual con nuestros especialistas. Agenda en línea y recibe atención personalizada.
                    </p>

                    {/* Trust badges */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        marginTop: '1.5rem',
                        flexWrap: 'wrap',
                    }}>
                        {FEATURES.map((feature, idx) => (
                            <span key={idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#059669',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                            }}>
                                {feature.icon} {feature.text}
                            </span>
                        ))}
                    </div>
                </header>

                <div className="booking-content">
                    {/* Step 1: Select Service */}
                    <section className="booking-step">
                        <h2 className="step-title">
                            <span className="step-number">1</span>
                            Selecciona el servicio
                        </h2>
                        <div className="service-options" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '1rem',
                        }}>
                            {SERVICES_OPTIONS.map((service) => (
                                <label
                                    key={service.id}
                                    className="service-option-card"
                                    style={{
                                        position: 'relative',
                                        display: 'block',
                                        padding: '1.5rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {service.popular && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '1rem',
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            color: 'white',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                        }}>
                                            Más popular
                                        </span>
                                    )}
                                    <input type="radio" name="service" value={service.id} style={{
                                        position: 'absolute',
                                        opacity: 0,
                                    }} />
                                    <div className="option-content">
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            marginBottom: '0.5rem',
                                        }}>
                                            <span style={{ fontSize: '1.5rem' }}>{service.icon}</span>
                                            <strong style={{ fontSize: '1.125rem' }}>{service.name}</strong>
                                        </div>
                                        <p style={{
                                            fontSize: '0.875rem',
                                            color: '#6b7280',
                                            marginBottom: '0.75rem',
                                        }}>
                                            {service.description}
                                        </p>
                                        <span className="option-details" style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            color: '#374151',
                                            fontWeight: '500',
                                        }}>
                                            <span>⏱️ {service.duration}</span>
                                            <span style={{ color: '#059669' }}>{service.price}</span>
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Step 2: Select Date */}
                    <section className="booking-step">
                        <h2 className="step-title">
                            <span className="step-number">2</span>
                            Selecciona la fecha
                        </h2>
                        <div className="calendar-placeholder" style={{
                            background: '#f9fafb',
                            borderRadius: '12px',
                            padding: '2rem',
                            textAlign: 'center',
                        }}>
                            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</p>
                            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Calendario de selección</p>
                            <p className="text-muted" style={{ color: '#6b7280' }}>
                                Próximas fechas disponibles esta semana
                            </p>

                            {/* Quick date buttons */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                marginTop: '1.5rem',
                                flexWrap: 'wrap',
                            }}>
                                {['Hoy', 'Mañana', 'Lun 23', 'Mar 24', 'Mié 25'].map((day, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        style={{
                                            padding: '0.75rem 1.25rem',
                                            border: idx === 0 ? '2px solid #6366f1' : '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            background: idx === 0 ? '#eef2ff' : 'white',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            color: idx === 0 ? '#6366f1' : '#374151',
                                        }}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Step 3: Select Time */}
                    <section className="booking-step">
                        <h2 className="step-title">
                            <span className="step-number">3</span>
                            Selecciona la hora
                        </h2>
                        <div className="time-slots" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                            gap: '0.75rem',
                        }}>
                            {AVAILABLE_TIMES.map((time, idx) => (
                                <label
                                    key={time}
                                    className="time-slot"
                                    style={{
                                        display: 'block',
                                        padding: '1rem',
                                        textAlign: 'center',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        cursor: idx < 10 ? 'pointer' : 'not-allowed',
                                        opacity: idx < 10 ? 1 : 0.5,
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="time"
                                        value={time}
                                        disabled={idx >= 10}
                                        style={{
                                            position: 'absolute',
                                            opacity: 0,
                                        }}
                                    />
                                    <span style={{ fontWeight: '600' }}>{time}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Step 4: Contact Info */}
                    <section className="booking-step">
                        <h2 className="step-title">
                            <span className="step-number">4</span>
                            Tus datos
                        </h2>
                        <div className="contact-form" style={{
                            display: 'grid',
                            gap: '1.25rem',
                        }}>
                            <div className="form-field">
                                <label htmlFor="name" style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                }}>
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Juan Pérez García"
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                    }}
                                />
                            </div>
                            <div className="form-row" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1.25rem',
                            }}>
                                <div className="form-field">
                                    <label htmlFor="email" style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '500',
                                    }}>
                                        Correo electrónico *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        placeholder="tu@email.com"
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                        }}
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="phone" style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '500',
                                    }}>
                                        Teléfono *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        placeholder="(55) 1234-5678"
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="form-field">
                                <label htmlFor="notes" style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                }}>
                                    Notas adicionales (opcional)
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={3}
                                    placeholder="¿Tienes algún requerimiento especial o comentario?"
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        resize: 'vertical',
                                    }}
                                ></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Summary and Submit */}
                    <section className="booking-summary" style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        borderRadius: '16px',
                        padding: '2rem',
                        marginTop: '2rem',
                    }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                            Resumen de tu cita
                        </h3>
                        <div className="summary-details" style={{
                            display: 'grid',
                            gap: '0.75rem',
                            marginBottom: '1.5rem',
                        }}>
                            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6b7280' }}>Servicio:</span>
                                <strong>Selecciona un servicio</strong>
                            </p>
                            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6b7280' }}>Fecha:</span>
                                <strong>Selecciona una fecha</strong>
                            </p>
                            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6b7280' }}>Hora:</span>
                                <strong>Selecciona una hora</strong>
                            </p>
                            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0.5rem 0' }} />
                            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem' }}>
                                <span style={{ color: '#6b7280' }}>Total:</span>
                                <strong style={{ color: '#059669' }}>$350</strong>
                            </p>
                        </div>
                        <button
                            className="btn btn-primary btn-lg btn-block"
                            style={{
                                width: '100%',
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                        >
                            ✓ Confirmar cita
                        </button>
                        <p className="booking-note" style={{
                            textAlign: 'center',
                            marginTop: '1rem',
                            color: '#6b7280',
                            fontSize: '0.875rem',
                        }}>
                            Recibirás un correo de confirmación con los detalles de tu cita
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
