/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOGIN / REGISTRO - PÁGINA DE AUTENTICACIÓN
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CuentaPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                // Login logic
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Error al iniciar sesión');
                }

                // Store user data
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect based on user type
                if (data.user?.isAdmin) {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/cuenta/dashboard');
                }
            } else {
                // Register logic
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }

                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        name: formData.name,
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Error al registrarse');
                }

                // Redirect to dashboard
                router.push('/cuenta/dashboard');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <main className="auth-page">
            <div className="auth-container">
                {/* Left side - Branding */}
                <div className="auth-branding">
                    <div className="branding-content">
                        <Link href="/" className="auth-logo">
                            <span className="logo-icon">👁️</span>
                            <span className="logo-text">Mexilux</span>
                        </Link>
                        <h1>Bienvenido a Mexilux</h1>
                        <p>Tu destino para armazones premium con esencia mexicana</p>
                        <div className="branding-features">
                            <div className="feature">
                                <span>✓</span> Envío gratis en pedidos +$2,000
                            </div>
                            <div className="feature">
                                <span>✓</span> Garantía de 1 año
                            </div>
                            <div className="feature">
                                <span>✓</span> Diseño 100% mexicano
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        {/* Tabs */}
                        <div className="auth-tabs">
                            <button
                                className={`auth-tab ${isLogin ? 'active' : ''}`}
                                onClick={() => setIsLogin(true)}
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                                onClick={() => setIsLogin(false)}
                            >
                                Registrarse
                            </button>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="auth-error">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="auth-form">
                            {!isLogin && (
                                <div className="form-group">
                                    <label htmlFor="name">Nombre completo</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Tu nombre"
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="email">Correo electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>

                            {!isLogin && (
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required={!isLogin}
                                        minLength={6}
                                    />
                                </div>
                            )}

                            {isLogin && (
                                <div className="form-options">
                                    <label className="remember-me">
                                        <input type="checkbox" name="remember" />
                                        <span>Recordarme</span>
                                    </label>
                                    <Link href="/cuenta/recuperar" className="forgot-password">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-auth-submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="loading-spinner"></span>
                                ) : isLogin ? (
                                    'Iniciar Sesión'
                                ) : (
                                    'Crear Cuenta'
                                )}
                            </button>
                        </form>

                        {/* Admin hint */}
                        <div className="admin-hint">
                            <p>¿Eres administrador? Inicia sesión con tus credenciales de admin.</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .auth-page {
                    min-height: 100vh;
                    background: #f5f5f7;
                }

                .auth-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    min-height: 100vh;
                }

                /* Branding side */
                .auth-branding {
                    background: linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem;
                    position: relative;
                    overflow: hidden;
                }

                .auth-branding::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at 30% 50%, rgba(0, 113, 227, 0.2) 0%, transparent 60%);
                }

                .branding-content {
                    position: relative;
                    z-index: 1;
                    color: white;
                    max-width: 400px;
                }

                .auth-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                    text-decoration: none;
                }

                .logo-icon {
                    font-size: 2rem;
                }

                .logo-text {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: white;
                }

                .branding-content h1 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin: 0 0 1rem 0;
                    line-height: 1.2;
                }

                .branding-content > p {
                    font-size: 1.125rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0 0 2rem 0;
                }

                .branding-features {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .feature {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.9);
                }

                .feature span {
                    color: #0071e3;
                    font-weight: 600;
                }

                /* Form side */
                .auth-form-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem;
                    background: white;
                }

                .auth-form-wrapper {
                    width: 100%;
                    max-width: 400px;
                }

                .auth-tabs {
                    display: flex;
                    gap: 0;
                    margin-bottom: 2rem;
                    background: #f5f5f7;
                    border-radius: 12px;
                    padding: 4px;
                }

                .auth-tab {
                    flex: 1;
                    padding: 0.875rem 1.5rem;
                    border: none;
                    background: transparent;
                    font-size: 1rem;
                    font-weight: 500;
                    color: #6e6e73;
                    cursor: pointer;
                    border-radius: 10px;
                    transition: all 0.2s;
                }

                .auth-tab.active {
                    background: white;
                    color: #1d1d1f;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                }

                .auth-error {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 12px;
                    color: #dc2626;
                    font-size: 0.875rem;
                    margin-bottom: 1.5rem;
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #1d1d1f;
                }

                .form-group input {
                    padding: 0.875rem 1rem;
                    border: 1px solid #d1d1d6;
                    border-radius: 10px;
                    font-size: 1rem;
                    transition: all 0.2s;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #0071e3;
                    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
                }

                .form-options {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.875rem;
                }

                .remember-me {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    color: #6e6e73;
                }

                .remember-me input {
                    width: 16px;
                    height: 16px;
                    accent-color: #0071e3;
                }

                .forgot-password {
                    color: #0071e3;
                    text-decoration: none;
                }

                .forgot-password:hover {
                    text-decoration: underline;
                }

                .btn-auth-submit {
                    padding: 1rem;
                    background: #0071e3;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                }

                .btn-auth-submit:hover:not(:disabled) {
                    background: #0077ed;
                    transform: translateY(-1px);
                }

                .btn-auth-submit:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .loading-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid white;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .auth-divider {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin: 1.5rem 0;
                }

                .auth-divider::before,
                .auth-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #d1d1d6;
                }

                .auth-divider span {
                    font-size: 0.875rem;
                    color: #6e6e73;
                }

                .social-login {
                    display: flex;
                    gap: 1rem;
                }

                .btn-social {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 0.875rem;
                    border: 1px solid #d1d1d6;
                    border-radius: 12px;
                    background: white;
                    font-size: 0.9375rem;
                    font-weight: 500;
                    color: #1d1d1f;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-social:hover {
                    background: #f5f5f7;
                }

                .admin-hint {
                    margin-top: 2rem;
                    padding: 1rem;
                    background: #f5f5f7;
                    border-radius: 12px;
                    text-align: center;
                }

                .admin-hint p {
                    margin: 0;
                    font-size: 0.875rem;
                    color: #6e6e73;
                }

                @media (max-width: 900px) {
                    .auth-container {
                        grid-template-columns: 1fr;
                    }

                    .auth-branding {
                        display: none;
                    }

                    .auth-form-container {
                        min-height: 100vh;
                    }
                }
            `}</style>
        </main>
    );
}
