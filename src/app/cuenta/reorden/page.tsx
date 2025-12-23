/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REORDENAR LENTES DE CONTACTO (SITEMAP 4.4)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reordenar Lentes de Contacto | Mexilux',
    description: 'Reordena tus lentes de contacto de forma rápida y sencilla.',
};

const PREVIOUS_LC_ORDERS = [
    {
        id: 'lc-001',
        name: 'Acuvue Oasys',
        type: 'Mensual',
        quantity: '6 lentes por ojo',
        lastOrder: '20 Oct 2024',
        price: 1299,
        rightEye: { sph: -2.50, bc: 8.4, dia: 14.0 },
        leftEye: { sph: -2.25, bc: 8.4, dia: 14.0 },
    },
];

export default function ReordenPage() {
    return (
        <main className="reorder-page">
            {/* Breadcrumb */}
            <nav className="breadcrumb" aria-label="Navegación">
                <Link href="/">Inicio</Link>
                <span className="breadcrumb-separator">/</span>
                <Link href="/cuenta">Mi Cuenta</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">Reordenar LC</span>
            </nav>

            <div className="section-container">
                <header className="page-header">
                    <h1>Reordenar Lentes de Contacto</h1>
                    <p>Reordena tus lentes en segundos con tu última graduación</p>
                </header>

                <div className="reorder-content">
                    {PREVIOUS_LC_ORDERS.length > 0 ? (
                        <>
                            <section className="previous-orders">
                                <h2>Tu última compra de lentes de contacto</h2>

                                {PREVIOUS_LC_ORDERS.map((order) => (
                                    <article key={order.id} className="lc-order-card">
                                        <div className="lc-info">
                                            <span className="lc-icon">👁️</span>
                                            <div className="lc-details">
                                                <h3>{order.name}</h3>
                                                <p>{order.type} • {order.quantity}</p>
                                                <span className="last-order">Última compra: {order.lastOrder}</span>
                                            </div>
                                        </div>

                                        <div className="lc-rx">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Ojo</th>
                                                        <th>ESF</th>
                                                        <th>BC</th>
                                                        <th>DIA</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>OD</td>
                                                        <td>{order.rightEye.sph.toFixed(2)}</td>
                                                        <td>{order.rightEye.bc}</td>
                                                        <td>{order.rightEye.dia}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>OI</td>
                                                        <td>{order.leftEye.sph.toFixed(2)}</td>
                                                        <td>{order.leftEye.bc}</td>
                                                        <td>{order.leftEye.dia}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="lc-actions">
                                            <span className="lc-price">
                                                ${order.price.toLocaleString('es-MX')}
                                            </span>
                                            <div className="quantity-selector">
                                                <button className="qty-btn">-</button>
                                                <span className="qty-value">1</span>
                                                <button className="qty-btn">+</button>
                                            </div>
                                            <button className="btn btn-primary">
                                                Agregar al carrito
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </section>

                            <section className="reorder-note">
                                <div className="note-card">
                                    <span className="note-icon">ℹ️</span>
                                    <div className="note-text">
                                        <strong>¿Cambió tu graduación?</strong>
                                        <p>Si tu receta ha cambiado, te recomendamos actualizar tu información antes de reordenar.</p>
                                        <Link href="/cuenta/salud-visual">Actualizar receta</Link>
                                    </div>
                                </div>
                            </section>
                        </>
                    ) : (
                        <section className="no-orders">
                            <span className="empty-icon">📦</span>
                            <h2>No tienes compras previas de lentes de contacto</h2>
                            <p>Cuando compres lentes de contacto, podrás reordenarlos fácilmente desde aquí.</p>
                            <Link href="/catalogo?tipo=lentes-de-contacto" className="btn btn-primary">
                                Ver lentes de contacto
                            </Link>
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}
