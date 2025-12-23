/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PASO 4: TRATAMIENTOS Y COBERTURAS
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use client';

import React, { useMemo } from 'react';
import { useConfiguratorActions, useLensConfiguratorStore } from '@/store/lens-configurator';
import type { Frame, LensTreatment, TreatmentCategory } from '@/types';

interface TreatmentsStepProps {
    frame: Frame;
    isAuthenticated: boolean;
    errors: string[];
}

// Datos de tratamientos (en producción vendrían de la API)
const AVAILABLE_TREATMENTS: LensTreatment[] = [
    {
        id: 'treat-ar',
        name: 'Antirreflejante Premium',
        shortName: 'AR Premium',
        description: 'Elimina reflejos para una visión más clara y natural',
        category: 'coating',
        benefits: [
            'Reduce fatiga visual',
            'Mejora apariencia en fotos',
            'Visión nocturna más clara',
            'Fácil de limpiar',
        ],
        incompatibleWith: [],
        requiresMaterials: [],
        excludedUsageTypes: [],
        price: 350,
        currency: 'MXN',
        sortOrder: 1,
        isActive: true,
        isPopular: true,
    },
    {
        id: 'treat-blue',
        name: 'Filtro de Luz Azul',
        shortName: 'Blue Filter',
        description: 'Protege tus ojos de la luz azul de pantallas',
        category: 'blue_light',
        benefits: [
            'Reduce fatiga digital',
            'Mejora calidad del sueño',
            'Protección para uso de pantallas',
            'Ideal para trabajo de oficina',
        ],
        incompatibleWith: ['treat-photo'],
        requiresMaterials: [],
        excludedUsageTypes: [],
        price: 450,
        currency: 'MXN',
        sortOrder: 2,
        isActive: true,
        isPopular: true,
    },
    {
        id: 'treat-photo',
        name: 'Fotocromático (Transitions)',
        shortName: 'Transitions',
        description: 'Se oscurece con la luz solar automáticamente',
        category: 'photochromic',
        benefits: [
            'Adaptación automática',
            '100% protección UV',
            'Comodidad en interiores y exteriores',
            'Sin necesidad de cambiar de lentes',
        ],
        incompatibleWith: ['treat-blue', 'treat-polar'],
        requiresMaterials: [],
        excludedUsageTypes: ['single_vision_computer'],
        price: 1800,
        currency: 'MXN',
        sortOrder: 3,
        isActive: true,
        isPopular: true,
    },
    {
        id: 'treat-polar',
        name: 'Polarizado',
        shortName: 'Polarizado',
        description: 'Elimina reflejos del agua, nieve y superficies brillantes',
        category: 'polarized',
        benefits: [
            'Ideal para conducir',
            'Perfecto para deportes acuáticos',
            'Reduce fatiga visual en exteriores',
            'Colores más vibrantes',
        ],
        incompatibleWith: ['treat-photo'],
        requiresMaterials: [],
        excludedUsageTypes: ['single_vision_computer', 'single_vision_near'],
        price: 1200,
        currency: 'MXN',
        sortOrder: 4,
        isActive: true,
        isPopular: false,
    },
    {
        id: 'treat-scratch',
        name: 'Anti-Rayado Premium',
        shortName: 'Anti-Rayado',
        description: 'Capa extra de protección contra rayones',
        category: 'coating',
        benefits: [
            'Mayor durabilidad',
            'Garantía extendida',
            'Ideal para uso intensivo',
        ],
        incompatibleWith: [],
        requiresMaterials: [],
        excludedUsageTypes: [],
        price: 200,
        currency: 'MXN',
        sortOrder: 5,
        isActive: true,
        isPopular: false,
    },
    {
        id: 'treat-hydro',
        name: 'Hidrofóbico + Oleofóbico',
        shortName: 'Hidrofóbico',
        description: 'Repele agua, grasa y manchas de dedos',
        category: 'coating',
        benefits: [
            'Fácil limpieza',
            'Repele agua de lluvia',
            'Menos manchas de dedos',
        ],
        incompatibleWith: [],
        requiresMaterials: [],
        excludedUsageTypes: [],
        price: 250,
        currency: 'MXN',
        sortOrder: 6,
        isActive: true,
        isPopular: false,
    },
];

// Configuración de categorías
const CATEGORY_CONFIG: Record<
    TreatmentCategory,
    { name: string; description: string; icon: string }
