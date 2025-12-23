/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Script para crear el primer usuario admin
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Ejecutar con: npm run create-admin
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('Creando usuario administrador para Mexilux');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const adminEmail = 'admin@mexilux.com';
    const adminPassword = 'admin123'; // ¡CAMBIAR EN PRODUCCIÓN!
    const adminName = 'Administrador';

    // Check if admin already exists
    const existing = await prisma.admin_users.findUnique({
        where: { email: adminEmail },
    });

    if (existing) {
        console.log('⚠️  El admin ya existe:', adminEmail);
        console.log('   Si necesitas resetear la contraseña, elimina el usuario primero.\n');
        return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create admin
    const admin = await prisma.admin_users.create({
        data: {
            email: adminEmail,
            password_hash: passwordHash,
            name: adminName,
            role: 'super_admin',
        },
    });

    console.log('✅ Usuario admin creado exitosamente!\n');
    console.log('   📧 Email:', adminEmail);
    console.log('   🔑 Contraseña:', adminPassword);
    console.log('   👤 Nombre:', adminName);
    console.log('   🏷️  Rol: Super Admin\n');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después de iniciar sesión!\n');
    console.log('   Accede a: http://localhost:3000/admin/login\n');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Error:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
