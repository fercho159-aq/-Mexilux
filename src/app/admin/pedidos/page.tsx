import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';
import prisma from '@/lib/db/prisma';
import Link from 'next/link';
import { AdminSidebar } from '../dashboard/AdminSidebar';
import '../admin.css';

const STATUS_CONFIG: Record<string, { label: string; icon: string; badgeClass: string }> = {
    pending_payment: { label: 'Pago Pendiente', icon: '⏳', badgeClass: 'badge-draft' },
    payment_confirmed: { label: 'Confirmado', icon: '✓', badgeClass: 'badge-active' },
    in_production: { label: 'En Producción', icon: '🔧', badgeClass: 'badge-draft' },
    quality_control: { label: 'Control Calidad', icon: '🔍', badgeClass: 'badge-draft' },
    ready_for_shipping: { label: 'Listo para Envío', icon: '📦', badgeClass: 'badge-active' },
    shipped: { label: 'Enviado', icon: '🚚', badgeClass: 'badge-active' },
    delivered: { label: 'Entregado', icon: '✅', badgeClass: 'badge-active' },
    cancelled: { label: 'Cancelado', icon: '❌', badgeClass: 'badge-out' },
    returned: { label: 'Devuelto', icon: '↩️', badgeClass: 'badge-out' },
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminPedidosPage({ searchParams }: PageProps) {
    const session = await getAdminSession();
    if (!session) redirect('/admin/login');

    const params = await searchParams;
    const statusFilter = params.status as string | undefined;

    const where: Record<string, string> = {};
    if (statusFilter && statusFilter !== 'all') {
        where.status = statusFilter;
    }

    const [orders, statusCounts] = await Promise.all([
        prisma.orders.findMany({
            where,
            include: { user: true, order_items: true },
            orderBy: { created_at: 'desc' },
        }),
        prisma.orders.groupBy({ by: ['status'], _count: true }),
    ]);

    const countMap: Record<string, number> = {};
    statusCounts.forEach((s) => { countMap[s.status] = s._count; });
    const totalOrders = Object.values(countMap).reduce((a, b) => a + b, 0);

    return (
        <div className="admin-layout">
            <AdminSidebar session={session} />

            <main className="admin-main">
                <div className="admin-content">
                    <header className="admin-page-header">
                        <div>
                            <h1 className="admin-page-title">Pedidos</h1>
                            <p style={{ color: '#b5b5c3', margin: 0, fontSize: '0.9rem' }}>
                                {orders.length} pedidos encontrados
                            </p>
                        </div>
                    </header>

                    {/* Status Filter Pills */}
                    <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        marginBottom: '1.5rem',
                        flexWrap: 'wrap',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid #eff2f5'
                    }}>
                        <Link
                            href="/admin/pedidos"
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                background: !statusFilter ? '#3699ff' : '#f3f6f9',
                                color: !statusFilter ? 'white' : '#7e8299',
                                textDecoration: 'none',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                            }}
                        >
                            Todos ({totalOrders})
                        </Link>
                        {Object.entries(STATUS_CONFIG).slice(0, 5).map(([key, cfg]) => (
                            <Link
                                key={key}
                                href={`/admin/pedidos?status=${key}`}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    background: statusFilter === key ? '#3699ff' : '#f3f6f9',
                                    color: statusFilter === key ? 'white' : '#7e8299',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                }}
                            >
                                {cfg.icon} {cfg.label} ({countMap[key] || 0})
                            </Link>
                        ))}
                    </div>

                    {/* Orders Table */}
                    <div className="admin-card">
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #eff2f5' }}>
                            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#3f4254' }}>
                                {statusFilter ? STATUS_CONFIG[statusFilter]?.label || 'Pedidos' : 'Todos los Pedidos'}
                            </h2>
                        </div>

                        {orders.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Pedido</th>
                                        <th>Cliente</th>
                                        <th>Artículos</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Fecha</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => {
                                        const cfg = STATUS_CONFIG[order.status] || { label: order.status, icon: '❓', badgeClass: 'badge-draft' };
                                        return (
                                            <tr key={order.id}>
                                                <td>
                                                    <strong style={{ color: '#3699ff' }}>#{order.order_number}</strong>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: 36, height: 36, borderRadius: '50%',
                                                            background: '#3699ff', color: 'white',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontWeight: 600, fontSize: '0.8rem'
                                                        }}>
                                                            {order.user ? `${order.user.first_name?.charAt(0) || ''}${order.user.last_name?.charAt(0) || ''}` : 'G'}
                                                        </div>
                                                        <div>
                                                            <strong style={{ display: 'block' }}>
                                                                {order.user ? `${order.user.first_name} ${order.user.last_name}` : 'Invitado'}
                                                            </strong>
                                                            <span style={{ fontSize: '0.8rem', color: '#b5b5c3' }}>
                                                                {order.user?.email || 'Sin email'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{order.order_items.length} artículo{order.order_items.length !== 1 ? 's' : ''}</td>
                                                <td>
                                                    <strong>${Number(order.total).toLocaleString('es-MX')}</strong>
                                                </td>
                                                <td>
                                                    <span className={`badge ${cfg.badgeClass}`}>
                                                        {cfg.icon} {cfg.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ display: 'block' }}>{new Date(order.created_at).toLocaleDateString('es-MX')}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#b5b5c3' }}>
                                                        {new Date(order.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <Link href={`/admin/pedidos/${order.id}`} className="btn-icon" title="Ver detalles">
                                                            👁️
                                                        </Link>
                                                        <button className="btn-icon" title="Imprimir">
                                                            🖨️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: '4rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#3f4254' }}>No hay pedidos</h3>
                                <p style={{ margin: 0, color: '#b5b5c3' }}>
                                    {statusFilter
                                        ? `No hay pedidos con estado "${STATUS_CONFIG[statusFilter]?.label || statusFilter}"`
                                        : 'Aún no se han realizado pedidos'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