> = {
    coating: {
        name: 'Recubrimientos',
        description: 'Capas protectoras para tus lentes',
        icon: '🛡️',
    },
    tint: {
        name: 'Tintes',
        description: 'Colores para tus lentes',
        icon: '🎨',
    },
    photochromic: {
        name: 'Fotocromático',
        description: 'Lentes que cambian con la luz',
        icon: '🌓',
    },
    blue_light: {
        name: 'Luz Azul',
        description: 'Protección para pantallas',
        icon: '💻',
    },
    polarized: {
        name: 'Polarizado',
        description: 'Anti-reflejos para exteriores',
        icon: '😎',
    },
};

export function TreatmentsStep({ frame, errors }: TreatmentsStepProps) {
    const { toggleTreatment, setTreatments } = useConfiguratorActions();
    const configuration = useLensConfiguratorStore((state) => state.configuration);
    const selectedTreatments = configuration?.treatmentIds || [];
    const usageType = configuration?.usageType;
    const materialId = configuration?.materialId;

    // Filtrar tratamientos disponibles
    const availableTreatments = useMemo(() => {
        return AVAILABLE_TREATMENTS.filter((treatment) => {
            // Filtrar por tipo de uso
            if (usageType && treatment.excludedUsageTypes.includes(usageType)) {
                return false;
            }
            // Filtrar por material requerido
            if (
                treatment.requiresMaterials.length > 0 &&
                materialId &&
                !treatment.requiresMaterials.includes(materialId)
            ) {
                return false;
            }
            return treatment.isActive;
        });
    }, [usageType, materialId]);

    // Agrupar por categoría
    const treatmentsByCategory = useMemo(() => {
        const grouped = new Map<TreatmentCategory, LensTreatment[]>();

        availableTreatments.forEach((treatment) => {
            const existing = grouped.get(treatment.category) || [];
            grouped.set(treatment.category, [...existing, treatment]);
        });

        return grouped;
    }, [availableTreatments]);

    // Verificar incompatibilidades
    const getIncompatibleMessage = (treatment: LensTreatment): string | null => {
        for (const selectedId of selectedTreatments) {
            if (treatment.incompatibleWith.includes(selectedId)) {
                const incompatibleTreatment = AVAILABLE_TREATMENTS.find(
                    (t) => t.id === selectedId
                );
                if (incompatibleTreatment) {
                    return `No compatible con ${incompatibleTreatment.shortName}`;
                }
            }
        }
        return null;
    };

    const isIncompatible = (treatment: LensTreatment): boolean => {
        return getIncompatibleMessage(treatment) !== null;
    };

    const handleToggle = (treatmentId: string) => {
        const treatment = AVAILABLE_TREATMENTS.find((t) => t.id === treatmentId);
        if (!treatment) return;

        // Si ya está seleccionado, deseleccionar
        if (selectedTreatments.includes(treatmentId)) {
            toggleTreatment(treatmentId);
            return;
        }

        // Si no es incompatible, agregar
        if (!isIncompatible(treatment)) {
            toggleTreatment(treatmentId);
        }
    };

    // Calcular total
    const totalTreatmentsPrice = useMemo(() => {
        return selectedTreatments.reduce((sum, id) => {
            const treatment = AVAILABLE_TREATMENTS.find((t) => t.id === id);
            return sum + (treatment?.price || 0);
        }, 0);
    }, [selectedTreatments]);

    const formatPrice = (price: number) => {
        return `+$${price.toLocaleString('es-MX')}`;
    };

    return (
        <div className="treatments-step">
            {/* Paquetes populares (bundles predefinidos) */}
            <div className="treatment-bundles">
                <h4>Paquetes Recomendados</h4>
                <div className="bundles-grid">
                    <button
                        type="button"
                        onClick={() => setTreatments(['treat-ar', 'treat-scratch', 'treat-hydro'])}
                        className={`bundle-card ${selectedTreatments.length === 3 &&
                                selectedTreatments.includes('treat-ar') &&
                                selectedTreatments.includes('treat-scratch')
                                ? 'selected'
                                : ''
                            }`}
                    >
                        <span className="bundle-icon" aria-hidden="true">⭐</span>
                        <span className="bundle-name">Esencial</span>
                        <span className="bundle-includes">
                            AR + Anti-Rayado + Hidrofóbico
                        </span>
                        <span className="bundle-price">$800 MXN</span>
                        <span className="bundle-savings">Ahorra $200</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setTreatments(['treat-ar', 'treat-blue', 'treat-scratch', 'treat-hydro'])}
                        className={`bundle-card ${selectedTreatments.length === 4 &&
                                selectedTreatments.includes('treat-blue')
                                ? 'selected'
                                : ''
                            }`}
                    >
                        <span className="bundle-icon" aria-hidden="true">💼</span>
                        <span className="bundle-name">Digital</span>
                        <span className="bundle-includes">
                            AR + Luz Azul + Anti-Rayado + Hidrofóbico
                        </span>
                        <span className="bundle-price">$1,100 MXN</span>
                        <span className="bundle-savings">Ahorra $350</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setTreatments([])}
                        className={`bundle-card ${selectedTreatments.length === 0 ? 'selected' : ''}`}
                    >
                        <span className="bundle-icon" aria-hidden="true">✨</span>
                        <span className="bundle-name">Sin Extras</span>
                        <span className="bundle-includes">Solo el lente base</span>
                        <span className="bundle-price">Incluido</span>
                    </button>
                </div>
            </div>

            <div className="bundle-divider">
                <span>o personaliza tu selección</span>
            </div>

            {/* Tratamientos individuales por categoría */}
            <div className="treatments-categories">
                {Array.from(treatmentsByCategory.entries()).map(([category, treatments]) => {
                    const categoryConfig = CATEGORY_CONFIG[category];

                    return (
                        <div key={category} className="category-section">
                            <h4 className="category-header">
                                <span className="category-icon" aria-hidden="true">
                                    {categoryConfig.icon}
                                </span>
                                <span className="category-name">{categoryConfig.name}</span>
                            </h4>

                            <div className="treatments-list">
                                {treatments.map((treatment) => {
                                    const isSelected = selectedTreatments.includes(treatment.id);
                                    const incompatibleMsg = getIncompatibleMessage(treatment);
                                    const disabled = incompatibleMsg !== null && !isSelected;

                                    return (
                                        <div
                                            key={treatment.id}
                                            className={`treatment-item ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''
                                                }`}
                                        >
                                            <label className="treatment-label">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleToggle(treatment.id)}
                                                    disabled={disabled}
                                                    aria-describedby={`${treatment.id}-desc`}
                                                />

                                                <div className="treatment-content">
                                                    <div className="treatment-header">
                                                        <span className="treatment-name">
                                                            {treatment.name}
                                                            {treatment.isPopular && (
                                                                <span className="popular-badge">Popular</span>
                                                            )}
                                                        </span>
                                                        <span className="treatment-price">
                                                            {formatPrice(treatment.price)}
                                                        </span>
                                                    </div>

                                                    <p
                                                        id={`${treatment.id}-desc`}
                                                        className="treatment-description"
                                                    >
                                                        {treatment.description}
                                                    </p>

                                                    {/* Beneficios (expandibles) */}
                                                    <details className="treatment-benefits">
                                                        <summary>Ver beneficios</summary>
                                                        <ul>
                                                            {treatment.benefits.map((benefit, idx) => (
                                                                <li key={idx}>
                                                                    <span aria-hidden="true">✓</span>
                                                                    {benefit}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </details>

                                                    {/* Mensaje de incompatibilidad */}
                                                    {incompatibleMsg && (
                                                        <span className="incompatible-notice">
                                                            <span aria-hidden="true">⚠️</span>
                                                            {incompatibleMsg}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Indicador visual de selección */}
                                                <span className="checkbox-indicator" aria-hidden="true">
                                                    {isSelected ? (
                                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                        </svg>
                                                    ) : (
                                                        <span className="checkbox-empty" />
                                                    )}
                                                </span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Resumen de selección */}
            <div className="treatments-summary" role="status" aria-live="polite">
                <div className="summary-content">
                    <span className="summary-label">
                        {selectedTreatments.length === 0
                            ? 'Sin tratamientos adicionales'
                            : `${selectedTreatments.length} tratamiento${selectedTreatments.length > 1 ? 's' : ''
                            } seleccionado${selectedTreatments.length > 1 ? 's' : ''}`}
                    </span>
                    <span className="summary-total">
                        {totalTreatmentsPrice === 0
                            ? 'Incluido'
                            : `+$${totalTreatmentsPrice.toLocaleString('es-MX')} MXN`}
                    </span>
                </div>
            </div>

            {/* Nota de garantía */}
            <div className="warranty-note" role="note">
                <span aria-hidden="true">🛡️</span>
                <p>
                    Todos los tratamientos incluyen 1 año de garantía contra defectos de
                    fabricación.
                </p>
            </div>
        </div>
    );
}

export default TreatmentsStep;
