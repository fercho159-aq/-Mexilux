import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';
import prisma from '@/lib/db/prisma';
import { AdminSidebar } from '../dashboard/AdminSidebar';
import '../admin.css';

export default async function AdminMarcasPage() {
    const session = await getAdminSession();
    if (!session) redirect('/admin/login');

    const brands = await prisma.brands.findMany({
        orderBy: { name: 'asc' },
    });

    return (
        <div className="admin-layout">
            <AdminSidebar session={session} />
            <main className="admin-main">
                <div className="admin-content">
                    <header className="admin-page-header">
                        <h1 className="admin-page-title">Marcas</h1>
                        <button style={{ padding: '10px 20px', background: '#3699ff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                            + Nueva Marca
                        </button>
                    </header>

                    <div className="admin-card">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Logo</th>
                                    <th>Nombre</th>
                                    <th>Slug</th>
                                    <th>Tipo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brands.map((brand) => (
                                    <tr key={brand.id}>
                                        <td>
                                            {brand.logo_url ? (
                                                <img src={brand.logo_url} alt={brand.name} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                                            ) : (
                                                <div style={{ width: 40, height: 40, background: '#f3f6f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏷️</div>
                                            )}
                                        </td>
                                        <td><strong>{brand.name}</strong></td>
                                        <td>{brand.slug}</td>
                                        <td>{brand.is_luxury ? <span className="badge badge-active">Lujo</span> : '-'}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-icon" title="Editar">✏️</button>
                                                <button className="btn-icon delete" title="Eliminar">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {brands.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No hay marcas</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
