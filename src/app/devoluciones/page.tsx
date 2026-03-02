/**
 * PÁGINA DE DEVOLUCIONES
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { MessageCircle, Mail, ClipboardList } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Devoluciones | Mexilux',
    description: 'Proceso de devolución de productos en Mexilux. 30 días para devolver.',
};

export default function DevolucionesPage() {
    return (
        <main className="legal-page">
            <div className="section-container">
                <header className="legal-header">
                    <h1>Política de Devoluciones</h1>
                    <p>Tu satisfacción es nuestra prioridad</p>
                </header>

                <div className="legal-content">
                    <div className="info-box highlight">
                        <h3>30 Días para Devolución</h3>
                        <p>Tienes 30 días naturales desde la recepción para solicitar una devolución sin preguntas.</p>
                    </div>

                    <section className="legal-section">
                        <h2>✓ Condiciones</h2>
                        <ul className="conditions-list">
                            <li>✓ El producto debe estar en condiciones originales</li>
                            <li>✓ Incluir empaque y accesorios originales</li>
                            <li>✓ No presentar signos de uso prolongado</li>
                            <li>✓ Incluir comprobante de compra</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>✗ Excepciones</h2>
                        <ul className="exceptions-list">
                            <li>✗ Lentes graduados personalizados (después de 30 días)</li>
                            <li>✗ Lentes de contacto con empaque abierto</li>
                            <li>✗ Productos con daño intencional</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2><ClipboardList className="inline-block" size={20} /> Proceso</h2>
                        <ol className="process-steps">
                            <li><strong>Solicita:</strong> Escríbenos con tu número de pedido</li>
                            <li><strong>Recibe guía:</strong> Te enviamos etiqueta de envío gratis</li>
                            <li><strong>Envía:</strong> Entrega en cualquier sucursal de paquetería</li>
                            <li><strong>Reembolso:</strong> 5-10 días hábiles después de recibir</li>
                        </ol>
                    </section>

                    <section className="legal-section contact-section">
                        <h2>Iniciar devolución</h2>
                        <div className="contact-options">
                            <Link href="/contacto" className="contact-option"><MessageCircle className="inline-block" size={16} /> WhatsApp: (55) 1234-5678</Link>
                            <Link href="mailto:soporte@mexilux.com" className="contact-option"><Mail className="inline-block" size={16} /> soporte@mexilux.com</Link>
                        </div>
                        <p style={{ marginTop: '1rem' }}>
                            <Link href="/legal/garantia">Ver política de garantía completa →</Link>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
