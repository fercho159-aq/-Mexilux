/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PÁGINA DE BÚSQUEDA
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Suspense } from 'react';
import { Search } from 'lucide-react';
import SearchPageClient from './SearchPageClient';

// Loading fallback
function SearchLoading() {
    return (
        <main className="search-page">
            <div className="section-container">
                <header className="search-header">
                    <h1>¿Qué se te perdió?</h1>
                    <div className="search-input-wrapper">
                        <input
                            type="search"
                            placeholder="Cargando..."
                            className="search-input"
                            disabled
                        />
                        <span className="search-icon"><Search size={18} /></span>
                    </div>
                </header>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>Cargando búsqueda...</p>
                </div>
            </div>
        </main>
    );
}

export default function BuscarPage() {
    return (
        <Suspense fallback={<SearchLoading />}>
            <SearchPageClient />
        </Suspense>
    );
}
