import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';
import prisma from '@/lib/db/prisma';
import { AdminSidebar } from '../dashboard/AdminSidebar';
import '../admin.css';

export default async function AdminUsuariosPage() {
    const session = await getAdminSession();
    if (!session) redirect('/admin/login');

    const users = await prisma.users.findMany({
        orderBy: { created_at: 'desc' },
        take: 50,
    });

    return (
        <div className="admin-layout">
            <AdminSidebar session={session} />
            <main className="admin-main">
                <div className="admin-content">
                    <header className="admin-page-header">
                        <h1 className="admin-page-title">Usuarios</h1>
                        <p style={{ color: '#b5b5c3', margin: 0 }}>{users.length} usuarios registrados</p>
                    </header>

                    <div className="admin-card">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Registrado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#3699ff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                                                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <strong>{user.first_name} {user.last_name}</strong>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || '-'}</td>
                                        <td>{new Date(user.created_at).toLocaleDateString('es-MX')}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-icon" title="Ver">👁️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No hay usuarios</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
