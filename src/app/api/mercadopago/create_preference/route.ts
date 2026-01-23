
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
            items = body.items.map((item: any) => ({
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

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: items,
                back_urls: {
                    success: `${request.nextUrl.origin}/checkout/success`,
                    failure: `${request.nextUrl.origin}/checkout/failure`,
                    pending: `${request.nextUrl.origin}/checkout/pending`,
                },
                auto_return: 'approved',
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
