/**
 * Admin Logout API Route
 * POST /api/admin/auth/logout
 */

import { NextRequest, NextResponse } from 'next/server';
import { logoutAdmin } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('admin_token')?.value;

        if (token) {
            await logoutAdmin(token);
        }

        const response = NextResponse.json({ success: true });

        // Clear cookie
        response.cookies.set('admin_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Logout API error:', error);
        return NextResponse.json(
            { success: false, error: 'Error del servidor' },
            { status: 500 }
        );
    }
}
