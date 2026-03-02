'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SHAPES = [
    { value: 'rectangular', label: 'Rectangular' },
    { value: 'round', label: 'Redondo' },
    { value: 'cat_eye', label: 'Cat Eye' },
    { value: 'aviator', label: 'Aviador' },
    { value: 'square', label: 'Cuadrado' },
    { value: 'oval', label: 'Ovalado' },
];

const MATERIALS = [
    { value: 'acetate', label: 'Acetato' },
    { value: 'metal', label: 'Metal' },
    { value: 'titanium', label: 'Titanio' },
    { value: 'tr90', label: 'TR90' },
    { value: 'mixed', label: 'Mixto' },
];

interface CatalogFiltersProps {
    activeShape?: string;
    activeMaterial?: string;
    activeGenero?: string;
}

export default function CatalogFilters({ activeShape, activeMaterial, activeGenero }: CatalogFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const activeFiltersCount = [activeShape, activeMaterial].filter(Boolean).length;

    const buildUrl = (key: string, value: string | null) => {
        const params = new URLSearchParams();
        if (activeGenero) params.set('genero', activeGenero);
        if (activeShape && key !== 'forma') params.set('forma', activeShape);
        if (activeMaterial && key !== 'material') params.set('material', activeMaterial);

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        const qs = params.toString();
        return `/catalogo${qs ? `?${qs}` : ''}`;
    };

    const handleFilter = (key: string, value: string) => {
        const currentValue = key === 'forma' ? activeShape : activeMaterial;
        const newValue = currentValue === value ? null : value;
        router.push(buildUrl(key, newValue));
    };

    const clearAll = () => {
        const params = new URLSearchParams();
        if (activeGenero) params.set('genero', activeGenero);
        const qs = params.toString();
        router.push(`/catalogo${qs ? `?${qs}` : ''}`);
    };

    return (
        <div className="filter-actions" style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1rem',
                    background: isOpen ? '#152132' : '#f5f5f7',
                    color: isOpen ? 'white' : '#152132',
                    border: 'none',
                    borderRadius: '100px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                    <circle cx="8" cy="6" r="2" fill={isOpen ? 'white' : '#152132'} stroke="none" />
                    <circle cx="16" cy="12" r="2" fill={isOpen ? 'white' : '#152132'} stroke="none" />
                    <circle cx="10" cy="18" r="2" fill={isOpen ? 'white' : '#152132'} stroke="none" />
                </svg>
                Filtros
                {activeFiltersCount > 0 && (
                    <span style={{
                        width: '18px',
                        height: '18px',
                        background: isOpen ? 'white' : '#152132',
                        color: isOpen ? '#152132' : 'white',
                        borderRadius: '50%',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {activeFiltersCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                    border: '1px solid #e2e8f0',
                    padding: '1.25rem',
                    width: '280px',
                    zIndex: 100,
                }}>
                    {/* Forma */}
                    <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            color: '#94a3b8',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.5rem',
                        }}>
                            Forma
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                            {SHAPES.map((shape) => (
                                <button
                                    key={shape.value}
                                    onClick={() => handleFilter('forma', shape.value)}
                                    style={{
                                        padding: '0.375rem 0.75rem',
                                        borderRadius: '100px',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: activeShape === shape.value ? '#152132' : '#f1f5f9',
                                        color: activeShape === shape.value ? 'white' : '#475569',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    {shape.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Material */}
                    <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            color: '#94a3b8',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.5rem',
                        }}>
                            Material
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                            {MATERIALS.map((mat) => (
                                <button
                                    key={mat.value}
                                    onClick={() => handleFilter('material', mat.value)}
                                    style={{
                                        padding: '0.375rem 0.75rem',
                                        borderRadius: '100px',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: activeMaterial === mat.value ? '#152132' : '#f1f5f9',
                                        color: activeMaterial === mat.value ? 'white' : '#475569',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    {mat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Clear */}
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={clearAll}
                            style={{
                                width: '100%',
                                padding: '0.625rem',
                                background: '#fef2f2',
                                color: '#ef4444',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
