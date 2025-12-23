/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Admin Authentication Library
 * ═══════════════════════════════════════════════════════════════════════════
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/lib/db/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'mexilux-admin-secret-key-change-in-production';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 días en segundos

export interface AdminSession {
    id: string;
    email: string;
    name: string;
    role: string;
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: AdminSession): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_DURATION });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): AdminSession | null {
    try {
        return jwt.verify(token, JWT_SECRET) as AdminSession;
    } catch {
        return null;
    }
}

/**
 * Login admin user
 * Supports both hashed and plain-text passwords (auto-hashes on first login)
 */
export async function loginAdmin(email: string, password: string): Promise<{
    success: boolean;
    error?: string;
    token?: string;
    admin?: AdminSession;
}> {
    try {
        // Find admin by email
        const admin = await prisma.admin_users.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!admin) {
            return { success: false, error: 'Credenciales inválidas' };
        }

        if (!admin.is_active) {
            return { success: false, error: 'Cuenta desactivada' };
        }

        let isValid = false;
        let needsRehash = false;

        // Check if password_hash looks like a bcrypt hash (starts with $2)
        if (admin.password_hash.startsWith('$2')) {
            // It's a bcrypt hash, verify normally
            isValid = await verifyPassword(password, admin.password_hash);
        } else {
            // It's plain text, compare directly
            isValid = admin.password_hash === password;
            if (isValid) {
                needsRehash = true; // Mark for hashing
            }
        }

        if (!isValid) {
            return { success: false, error: 'Credenciales inválidas' };
        }

        // If password was plain text, hash it now
        if (needsRehash) {
            const hashedPassword = await hashPassword(password);
            await prisma.admin_users.update({
                where: { id: admin.id },
                data: { password_hash: hashedPassword },
            });
            console.log('Password hashed for user:', admin.email);
        }

        // Create session data
        const sessionData: AdminSession = {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
        };

        // Generate token
        const token = generateToken(sessionData);

        // Update last login
        await prisma.admin_users.update({
            where: { id: admin.id },
            data: { last_login_at: new Date() },
        });

        // Store session in database
        await prisma.admin_sessions.create({
            data: {
                admin_user_id: admin.id,
                token,
                expires_at: new Date(Date.now() + SESSION_DURATION * 1000),
            },
        });

        return { success: true, token, admin: sessionData };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Error del servidor' };
    }
}

/**
 * Logout admin (remove session)
 */
export async function logoutAdmin(token: string): Promise<void> {
    try {
        await prisma.admin_sessions.deleteMany({
            where: { token },
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
}

/**
 * Get current admin session from cookies (server-side)
 */
export async function getAdminSession(): Promise<AdminSession | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token) {
            return null;
        }

        // Verify token
        const session = verifyToken(token);
        if (!session) {
            return null;
        }

        // Check if session exists in database and is not expired
        const dbSession = await prisma.admin_sessions.findUnique({
            where: { token },
            include: { admin_user: true },
        });

        if (!dbSession || dbSession.expires_at < new Date()) {
            return null;
        }

        if (!dbSession.admin_user.is_active) {
            return null;
        }

        return session;
    } catch {
        return null;
    }
}

/**
 * Create admin user
 */
export async function createAdminUser(data: {
    email: string;
    password: string;
    name: string;
    role?: 'admin' | 'super_admin' | 'staff';
}): Promise<{ success: boolean; error?: string }> {
    try {
        const existingAdmin = await prisma.admin_users.findUnique({
            where: { email: data.email.toLowerCase() },
        });

        if (existingAdmin) {
            return { success: false, error: 'El email ya está registrado' };
        }

        const passwordHash = await hashPassword(data.password);

        await prisma.admin_users.create({
            data: {
                email: data.email.toLowerCase(),
                password_hash: passwordHash,
                name: data.name,
                role: data.role || 'admin',
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Create admin error:', error);
        return { success: false, error: 'Error al crear usuario' };
    }
}
