/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MI CUENTA - DASHBOARD DE USUARIO
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CuentaDashboardPage() {
    const router = useRouter();
    const [userName, setUserName] = useState('Usuario');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.name) {
                    // Get first name only
                    const firstName = user.name.split(' ')[0];
                    setUserName(firstName);
                }
            } catch (e) {
                console.error('Error parsing user data', e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        sessionStorage.clear();
        router.push('/cuenta');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f7',
            paddingTop: '120px',
            paddingBottom: '60px',
        }}>
            <div style={{
                maxWidth: '500px',
                margin: '0 auto',
                padding: '0 20px',
            }}>
                {/* Welcome Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '40px 30px',
                    textAlign: 'center',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                    marginBottom: '20px',
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #0071e3, #5ac8fa)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '40px',
                        margin: '0 auto 20px',
                    }}>
                        👤
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#1d1d1f',
                        margin: '0 0 8px 0',
                    }}>
                        Hola, {userName}
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#6e6e73',
                        margin: 0,
                    }}>
                        Bienvenido a tu cuenta
                    </p>
                </div>

                {/* Menu Card */}
                <Link href="/cuenta/pedidos" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                    marginBottom: '20px',
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #34c759, #30d158)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        flexShrink: 0,
                    }}>
                        📦
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: '17px',
                            fontWeight: '600',
                            color: '#1d1d1f',
                            marginBottom: '4px',
                        }}>
                            Mis Pedidos
                        </div>
                        <div style={{
                            fontSize: '14px',
                            color: '#6e6e73',
                        }}>
                            Ver historial de compras
                        </div>
                    </div>
                    <div style={{
                        fontSize: '20px',
                        color: '#c7c7cc',
                    }}>
                        ›
                    </div>
                </Link>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        padding: '16px',
                        background: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#ff3b30',
                        cursor: 'pointer',
                        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                    }}
                >
                    🚪 Cerrar sesión
                </button>
            </div>
        </div>
    );
}
