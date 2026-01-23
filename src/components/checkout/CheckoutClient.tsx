
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MercadoPagoButton from './MercadoPagoButton';

interface CheckoutItem {
    id: string;
    slug: string;
    name: string;
    brand: string;
    variant: string;
    image: string;
    price: number;
    quantity: number;
    uvProtection?: string;
}

interface CheckoutClientProps {
    initialItem?: CheckoutItem;
}

export default function CheckoutClient({ initialItem }: CheckoutClientProps) {
    const [items, setItems] = useState<CheckoutItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (initialItem) {
            setItems([initialItem]);
            setLoading(false);
        } else {
            const savedCart = localStorage.getItem('mexilux_cart');
            if (savedCart) {
                try {
                    const cartItems = JSON.parse(savedCart);
                    setItems(cartItems.map((item: any) => ({
                        id: item.id || `${item.slug}-${Date.now()}`,
                        slug: item.slug,
                        name: item.name,
                        brand: item.brand,
                        variant: item.variant,
                        image: item.image,
                        price: item.price,
                        quantity: item.quantity,
                        uvProtection: 'UV400' // Default assumption for premium eyewear
                    })));
                } catch (e) {
                    console.error('Error loading cart:', e);
                }
            }
            setLoading(false);
        }
    }, [initialItem]);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = subtotal >= 1500 ? 0 : 99;
    const total = subtotal + shippingCost;

    const formatPrice = (price: number) => `$${price.toLocaleString('es-MX')}`;

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-500 font-medium animate-pulse">Preparando tu checkout...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-24 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🛒</span>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-gray-900">Tu carrito está vacío</h1>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    Parece que aún no has agregado nada. Explora nuestra colección y encuentra tus lentes ideales.
                </p>
                <Link href="/catalogo" className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <span>Explorar catálogo</span>
                    <span>→</span>
                </Link>
            </div>
        );
    }

    const mpItems = items.map(item => ({
        id: item.slug,
        title: `${item.brand || ''} ${item.name} (${item.variant})`.trim(),
        quantity: item.quantity,
        price: item.price
    }));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

                {/* Columna Izquierda: Información y Pago (7 columnas) */}
                <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">
                    <header className="mb-10">
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6 font-medium">
                            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shadow-sm">1</span>
                            <span className="text-gray-900 font-semibold">Carrito</span>
                            <div className="w-12 h-px bg-gray-300"></div>
                            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-blue-200">2</span>
                            <span className="text-blue-600 font-semibold">Pago</span>
                            <div className="w-12 h-px bg-gray-200"></div>
                            <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-sm font-bold border border-gray-200">3</span>
                            <span>Confirmación</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">Finalizar Compra</h1>
                        <p className="text-lg text-gray-500">Completa tus datos de pago para recibir tus lentes.</p>
                    </header>

                    {/* Banner de seguridad */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex items-start gap-5">
                        <span className="text-3xl">🔒</span>
                        <div>
                            <h3 className="font-bold text-blue-900 text-lg">Compra 100% Segura</h3>
                            <p className="text-blue-700/80 mt-1">Tus datos están protegidos con encriptación SSL de 256 bits de grado bancario.</p>
                        </div>
                    </div>

                    {/* Sección de Pago */}
                    <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <span>💳</span> Método de Pago
                        </h2>

                        <div className="space-y-8">
                            {/* Opción Mercado Pago */}
                            <div className="p-6 md:p-8 rounded-3xl bg-white border-2 border-blue-500 shadow-lg shadow-blue-100/50 relative overflow-hidden transition-all hover:shadow-blue-200/50">
                                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                                    Recomendado
                                </div>
                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
                                        Mercado Pago
                                    </h3>
                                    <div className="flex gap-3 mt-3 opacity-80">
                                        <span className="text-xs border border-gray-200 bg-gray-50 px-2 py-1 rounded-md font-medium text-gray-600">Visa</span>
                                        <span className="text-xs border border-gray-200 bg-gray-50 px-2 py-1 rounded-md font-medium text-gray-600">Mastercard</span>
                                        <span className="text-xs border border-gray-200 bg-gray-50 px-2 py-1 rounded-md font-medium text-gray-600">Amex</span>
                                        <span className="text-xs border border-gray-200 bg-gray-50 px-2 py-1 rounded-md font-medium text-gray-600">OXXO</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <MercadoPagoButton items={mpItems} />
                                </div>

                                <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Procesado de forma segura por Mercado Pago
                                </p>
                            </div>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-gray-100"></div>
                                <span className="flex-shrink-0 mx-6 text-gray-400 text-sm font-medium bg-white px-2">O si prefieres</span>
                                <div className="flex-grow border-t border-gray-100"></div>
                            </div>

                            {/* Opción WhatsApp */}
                            <a
                                href={`https://wa.me/5215512345678?text=Hola, quiero confirmar mi pedido de ${items.length} productos por un total de ${formatPrice(total)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center gap-5 w-full p-6 md:p-8 rounded-3xl border-2 border-dashed border-gray-200 hover:border-green-500/50 hover:bg-green-50/10 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform shadow-sm">
                                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <div className="flex-1 text-left">
                                    <span className="block font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors">Confirmar por WhatsApp</span>
                                    <span className="text-gray-500">Atención personalizada inmediata</span>
                                </div>
                                <span className="text-gray-300 font-bold text-2xl group-hover:text-green-500 group-hover:translate-x-1 transition-all">→</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Resumen (5 columnas) */}
                <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-32">
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                        <div className="p-8 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-gray-900">Resumen del pedido</h2>
                            <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">{items.length} artículos</span>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="group flex gap-5 p-3 -mx-3 hover:bg-gray-50 rounded-2xl transition-colors">
                                        <div className="relative w-24 h-24 flex-shrink-0 bg-white rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden p-2">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain hover:scale-105 transition-transform duration-500"
                                                    sizes="96px"
                                                />
                                            ) : (
                                                <span className="text-3xl">👓</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 py-1 flex flex-col justify-center">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{item.brand}</p>
                                            <h3 className="font-bold text-gray-900 text-base leading-tight mb-2">{item.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">{item.variant}</span>
                                                <span className="text-xs text-gray-400 font-medium">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-right py-1 flex flex-col justify-center">
                                            <p className="font-bold text-gray-900 text-lg">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-8 space-y-4">
                                <div className="flex justify-between text-gray-600 text-base">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-base">
                                    <span>Envío</span>
                                    <span className={shippingCost === 0 ? 'text-green-600 font-bold bg-green-50 px-2.5 py-0.5 rounded-md' : 'font-medium text-gray-900'}>
                                        {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-8">
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-xs text-gray-400 font-medium">Impuestos incluidos</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-4xl font-extrabold text-gray-900 tracking-tight">{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center lg:text-left flex justify-center lg:justify-start pl-2">
                        <Link href="/carrito" className="text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 group p-2">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al carrito
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
