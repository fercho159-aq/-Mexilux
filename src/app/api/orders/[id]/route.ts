/**
 * Order Detail API
 * GET: Get order details by ID or order number
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

// GET: Get order details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = request.headers.get('x-user-id');

        // Try to find by ID first, then by order number
        let order = await prisma.orders.findUnique({
            where: { id },
            include: {
                order_items: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
                        last_name: true,
                    }
                }
            }
        });

        // If not found by ID, try order number
        if (!order) {
            order = await prisma.orders.findUnique({
                where: { order_number: id },
                include: {
                    order_items: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            first_name: true,
                            last_name: true,
                        }
                    }
                }
            });
        }

        if (!order) {
            return NextResponse.json(
                { error: 'Pedido no encontrado' },
                { status: 404 }
            );
        }

        // If user is logged in, verify they own the order
        if (userId && order.user_id && order.user_id !== userId) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            );
        }

        // Format order items
        const formattedItems = order.order_items.map(item => {
            const frameSnapshot = item.frame_snapshot as {
                id: string;
                name: string;
                slug: string;
                brand: string;
                basePrice: number;
            };
            const colorSnapshot = item.color_variant_snapshot as {
                id: string;
                colorName: string;
                colorHex: string;
                sku: string;
                images: Array<{ url: string; type: string }>;
            };
            const lensSnapshot = item.lens_configuration_snapshot as {
                usageType: string;
                materialName: string;
                treatmentIds: string[];
                pricing: { total: number };
            } | null;

            return {
                id: item.id,
                frame: {
                    name: frameSnapshot?.name || 'Producto',
                    slug: frameSnapshot?.slug || '',
                    brand: frameSnapshot?.brand || '',
                },
                colorVariant: {
                    colorName: colorSnapshot?.colorName || '',
                    colorHex: colorSnapshot?.colorHex || '',
                    sku: colorSnapshot?.sku || '',
                    image: colorSnapshot?.images?.[0]?.url || '',
                },
                lensConfiguration: lensSnapshot ? {
                    usageType: lensSnapshot.usageType,
                    materialName: lensSnapshot.materialName,
                    price: lensSnapshot.pricing?.total || 0,
                } : null,
                quantity: item.quantity,
                unitPrice: Number(item.unit_price),
                totalPrice: Number(item.total_price),
                productionStatus: item.production_status,
                productionNotes: item.production_notes,
            };
        });

        // Parse addresses
        const shippingAddress = order.shipping_address as {
            street: string;
            streetLine2?: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            name?: string;
            phone?: string;
        };

        const billingAddress = order.billing_address as typeof shippingAddress | null;

        const formattedOrder = {
            id: order.id,
            orderNumber: order.order_number,
            status: order.status,
            statusLabel: getStatusLabel(order.status),

            // Customer info (only if they own it or it's public tracking)
            customer: order.user ? {
                name: `${order.user.first_name || ''} ${order.user.last_name || ''}`.trim(),
                email: order.user.email,
            } : null,

            // Addresses
            shippingAddress: {
                name: shippingAddress?.name || '',
                street: shippingAddress?.street || '',
                streetLine2: shippingAddress?.streetLine2 || '',
                city: shippingAddress?.city || '',
                state: shippingAddress?.state || '',
                postalCode: shippingAddress?.postalCode || '',
                country: shippingAddress?.country || 'México',
                phone: shippingAddress?.phone || '',
            },
            billingAddress: billingAddress ? {
                name: billingAddress?.name || '',
                street: billingAddress?.street || '',
                streetLine2: billingAddress?.streetLine2 || '',
                city: billingAddress?.city || '',
                state: billingAddress?.state || '',
                postalCode: billingAddress?.postalCode || '',
                country: billingAddress?.country || 'México',
            } : null,

            // Items
            items: formattedItems,

            // Pricing
            subtotal: Number(order.subtotal),
            discount: Number(order.discount),
            shipping: Number(order.shipping),
            tax: Number(order.tax),
            total: Number(order.total),
            couponCode: order.coupon_code,

            // Payment
            paymentMethod: order.payment_method,
            paymentReference: order.payment_reference,
            paidAt: order.paid_at,

            // Shipping
            trackingNumber: order.tracking_number,
            carrier: order.carrier,
            shippedAt: order.shipped_at,
            deliveredAt: order.delivered_at,

            // Notes
            notes: order.notes,

            // Dates
            createdAt: order.created_at,
            updatedAt: order.updated_at,
        };

        return NextResponse.json(formattedOrder);
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { error: 'Error al obtener el pedido' },
            { status: 500 }
        );
    }
}

// Helper to get status label in Spanish
function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending_payment: 'Pendiente de pago',
        payment_confirmed: 'Pago confirmado',
        in_production: 'En producción',
        quality_control: 'Control de calidad',
        ready_for_shipping: 'Listo para enviar',
        shipped: 'Enviado',
        delivered: 'Entregado',
        cancelled: 'Cancelado',
        returned: 'Devuelto',
    };
    return labels[status] || status;
}
