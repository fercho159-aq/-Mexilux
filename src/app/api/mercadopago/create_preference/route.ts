
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Basic validation
        if (!body.title || !body.price || !body.quantity) {
            return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
        }

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: body.id || 'item-id',
                        title: body.title,
                        quantity: Number(body.quantity),
                        unit_price: Number(body.price),
                        currency_id: 'MXN',
                    },
                ],
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
