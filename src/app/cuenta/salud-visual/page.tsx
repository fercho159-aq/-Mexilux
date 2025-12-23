/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MI SALUD VISUAL - RECETAS GUARDADAS (SITEMAP 4.3)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mi Salud Visual | Mexilux',
    description: 'Consulta y gestiona tus recetas médicas guardadas.',
};

const PRESCRIPTIONS = [
    {
        id: 'rx-001',
        name: 'Receta Dr. García',
        issueDate: '15 Jun 2024',
        expirationDate: '15 Jun 2026',
        doctor: 'Dr. Roberto García',
        isActive: true,
        rightEye: { sph: -2.50, cyl: -0.75, axis: 90, pd: 31 },
        leftEye: { sph: -2.25, cyl: -0.50, axis: 85, pd: 31 },
    },
    {
        id: 'rx-002',
        name: 'Receta anterior',
        issueDate: '10 Mar 2022',
        expirationDate: '10 Mar 2024',
        doctor: 'Dra. Ana Martínez',
        isActive: false,
        rightEye: { sph: -2.00, cyl: -0.50, axis: 90, pd: 31 },
        leftEye: { sph: -2.00, cyl: -0.25, axis: 85, pd: 31 },
    },
];

export default function SaludVisualPage() {
    const formatValue = (val: number) => (val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2));

    return (
        <main className="health-page">
            {/* Breadcrumb */}
            <nav className="breadcrumb" aria-label="Navegación">
                <Link href="/">Inicio</Link>
                <span className="breadcrumb-separator">/</span>
                <Link href="/cuenta">Mi Cuenta</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">Mi Salud Visual</span>
            </nav>

            <div className="section-container">
                <header className="page-header">
                    <div>
                        <h1>Mi Salud Visual</h1>
                        <p>Gestiona tus recetas médicas y mantén actualizada tu graduación</p>
                    </div>
                    <Link href="/cuenta/salud-visual/nueva" className="btn btn-primary">
                        + Agregar receta
                    </Link>
                </header>

                {/* Active Prescription */}
                <section className="prescriptions-section">
                    <h2>Receta activa</h2>
                    {PRESCRIPTIONS.filter(p => p.isActive).map((rx) => (
                        <article key={rx.id} className="prescription-card active">
                            <header className="rx-header">
                                <div className="rx-title">
                                    <span className="rx-badge">Activa</span>
                                    <h3>{rx.name}</h3>
                                    <span className="rx-doctor">{rx.doctor}</span>
                                </div>
                                <div className="rx-dates">
                                    <span>Emitida: {rx.issueDate}</span>
                                    <span>Vigente hasta: {rx.expirationDate}</span>
                                </div>
                            </header>

                            <div className="rx-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Ojo</th>
                                            <th>ESF</th>
                                            <th>CIL</th>
                                            <th>EJE</th>
                                            <th>DP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>OD (Derecho)</td>
                                            <td>{formatValue(rx.rightEye.sph)}</td>
                                            <td>{formatValue(rx.rightEye.cyl)}</td>
                                            <td>{rx.rightEye.axis}°</td>
                                            <td>{rx.rightEye.pd} mm</td>
                                        </tr>
                                        <tr>
                                            <td>OI (Izquierdo)</td>
                                            <td>{formatValue(rx.leftEye.sph)}</td>
                                            <td>{formatValue(rx.leftEye.cyl)}</td>
                                            <td>{rx.leftEye.axis}°</td>
                                            <td>{rx.leftEye.pd} mm</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <footer className="rx-footer">
                                <button className="btn btn-outline btn-sm">
                                    Editar
                                </button>
                                <Link href="/catalogo" className="btn btn-primary btn-sm">
                                    Usar para comprar
                                </Link>
                            </footer>
                        </article>
                    ))}
                </section>

                {/* Previous Prescriptions */}
                <section className="prescriptions-section">
                    <h2>Recetas anteriores</h2>
                    {PRESCRIPTIONS.filter(p => !p.isActive).map((rx) => (
                        <article key={rx.id} className="prescription-card expired">
                            <header className="rx-header">
                                <div className="rx-title">
                                    <span className="rx-badge expired">Expirada</span>
                                    <h3>{rx.name}</h3>
                                    <span className="rx-doctor">{rx.doctor}</span>
                                </div>
                                <div className="rx-dates">
                                    <span>Emitida: {rx.issueDate}</span>
                                    <span className="expired-date">Expiró: {rx.expirationDate}</span>
                                </div>
                            </header>
                            <footer className="rx-footer">
                                <p className="expired-notice">
                                    ⚠️ Esta receta ha expirado. Te recomendamos agendar un nuevo examen de la vista.
                                </p>
                                <Link href="/servicios/citas" className="btn btn-outline btn-sm">
                                    Agendar examen
                                </Link>
                            </footer>
                        </article>
                    ))}
                </section>

                {/* CTA */}
                <section className="health-cta">
                    <div className="cta-card">
                        <span className="cta-icon">📅</span>
                        <div className="cta-text">
                            <h3>¿Tu receta tiene más de 1 año?</h3>
                            <p>Los expertos recomiendan un examen visual anual para mantener tu salud ocular</p>
                        </div>
                        <Link href="/servicios/citas" className="btn btn-primary">
                            Agendar examen
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
