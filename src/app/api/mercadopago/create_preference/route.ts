
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: NextRequest) {
    try {
        // Validar que el access token esté configurado
        const accessToken = process.env.MP_ACCESS_TOKEN;
        if (!accessToken) {
            console.error('MP_ACCESS_TOKEN is not configured');
            return NextResponse.json(
                { error: 'Payment configuration error. Please contact support.' },
                { status: 500 }
            );
        }

        const client = new MercadoPagoConfig({ accessToken });
        const body = await request.json();

        let items = [];

        // Check if we received an array of items or a single item
        if (body.items && Array.isArray(body.items)) {
            items = body.items.map((item: { id?: string; title: string; quantity?: number; price?: number; unit_price?: number }) => ({
                id: item.id || 'item-id',
                title: item.title,
                quantity: Number(item.quantity) || 1,
                unit_price: Number(item.price || item.unit_price),
                currency_id: 'MXN',
            }));
        } else if (body.title && body.price) {
            // Legacy/Single mode support
            items = [{
                id: body.id || 'item-id',
                title: body.title,
                quantity: Number(body.quantity) || 1,
                unit_price: Number(body.price),
                currency_id: 'MXN',
            }];
        } else {
            return NextResponse.json({ error: 'Missing items data' }, { status: 400 });
        }

        // Optional: External reference for tracking (order ID or order number)
        const externalReference = body.orderId || body.orderNumber || body.external_reference;

        // Optional: Payer information
        const payer = body.payer ? {
            name: body.payer.name,
            surname: body.payer.surname,
            email: body.payer.email,
            phone: body.payer.phone ? {
                area_code: body.payer.phone.area_code || '',
                number: body.payer.phone.number || body.payer.phone,
            } : undefined,
        } : undefined;

        // Calculate shipping if provided
        const shipments = body.shipping ? {
            cost: Number(body.shipping),
            mode: 'not_specified' as const,
        } : undefined;

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: items,
                payer: payer,
                shipments: shipments,
                external_reference: externalReference,
                notification_url: body.notificationUrl || `${request.nextUrl.origin}/api/mercadopago/webhook`,
                back_urls: {
                    success: `${request.nextUrl.origin}/checkout/success${externalReference ? `?order=${externalReference}` : ''}`,
                    failure: `${request.nextUrl.origin}/checkout/failure${externalReference ? `?order=${externalReference}` : ''}`,
                    pending: `${request.nextUrl.origin}/checkout/pending${externalReference ? `?order=${externalReference}` : ''}`,
                },
                auto_return: 'approved',
                statement_descriptor: 'MEXILUX',
                expires: true,
                expiration_date_from: new Date().toISOString(),
                expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            },
        });

        return NextResponse.json({ id: result.id });
    } catch (error: any) {
        console.error('Error creating MercadoPago preference:', {
            message: error?.message,
            cause: error?.cause,
            status: error?.status,
        });
        return NextResponse.json(
            { error: 'Error creating payment preference. Please try again.' },
            { status: 500 }
        );
    }
}
