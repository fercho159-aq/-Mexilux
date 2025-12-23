import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';
import prisma from '@/lib/db/prisma';
import { AdminSidebar } from '../dashboard/AdminSidebar';
import '../admin.css';

export default async function AdminCategoriasPage() {
    const session = await getAdminSession();
    if (!session) redirect('/admin/login');

    const categories = await prisma.categories.findMany({
        orderBy: { name: 'asc' },
    });

    return (
        <div className="admin-layout">
            <AdminSidebar session={session} />
            <main className="admin-main">
                <div className="admin-content">
                    <header className="admin-page-header">
                        <h1 className="admin-page-title">Categorías</h1>
                        <button style={{ padding: '10px 20px', background: '#3699ff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                            + Nueva Categoría
                        </button>
                    </header>

                    <div className="admin-card">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Slug</th>
                                    <th>Orden</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td><strong>{cat.name}</strong></td>
                                        <td>{cat.slug}</td>
                                        <td>{cat.sort_order}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-icon" title="Editar">✏️</button>
                                                <button className="btn-icon delete" title="Eliminar">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>No hay categorías</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
