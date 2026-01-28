/**
 * MercadoPago Webhook - Handle payment notifications
 * POST: Process payment notifications from MercadoPago
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import crypto from 'crypto';

// Verify webhook signature (optional but recommended)
function verifySignature(
    xSignature: string | null,
    xRequestId: string | null,
    dataId: string,
    secret: string
): boolean {
    if (!xSignature || !secret) return true; // Skip if not configured

    const parts = xSignature.split(',');
    let ts = '';
    let hash = '';

    for (const part of parts) {
        const [key, value] = part.split('=');
        if (key === 'ts') ts = value;
        if (key === 'v1') hash = value;
    }

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(manifest);
    const generatedHash = hmac.digest('hex');

    return generatedHash === hash;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('MercadoPago webhook received:', JSON.stringify(body, null, 2));

        // Get headers for signature verification
        const xSignature = request.headers.get('x-signature');
        const xRequestId = request.headers.get('x-request-id');

        // Verify signature if webhook secret is configured
        const webhookSecret = process.env.MP_WEBHOOK_SECRET;
        if (webhookSecret && body.data?.id) {
            const isValid = verifySignature(xSignature, xRequestId, body.data.id, webhookSecret);
            if (!isValid) {
                console.error('Invalid webhook signature');
                return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
        }

        // Handle different notification types
        const { type, action, data } = body;

        // Only process payment notifications
        if (type !== 'payment') {
            console.log(`Ignoring notification type: ${type}`);
            return NextResponse.json({ received: true });
        }

        const paymentId = data?.id;
        if (!paymentId) {
            console.error('No payment ID in webhook');
            return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
        }

        // Get payment details from MercadoPago API
        const accessToken = process.env.MP_ACCESS_TOKEN;
        if (!accessToken) {
            console.error('MP_ACCESS_TOKEN not configured');
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
        }

        const client = new MercadoPagoConfig({ accessToken });
        const paymentApi = new Payment(client);

        const payment = await paymentApi.get({ id: paymentId });
        console.log('Payment details:', JSON.stringify(payment, null, 2));

        const {
            status: paymentStatus,
            status_detail: statusDetail,
            external_reference: externalReference,
            transaction_amount: transactionAmount,
            date_approved: dateApproved,
            payment_method_id: paymentMethodId,
            payment_type_id: paymentTypeId,
        } = payment;

        // Find the order by payment reference or external reference
        // The external_reference should be the order ID or order number
        let order = null;

        if (externalReference) {
            // Try by order ID first
            order = await prisma.orders.findUnique({
                where: { id: externalReference }
            });

            // Try by order number
            if (!order) {
                order = await prisma.orders.findUnique({
                    where: { order_number: externalReference }
                });
            }
        }

        // If no external reference, try to find by payment reference
        if (!order) {
            order = await prisma.orders.findFirst({
                where: { payment_reference: paymentId.toString() }
            });
        }

        if (!order) {
            console.log(`Order not found for payment ${paymentId}, reference: ${externalReference}`);
            // Still return 200 to acknowledge receipt
            return NextResponse.json({ received: true, orderNotFound: true });
        }

        // Map MercadoPago status to our order status
        let newOrderStatus = order.status;
        let shouldUpdatePayment = false;

        switch (paymentStatus) {
            case 'approved':
                newOrderStatus = 'payment_confirmed';
                shouldUpdatePayment = true;
                break;
            case 'pending':
            case 'in_process':
                // Keep as pending_payment
                newOrderStatus = 'pending_payment';
                break;
            case 'rejected':
            case 'cancelled':
                // Payment failed - order stays pending or gets cancelled
                if (order.status === 'pending_payment') {
                    // Don't automatically cancel, user might retry
                    console.log(`Payment ${paymentStatus} for order ${order.order_number}`);
                }
                break;
            case 'refunded':
            case 'charged_back':
                newOrderStatus = 'returned';
                break;
            default:
                console.log(`Unknown payment status: ${paymentStatus}`);
        }

        // Update order with payment info
        const updateData: {
            payment_reference: string;
            payment_method: string;
            status?: string;
            paid_at?: Date;
            notes?: string;
            updated_at: Date;
        } = {
            payment_reference: paymentId.toString(),
            payment_method: `${paymentTypeId || 'mercadopago'}${paymentMethodId ? ` (${paymentMethodId})` : ''}`,
            updated_at: new Date(),
        };

        if (shouldUpdatePayment) {
            updateData.status = newOrderStatus;
            updateData.paid_at = dateApproved ? new Date(dateApproved) : new Date();
        } else if (newOrderStatus !== order.status && paymentStatus === 'rejected') {
            // Add note about failed payment
            updateData.notes = `${order.notes || ''}\nPago rechazado: ${statusDetail || paymentStatus}`.trim();
        }

        await prisma.orders.update({
            where: { id: order.id },
            data: updateData,
        });

        console.log(`Order ${order.order_number} updated: status=${newOrderStatus}, payment=${paymentStatus}`);

        // TODO: Send confirmation email to customer
        // await sendOrderConfirmationEmail(order.id);

        // TODO: Notify admin about new paid order
        // await notifyAdmin(order.id);

        return NextResponse.json({
            received: true,
            orderNumber: order.order_number,
            status: newOrderStatus,
            paymentStatus,
        });

    } catch (error: unknown) {
        console.error('Webhook error:', error);
        // Still return 200 to prevent MercadoPago from retrying too much
        // Log the error for investigation
        return NextResponse.json({
            received: true,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

// GET: Health check for webhook endpoint
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        endpoint: 'mercadopago-webhook',
        timestamp: new Date().toISOString(),
    });
}
