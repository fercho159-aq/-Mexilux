/**
 * ═══════════════════════════════════════════════════════════════════════════
 * POLÍTICA DE PRIVACIDAD
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidad | Mexilux',
    description: 'Conoce cómo protegemos y utilizamos tu información personal en Mexilux.',
};

export default function PrivacidadPage() {
    return (
        <main className="legal-page">
            <div className="section-container">
                <header className="legal-header">
                    <h1>Política de Privacidad</h1>
                    <p className="legal-updated">Última actualización: Diciembre 2024</p>
                </header>

                <div className="legal-content">
                    <section className="legal-section">
                        <h2>1. Información que Recopilamos</h2>
                        <p>En Mexilux, recopilamos información para brindarte un mejor servicio. Los tipos de información que podemos recopilar incluyen:</p>

                        <h3>Información personal</h3>
                        <ul>
                            <li>Nombre completo</li>
                            <li>Correo electrónico</li>
                            <li>Número de teléfono</li>
                            <li>Dirección de envío y facturación</li>
                            <li>Información de pago (procesada de forma segura)</li>
                        </ul>

                        <h3>Información médica</h3>
                        <ul>
                            <li>Recetas oftalmológicas</li>
                            <li>Historial de graduación</li>
                            <li>Distancia pupilar</li>
                        </ul>

                        <h3>Información de navegación</h3>
                        <ul>
                            <li>Cookies y datos de sesión</li>
                            <li>Historial de productos vistos</li>
                            <li>Preferencias de navegación</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>2. Uso de la Información</h2>
                        <p>Utilizamos tu información para:</p>
                        <ul>
                            <li>Procesar y enviar tus pedidos</li>
                            <li>Fabricar lentes graduados según tu receta</li>
                            <li>Gestionar citas de optometría</li>
                            <li>Enviar notificaciones sobre tu pedido</li>
                            <li>Mejorar nuestros productos y servicios</li>
                            <li>Enviarte ofertas personalizadas (con tu consentimiento)</li>
                            <li>Cumplir con obligaciones legales</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>3. Protección de Datos</h2>
                        <p>Tu seguridad es nuestra prioridad. Implementamos medidas técnicas y organizativas para proteger tu información:</p>
                        <ul>
                            <li>Encriptación SSL/TLS en todas las transmisiones</li>
                            <li>Almacenamiento seguro con acceso restringido</li>
                            <li>Monitoreo continuo de seguridad</li>
                            <li>Capacitación de personal en protección de datos</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>4. Compartir Información</h2>
                        <p>No vendemos ni alquilamos tu información personal. Solo la compartimos con:</p>
                        <ul>
                            <li><strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar (pagos, envíos, laboratorio)</li>
                            <li><strong>Cuando es requerido por ley:</strong> Autoridades competentes mediante orden legal</li>
                            <li><strong>Con tu consentimiento:</strong> Cuando nos autorizas explícitamente</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>5. Cookies</h2>
                        <p>Utilizamos cookies para:</p>
                        <ul>
                            <li>Recordar tus preferencias</li>
                            <li>Mantener tu sesión activa</li>
                            <li>Analizar el uso del sitio</li>
                            <li>Personalizar tu experiencia</li>
                        </ul>
                        <p>Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades.</p>
                    </section>

                    <section className="legal-section">
                        <h2>6. Tus Derechos</h2>
                        <p>Conforme a la Ley Federal de Protección de Datos Personales, tienes derecho a:</p>
                        <ul>
                            <li><strong>Acceso:</strong> Conocer qué datos tenemos sobre ti</li>
                            <li><strong>Rectificación:</strong> Corregir datos incorrectos</li>
                            <li><strong>Cancelación:</strong> Solicitar la eliminación de tus datos</li>
                            <li><strong>Oposición:</strong> Oponerte al uso de tus datos para ciertos fines</li>
                        </ul>
                        <p>Para ejercer estos derechos, contáctanos a <a href="mailto:privacidad@mexilux.com">privacidad@mexilux.com</a></p>
                    </section>

                    <section className="legal-section">
                        <h2>7. Retención de Datos</h2>
                        <p>Conservamos tu información durante el tiempo necesario para:</p>
                        <ul>
                            <li>Cumplir con los fines para los que fue recopilada</li>
                            <li>Cumplir con obligaciones legales (ej. recetas médicas: 5 años)</li>
                            <li>Resolver disputas y hacer cumplir acuerdos</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>8. Cambios a esta Política</h2>
                        <p>Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos por correo electrónico o mediante un aviso en nuestro sitio web.</p>
                    </section>

                    <section className="legal-section contact-section">
                        <h2>9. Contacto</h2>
                        <p>Para preguntas sobre privacidad:</p>
                        <div className="contact-options">
                            <Link href="mailto:privacidad@mexilux.com" className="contact-option">
                                ✉️ privacidad@mexilux.com
                            </Link>
                            <Link href="/contacto" className="contact-option">
                                💬 Formulario de contacto
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
