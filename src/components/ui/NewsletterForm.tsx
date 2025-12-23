/**
 * Newsletter Form - Client Component
 */

'use client';

import React, { useState } from 'react';

export function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        setStatus('loading');

        // Simular envío
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setStatus('success');
        setEmail('');

        // Reset after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                aria-label="Correo electrónico"
                className="newsletter-input"
                required
                disabled={status === 'loading'}
            />
            <button
                type="submit"
                className="btn btn-newsletter"
                disabled={status === 'loading'}
            >
                {status === 'loading' ? 'Enviando...' : status === 'success' ? '¡Listo!' : 'Suscribirse'}
            </button>
        </form>
    );
}

export default NewsletterForm;
