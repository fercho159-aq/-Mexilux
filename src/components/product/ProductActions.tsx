'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LensOption {
    id: string;
    name: string;
    description: string;
    price: number;
    emoji: string;
}

const LENS_OPTIONS: LensOption[] = [
    { id: 'basic', name: 'Sin tratamiento', description: 'Solo armazón', price: 0, emoji: '👓' },
    { id: 'blueray', name: 'Blue Ray', description: 'Protección luz azul', price: 300, emoji: '💙' },
    { id: 'polarizado', name: 'Polarizado', description: 'Ideal para sol', price: 450, emoji: '🕶️' },
    { id: 'fotocromatico', name: 'Fotocromático', description: 'Se oscurece con el sol', price: 550, emoji: '🌓' },
    { id: 'tinte', name: 'Tinte de color', description: 'Estilo único', price: 200, emoji: '🎨' },
];

interface ProductActionsProps {
    slug: string;
    variantId: string;
    basePrice: number;
    formatPrice: (price: number) => string;
}

export default function ProductActions({ slug, variantId, basePrice, formatPrice }: ProductActionsProps) {
    const [selectedLens, setSelectedLens] = useState<string>('basic');
    const [showLensOptions, setShowLensOptions] = useState(false);

    const selectedOption = LENS_OPTIONS.find(opt => opt.id === selectedLens) || LENS_OPTIONS[0];
    const totalPrice = basePrice + selectedOption.price;

    return (
        <div className="lens-config-section">
            <div className="config-options">

                {/* Selector de tipo de lente */}
                <div style={{ marginBottom: '16px' }}>
                    <button
                        onClick={() => setShowLensOptions(!showLensOptions)}
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: '#f5f5f5',
                            border: '2px solid #e0e0e0',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '14px'
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '20px' }}>{selectedOption.emoji}</span>
                            <span>
                                <strong>{selectedOption.name}</strong>
                                {selectedOption.price > 0 && (
                                    <span style={{ color: '#666', marginLeft: '8px' }}>
                                        +{formatPrice(selectedOption.price)}
                                    </span>
                                )}
                            </span>
                        </span>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{
                                transform: showLensOptions ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s'
                            }}
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    {/* Opciones desplegables */}
                    {showLensOptions && (
                        <div style={{
                            marginTop: '8px',
                            background: '#fff',
                            border: '1px solid #e0e0e0',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                            {LENS_OPTIONS.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        setSelectedLens(option.id);
                                        setShowLensOptions(false);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: selectedLens === option.id ? '#f0f7ff' : '#fff',
                                        border: 'none',
                                        borderBottom: '1px solid #f0f0f0',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '18px' }}>{option.emoji}</span>
                                        <span>
                                            <strong style={{ display: 'block', fontSize: '14px' }}>{option.name}</strong>
                                            <small style={{ color: '#666' }}>{option.description}</small>
                                        </span>
                                    </span>
                                    <span style={{
                                        color: option.price > 0 ? '#006847' : '#666',
                                        fontWeight: '600',
                                        fontSize: '14px'
                                    }}>
                                        {option.price > 0 ? `+${formatPrice(option.price)}` : 'Incluido'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Botón principal - Agregar a la bolsa */}
                <Link
                    href={`/carrito?add=${slug}&variant=${variantId}&lens=${selectedLens}`}
                    className="btn btn-primary btn-config"
                >
                    <span className="config-icon">👜</span>
                    <span className="config-text">
                        <strong>Órale pues necio, me lo llevo</strong>
                        <small>{formatPrice(totalPrice)}</small>
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                </Link>

                {/* Botón de compra rápida */}
                <Link
                    href={`/checkout?buy=${slug}&variant=${variantId}&lens=${selectedLens}`}
                    className="btn btn-config"
                    style={{
                        background: 'linear-gradient(135deg, #006847 0%, #2e7d32 100%)',
                        color: 'white',
                        border: 'none'
                    }}
                >
                    <span className="config-icon">⚡</span>
                    <span className="config-text">
                        <strong>¡Lo quiero ya!</strong>
                        <small>Ir directo al pago</small>
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                </Link>

                {/* Info sobre lentes graduados */}
                <p style={{
                    fontSize: '0.875rem',
                    color: '#666',
                    textAlign: 'center',
                    marginTop: '1rem'
                }}>
                    💡 ¿Necesitas lentes graduados? Contáctanos por WhatsApp para cotizar.
                </p>
            </div>
        </div>
    );
}
