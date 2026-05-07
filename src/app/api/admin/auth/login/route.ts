/**
 * Admin Login API Route
 * POST /api/admin/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { loginAdmin } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email y contraseña son requeridos' },
                { status: 400 }
            );
        }

        const result = await loginAdmin(email, password);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 401 }
            );
        }

        // Set cookie with token
        const response = NextResponse.json({
            success: true,
            admin: result.admin,
        });

        response.cookies.set('admin_token', result.token!, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json(
            { success: false, error: 'Error del servidor' },
            { status: 500 }
        );
    }
}
