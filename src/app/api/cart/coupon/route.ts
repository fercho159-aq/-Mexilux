/**
 * Coupon API - Validate and apply coupons
 * POST: Apply coupon to cart
 * DELETE: Remove coupon from cart
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { cookies } from 'next/headers';

// Helper to get session ID
async function getSessionId(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get('cart_session')?.value;
}

// Helper to recalculate cart totals with coupon
async function recalculateCartWithCoupon(cartId: string, couponCode: string | null) {
    const cart = await prisma.carts.findUnique({
        where: { id: cartId },
        include: { cart_items: true }
    });

    if (!cart) return;

    const subtotal = cart.cart_items.reduce((sum, item) =>
        sum + Number(item.total_price), 0
    );

    let discount = 0;

    if (couponCode) {
        const coupon = await prisma.coupons.findUnique({
            where: { code: couponCode.toUpperCase() }
        });

        if (coupon && coupon.is_active) {
            if (coupon.discount_type === 'percentage') {
                discount = subtotal * (Number(coupon.discount_value) / 100);
            } else if (coupon.discount_type === 'fixed') {
                discount = Math.min(Number(coupon.discount_value), subtotal);
            }
        }
    }

    const shipping = (subtotal - discount) >= 1500 ? 0 : 200;
    const total = subtotal - discount + shipping;

    await prisma.carts.update({
        where: { id: cartId },
        data: {
            subtotal,
            discount,
            shipping,
            total,
            coupon_code: couponCode?.toUpperCase() || null,
            updated_at: new Date(),
        }
    });

    return { subtotal, discount, shipping, total };
}

// POST: Apply coupon to cart
export async function POST(request: NextRequest) {
    try {
        const sessionId = await getSessionId();
        const userId = request.headers.get('x-user-id') || undefined;

        const body = await request.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json(
                { error: 'Código de cupón requerido' },
                { status: 400 }
            );
        }

        const normalizedCode = code.toUpperCase().trim();

        // Find the coupon
        const coupon = await prisma.coupons.findUnique({
            where: { code: normalizedCode }
        });

        if (!coupon) {
            return NextResponse.json(
                { error: 'Cupón no válido' },
                { status: 404 }
            );
        }

        // Validate coupon
        const now = new Date();

        if (!coupon.is_active) {
            return NextResponse.json(
                { error: 'Este cupón ya no está disponible' },
                { status: 400 }
            );
        }

        if (coupon.valid_from && now < coupon.valid_from) {
            return NextResponse.json(
                { error: 'Este cupón aún no está activo' },
                { status: 400 }
            );
        }

        if (coupon.valid_until && now > coupon.valid_until) {
            return NextResponse.json(
                { error: 'Este cupón ha expirado' },
                { status: 400 }
            );
        }

        if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
            return NextResponse.json(
                { error: 'Este cupón ha alcanzado su límite de uso' },
                { status: 400 }
            );
        }

        // Get user's cart
        const cart = await prisma.carts.findFirst({
            where: userId
                ? { user_id: userId }
                : { session_id: sessionId, user_id: null },
            include: { cart_items: true }
        });

        if (!cart || cart.cart_items.length === 0) {
            return NextResponse.json(
                { error: 'El carrito está vacío' },
                { status: 400 }
            );
        }

        // Check minimum purchase
        const subtotal = cart.cart_items.reduce((sum, item) =>
            sum + Number(item.total_price), 0
        );

        if (coupon.min_purchase && subtotal < Number(coupon.min_purchase)) {
            return NextResponse.json(
                {
                    error: `Compra mínima de $${Number(coupon.min_purchase).toLocaleString('es-MX')} requerida`,
                    minPurchase: Number(coupon.min_purchase)
                },
                { status: 400 }
            );
        }

        // Apply coupon and recalculate
        const totals = await recalculateCartWithCoupon(cart.id, normalizedCode);

        // Calculate discount details
        let discountDescription = '';
        if (coupon.discount_type === 'percentage') {
            discountDescription = `${Number(coupon.discount_value)}% de descuento`;
        } else {
            discountDescription = `$${Number(coupon.discount_value).toLocaleString('es-MX')} de descuento`;
        }

        return NextResponse.json({
            success: true,
            coupon: {
                code: coupon.code,
                description: coupon.description || discountDescription,
                discountType: coupon.discount_type,
                discountValue: Number(coupon.discount_value),
            },
            cart: {
                subtotal: totals?.subtotal || 0,
                discount: totals?.discount || 0,
                shipping: totals?.shipping || 0,
                total: totals?.total || 0,
            }
        });

    } catch (error) {
        console.error('Error applying coupon:', error);
        return NextResponse.json(
            { error: 'Error al aplicar el cupón' },
            { status: 500 }
        );
    }
}

// DELETE: Remove coupon from cart
export async function DELETE(request: NextRequest) {
    try {
        const sessionId = await getSessionId();
        const userId = request.headers.get('x-user-id') || undefined;

        // Get user's cart
        const cart = await prisma.carts.findFirst({
            where: userId
                ? { user_id: userId }
                : { session_id: sessionId, user_id: null },
        });

        if (!cart) {
            return NextResponse.json(
                { error: 'Carrito no encontrado' },
                { status: 404 }
            );
        }

        // Remove coupon and recalculate
        const totals = await recalculateCartWithCoupon(cart.id, null);

        return NextResponse.json({
            success: true,
            cart: {
                subtotal: totals?.subtotal || 0,
                discount: 0,
                shipping: totals?.shipping || 0,
                total: totals?.total || 0,
            }
        });

    } catch (error) {
        console.error('Error removing coupon:', error);
        return NextResponse.json(
            { error: 'Error al remover el cupón' },
            { status: 500 }
        );
    }
}
