import { NextResponse } from 'next/server';

interface AsesorRequest {
    phone?: string;
    frameSlug?: string;
    frameName?: string;
    prescription?: unknown;
    config?: unknown;
}

export async function POST(req: Request) {
    let body: AsesorRequest;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
    }

    const phone = body.phone?.toString().trim();
    if (!phone || phone.length < 7) {
        return NextResponse.json({ error: 'Teléfono inválido' }, { status: 400 });
    }

    const lead = {
        receivedAt: new Date().toISOString(),
        phone,
        frameSlug: body.frameSlug,
        frameName: body.frameName,
        prescription: body.prescription,
        config: body.config,
    };
    console.log('[configurador/asesor] Nuevo lead:', lead);

    return NextResponse.json({ ok: true });
}
