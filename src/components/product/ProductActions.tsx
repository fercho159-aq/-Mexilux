'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LensOption {
    id: string;
    name: string;
    description: string;
    price: number;
}

const LENS_OPTIONS: LensOption[] = [
    { id: 'blueray', name: 'Blue Ray', description: 'Proteccion luz azul', price: 450 },
    { id: 'polarizado', name: 'Polarizado', description: 'Ideal para sol', price: 1200 },
    { id: 'fotocromatico', name: 'Fotocromatico', description: 'Se oscurece con el sol', price: 1800 },
    { id: 'antirreflejante', name: 'Antirreflejante', description: 'Elimina reflejos', price: 350 },
    { id: 'antirayado', name: 'Anti-Rayado', description: 'Mayor durabilidad', price: 200 },
    { id: 'hidrofobico', name: 'Hidrofobico', description: 'Repele agua y grasa', price: 250 },
    { id: 'tinte', name: 'Tinte de color', description: 'Estilo unico', price: 300 },
];

interface ProductActionsProps {
    slug: string;
    variantId: string;
    basePrice: number;
}

export default function ProductActions({ slug, variantId, basePrice }: ProductActionsProps) {
    const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
    const [showTreatments, setShowTreatments] = useState(false);

    const formatPrice = (price: number) => {
        return `$${price.toLocaleString('es-MX')}`;
    };

    const toggleTreatment = (id: string) => {
        setSelectedTreatments(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const treatmentsTotal = selectedTreatments.reduce((sum, id) => {
        const opt = LENS_OPTIONS.find(o => o.id === id);
        return sum + (opt?.price || 0);
    }, 0);

    const totalPrice = basePrice + treatmentsTotal;

    const treatmentsParam = selectedTreatments.length > 0 ? `&treatments=${selectedTreatments.join(',')}` : '';

    return (
        <div className="lens-config-section">
            <div className="config-options">

                {/* Toggle de tratamientos */}
                <div style={{ marginBottom: '16px' }}>
                    <button
                        onClick={() => setShowTreatments(!showTreatments)}
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: showTreatments ? '#152132' : '#f5f5f7',
                            color: showTreatments ? 'white' : '#152132',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '14px',
                            fontWeight: 600,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            <span>
                                Agregar tratamientos
                                {selectedTreatments.length > 0 && (
                                    <span style={{
                                        marginLeft: '8px',
                                        fontSize: '12px',
                                        opacity: 0.7,
                                    }}>
                                        ({selectedTreatments.length} seleccionados)
                                    </span>
                                )}
                            </span>
                        </span>
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{
                                transform: showTreatments ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s',
                            }}
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    {/* Lista de tratamientos acumulables */}
                    {showTreatments && (
                        <div style={{
                            marginTop: '8px',
                            background: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        }}>
                            {LENS_OPTIONS.map((option) => {
                                const isSelected = selectedTreatments.includes(option.id);
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => toggleTreatment(option.id)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: isSelected ? '#f0fdf4' : '#fff',
                                            border: 'none',
                                            borderBottom: '1px solid #f1f5f9',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            textAlign: 'left',
                                            transition: 'background 0.15s ease',
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {/* Checkbox visual */}
                                            <span style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '6px',
                                                border: isSelected ? 'none' : '2px solid #cbd5e1',
                                                background: isSelected ? '#16a34a' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                transition: 'all 0.15s ease',
                                            }}>
                                                {isSelected && (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </span>
                                            <span>
                                                <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a' }}>{option.name}</strong>
                                                <small style={{ color: '#64748b', fontSize: '11px' }}>{option.description}</small>
                                            </span>
                                        </span>
                                        <span style={{
                                            color: isSelected ? '#16a34a' : '#475569',
                                            fontWeight: 600,
                                            fontSize: '13px',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            +{formatPrice(option.price)}
                                        </span>
                                    </button>
                                );
                            })}

                            {/* Subtotal de tratamientos */}
                            {selectedTreatments.length > 0 && (
                                <div style={{
                                    padding: '10px 16px',
                                    background: '#f8fafc',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                }}>
                                    <span style={{ color: '#64748b' }}>Tratamientos ({selectedTreatments.length})</span>
                                    <span style={{ color: '#152132' }}>+{formatPrice(treatmentsTotal)}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Boton principal - Agregar a la bolsa */}
                <Link
                    href={`/carrito?add=${slug}&variant=${variantId}${treatmentsParam}`}
                    className="btn btn-primary btn-config"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    <span className="config-text">
                        <strong>Agregar a la bolsa</strong>
                        <small>{formatPrice(totalPrice)}</small>
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                </Link>

                {/* Boton de cotizacion con graduacion */}
                <a
                    href={`https://wa.me/5215512345678?text=${encodeURIComponent(
                        `Hola, quiero solicitar cotización con graduación para ${slug}${selectedTreatments.length > 0 ? `. Tratamientos: ${selectedTreatments.join(', ')}` : ''}. Precio base: ${formatPrice(totalPrice)}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-config"
                    style={{
                        background: 'linear-gradient(135deg, #006847 0%, #2e7d32 100%)',
                        color: 'white',
                        border: 'none',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <span className="config-text">
                        <strong>Solicitar cotizacion con graduacion</strong>
                        <small>Te asesoramos por WhatsApp</small>
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
