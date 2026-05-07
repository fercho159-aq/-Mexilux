/**
 * TÉRMINOS Y CONDICIONES
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Términos y Condiciones | Mexilux',
    description: 'Términos y condiciones de uso del sitio web y servicios de Mexilux.',
};

export default function TerminosPage() {
    return (
        <main className="legal-page">
            <div className="section-container">
                <header className="legal-header">
                    <h1>Términos y Condiciones</h1>
                    <p className="legal-updated">Última actualización: Diciembre 2024</p>
                </header>

                <div className="legal-content">
                    <section className="legal-section">
                        <h2>1. Aceptación de los Términos</h2>
                        <p>Al acceder y utilizar el sitio web de Mexilux, aceptas estos términos y condiciones. Si no estás de acuerdo, te pedimos que no utilices nuestro sitio.</p>
                    </section>

                    <section className="legal-section">
                        <h2>2. Productos y Pedidos</h2>
                        <p>Los precios están en MXN e incluyen IVA. Para lentes graduados, debes proporcionar una receta válida (máximo 2 años).</p>
                    </section>

                    <section className="legal-section">
                        <h2>3. Envíos</h2>
                        <ul>
                            <li>Armazones sin graduar: 2-3 días hábiles</li>
                            <li>Lentes graduados: 5-7 días hábiles</li>
                            <li>Envío gratis en compras mayores a $1,500 MXN</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>4. Garantía</h2>
                        <p>1 año de garantía en todas las monturas. Ver <Link href="/legal/garantia">política completa</Link>.</p>
                    </section>

                    <section className="legal-section">
                        <h2>5. Contacto</h2>
                        <div className="contact-options">
                            <Link href="mailto:legal@mexilux.com" className="contact-option">✉️ legal@mexilux.com</Link>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
