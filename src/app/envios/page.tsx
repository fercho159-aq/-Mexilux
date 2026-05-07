/**
 * PÁGINA DE ENVÍOS - Con humor mexicano
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { Truck, Wind, Glasses, Sparkles, Gift, Zap, MapPin, Eye, HelpCircle, MessageCircle, Package, Banknote } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Información de Envíos | Mexilux',
    description: 'Conoce nuestras opciones de envío y tiempos de entrega. ¡Ya vamos en camino!',
};

export default function EnviosPage() {
    return (
        <main className="legal-page">
            <div className="section-container">
                <header className="legal-header">
                    <h1><Truck className="inline-block" size={28} /> ¿Para cuándo me llegan?</h1>
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
                        <div style={{ margin: '0', display: 'flex', justifyContent: 'center' }}><Wind size={48} /></div>
                        <h2 style={{ margin: '1rem 0 0.5rem' }}>
                            &quot;Ya voy, es que hay mucho tráfico&quot;
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                            Tranquilo, no somos como tu cuate que siempre llega tarde.
                            Tus lentes llegan en tiempo y forma.
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2><Package className="inline-block" size={22} /> Tiempos de entrega</h2>
                        <div className="guarantee-cards">
                            <div className="guarantee-card">
                                <div style={{ margin: '0', display: 'flex', justifyContent: 'center' }}><Glasses size={40} /></div>
                                <h3>Solo armazón</h3>
                                <p className="guarantee-duration" style={{ color: 'var(--color-success)' }}>
                                    5-7 días hábiles
                                </p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    Calidad que vale la espera
                                </p>
                            </div>
                            <div className="guarantee-card">
                                <div style={{ margin: '0', display: 'flex', justifyContent: 'center' }}><Sparkles size={40} /></div>
                                <h3>Con lentes graduados</h3>
                                <p className="guarantee-duration" style={{ color: 'var(--color-primary)' }}>
                                    7-10 días hábiles
                                </p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    La perfección toma su tiempo, como un buen mole
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2><Banknote className="inline-block" size={22} /> Costo de envío</h2>

                        {/* Envío gratis destacado */}
                        <div style={{
                            background: 'linear-gradient(135deg, #006847 0%, #2e7d32 50%, #ce1126 100%)',
                            color: 'white',
                            padding: '2.5rem',
                            borderRadius: '20px',
                            textAlign: 'center',
                            marginBottom: '2rem',
                            boxShadow: '0 10px 40px rgba(0, 104, 71, 0.3)'
                        }}>
                            <div style={{ margin: '0', display: 'flex', justifyContent: 'center' }}><Gift size={56} color="white" /></div>
                            <p style={{ fontSize: '2rem', margin: '0.5rem 0', fontWeight: '800' }}>
                                ¡ENVÍO GRATIS!
                            </p>
                            <p style={{ fontSize: '1.25rem', margin: '0', opacity: 0.95 }}>
                                En compras mayores a <strong>$1,300 MXN</strong>
                            </p>
                            <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 0', opacity: 0.8 }}>
                                Porque queremos que tu dinero se quede en tus bolsillos
                            </p>
                        </div>

                        {/* Opciones de envío en tarjetas bonitas */}
                        <div className="guarantee-cards">
                            <div className="guarantee-card" style={{
                                border: '2px solid var(--color-border)',
                                background: 'var(--color-bg)'
                            }}>
                                <div style={{ margin: '0', display: 'flex', justifyContent: 'center' }}><Truck size={40} /></div>
                                <h3>Envío Estándar</h3>
                                <p style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: 'var(--color-primary)',
                                    margin: '0.5rem 0'
                                }}>
                                    $99 MXN
                                </p>
                                <p className="guarantee-duration" style={{ color: 'var(--color-text-secondary)' }}>
                                    5-7 días hábiles
                                </p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                    Tranquilo y seguro
                                </p>
                            </div>
                            <div className="guarantee-card" style={{
                                border: '2px solid var(--color-primary)',
                                background: 'linear-gradient(145deg, var(--color-bg) 0%, var(--color-primary-bg) 100%)'
                            }}>
                                <div style={{ margin: '0', display: 'flex', justifyContent: 'center' }}><Zap size={40} /></div>
                                <h3>Envío Express</h3>
                                <p style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: 'var(--color-primary)',
                                    margin: '0.5rem 0'
                                }}>
                                    $199 MXN
                                </p>
                                <p className="guarantee-duration" style={{ color: 'var(--color-success)' }}>
                                    3-5 días hábiles
                                </p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                    Pa&apos; los que no aguantan las ganas
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2><MapPin className="inline-block" size={22} /> Cobertura</h2>
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            background: 'var(--color-bg-secondary)',
                            borderRadius: '16px'
                        }}>
                            <p style={{ fontSize: '6rem', margin: '0', lineHeight: 1 }}><MapPin size={80} /></p>
                            <h3 style={{ margin: '1rem 0 0.5rem', fontSize: '1.5rem' }}>
                                Toda la República Mexicana
                            </h3>
                            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                                Desde Tijuana hasta Cancún, y todo lo que hay en medio
                            </p>
                        </div>
                    </section>

                    <section className="legal-section" style={{
                        background: 'var(--color-bg-secondary)',
                        padding: '2rem',
                        borderRadius: '16px',
                        textAlign: 'center'
                    }}>
                        <div style={{ margin: '0', display: 'flex', justifyContent: 'center' }}><Eye size={56} /></div>
                        <h2 style={{ margin: '1rem 0 0.5rem', fontSize: '1.75rem' }}>
                            Tóxico
                        </h2>
                        <p style={{
                            color: 'var(--color-text-secondary)',
                            maxWidth: '400px',
                            margin: '0 auto',
                            fontSize: '1rem'
                        }}>
                            Te mandamos tu número de guía para que puedas stalkear tu paquete
                        </p>
                    </section>

                    <section className="legal-section contact-section" style={{
                        background: 'var(--color-bg-secondary)',
                        padding: '2rem',
                        borderRadius: '16px',
                        textAlign: 'center'
                    }}>
                        <h2>¿Dudas sobre tu envío? <HelpCircle className="inline-block" size={22} /></h2>
                        <p style={{
                            marginBottom: '0.5rem',
                            fontStyle: 'italic',
                            fontSize: '1.1rem'
                        }}>
                            &quot;La única diferencia entre un pend#%* y un inteligente es que uno se quedó con la duda&quot;
                        </p>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'var(--color-text-muted)',
                            marginBottom: '1.5rem'
                        }}>
                            — Mi abuelo, 2020 (che viejo sabio)
                        </p>
                        <div className="contact-options">
                            <Link href="/contacto" className="btn btn-primary">
                                <MessageCircle className="inline-block" size={16} /> Escríbenos
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
