'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Mock products for search
const ALL_PRODUCTS = [
    {
        id: 'prod-1',
        name: 'Aviator Classic',
        brand: 'Ray-Ban',
        category: 'Lentes de Sol',
        price: 3499,
        image: '🕶️',
        slug: 'ray-ban-aviator-classic',
    },
    {
        id: 'prod-2',
        name: 'Holbrook',
        brand: 'Oakley',
        category: 'Lentes de Sol',
        price: 2899,
        image: '🕶️',
        slug: 'oakley-holbrook',
    },
    {
        id: 'prod-3',
        name: 'GG0061S',
        brand: 'Gucci',
        category: 'Oftálmicos',
        price: 6999,
        image: '👓',
        slug: 'gucci-gg0061s',
    },
    {
        id: 'prod-4',
        name: 'FT5401',
        brand: 'Tom Ford',
        category: 'Oftálmicos',
        price: 5499,
        image: '👓',
        slug: 'tom-ford-ft5401',
    },
    {
        id: 'prod-5',
        name: 'Wayfarer',
        brand: 'Ray-Ban',
        category: 'Lentes de Sol',
        price: 3299,
        image: '🕶️',
        slug: 'ray-ban-wayfarer',
    },
    {
        id: 'prod-6',
        name: 'Clubmaster',
        brand: 'Ray-Ban',
        category: 'Oftálmicos',
        price: 3599,
        image: '👓',
        slug: 'ray-ban-clubmaster',
    },
];

const POPULAR_SEARCHES = [
    'Ray-Ban',
    'Lentes de sol',
    'Oftálmicos',
    'Oakley',
    'Progresivos',
    'Blue light',
];

export default function SearchPageClient() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<typeof ALL_PRODUCTS>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const formatPrice = (price: number) => `$${price.toLocaleString('es-MX')}`;

    // Perform search
    const handleSearch = (searchQuery: string) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setHasSearched(true);
        const filtered = ALL_PRODUCTS.filter(
            (product) =>
                product.name.toLowerCase().includes(q) ||
                product.brand.toLowerCase().includes(q) ||
                product.category.toLowerCase().includes(q)
        );
        setResults(filtered);
    };

    // Search on query change with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Search on initial load if query param exists
    useEffect(() => {
        if (initialQuery) {
            setQuery(initialQuery);
            handleSearch(initialQuery);
        }
    }, [initialQuery]);

    return (
        <main className="search-page">
            <div className="section-container">
                {/* Search header */}
                <header className="search-header">
                    <h1>¿Qué se te perdió?</h1>
                    <div className="search-input-wrapper">
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar lentes, marcas, estilos..."
                            className="search-input"
                            autoFocus
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                </header>

                {/* Popular searches (when no query) */}
                {!hasSearched && (
                    <section className="popular-searches">
                        <h2>Búsquedas populares</h2>
                        <div className="search-tags">
                            {POPULAR_SEARCHES.map((term) => (
                                <button
                                    key={term}
                                    className="search-tag"
                                    onClick={() => setQuery(term)}
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Search results */}
                {hasSearched && (
                    <section className="search-results">
                        <p className="results-count">
                            {results.length === 0
                                ? `No se encontraron resultados para "${query}"`
                                : `${results.length} resultado${results.length !== 1 ? 's' : ''} para "${query}"`}
                        </p>

                        {results.length > 0 && (
                            <div className="products-grid">
                                {results.map((product) => (
                                    <article key={product.id} className="product-card">
                                        <Link href={`/catalogo/${product.slug}`} className="product-image-link">
                                            <div className="product-image">
                                                <span className="product-emoji">{product.image}</span>
                                            </div>
                                        </Link>
                                        <div className="product-info">
                                            <span className="product-brand">{product.brand}</span>
                                            <h3 className="product-name">
                                                <Link href={`/catalogo/${product.slug}`}>
                                                    {product.name}
                                                </Link>
                                            </h3>
                                            <span className="product-category">{product.category}</span>
                                            <div className="product-price">
                                                <span className="price-current">{formatPrice(product.price)}</span>
                                            </div>
                                        </div>
                                        <div className="product-actions">
                                            <Link href={`/catalogo/${product.slug}`} className="btn btn-product">
                                                Ver detalles
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {results.length === 0 && (
                            <div className="no-results">
                                <span className="no-results-icon">🔍</span>
                                <h3>No encontramos lo que buscas</h3>
                                <p>Intenta con otros términos o explora nuestro catálogo</p>
                                <Link href="/catalogo" className="btn btn-primary">
                                    Ver catálogo completo
                                </Link>
                            </div>
                        )}
                    </section>
                )}

                {/* Quick links */}
                <section className="quick-categories">
                    <h2>Explorar por categoría</h2>
                    <div className="categories-links">
                        <Link href="/catalogo?tipo=sol" className="category-link">
                            🕶️ Lentes de Sol
                        </Link>
                        <Link href="/catalogo?tipo=oftalmicos" className="category-link">
                            👓 Oftálmicos
                        </Link>
                        <Link href="/catalogo?genero=hombre" className="category-link">
                            🇲🇽 Mexicano
                        </Link>
                        <Link href="/catalogo?genero=mujer" className="category-link">
                            🇲🇽 Mexicana
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
