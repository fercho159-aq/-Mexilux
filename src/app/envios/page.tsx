/**
 * PÁGINA DE ENVÍOS - Con humor mexicano 🇲🇽
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Información de Envíos | Mexilux',
    description: 'Conoce nuestras opciones de envío y tiempos de entrega. ¡Ya vamos en camino!',
};

export default function EnviosPage() {
    return (
        <main className="legal-page">
            <div className="section-container">
                <header className="legal-header">
                    <h1>🚚 ¿Para cuándo me llegan?</h1>
                    <p style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
                        En <strong>5 a 7 días</strong> los tienes en tu puerta
                    </p>
                </header>

                <div className="legal-content">
                    {/* Sección principal con humor */}
                    <section className="legal-section" style={{ 
                        background: 'var(--color-bg-secondary)', 
                        padding: '2rem', 
                        borderRadius: '16px',
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}>
                        <p style={{ fontSize: '3rem', margin: '0' }}>🏃‍♂️💨</p>
                        <h2 style={{ margin: '1rem 0 0.5rem' }}>
                            &quot;Ya voy, es que hay mucho tráfico&quot;
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                            Tranquilo, no somos como tu cuate que siempre llega tarde. 
                            Tus lentes llegan en tiempo y forma.
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2>📦 Tiempos de entrega</h2>
                        <div className="guarantee-cards">
                            <div className="guarantee-card">
                                <p style={{ fontSize: '2.5rem', margin: '0' }}>📍</p>
                                <h3>Solo armazón</h3>
                                <p className="guarantee-duration" style={{ color: 'var(--color-success)' }}>
                                    1-3 días hábiles
                                </p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    Más rápido que encontrar estacionamiento en el centro
                                </p>
                            </div>
                            <div className="guarantee-card">
                                <p style={{ fontSize: '2.5rem', margin: '0' }}>👓</p>
                                <h3>Con lentes graduados</h3>
                                <p className="guarantee-duration" style={{ color: 'var(--color-primary)' }}>
                                    5-7 días hábiles
                                </p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    &quot;Como buen mexicano, lo enviamos el último día... 
                                    <br />pero siempre a tiempo&quot; 😉
                                </p>
                            </div>
                            <div className="guarantee-card">
                                <p style={{ fontSize: '2.5rem', margin: '0' }}>✨</p>
                                <h3>Lentes especiales</h3>
                                <p className="guarantee-duration" style={{ color: 'var(--color-warning)' }}>
                                    7-10 días hábiles
                                </p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    La perfección toma su tiempo, como un buen mole
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2>💸 Costo de envío</h2>
                        <div style={{ 
                            background: 'linear-gradient(135deg, var(--color-success) 0%, #2e7d32 100%)',
                            color: 'white',
                            padding: '2rem',
                            borderRadius: '16px',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '1.5rem', margin: '0 0 0.5rem', fontWeight: '700' }}>
                                ¡ENVÍO GRATIS! 🎉
                            </p>
                            <p style={{ margin: '0', opacity: 0.9 }}>
                                En todas las compras mayores a $1,500 MXN
                            </p>
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                            <ul>
                                <li><strong>Envío estándar:</strong> $99 MXN (3-5 días)</li>
                                <li><strong>Envío express:</strong> $199 MXN (1-2 días) - Para los que no aguantan las ganas</li>
                            </ul>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2>📍 Cobertura</h2>
                        <p>Llegamos a toda la República Mexicana. Desde Tijuana hasta Cancún, y todo lo que hay en medio.</p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                            <span style={{ 
                                padding: '0.5rem 1rem', 
                                background: 'var(--color-bg-secondary)', 
                                borderRadius: '20px',
                                fontSize: '0.9rem'
                            }}>📦 DHL Express</span>
                            <span style={{ 
                                padding: '0.5rem 1rem', 
                                background: 'var(--color-bg-secondary)', 
                                borderRadius: '20px',
                                fontSize: '0.9rem'
                            }}>📦 FedEx</span>
                            <span style={{ 
                                padding: '0.5rem 1rem', 
                                background: 'var(--color-bg-secondary)', 
                                borderRadius: '20px',
                                fontSize: '0.9rem'
                            }}>📦 Estafeta</span>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2>📱 Rastreo en tiempo real</h2>
                        <p>
                            Te mandamos tu número de guía por WhatsApp y correo para que 
                            puedas stalkear tu paquete como si fuera tu ex. 👀
                        </p>
                        <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', marginTop: '1rem' }}>
                            (También funciona para saber exactamente cuándo llega el repartidor 
                            y no bajarte en pijama)
                        </p>
                    </section>

                    <section className="legal-section contact-section" style={{
                        background: 'var(--color-bg-secondary)',
                        padding: '2rem',
                        borderRadius: '16px',
                        textAlign: 'center'
                    }}>
                        <h2>¿Dudas sobre tu envío? 🤔</h2>
                        <p style={{ marginBottom: '1.5rem' }}>
                            No te quedes con la duda, pregunta lo que quieras
                        </p>
                        <div className="contact-options">
                            <Link href="/contacto" className="btn btn-primary">
                                💬 Escríbenos
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
