import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';
import { AdminSidebar } from '../dashboard/AdminSidebar';
import '../admin.css';

export default async function AdminConfiguracionPage() {
    const session = await getAdminSession();
    if (!session) redirect('/admin/login');

    return (
        <div className="admin-layout">
            <AdminSidebar session={session} />
            <main className="admin-main">
                <div className="admin-content">
                    <header className="admin-page-header">
                        <h1 className="admin-page-title">Configuración</h1>
                    </header>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="admin-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ width: 45, height: 45, borderRadius: '10px', background: '#e8f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                    🏪
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#3f4254' }}>Información de la Tienda</h3>
                            </div>
                            <p style={{ color: '#7e8299', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
                                Nombre, logo, dirección y datos de contacto.
                            </p>
                            <button style={{ padding: '8px 16px', background: '#f3f6f9', color: '#7e8299', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                                Editar
                            </button>
                        </div>

                        <div className="admin-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ width: 45, height: 45, borderRadius: '10px', background: '#e8fff3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                    💳
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#3f4254' }}>Métodos de Pago</h3>
                            </div>
                            <p style={{ color: '#7e8299', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
                                Configurar Stripe, PayPal, transferencias.
                            </p>
                            <button style={{ padding: '8px 16px', background: '#f3f6f9', color: '#7e8299', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                                Configurar
                            </button>
                        </div>

                        <div className="admin-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ width: 45, height: 45, borderRadius: '10px', background: '#fff8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                    🚚
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#3f4254' }}>Envíos</h3>
                            </div>
                            <p style={{ color: '#7e8299', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
                                Zonas de envío, tarifas y transportistas.
                            </p>
                            <button style={{ padding: '8px 16px', background: '#f3f6f9', color: '#7e8299', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                                Configurar
                            </button>
                        </div>

                        <div className="admin-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ width: 45, height: 45, borderRadius: '10px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                    📧
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#3f4254' }}>Notificaciones</h3>
                            </div>
                            <p style={{ color: '#7e8299', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
                                Emails automáticos y plantillas.
                            </p>
                            <button style={{ padding: '8px 16px', background: '#f3f6f9', color: '#7e8299', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                                Configurar
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
