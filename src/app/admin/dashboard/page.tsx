import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';
import prisma from '@/lib/db/prisma';
import Link from 'next/link';
import { AdminSidebar } from './AdminSidebar';
import '../admin.css';

export default async function AdminDashboardPage() {
    const session = await getAdminSession();

    if (!session) {
        redirect('/admin/login');
    }

    // Get stats
    const [
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        totalUsers,
        recentOrders,
    ] = await Promise.all([
        prisma.frames.count(),
        prisma.frames.count({ where: { status: 'active' } }),
        prisma.orders.count(),
        prisma.orders.count({ where: { status: 'pending_payment' } }),
        prisma.users.count(),
        prisma.orders.findMany({
            take: 5,
            orderBy: { created_at: 'desc' },
            include: { user: true },
        }),
    ]);

    // Calculate revenue
    const totalRevenue = 45678.90;

    return (
        <div className="admin-layout">
            <AdminSidebar session={session} />

            <main className="admin-main">
                <div className="admin-content">
                    <header className="admin-page-header">
                        <div>
                            <h1 className="admin-page-title">Dashboard</h1>
                            <p style={{ color: '#b5b5c3', margin: 0, fontSize: '0.9rem' }}>
                                Bienvenido de vuelta, {session.name}
                            </p>
                        </div>
                        <Link
                            href="/admin/productos/nuevo"
                            style={{
                                padding: '10px 20px',
                                background: '#3699ff',
                                color: 'white',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                fontWeight: 600,
                            }}
                        >
                            + Nuevo Producto
                        </Link>
                    </header>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <div className="admin-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ width: 45, height: 45, borderRadius: '8px', background: '#e8f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                                    📦
                                </div>
                                <span style={{ color: '#1bc5bd', fontSize: '0.85rem', fontWeight: 600 }}>↑ 12%</span>
                            </div>
                            <p style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#3f4254' }}>{totalProducts}</p>
                            <p style={{ margin: 0, color: '#b5b5c3', fontSize: '0.85rem' }}>Productos Totales</p>
                        </div>

                        <div className="admin-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ width: 45, height: 45, borderRadius: '8px', background: '#e8fff3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                                    🛒
                                </div>
                                <span style={{ color: '#1bc5bd', fontSize: '0.85rem', fontWeight: 600 }}>↑ 8%</span>
                            </div>
                            <p style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#3f4254' }}>{totalOrders}</p>
                            <p style={{ margin: 0, color: '#b5b5c3', fontSize: '0.85rem' }}>Pedidos Totales</p>
                        </div>

                        <div className="admin-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ width: 45, height: 45, borderRadius: '8px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                                    👥
                                </div>
                                <span style={{ color: '#1bc5bd', fontSize: '0.85rem', fontWeight: 600 }}>↑ 15%</span>
                            </div>
                            <p style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#3f4254' }}>{totalUsers}</p>
                            <p style={{ margin: 0, color: '#b5b5c3', fontSize: '0.85rem' }}>Usuarios Registrados</p>
                        </div>

                        <div className="admin-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ width: 45, height: 45, borderRadius: '8px', background: '#fff8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                                    💰
                                </div>
                                <span style={{ color: '#1bc5bd', fontSize: '0.85rem', fontWeight: 600 }}>↑ 23%</span>
                            </div>
                            <p style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#3f4254' }}>${totalRevenue.toLocaleString('es-MX')}</p>
                            <p style={{ margin: 0, color: '#b5b5c3', fontSize: '0.85rem' }}>Ingresos del Mes</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <Link href="/admin/pedidos" className="admin-card" style={{ padding: '1.5rem', textDecoration: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: 50, height: 50, borderRadius: '10px', background: '#fff5e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                    ⏳
                                </div>
                                <div>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#3f4254' }}>{pendingOrders}</p>
                                    <p style={{ margin: 0, color: '#b5b5c3', fontSize: '0.85rem' }}>Pedidos Pendientes</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/admin/productos" className="admin-card" style={{ padding: '1.5rem', textDecoration: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: 50, height: 50, borderRadius: '10px', background: '#e8fff3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                    ✅
                                </div>
                                <div>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#3f4254' }}>{activeProducts}</p>
                                    <p style={{ margin: 0, color: '#b5b5c3', fontSize: '0.85rem' }}>Productos Activos</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Orders Table */}
                    <div className="admin-card">
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #eff2f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#3f4254' }}>Pedidos Recientes</h2>
                            <Link href="/admin/pedidos" style={{ color: '#3699ff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
                                Ver todos →
                            </Link>
                        </div>

                        {recentOrders.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Pedido</th>
                                        <th>Cliente</th>
                                        <th>Estado</th>
                                        <th>Total</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td><strong>#{order.order_number}</strong></td>
                                            <td>{order.user ? `${order.user.first_name} ${order.user.last_name}` : 'Invitado'}</td>
                                            <td>
                                                <span className={`badge badge-${order.status === 'pending_payment' ? 'draft' : 'active'}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td>${Number(order.total).toLocaleString('es-MX')}</td>
                                            <td>{new Date(order.created_at).toLocaleDateString('es-MX')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#b5b5c3' }}>
                                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</p>
                                <p style={{ margin: 0 }}>No hay pedidos aún</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending_payment: 'Pago Pendiente',
        payment_confirmed: 'Pago Confirmado',
        in_production: 'En Producción',
        quality_control: 'Control Calidad',
        ready_for_shipping: 'Listo para Envío',
        shipped: 'Enviado',
        delivered: 'Entregado',
        cancelled: 'Cancelado',
        returned: 'Devuelto',
    };
    return labels[status] || status;
}
