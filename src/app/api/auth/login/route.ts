/**
 * API Route: Login
 * Supports both regular users and admin users
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email y contraseña son requeridos' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase();

        // First, check if it's an admin user
        const adminUser = await prisma.admin_users.findUnique({
            where: { email: normalizedEmail },
            select: {
                id: true,
                email: true,
                password_hash: true,
                name: true,
                role: true,
                is_active: true,
            },
        });

        if (adminUser) {
            // Verify admin is active
            if (!adminUser.is_active) {
                return NextResponse.json(
                    { error: 'Esta cuenta está desactivada' },
                    { status: 401 }
                );
            }

            // Verify password
            const isValid = await bcrypt.compare(password, adminUser.password_hash);

            if (!isValid) {
                return NextResponse.json(
                    { error: 'Credenciales inválidas' },
                    { status: 401 }
                );
            }

            // Update last login
            await prisma.admin_users.update({
                where: { id: adminUser.id },
                data: { last_login_at: new Date() },
            });

            // Return admin user data
            return NextResponse.json({
                success: true,
                user: {
                    id: adminUser.id,
                    email: adminUser.email,
                    name: adminUser.name,
                    role: adminUser.role, // 'admin' | 'super_admin' | 'staff'
                    isAdmin: true,
                },
            });
        }

        // If not admin, check regular users
        const user = await prisma.users.findUnique({
            where: { email: normalizedEmail },
            select: {
                id: true,
                email: true,
                password_hash: true,
                first_name: true,
                last_name: true,
                is_active: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        if (!user.is_active) {
            return NextResponse.json(
                { error: 'Esta cuenta está desactivada' },
                { status: 401 }
            );
        }

        if (!user.password_hash) {
            return NextResponse.json(
                { error: 'Esta cuenta no tiene contraseña configurada. Por favor usa otro método de inicio de sesión.' },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Return regular user data
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                role: 'customer',
                isAdmin: false,
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
