'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface AdminSidebarProps {
    session: {
        id: string;
        name: string;
        role: string;
    };
}

export function AdminSidebar({ session }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/admin/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const menuItems = [
        {
            section: 'MENÚ PRINCIPAL', items: [
                { icon: '📊', label: 'Dashboard', href: '/admin/dashboard' },
                { icon: '🛒', label: 'Pedidos', href: '/admin/pedidos' },
                { icon: '👓', label: 'Productos', href: '/admin/productos' },
                { icon: '📁', label: 'Categorías', href: '/admin/categorias' },
                { icon: '🏷️', label: 'Marcas', href: '/admin/marcas' },
                { icon: '👥', label: 'Usuarios', href: '/admin/usuarios' },
                { icon: '📅', label: 'Citas', href: '/admin/citas' },
                { icon: '🎟️', label: 'Cupones', href: '/admin/cupones' },
            ]
        },
        {
            section: 'SISTEMA', items: [
                { icon: '⚙️', label: 'Configuración', href: '/admin/configuracion' },
                { icon: '🌐', label: 'Ver Tienda', href: '/', external: true },
            ]
        }
    ];

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
                <span className="logo-text">Mexilux Admin</span>
            </div>

            <nav className="admin-sidebar-nav">
                {menuItems.map((group, idx) => (
                    <div key={idx} className="admin-nav-section">
                        <div className="admin-nav-title">{group.section}</div>
                        {group.items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`admin-nav-link ${pathname.startsWith(item.href) && item.href !== '/' ? 'active' : ''}`}
                                target={item.external ? '_blank' : undefined}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="admin-sidebar-footer">
                <div className="admin-user-info">
                    <div className="admin-user-avatar">
                        {session.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="admin-user-details">
                        <span className="admin-user-name">{session.name}</span>
                        <span className="admin-user-role">
                            {session.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </span>
                    </div>
                </div>
                <button onClick={handleLogout} className="admin-logout-btn">
                    🚪 Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
