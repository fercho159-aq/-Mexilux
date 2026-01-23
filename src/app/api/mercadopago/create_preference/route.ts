
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: NextRequest) {
    try {
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
    } catch (error) {
        console.error('Error creating preference:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
