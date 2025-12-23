import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';
import { AdminSidebar } from '../dashboard/AdminSidebar';
import '../admin.css';

export default async function AdminCuponesPage() {
    const session = await getAdminSession();
    if (!session) redirect('/admin/login');

    return (
        <div className="admin-layout">
            <AdminSidebar session={session} />
            <main className="admin-main">
                <div className="admin-content">
                    <header className="admin-page-header">
                        <h1 className="admin-page-title">Cupones</h1>
                        <button style={{ padding: '10px 20px', background: '#3699ff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                            + Nuevo Cupón
                        </button>
                    </header>

                    <div className="admin-card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎟️</div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#3f4254' }}>Gestión de Cupones</h3>
                        <p style={{ color: '#b5b5c3', margin: 0 }}>
                            Crea y administra códigos de descuento para tus clientes.
                        </p>
                        <p style={{ color: '#b5b5c3', marginTop: '1rem', fontSize: '0.85rem' }}>
                            Próximamente: Cupones por porcentaje, monto fijo, envío gratis y más.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
