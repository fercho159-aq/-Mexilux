/**
 * Orders API - Main endpoints
 * GET: List user orders
 * POST: Create new order from cart
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { cookies } from 'next/headers';
import { order_status } from '@prisma/client';

// Generate unique order number
function generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MX${year}${month}-${random}`;
}

// Helper to get session ID
async function getSessionId(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get('cart_session')?.value;
}

// GET: List orders for user
export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json(
                { error: 'Autenticación requerida' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');

        const where: { user_id: string; status?: order_status } = { user_id: userId };
        if (status && Object.values(order_status).includes(status as order_status)) {
            where.status = status as order_status;
        }

        const [orders, total] = await Promise.all([
            prisma.orders.findMany({
                where,
                include: {
                    order_items: true,
                },
                orderBy: { created_at: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.orders.count({ where }),
        ]);

        const formattedOrders = orders.map(order => ({
            id: order.id,
            orderNumber: order.order_number,
            status: order.status,
            subtotal: Number(order.subtotal),
            discount: Number(order.discount),
            shipping: Number(order.shipping),
            tax: Number(order.tax),
            total: Number(order.total),
            itemCount: order.order_items.length,
            paymentMethod: order.payment_method,
            trackingNumber: order.tracking_number,
            carrier: order.carrier,
            createdAt: order.created_at,
            shippedAt: order.shipped_at,
            deliveredAt: order.delivered_at,
        }));

        return NextResponse.json({
            orders: formattedOrders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Error al obtener pedidos' },
            { status: 500 }
        );
    }
}

// POST: Create order from cart
export async function POST(request: NextRequest) {
    try {
        const sessionId = await getSessionId();
        const userId = request.headers.get('x-user-id') || undefined;

        const body = await request.json();
        const { shippingAddress, billingAddress, paymentMethod, paymentReference } = body;

        if (!shippingAddress) {
            return NextResponse.json(
                { error: 'Dirección de envío requerida' },
                { status: 400 }
            );
        }

        // Get user's cart
        const cart = await prisma.carts.findFirst({
            where: userId
                ? { user_id: userId }
                : { session_id: sessionId, user_id: null },
            include: {
                cart_items: {
                    include: {
                        frame: {
                            include: {
                                brand: true,
                            }
                        },
                        color_variant: {
                            include: {
                                frame_images: true,
                            }
                        },
                        lens_configuration: {
                            include: {
                                material: true,
                            }
                        },
                    }
                }
            }
        });

        if (!cart || cart.cart_items.length === 0) {
            return NextResponse.json(
                { error: 'El carrito está vacío' },
                { status: 400 }
            );
        }

        // Verify stock availability for all items
        for (const item of cart.cart_items) {
            const currentStock = await prisma.frame_color_variants.findUnique({
                where: { id: item.color_variant_id },
                select: { stock_quantity: true }
            });

            if (!currentStock || currentStock.stock_quantity < item.quantity) {
                return NextResponse.json(
                    {
                        error: `Stock insuficiente para ${item.frame.name}`,
                        itemId: item.id
                    },
                    { status: 400 }
                );
            }
        }

        // Create order within transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create the order
            const newOrder = await tx.orders.create({
                data: {
                    order_number: generateOrderNumber(),
                    user_id: userId || null,
                    status: 'pending_payment',
                    shipping_address: shippingAddress,
                    billing_address: billingAddress || shippingAddress,
                    subtotal: cart.subtotal,
                    discount: cart.discount,
                    shipping: cart.shipping,
                    tax: cart.tax,
                    total: cart.total,
                    coupon_code: cart.coupon_code,
                    payment_method: paymentMethod || null,
                    payment_reference: paymentReference || null,
                }
            });

            // Create order items with snapshots
            for (const cartItem of cart.cart_items) {
                // Create snapshot of frame data
                const frameSnapshot = {
                    id: cartItem.frame.id,
                    name: cartItem.frame.name,
                    slug: cartItem.frame.slug,
                    brand: cartItem.frame.brand?.name || '',
                    basePrice: Number(cartItem.frame.base_price),
                };

                // Create snapshot of color variant
                const colorVariantSnapshot = {
                    id: cartItem.color_variant.id,
                    colorName: cartItem.color_variant.color_name,
                    colorHex: cartItem.color_variant.color_hex,
                    sku: cartItem.color_variant.sku,
                    images: cartItem.color_variant.frame_images.map(img => ({
                        url: img.url,
                        type: img.image_type,
                    })),
                };

                // Create snapshot of lens configuration if present
                const lensConfigSnapshot = cartItem.lens_configuration ? {
                    usageType: cartItem.lens_configuration.usage_type,
                    materialId: cartItem.lens_configuration.material_id,
                    materialName: cartItem.lens_configuration.material?.name || null,
                    treatmentIds: cartItem.lens_configuration.treatment_ids,
                    pricing: cartItem.lens_configuration.pricing,
                } : undefined;

                await tx.order_items.create({
                    data: {
                        order_id: newOrder.id,
                        frame_snapshot: frameSnapshot,
                        color_variant_snapshot: colorVariantSnapshot,
                        ...(lensConfigSnapshot && { lens_configuration_snapshot: lensConfigSnapshot }),
                        quantity: cartItem.quantity,
                        unit_price: cartItem.unit_price,
                        total_price: cartItem.total_price,
                        production_status: 'pending',
                    }
                });

                // Update stock
                await tx.frame_color_variants.update({
                    where: { id: cartItem.color_variant_id },
                    data: {
                        stock_quantity: {
                            decrement: cartItem.quantity
                        }
                    }
                });
            }

            // Clear the cart
            await tx.cart_items.deleteMany({
                where: { cart_id: cart.id }
            });

            await tx.carts.update({
                where: { id: cart.id },
                data: {
                    subtotal: 0,
                    discount: 0,
                    shipping: 0,
                    tax: 0,
                    total: 0,
                    coupon_code: null,
                    updated_at: new Date(),
                }
            });

            return newOrder;
        });

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                orderNumber: order.order_number,
                status: order.status,
                total: Number(order.total),
                createdAt: order.created_at,
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Error al crear el pedido' },
            { status: 500 }
        );
    }
}
