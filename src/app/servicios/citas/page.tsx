/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AGENDAR CITA (SITEMAP 3.2)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Agendar Cita | Mexilux',
    description: 'Agenda tu examen de la vista en línea. Elige el servicio, fecha y horario que más te convenga.',
};

const SERVICES_OPTIONS = [
    { id: 'examen-vista', name: 'Examen de la Vista', duration: '45 min', price: '$350' },
    { id: 'lentes-contacto', name: 'Adaptación Lentes de Contacto', duration: '30 min', price: '$500' },
    { id: 'examen-pediatrico', name: 'Examen Pediátrico', duration: '45 min', price: '$400' },
    { id: 'seguimiento', name: 'Cita de Seguimiento', duration: '20 min', price: '$200' },
];

const AVAILABLE_TIMES = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00',
];

export default function CitasPage() {
    return (
        <main className="booking-page">
            {/* Breadcrumb */}
            <nav className="breadcrumb" aria-label="Navegación">
                <Link href="/">Inicio</Link>
                <span className="breadcrumb-separator">/</span>
                <Link href="/servicios">Servicios</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">Agendar Cita</span>
            </nav>

            <div className="booking-container">
                <header className="booking-header">
                    <h1>Agenda tu cita</h1>
                    <p>Selecciona el servicio, fecha y horario que prefieras</p>
                </header>

                <div className="booking-content">
                    {/* Step 1: Select Service */}
                    <section className="booking-step">
                        <h2 className="step-title">
                            <span className="step-number">1</span>
                            Selecciona el servicio
                        </h2>
                        <div className="service-options">
                            {SERVICES_OPTIONS.map((service) => (
                                <label key={service.id} className="service-option-card">
                                    <input type="radio" name="service" value={service.id} />
                                    <div className="option-content">
                                        <strong>{service.name}</strong>
                                        <span className="option-details">
                                            {service.duration} • {service.price}
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
                        <div className="calendar-placeholder">
                            <p>📅 Calendario de selección de fecha</p>
                            <p className="text-muted">Próximas fechas disponibles: Esta semana</p>
                        </div>
                    </section>

                    {/* Step 3: Select Time */}
                    <section className="booking-step">
                        <h2 className="step-title">
                            <span className="step-number">3</span>
                            Selecciona la hora
                        </h2>
                        <div className="time-slots">
                            {AVAILABLE_TIMES.map((time) => (
                                <label key={time} className="time-slot">
                                    <input type="radio" name="time" value={time} />
                                    <span>{time}</span>
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
                        <div className="contact-form">
                            <div className="form-row">
                                <div className="form-field">
                                    <label htmlFor="name">Nombre completo</label>
                                    <input type="text" id="name" name="name" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-field">
                                    <label htmlFor="email">Correo electrónico</label>
                                    <input type="email" id="email" name="email" required />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="phone">Teléfono</label>
                                    <input type="tel" id="phone" name="phone" required />
                                </div>
                            </div>
                            <div className="form-field">
                                <label htmlFor="notes">Notas adicionales (opcional)</label>
                                <textarea id="notes" name="notes" rows={3}></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Summary and Submit */}
                    <section className="booking-summary">
                        <h3>Resumen de tu cita</h3>
                        <div className="summary-details">
                            <p><strong>Servicio:</strong> Selecciona un servicio</p>
                            <p><strong>Fecha:</strong> Selecciona una fecha</p>
                            <p><strong>Hora:</strong> Selecciona una hora</p>
                        </div>
                        <button className="btn btn-primary btn-lg btn-block">
                            Confirmar cita
                        </button>
                        <p className="booking-note">
                            Recibirás un correo de confirmación con los detalles de tu cita
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
