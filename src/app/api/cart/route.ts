/**
 * Cart API - Main endpoints
 * GET: Get cart contents
 * POST: Add item to cart
 * DELETE: Clear entire cart
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Helper to get or create session ID
async function getSessionId(): Promise<string> {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('cart_session')?.value;

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        // Note: Cookie will be set in the response
    }

    return sessionId;
}

// Helper to get or create cart
async function getOrCreateCart(userId?: string, sessionId?: string) {
    // Try to find existing cart
    let cart = await prisma.carts.findFirst({
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
                            frame_images: {
                                where: { image_type: 'front' },
                                take: 1,
                            }
                        }
                    },
                    lens_configuration: true,
                }
            }
        }
    });

    // Create new cart if not found
    if (!cart) {
        cart = await prisma.carts.create({
            data: {
                user_id: userId || null,
                session_id: userId ? null : sessionId,
                subtotal: 0,
                discount: 0,
                shipping: 0,
                tax: 0,
                total: 0,
            },
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
                                frame_images: {
                                    where: { image_type: 'front' },
                                    take: 1,
                                }
                            }
                        },
                        lens_configuration: true,
                    }
                }
            }
        });
    }

    return cart;
}

// Helper to recalculate cart totals
async function recalculateCart(cartId: string) {
    const cartItems = await prisma.cart_items.findMany({
        where: { cart_id: cartId }
    });

    const subtotal = cartItems.reduce((sum, item) =>
        sum + Number(item.total_price), 0
    );

    // Free shipping over $1,500 MXN
    const shipping = subtotal >= 1500 ? 0 : 200;
    const tax = 0; // Tax already included in prices
    const total = subtotal + shipping;

    await prisma.carts.update({
        where: { id: cartId },
        data: {
            subtotal,
            shipping,
            tax,
            total,
            updated_at: new Date(),
        }
    });
}

// GET: Retrieve cart
export async function GET(request: NextRequest) {
    try {
        const sessionId = await getSessionId();
        // TODO: Get userId from auth session if logged in
        const userId = request.headers.get('x-user-id') || undefined;

        const cart = await getOrCreateCart(userId, sessionId);

        // Format response
        const formattedCart = {
            id: cart.id,
            items: cart.cart_items.map(item => ({
                id: item.id,
                frameId: item.frame_id,
                name: item.frame.name,
                slug: item.frame.slug,
                brand: item.frame.brand?.name || '',
                colorVariantId: item.color_variant_id,
                colorName: item.color_variant.color_name,
                image: item.color_variant.frame_images?.[0]?.url || '',
                quantity: item.quantity,
                unitPrice: Number(item.unit_price),
                totalPrice: Number(item.total_price),
                lensConfigurationId: item.lens_configuration_id,
                addedAt: item.added_at,
            })),
            subtotal: Number(cart.subtotal),
            discount: Number(cart.discount),
            shipping: Number(cart.shipping),
            tax: Number(cart.tax),
            total: Number(cart.total),
            couponCode: cart.coupon_code,
            itemCount: cart.cart_items.reduce((sum, item) => sum + item.quantity, 0),
        };

        const response = NextResponse.json(formattedCart);

        // Set session cookie if not present
        const cookieStore = await cookies();
        if (!cookieStore.get('cart_session')) {
            response.cookies.set('cart_session', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });
        }

        return response;
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json(
            { error: 'Error al obtener el carrito' },
            { status: 500 }
        );
    }
}

// POST: Add item to cart
export async function POST(request: NextRequest) {
    try {
        const sessionId = await getSessionId();
        const userId = request.headers.get('x-user-id') || undefined;

        const body = await request.json();
        const { frameId, colorVariantId, quantity = 1, lensConfigurationId } = body;

        if (!frameId || !colorVariantId) {
            return NextResponse.json(
                { error: 'frameId y colorVariantId son requeridos' },
                { status: 400 }
            );
        }

        // Get frame details for pricing
        const frame = await prisma.frames.findUnique({
            where: { id: frameId },
            include: {
                brand: true,
                frame_color_variants: {
                    where: { id: colorVariantId },
                    include: {
                        frame_images: {
                            where: { image_type: 'front' },
                            take: 1,
                        }
                    }
                }
            }
        });

        if (!frame) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        const colorVariant = frame.frame_color_variants[0];
        if (!colorVariant) {
            return NextResponse.json(
                { error: 'Variante de color no encontrada' },
                { status: 404 }
            );
        }

        // Check stock
        if (colorVariant.stock_quantity < quantity) {
            return NextResponse.json(
                { error: 'Stock insuficiente' },
                { status: 400 }
            );
        }

        // Get or create cart
        const cart = await getOrCreateCart(userId, sessionId);

        // Calculate price (frame + lens configuration if applicable)
        let unitPrice = Number(frame.base_price);

        if (lensConfigurationId) {
            const lensConfig = await prisma.lens_configurations.findUnique({
                where: { id: lensConfigurationId }
            });
            if (lensConfig?.pricing) {
                const pricing = lensConfig.pricing as { total?: number };
                unitPrice += pricing.total || 0;
            }
        }

        const totalPrice = unitPrice * quantity;

        // Check if item already exists in cart (same frame + color + lens config)
        const existingItem = await prisma.cart_items.findFirst({
            where: {
                cart_id: cart.id,
                frame_id: frameId,
                color_variant_id: colorVariantId,
                lens_configuration_id: lensConfigurationId || null,
            }
        });

        let cartItem;
        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;
            cartItem = await prisma.cart_items.update({
                where: { id: existingItem.id },
                data: {
                    quantity: newQuantity,
                    total_price: unitPrice * newQuantity,
                }
            });
        } else {
            // Create new cart item
            cartItem = await prisma.cart_items.create({
                data: {
                    cart_id: cart.id,
                    frame_id: frameId,
                    color_variant_id: colorVariantId,
                    lens_configuration_id: lensConfigurationId || null,
                    quantity,
                    unit_price: unitPrice,
                    total_price: totalPrice,
                }
            });
        }

        // Recalculate cart totals
        await recalculateCart(cart.id);

        // Return updated cart
        const updatedCart = await getOrCreateCart(userId, sessionId);

        const response = NextResponse.json({
            success: true,
            item: {
                id: cartItem.id,
                frameId: frame.id,
                name: frame.name,
                brand: frame.brand?.name || '',
                colorName: colorVariant.color_name,
                image: colorVariant.frame_images?.[0]?.url || '',
                quantity: cartItem.quantity,
                unitPrice: Number(cartItem.unit_price),
                totalPrice: Number(cartItem.total_price),
            },
            cart: {
                itemCount: updatedCart.cart_items.reduce((sum, item) => sum + item.quantity, 0),
                total: Number(updatedCart.total),
            }
        });

        // Set session cookie if not present
        const cookieStore = await cookies();
        if (!cookieStore.get('cart_session')) {
            response.cookies.set('cart_session', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30,
            });
        }

        return response;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json(
            { error: 'Error al agregar al carrito' },
            { status: 500 }
        );
    }
}

// DELETE: Clear cart
export async function DELETE(request: NextRequest) {
    try {
        const sessionId = await getSessionId();
        const userId = request.headers.get('x-user-id') || undefined;

        const cart = await prisma.carts.findFirst({
            where: userId
                ? { user_id: userId }
                : { session_id: sessionId, user_id: null },
        });

        if (cart) {
            // Delete all cart items
            await prisma.cart_items.deleteMany({
                where: { cart_id: cart.id }
            });

            // Reset cart totals
            await prisma.carts.update({
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

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error clearing cart:', error);
        return NextResponse.json(
            { error: 'Error al vaciar el carrito' },
            { status: 500 }
        );
    }
}
