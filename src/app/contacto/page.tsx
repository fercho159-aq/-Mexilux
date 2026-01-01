/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PÁGINA DE CONTACTO
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contacto | Mexilux',
    description: 'Contáctanos por WhatsApp, teléfono o correo electrónico. Estamos aquí para ayudarte con tus lentes y servicios visuales.',
};

const CONTACT_METHODS = [
    {
        icon: '💬',
        title: 'WhatsApp',
        description: 'Respuesta inmediata',
        value: '+52 55 1234 5678',
        link: 'https://wa.me/5215512345678',
        action: 'Chatear ahora',
        highlighted: true,
    },
    {
        icon: '✉️',
        title: 'Correo electrónico',
        description: 'Respuesta en 24 horas',
        value: 'hola@mexilux.com',
        link: 'mailto:hola@mexilux.com',
        action: 'Enviar correo',
        highlighted: false,
    },
];



const FAQ_QUICK = [
    {
        q: '¿Cuánto tardan mis lentes graduados?',
        a: 'Los lentes graduados tardan de 5 a 7 días hábiles en estar listos.',
    },
    {
        q: '¿Aceptan mi receta de otro optometrista?',
        a: 'Sí, aceptamos recetas de cualquier optometrista certificado siempre que esté vigente.',
    },
    {
        q: '¿Tienen garantía en sus productos?',
        a: 'Sí, todos nuestros productos incluyen garantía de 1 año contra defectos de fabricación.',
    },
];

export default function ContactoPage() {
    return (
        <main className="contact-page">
            {/* Header */}
            <header className="contact-hero">
                <p style={{ fontStyle: 'italic', fontSize: '1.1rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                    &quot;La única diferencia entre un pend#%* y un inteligente es que uno se quedó con la duda&quot;
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                    — Mi abuelo, 2020 (che viejo sabio)
                </p>
                <h1>¿En qué podemos ayudarte?</h1>
                <p>Estamos aquí para ti. Elige el canal que prefieras</p>
            </header>

            <div className="section-container">
                {/* Contact methods */}
                <section className="contact-methods">
                    {CONTACT_METHODS.map((method) => (
                        <a
                            key={method.title}
                            href={method.link}
                            className={`contact-card ${method.highlighted ? 'highlighted' : ''}`}
                            target={method.link.startsWith('http') ? '_blank' : undefined}
                            rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                            <span className="contact-icon">{method.icon}</span>
                            <div className="contact-info">
                                <h2>{method.title}</h2>
                                <p className="contact-value">{method.value}</p>
                                <p className="contact-description">{method.description}</p>
                            </div>
                            <span className="contact-action btn btn-sm">
                                {method.action} →
                            </span>
                        </a>
                    ))}
                </section>

                {/* Contact form */}
                <section className="contact-form-section">
                    <h2>Envíanos un mensaje</h2>
                    <p>Completa el formulario y te responderemos a la brevedad</p>

                    <form className="contact-form">
                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="name">Nombre completo *</label>
                                <input type="text" id="name" name="name" required />
                            </div>
                            <div className="form-field">
                                <label htmlFor="email">Correo electrónico *</label>
                                <input type="email" id="email" name="email" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="phone">Teléfono</label>
                                <input type="tel" id="phone" name="phone" />
                            </div>
                            <div className="form-field">
                                <label htmlFor="subject">Asunto *</label>
                                <select id="subject" name="subject" required>
                                    <option value="">Selecciona una opción</option>
                                    <option value="productos">Consulta sobre productos</option>
                                    <option value="pedido">Seguimiento de pedido</option>
                                    <option value="cita">Agendar cita</option>
                                    <option value="devolucion">Devolución o garantía</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-field">
                            <label htmlFor="message">Mensaje *</label>
                            <textarea id="message" name="message" rows={5} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg">
                            Enviar mensaje
                        </button>
                    </form>
                </section>



                {/* Quick FAQ */}
                <section className="quick-faq">
                    <h2>Preguntas frecuentes</h2>
                    <div className="faq-list">
                        {FAQ_QUICK.map((faq, idx) => (
                            <details key={idx} className="faq-item">
                                <summary>{faq.q}</summary>
                                <p>{faq.a}</p>
                            </details>
                        ))}
                    </div>
                    <Link href="/legal/faq" className="btn btn-outline">
                        Ver todas las preguntas →
                    </Link>
                </section>
            </div>
        </main>
    );
}
