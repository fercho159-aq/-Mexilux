import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

interface ProcessPaymentBody {
    token: string;
    issuer_id: string;
    payment_method_id: string;
    transaction_amount: number;
    installments: number;
    payer: {
        email: string;
        identification: {
            type: string;
            number: string;
        };
    };
    description?: string;
    external_reference?: string;
}

export async function POST(request: NextRequest) {
    try {
        const accessToken = process.env.MP_ACCESS_TOKEN;
        if (!accessToken) {
            console.error('MP_ACCESS_TOKEN is not configured');
            return NextResponse.json(
                { error: 'Error de configuración de pagos. Contacta a soporte.' },
                { status: 500 }
            );
        }

        const body: ProcessPaymentBody = await request.json();

        if (!body.token || !body.payment_method_id || !body.transaction_amount || !body.payer?.email) {
            return NextResponse.json(
                { error: 'Faltan datos de pago requeridos.' },
                { status: 400 }
            );
        }

        const client = new MercadoPagoConfig({ accessToken });
        const payment = new Payment(client);

        const paymentBody: any = {
            token: body.token,
            payment_method_id: body.payment_method_id,
            transaction_amount: Number(body.transaction_amount),
            installments: Number(body.installments) || 1,
            payer: {
                email: body.payer.email,
                identification: body.payer.identification,
            },
            description: body.description || 'Compra en Mexilux',
            external_reference: body.external_reference,
            notification_url: `${request.nextUrl.origin}/api/mercadopago/webhook`,
            statement_descriptor: 'MEXILUX',
        };

        if (body.issuer_id && body.issuer_id !== '') {
            paymentBody.issuer_id = Number(body.issuer_id);
        }

        const result = await payment.create({ body: paymentBody });

        const status = result.status;
        const statusDetail = result.status_detail;

        if (status === 'approved') {
            return NextResponse.json({
                success: true,
                status: 'approved',
                payment_id: result.id,
                transaction_amount: result.transaction_amount,
                message: 'Pago aprobado',
            });
        }

        if (status === 'in_process' || status === 'pending') {
            return NextResponse.json({
                success: true,
                status: 'pending',
                payment_id: result.id,
                message: 'Pago en proceso. Te notificaremos cuando se confirme.',
            });
        }

        return NextResponse.json({
            success: false,
            status: status,
            status_detail: statusDetail,
            message: getRejectionMessage(statusDetail),
        }, { status: 400 });

    } catch (error: any) {
        console.error('Error processing payment:', {
            message: error?.message,
            cause: error?.cause,
            status: error?.status,
        });

        return NextResponse.json(
            { error: 'Error al procesar el pago. Intenta de nuevo.' },
            { status: 500 }
        );
    }
}

function getRejectionMessage(statusDetail: string | undefined): string {
    const messages: Record<string, string> = {
        'cc_rejected_bad_filled_card_number': 'Revisa el número de tarjeta.',
        'cc_rejected_bad_filled_date': 'Revisa la fecha de vencimiento.',
        'cc_rejected_bad_filled_security_code': 'Revisa el código de seguridad.',
        'cc_rejected_bad_filled_other': 'Revisa los datos de la tarjeta.',
        'cc_rejected_call_for_authorize': 'Debes autorizar el pago con tu banco.',
        'cc_rejected_card_disabled': 'Llama a tu banco para activar tu tarjeta.',
        'cc_rejected_card_error': 'No pudimos procesar tu tarjeta.',
        'cc_rejected_duplicated_payment': 'Ya hiciste un pago por este monto.',
        'cc_rejected_high_risk': 'El pago fue rechazado por seguridad. Usa otro medio.',
        'cc_rejected_insufficient_amount': 'Fondos insuficientes.',
        'cc_rejected_invalid_installments': 'Tu tarjeta no acepta esa cantidad de meses sin intereses.',
        'cc_rejected_max_attempts': 'Llegaste al límite de intentos. Usa otra tarjeta.',
        'cc_rejected_other_reason': 'Tu banco rechazó el pago.',
    };

    return messages[statusDetail || ''] || 'El pago fue rechazado. Intenta con otro método.';
}
