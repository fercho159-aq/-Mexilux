/**
 * API Route: Register
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email y contraseña son requeridos' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.users.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Ya existe una cuenta con este email' },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Parse name
        const nameParts = (name || '').trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Create user
        const user = await prisma.users.create({
            data: {
                email: email.toLowerCase(),
                password_hash: passwordHash,
                first_name: firstName,
                last_name: lastName,
                is_active: true,
            },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
            },
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                role: 'customer', // All registered users are customers
                isAdmin: false,
            },
        });

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
