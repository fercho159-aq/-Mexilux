'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

interface OrderDetails {
    orderNumber: string;
    status: string;
    total: number;
    itemCount: number;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order');
    const paymentId = searchParams.get('payment_id');
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(!!orderId);

    useEffect(() => {
        if (orderId) {
            fetch(`/api/orders/${orderId}`)
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data) {
                        setOrder({
                            orderNumber: data.orderNumber,
                            status: data.status,
                            total: data.total,
                            itemCount: data.items?.length || 0,
                        });
                    }
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }

        // Clear cart from local storage
        localStorage.removeItem('mexilux_cart');
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { itemCount: 0 } }));
    }, [orderId]);

    const formatPrice = (price: number) => `$${price.toLocaleString('es-MX')}`;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-green-50 to-white">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-green-100">
                {/* Success animation */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
                    <div className="relative flex items-center justify-center w-24 h-24 bg-green-500 rounded-full">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-2 text-gray-800">
                    ¡Pago Exitoso!
                </h1>
                <p className="text-gray-600 mb-6">
                    Tu compra ha sido procesada correctamente.
                </p>

                {loading ? (
                    <div className="animate-pulse bg-gray-100 rounded-lg p-4 mb-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                ) : order ? (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">Pedido</span>
                            <span className="font-mono font-bold text-gray-800">{order.orderNumber}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">Productos</span>
                            <span className="text-gray-800">{order.itemCount} artículo{order.itemCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="text-sm text-gray-500">Total pagado</span>
                            <span className="text-lg font-bold text-green-600">{formatPrice(order.total)}</span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-500">
                            Recibirás un correo con los detalles de tu pedido.
                        </p>
                    </div>
                )}

                {paymentId && (
                    <p className="text-xs text-gray-400 mb-4">
                        Referencia de pago: {paymentId}
                    </p>
                )}

                <div className="space-y-3">
                    {order && (
                        <Link
                            href={`/cuenta/pedidos/${order.orderNumber}`}
                            className="block w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                        >
                            Ver mi pedido
                        </Link>
                    )}
                    <Link
                        href="/catalogo"
                        className="block w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                        Seguir comprando
                    </Link>
                    <Link
                        href="/"
                        className="block w-full py-2 text-gray-500 hover:text-gray-700 transition text-sm"
                    >
                        Volver al inicio
                    </Link>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        ¿Tienes preguntas? Escríbenos a{' '}
                        <a href="mailto:soporte@mexilux.com" className="text-green-600 hover:underline">
                            soporte@mexilux.com
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            </main>
        }>
            <SuccessContent />
        </Suspense>
    );
}
