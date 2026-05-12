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

// POST: Create order from cart or checkout items
export async function POST(request: NextRequest) {
    try {
        const sessionId = await getSessionId();
        const userId = request.headers.get('x-user-id') || undefined;

        const body = await request.json();
        const { shippingAddress, billingAddress, paymentMethod, paymentReference, items: checkoutItems, totals } = body;

        if (!shippingAddress) {
            return NextResponse.json(
                { error: 'Dirección de envío requerida' },
                { status: 400 }
            );
        }

        let cartItems: any[] = [];
        let orderSubtotal = 0;
        let orderDiscount = 0;
        let orderShipping = 0;
        let orderTax = 0;
        let orderTotal = 0;
        let couponCode: string | null = null;

        // If checkout items are provided (direct buy), use them
        if (checkoutItems && Array.isArray(checkoutItems) && checkoutItems.length > 0) {
            cartItems = checkoutItems;
            orderSubtotal = totals?.subtotal || checkoutItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
            orderDiscount = totals?.discount || 0;
            orderShipping = totals?.shipping || 0;
            orderTax = totals?.tax || 0;
            orderTotal = totals?.total || (orderSubtotal + orderShipping - orderDiscount);
        } else {
            // Get user's cart from DB
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

            cartItems = cart.cart_items;
            orderSubtotal = Number(cart.subtotal);
            orderDiscount = Number(cart.discount);
            orderShipping = Number(cart.shipping);
            orderTax = Number(cart.tax);
            orderTotal = Number(cart.total);
            couponCode = cart.coupon_code;
        }

        // Verify stock availability for all items
        for (const item of cartItems) {
            const variantId = item.color_variant_id || item.variantId;
            const currentStock = await prisma.frame_color_variants.findUnique({
                where: { id: variantId },
                select: { stock_quantity: true }
            });

            if (!currentStock || currentStock.stock_quantity < item.quantity) {
                return NextResponse.json(
                    {
                        error: `Stock insuficiente para ${item.frame?.name || item.name || 'producto'}`,
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
                    subtotal: orderSubtotal,
                    discount: orderDiscount,
                    shipping: orderShipping,
                    tax: orderTax,
                    total: orderTotal,
                    coupon_code: couponCode,
                    payment_method: paymentMethod || null,
                    payment_reference: paymentReference || null,
                }
            });

            // Create order items with snapshots
            for (const cartItem of cartItems) {
                // Handle both DB cart items and checkout items
                const isCheckoutItem = !!cartItem.slug;
                
                // Create snapshot of frame data
                const frameSnapshot = isCheckoutItem ? {
                    id: cartItem.id || cartItem.slug,
                    name: cartItem.name,
                    slug: cartItem.slug,
                    brand: cartItem.brand || '',
                    basePrice: cartItem.price,
                } : {
                    id: cartItem.frame.id,
                    name: cartItem.frame.name,
                    slug: cartItem.frame.slug,
                    brand: cartItem.frame.brand?.name || '',
                    basePrice: Number(cartItem.frame.base_price),
                };

                // Create snapshot of color variant
                const colorVariantSnapshot = isCheckoutItem ? {
                    id: cartItem.variantId || cartItem.id,
                    colorName: cartItem.variant || 'Estándar',
                    colorHex: null,
                    sku: null,
                    images: cartItem.image ? [{ url: cartItem.image, type: 'front' }] : [],
                } : {
                    id: cartItem.color_variant.id,
                    colorName: cartItem.color_variant.color_name,
                    colorHex: cartItem.color_variant.color_hex,
                    sku: cartItem.color_variant.sku,
                    images: cartItem.color_variant.frame_images.map((img: any) => ({
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

                const unitPrice = isCheckoutItem ? cartItem.price : Number(cartItem.unit_price);
                const quantity = cartItem.quantity;

                await tx.order_items.create({
                    data: {
                        order_id: newOrder.id,
                        frame_snapshot: frameSnapshot,
                        color_variant_snapshot: colorVariantSnapshot,
                        ...(lensConfigSnapshot && { lens_configuration_snapshot: lensConfigSnapshot }),
                        quantity: quantity,
                        unit_price: unitPrice,
                        total_price: unitPrice * quantity,
                        production_status: 'pending',
                    }
                });

                // Update stock
                const variantId = isCheckoutItem ? cartItem.variantId : cartItem.color_variant_id;
                await tx.frame_color_variants.update({
                    where: { id: variantId },
                    data: {
                        stock_quantity: {
                            decrement: quantity
                        }
                    }
                });
            }

            // Only clear DB cart if we used it
            if (!checkoutItems) {
                const cart = await prisma.carts.findFirst({
                    where: userId
                        ? { user_id: userId }
                        : { session_id: sessionId, user_id: null },
                });
                if (cart) {
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
                }
            }

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
