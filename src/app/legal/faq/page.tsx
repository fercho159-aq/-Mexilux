/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PREGUNTAS FRECUENTES - FAQ (SITEMAP 5.2)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Preguntas Frecuentes | Mexilux',
    description: 'Encuentra respuestas a las preguntas más comunes sobre nuestros productos, servicios, recetas y más.',
};

const FAQ_CATEGORIES = [
    {
        id: 'pedidos',
        title: '📦 Pedidos y Envíos',
        questions: [
            {
                q: '¿Cuánto tiempo tarda en llegar mi pedido?',
                a: 'Los armazones sin graduar se entregan en 2-3 días hábiles. Los lentes graduados tardan 5-7 días hábiles debido al proceso de fabricación personalizada en nuestro laboratorio.',
            },
            {
                q: '¿El envío es gratis?',
                a: 'Sí, el envío es gratuito en compras mayores a $1,500 MXN. Para pedidos menores, el costo de envío es de $99 MXN.',
            },
            {
                q: '¿Puedo rastrear mi pedido?',
                a: 'Sí, una vez que tu pedido sea enviado, recibirás un correo con el número de guía para rastrear tu envío en tiempo real.',
            },
        ],
    },
    {
        id: 'recetas',
        title: '👁️ Recetas y Graduación',
        questions: [
            {
                q: '¿Cómo ingreso mi receta oftalmológica?',
                a: 'Tienes tres opciones: 1) Subir una foto de tu receta, 2) Ingresar los valores manualmente en nuestro configurador, o 3) Usar una receta guardada previamente en tu cuenta.',
            },
            {
                q: '¿Mi receta sigue siendo válida?',
                a: 'Las recetas oftalmológicas tienen una vigencia recomendada de 1-2 años. Si tu receta tiene más tiempo, te recomendamos agendar un nuevo examen de la vista con nosotros.',
            },
            {
                q: '¿Qué significan los valores de mi receta?',
                a: 'ESF (esfera) indica miopía o hipermetropía. CIL (cilindro) indica astigmatismo. EJE es el ángulo del astigmatismo. DP es la distancia pupilar. En el configurador te explicamos cada valor.',
            },
            {
                q: '¿Aceptan recetas de otros optometristas?',
                a: 'Sí, aceptamos cualquier receta de optometristas u oftalmólogos certificados. Solo asegúrate de que esté vigente.',
            },
        ],
    },
    {
        id: 'lentes',
        title: '👓 Lentes y Tratamientos',
        questions: [
            {
                q: '¿Qué índice de lente debo elegir?',
                a: 'Depende de tu graduación. Para graduaciones bajas (-2 a +2) el índice 1.5 es suficiente. Para graduaciones medias, recomendamos 1.6. Para graduaciones altas, el índice 1.67 o 1.74 ofrecen lentes más delgados.',
            },
            {
                q: '¿Qué es el tratamiento Blue Light?',
                a: 'El tratamiento Blue Light filtra la luz azul dañina de pantallas digitales, reduciendo la fatiga visual y mejorando la calidad del sueño. Ideal para quienes pasan muchas horas frente a computadoras.',
            },
            {
                q: '¿Cuál es la diferencia entre monofocal y progresivo?',
                a: 'Los lentes monofocales tienen una sola graduación, para ver de lejos o de cerca. Los progresivos incluyen múltiples graduaciones en un solo lente, permitiendo ver claramente a todas las distancias sin necesidad de cambiar de anteojos.',
            },
        ],
    },
    {
        id: 'citas',
        title: '📅 Citas y Exámenes',
        questions: [
            {
                q: '¿Cómo agendo una cita?',
                a: 'Puedes agendar en línea desde nuestra página de citas, seleccionando el servicio, fecha y horario de tu preferencia. También puedes llamarnos o escribirnos por WhatsApp.',
            },
            {
                q: '¿Cuánto cuesta el examen de la vista?',
                a: 'El examen de la vista completo tiene un costo de $350 MXN. Este monto es 100% aplicable como descuento en la compra de lentes graduados.',
            },
            {
                q: '¿Qué incluye el examen de la vista?',
                a: 'Incluye refracción computarizada, evaluación de salud ocular, tonometría (presión ocular), y recomendaciones personalizadas. Dura aproximadamente 45 minutos.',
            },
        ],
    },
    {
        id: 'pagos',
        title: '💳 Pagos y Facturación',
        questions: [
            {
                q: '¿Qué métodos de pago aceptan?',
                a: 'Aceptamos tarjetas de crédito/débito Visa, MasterCard, American Express, PayPal, y transferencia bancaria. También ofrecemos meses sin intereses con tarjetas participantes.',
            },
            {
                q: '¿Puedo pagar a meses sin intereses?',
                a: 'Sí, ofrecemos hasta 12 meses sin intereses con tarjetas Banamex, Santander, HSBC, y Banorte en compras mayores a $3,000 MXN.',
            },
            {
                q: '¿Cómo solicito mi factura?',
                a: 'Puedes solicitar tu factura al momento de realizar tu compra ingresando tus datos fiscales, o posteriormente desde tu cuenta en la sección "Mis Pedidos".',
            },
        ],
    },
];

export default function FAQPage() {
    return (
        <main className="faq-page">
            <div className="section-container">
                <header className="faq-header">
                    <h1>Preguntas Frecuentes</h1>
                    <p>Encuentra respuestas rápidas a tus dudas</p>

                    {/* Quick search */}
                    <div className="faq-search">
                        <input
                            type="search"
                            placeholder="Buscar en las preguntas..."
                            aria-label="Buscar preguntas"
                        />
                    </div>
                </header>

                <div className="faq-content">
                    {/* Category navigation */}
                    <nav className="faq-nav" aria-label="Categorías de preguntas">
                        {FAQ_CATEGORIES.map((cat) => (
                            <a key={cat.id} href={`#${cat.id}`} className="faq-nav-item">
                                {cat.title}
                            </a>
                        ))}
                    </nav>

                    {/* Questions by category */}
                    <div className="faq-sections">
                        {FAQ_CATEGORIES.map((category) => (
                            <section key={category.id} id={category.id} className="faq-section">
                                <h2>{category.title}</h2>
                                <div className="faq-list">
                                    {category.questions.map((faq, idx) => (
                                        <details key={idx} className="faq-item">
                                            <summary className="faq-question">{faq.q}</summary>
                                            <div className="faq-answer">
                                                <p>{faq.a}</p>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <section className="faq-contact">
                    <h2>¿No encontraste tu respuesta?</h2>
                    <p>Nuestro equipo está listo para ayudarte</p>
                    <div className="contact-buttons">
                        <Link href="/contacto" className="btn btn-primary">
                            💬 Contactar por WhatsApp
                        </Link>
                        <Link href="mailto:info@mexilux.com" className="btn btn-outline">
                            ✉️ Enviar correo
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
