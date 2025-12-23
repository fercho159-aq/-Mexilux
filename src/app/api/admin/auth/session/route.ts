/**
 * Admin Session Check API Route
 * GET /api/admin/auth/session
 */

import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/admin';

export async function GET() {
    try {
        const session = await getAdminSession();

        if (!session) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        return NextResponse.json({
            authenticated: true,
            admin: session,
        });
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json(
            { authenticated: false, error: 'Error del servidor' },
            { status: 500 }
        );
    }
}
