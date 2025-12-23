/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MIS PEDIDOS - Historial de compras
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mis Pedidos | Mexilux',
    description: 'Consulta el historial y estado de tus pedidos.',
};

const ORDERS = [
    {
        id: 'MX-00123',
        date: '10 Dic 2024',
        status: 'Entregado',
        total: 4999,
        product: 'Ray-Ban Aviator Classic',
        variant: 'Dorado',
    },
    {
        id: 'MX-00098',
        date: '15 Nov 2024',
        status: 'Entregado',
        total: 2899,
        product: 'Oakley Holbrook',
        variant: 'Negro',
    },
    {
        id: 'MX-00075',
        date: '20 Oct 2024',
        status: 'Entregado',
        total: 1299,
        product: 'Gucci GG0061S',
        variant: 'Tortoise',
    },
];

export default function PedidosPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f7',
            paddingTop: '120px',
            paddingBottom: '60px',
        }}>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: '0 20px',
            }}>
                {/* Back Link */}
                <Link href="/cuenta/dashboard" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#0071e3',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '500',
                    marginBottom: '16px',
                }}>
                    ← Volver a mi cuenta
                </Link>

                {/* Header */}
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#1d1d1f',
                    margin: '0 0 8px 0',
                }}>
                    Mis Pedidos
                </h1>
                <p style={{
                    fontSize: '15px',
                    color: '#6e6e73',
                    margin: '0 0 30px 0',
                }}>
                    {ORDERS.length} pedidos realizados
                </p>

                {/* Orders List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {ORDERS.map((order) => (
                        <div key={order.id} style={{
                            background: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                        }}>
                            {/* Order Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px 20px',
                                borderBottom: '1px solid #f0f0f0',
                            }}>
                                <div>
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#1d1d1f',
                                    }}>
                                        Pedido #{order.id}
                                    </div>
                                    <div style={{
                                        fontSize: '13px',
                                        color: '#6e6e73',
                                        marginTop: '2px',
                                    }}>
                                        {order.date}
                                    </div>
                                </div>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '6px 12px',
                                    background: '#d4edda',
                                    color: '#0d6832',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                }}>
                                    ✓ {order.status}
                                </span>
                            </div>

                            {/* Product Info */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '16px 20px',
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: '#f5f5f7',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '28px',
                                    flexShrink: 0,
                                }}>
                                    👓
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        color: '#1d1d1f',
                                    }}>
                                        {order.product}
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#6e6e73',
                                        marginTop: '2px',
                                    }}>
                                        {order.variant}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px 20px',
                                background: '#fafafa',
                            }}>
                                <div style={{
                                    fontSize: '16px',
                                    color: '#1d1d1f',
                                }}>
                                    Total: <strong>${order.total.toLocaleString('es-MX')}</strong>
                                </div>
                                <Link href={`/cuenta/pedidos/${order.id}`} style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '10px 20px',
                                    background: '#0071e3',
                                    color: 'white',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                }}>
                                    Ver detalles →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
