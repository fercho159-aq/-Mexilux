/**
 * Cart Item API - Individual item operations
 * PUT: Update item quantity
 * DELETE: Remove item from cart
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { cookies } from 'next/headers';

// Helper to get session ID
async function getSessionId(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get('cart_session')?.value;
}

// Helper to recalculate cart totals
async function recalculateCart(cartId: string) {
    const cartItems = await prisma.cart_items.findMany({
        where: { cart_id: cartId }
    });

    const subtotal = cartItems.reduce((sum, item) =>
        sum + Number(item.total_price), 0
    );

    const shipping = subtotal >= 1500 ? 0 : 200;
    const tax = 0;
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

// Helper to verify cart ownership
async function verifyCartOwnership(itemId: string, userId?: string, sessionId?: string) {
    const cartItem = await prisma.cart_items.findUnique({
        where: { id: itemId },
        include: {
            cart: true
        }
    });

    if (!cartItem) {
        return { error: 'Item no encontrado', status: 404 };
    }

    const cart = cartItem.cart;

    // Verify ownership
    if (userId) {
        if (cart.user_id !== userId) {
            return { error: 'No autorizado', status: 403 };
        }
    } else {
        if (cart.session_id !== sessionId) {
            return { error: 'No autorizado', status: 403 };
        }
    }

    return { cartItem, cart };
}

// PUT: Update item quantity
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const { itemId } = await params;
        const sessionId = await getSessionId();
        const userId = request.headers.get('x-user-id') || undefined;

        const body = await request.json();
        const { quantity } = body;

        if (typeof quantity !== 'number' || quantity < 1) {
            return NextResponse.json(
                { error: 'Cantidad inválida' },
                { status: 400 }
            );
        }

        // Verify ownership
        const result = await verifyCartOwnership(itemId, userId, sessionId);
        if ('error' in result) {
            return NextResponse.json(
                { error: result.error },
                { status: result.status }
            );
        }

        const { cartItem, cart } = result;

        // Check stock
        const colorVariant = await prisma.frame_color_variants.findUnique({
            where: { id: cartItem.color_variant_id }
        });

        if (colorVariant && colorVariant.stock_quantity < quantity) {
            return NextResponse.json(
                { error: 'Stock insuficiente', availableStock: colorVariant.stock_quantity },
                { status: 400 }
            );
        }

        // Update quantity
        const updatedItem = await prisma.cart_items.update({
            where: { id: itemId },
            data: {
                quantity,
                total_price: Number(cartItem.unit_price) * quantity,
            }
        });

        // Recalculate cart totals
        await recalculateCart(cart.id);

        // Get updated cart totals
        const updatedCart = await prisma.carts.findUnique({
            where: { id: cart.id },
            include: {
                cart_items: true
            }
        });

        return NextResponse.json({
            success: true,
            item: {
                id: updatedItem.id,
                quantity: updatedItem.quantity,
                totalPrice: Number(updatedItem.total_price),
            },
            cart: {
                itemCount: updatedCart?.cart_items.reduce((sum, item) => sum + item.quantity, 0) || 0,
                subtotal: Number(updatedCart?.subtotal || 0),
                shipping: Number(updatedCart?.shipping || 0),
                total: Number(updatedCart?.total || 0),
            }
        });
    } catch (error) {
        console.error('Error updating cart item:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el carrito' },
            { status: 500 }
        );
    }
}

// DELETE: Remove item from cart
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const { itemId } = await params;
        const sessionId = await getSessionId();
        const userId = request.headers.get('x-user-id') || undefined;

        // Verify ownership
        const result = await verifyCartOwnership(itemId, userId, sessionId);
        if ('error' in result) {
            return NextResponse.json(
                { error: result.error },
                { status: result.status }
            );
        }

        const { cart } = result;

        // Delete the item
        await prisma.cart_items.delete({
            where: { id: itemId }
        });

        // Recalculate cart totals
        await recalculateCart(cart.id);

        // Get updated cart
        const updatedCart = await prisma.carts.findUnique({
            where: { id: cart.id },
            include: {
                cart_items: true
            }
        });

        return NextResponse.json({
            success: true,
            cart: {
                itemCount: updatedCart?.cart_items.reduce((sum, item) => sum + item.quantity, 0) || 0,
                subtotal: Number(updatedCart?.subtotal || 0),
                shipping: Number(updatedCart?.shipping || 0),
                total: Number(updatedCart?.total || 0),
            }
        });
    } catch (error) {
        console.error('Error removing cart item:', error);
        return NextResponse.json(
            { error: 'Error al eliminar del carrito' },
            { status: 500 }
        );
    }
}
