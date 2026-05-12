/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GARANTÍA Y DEVOLUCIONES (SITEMAP 5.1)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { Shield, Undo2, ClipboardList, CreditCard, MessageCircle, Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Garantía y Devoluciones | Mexilux',
    description: 'Conoce nuestra política de garantía y proceso de devoluciones. 30 días para devolución sin preguntas.',
};

export default function GarantiaPage() {
    return (
        <main className="legal-page">
            <div className="section-container">
                <header className="legal-header">
                    <h1>Garantía y Devoluciones</h1>
                    <p className="legal-updated">Última actualización: Diciembre 2024</p>
                </header>

                <div className="legal-content">
                    <section className="legal-section">
                        <h2><Shield className="inline-block" size={20} /> Nuestra Garantía</h2>
                        <p>
                            En Mexilux respaldamos la calidad de todos nuestros productos. Ofrecemos una garantía
                            completa que cubre defectos de fabricación y asegura tu satisfacción.
                        </p>

                        <div className="guarantee-cards">
                            <div className="guarantee-card">
                                <h3>Monturas</h3>
                                <p className="guarantee-duration">1 año de garantía</p>
                                <ul>
                                    <li>Defectos de fabricación</li>
                                    <li>Problemas en bisagras</li>
                                    <li>Desprendimiento de pintura</li>
                                    <li>Deformaciones del material</li>
                                </ul>
                            </div>

                            <div className="guarantee-card">
                                <h3>Lentes Graduados</h3>
                                <p className="guarantee-duration">6 meses de garantía</p>
                                <ul>
                                    <li>Defectos en el material</li>
                                    <li>Desprendimiento de tratamientos</li>
                                    <li>Errores de graduación (primeros 60 días)</li>
                                </ul>
                            </div>

                            <div className="guarantee-card">
                                <h3>Lentes de Contacto</h3>
                                <p className="guarantee-duration">Sellado de fábrica</p>
                                <ul>
                                    <li>Defectos visibles al recibir</li>
                                    <li>Empaques dañados o abiertos</li>
                                    <li>Error en la graduación recibida</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2><Undo2 className="inline-block" size={20} /> Política de Devoluciones</h2>

                        <div className="info-box highlight">
                            <h3>30 Días para Devolución</h3>
                            <p>
                                Tienes 30 días naturales desde la recepción de tu pedido para solicitar
                                una devolución, sin preguntas ni explicaciones.
                            </p>
                        </div>

                        <h3>Condiciones para Devolución</h3>
                        <ul className="conditions-list">
                            <li>✓ El producto debe estar en condiciones originales</li>
                            <li>✓ Debe incluir su empaque y accesorios originales</li>
                            <li>✓ No debe presentar signos de uso prolongado</li>
                            <li>✓ Incluir comprobante de compra o número de pedido</li>
                        </ul>

                        <h3>Excepciones</h3>
                        <ul className="exceptions-list">
                            <li>✗ Lentes graduados personalizados (después de 30 días)</li>
                            <li>✗ Lentes de contacto con empaque abierto</li>
                            <li>✗ Productos con daño intencional o mal uso</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><ClipboardList className="inline-block" size={20} /> Proceso de Devolución</h2>

                        <ol className="process-steps">
                            <li>
                                <strong>Solicita tu devolución</strong>
                                <p>Contacta a nuestro equipo por WhatsApp o correo electrónico con tu número de pedido.</p>
                            </li>
                            <li>
                                <strong>Recibe tu guía de envío</strong>
                                <p>Te enviaremos una guía prepagada para que regreses el producto sin costo.</p>
                            </li>
                            <li>
                                <strong>Empaca y envía</strong>
                                <p>Protege bien el producto y entrégalo en cualquier sucursal de la paquetería.</p>
                            </li>
                            <li>
                                <strong>Recibe tu reembolso</strong>
                                <p>Procesamos tu reembolso en 5-10 días hábiles después de recibir el producto.</p>
                            </li>
                        </ol>
                    </section>

                    <section className="legal-section">
                        <h2><CreditCard className="inline-block" size={20} /> Método de Reembolso</h2>
                        <p>
                            El reembolso se realizará al mismo método de pago original:
                        </p>
                        <ul>
                            <li><strong>Tarjeta de crédito/débito:</strong> 5-10 días hábiles</li>
                            <li><strong>PayPal:</strong> 3-5 días hábiles</li>
                            <li><strong>Transferencia bancaria:</strong> Hasta 7 días hábiles</li>
                        </ul>
                    </section>

                    <section className="legal-section contact-section">
                        <h2>¿Necesitas ayuda?</h2>
                        <p>Nuestro equipo está listo para asistirte:</p>
                        <div className="contact-options">
                            <Link href="/contacto" className="contact-option">
                                <MessageCircle className="inline-block" size={16} /> WhatsApp: (55) 1234-5678
                            </Link>
                            <a href="mailto:soporte@mexilux.com" className="contact-option">
                                <Mail className="inline-block" size={16} /> soporte@mexilux.com
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
