'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Glasses, FolderOpen, Tag, Users, Calendar, Ticket, Video, Settings, Globe, LogOut } from 'lucide-react';

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
                { icon: <LayoutDashboard size={18} />, label: 'Dashboard', href: '/admin/dashboard' },
                { icon: <ShoppingCart size={18} />, label: 'Pedidos', href: '/admin/pedidos' },
                { icon: <Glasses size={18} />, label: 'Productos', href: '/admin/productos' },
                { icon: <FolderOpen size={18} />, label: 'Categorías', href: '/admin/categorias' },
                { icon: <Tag size={18} />, label: 'Marcas', href: '/admin/marcas' },
                { icon: <Users size={18} />, label: 'Usuarios', href: '/admin/usuarios' },
                { icon: <Calendar size={18} />, label: 'Citas', href: '/admin/citas' },
                { icon: <Ticket size={18} />, label: 'Cupones', href: '/admin/cupones' },
                { icon: <Video size={18} />, label: 'Videos', href: '/admin/videos' },
            ]
        },
        {
            section: 'SISTEMA', items: [
                { icon: <Settings size={18} />, label: 'Configuración', href: '/admin/configuracion' },
                { icon: <Globe size={18} />, label: 'Ver Tienda', href: '/', external: true },
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
                    <LogOut size={16} /> Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
