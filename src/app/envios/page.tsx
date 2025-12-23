/**
 * PÁGINA DE ENVÍOS
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Información de Envíos | Mexilux',
    description: 'Conoce nuestras opciones de envío, tiempos de entrega y costos.',
};

const SHIPPING_OPTIONS = [
    {
        name: 'Envío Estándar',
        time: '3-5 días hábiles',
        price: '$99 MXN',
        freeAbove: '$1,500 MXN',
    },
    {
        name: 'Envío Express',
        time: '1-2 días hábiles',
        price: '$199 MXN',
        freeAbove: '$3,000 MXN',
    },
];

export default function EnviosPage() {
    return (
        <main className="legal-page">
            <div className="section-container">
                <header className="legal-header">
                    <h1>Información de Envíos</h1>
                    <p>Todo lo que necesitas saber sobre la entrega de tu pedido</p>
                </header>

                <div className="legal-content">
                    <section className="legal-section">
                        <h2>🚚 Opciones de Envío</h2>
                        <div className="guarantee-cards">
                            {SHIPPING_OPTIONS.map((option) => (
                                <div key={option.name} className="guarantee-card">
                                    <h3>{option.name}</h3>
                                    <p className="guarantee-duration">{option.time}</p>
                                    <ul>
                                        <li>Costo: {option.price}</li>
                                        <li>Gratis en compras +{option.freeAbove}</li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2>⏱️ Tiempos de Producción</h2>
                        <ul>
                            <li><strong>Solo armazón:</strong> Envío inmediato</li>
                            <li><strong>Lentes monofocales:</strong> 3-5 días de producción</li>
                            <li><strong>Lentes progresivos:</strong> 5-7 días de producción</li>
                            <li><strong>Lentes especiales:</strong> 7-10 días de producción</li>
                        </ul>
                        <p>Los tiempos de envío se suman después de la producción.</p>
                    </section>

                    <section className="legal-section">
                        <h2>📍 Cobertura</h2>
                        <p>Realizamos envíos a toda la República Mexicana a través de:</p>
                        <ul>
                            <li>DHL Express</li>
                            <li>FedEx</li>
                            <li>Estafeta</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>📦 Rastreo de Pedido</h2>
                        <p>Una vez enviado tu pedido, recibirás un correo con el número de guía para rastrear tu envío en tiempo real.</p>
                    </section>

                    <section className="legal-section contact-section">
                        <h2>¿Preguntas sobre tu envío?</h2>
                        <div className="contact-options">
                            <Link href="/contacto" className="contact-option">💬 Contáctanos</Link>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
