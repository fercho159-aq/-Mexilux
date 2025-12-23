/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PASO 3: SELECCIÓN DE MATERIAL
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use client';

import React from 'react';
import { useConfiguratorActions, useLensConfiguratorStore } from '@/store/lens-configurator';
import { recommendLensIndex } from '@/lib/validations/prescription';
import type { Frame, LensMaterial, LensIndex } from '@/types';

interface MaterialStepProps {
    frame: Frame;
    isAuthenticated: boolean;
    errors: string[];
}

// Datos de materiales (en producción vendrían de la API)
const AVAILABLE_MATERIALS: LensMaterial[] = [
    {
        id: 'mat-150',
        name: 'Estándar (Índice 1.50)',
        description: 'Material tradicional, ideal para graduaciones bajas',
        index: '1.50',
        highPrescriptionSuitable: false,
        maxSphereRecommended: 2,
        thinnessFactor: 1,
        isPolycarbonate: false,
        hasUVProtection: false,
        price: 0,
        currency: 'MXN',
        isActive: true,
    },
    {
        id: 'mat-156',
        name: 'Delgado (Índice 1.56)',
        description: 'Más delgado que el estándar, buena relación calidad-precio',
        index: '1.56',
        highPrescriptionSuitable: false,
        maxSphereRecommended: 4,
        thinnessFactor: 2,
        isPolycarbonate: false,
        hasUVProtection: true,
        price: 400,
        currency: 'MXN',
        isActive: true,
    },
    {
        id: 'mat-160',
        name: 'Extra Delgado (Índice 1.60)',
        description: 'Significativamente más delgado, ideal para graduaciones medias',
        index: '1.60',
        highPrescriptionSuitable: true,
        maxSphereRecommended: 6,
        thinnessFactor: 3,
        isPolycarbonate: false,
        hasUVProtection: true,
        price: 800,
        currency: 'MXN',
        isActive: true,
    },
    {
        id: 'mat-167',
        name: 'Ultra Delgado (Índice 1.67)',
        description: 'Muy delgado y ligero, para graduaciones altas',
        index: '1.67',
        highPrescriptionSuitable: true,
        maxSphereRecommended: 8,
        thinnessFactor: 4,
        isPolycarbonate: false,
        hasUVProtection: true,
        price: 1200,
        currency: 'MXN',
        isActive: true,
    },
    {
        id: 'mat-174',
        name: 'Premium Ultra Fino (Índice 1.74)',
        description: 'El más delgado disponible, para graduaciones muy altas',
        index: '1.74',
        highPrescriptionSuitable: true,
        maxSphereRecommended: 20,
        thinnessFactor: 5,
        isPolycarbonate: false,
        hasUVProtection: true,
        price: 2000,
        currency: 'MXN',
        isActive: true,
    },
    {
        id: 'mat-poly',
        name: 'Policarbonato',
        description: 'Ultra resistente a impactos, ideal para niños y deportes',
        index: '1.60',
        highPrescriptionSuitable: false,
        maxSphereRecommended: 4,
        thinnessFactor: 3,
        isPolycarbonate: true,
        hasUVProtection: true,
        price: 600,
        currency: 'MXN',
        isActive: true,
    },
];

export function MaterialStep({ frame, errors }: MaterialStepProps) {
    const { setMaterial } = useConfiguratorActions();
    const configuration = useLensConfiguratorStore((state) => state.configuration);
    const selectedMaterialId = configuration?.materialId;

    // Obtener graduación para recomendaciones
    const prescription = configuration?.manualPrescription;
    let recommendedIndex: LensIndex = '1.50';
    let maxSphere = 0;

    if (prescription) {
        const rightSphere = Math.abs(prescription.rightEye.sphere);
        const leftSphere = Math.abs(prescription.leftEye.sphere);
        const rightCyl = Math.abs(prescription.rightEye.cylinder || 0);
        const leftCyl = Math.abs(prescription.leftEye.cylinder || 0);

        maxSphere = Math.max(rightSphere, leftSphere);
        const maxCyl = Math.max(rightCyl, leftCyl);

        recommendedIndex = recommendLensIndex(maxSphere, maxCyl);
    }

    // Filtrar materiales compatibles con el frame
    const compatibleMaterials = AVAILABLE_MATERIALS.filter((material) => {
        if (!frame.compatibleLensIndexes.includes(material.index)) {
            return false;
        }
        return material.isActive;
    });

    const handleSelect = (materialId: string) => {
        setMaterial(materialId);
    };

    const formatPrice = (price: number) => {
        if (price === 0) return 'Incluido';
        return `+$${price.toLocaleString('es-MX')} MXN`;
    };

    // Generar barra visual de grosor
    const ThicknessBar = ({ factor }: { factor: number }) => (
        <div className="thickness-bar" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((level) => (
                <span
                    key={level}
                    className={`thickness-segment ${level <= factor ? 'active' : ''}`}
                />
            ))}
        </div>
    );

    return (
        <div className="material-step">
            {/* Recomendación basada en graduación */}
            {prescription && (
                <div className="recommendation-banner" role="note">
                    <span className="rec-icon" aria-hidden="true">💡</span>
                    <p>
                        Basado en tu graduación de <strong>{maxSphere.toFixed(2)}</strong>,
                        te recomendamos un material de índice <strong>{recommendedIndex}</strong> o superior
                        para lentes más delgados y estéticos.
                    </p>
                </div>
            )}

            {/* Grid de materiales */}
            <div
                className="materials-grid"
                role="radiogroup"
                aria-label="Selecciona el material del cristal"
            >
                {compatibleMaterials.map((material) => {
                    const isSelected = selectedMaterialId === material.id;
                    const isRecommended =
                        parseFloat(material.index) >= parseFloat(recommendedIndex);
                    const isOverkill = maxSphere < 2 && parseFloat(material.index) >= 1.67;

                    return (
                        <button
                            key={material.id}
                            type="button"
                            onClick={() => handleSelect(material.id)}
                            className={`material-card ${isSelected ? 'selected' : ''} ${isRecommended ? 'recommended' : ''
                                }`}
                            role="radio"
                            aria-checked={isSelected}
                            aria-describedby={`${material.id}-details`}
                        >
                            {/* Badge de recomendación */}
                            {isRecommended && !isOverkill && (
                                <span className="recommended-badge">Recomendado</span>
                            )}

                            {/* Header */}
                            <div className="material-header">
                                <h4 className="material-name">{material.name}</h4>
                                <span className="material-price">{formatPrice(material.price)}</span>
                            </div>

                            {/* Descripción */}
                            <p className="material-description">{material.description}</p>

                            {/* Detalles */}
                            <div id={`${material.id}-details`} className="material-details">
                                {/* Indicador de delgadez */}
                                <div className="detail-row">
                                    <span className="detail-label">Delgadez:</span>
                                    <ThicknessBar factor={material.thinnessFactor} />
                                    <span className="detail-value">{material.thinnessFactor}/5</span>
                                </div>

                                {/* Características */}
                                <ul className="material-features">
                                    {material.hasUVProtection && (
                                        <li className="feature">
                                            <span aria-hidden="true">☀️</span>
                                            Protección UV
                                        </li>
                                    )}
                                    {material.isPolycarbonate && (
                                        <li className="feature">
                                            <span aria-hidden="true">🛡️</span>
                                            Resistente a impactos
                                        </li>
                                    )}
                                    {material.highPrescriptionSuitable && (
                                        <li className="feature">
                                            <span aria-hidden="true">📐</span>
                                            Apto para graduaciones altas
                                        </li>
                                    )}
                                </ul>

                                {/* Advertencia si el material es excesivo */}
                                {isOverkill && (
                                    <p className="overkill-notice">
                                        <span aria-hidden="true">ℹ️</span>
                                        Para tu graduación, un índice menor es suficiente.
                                    </p>
                                )}
                            </div>

                            {/* Indicador de selección */}
                            {isSelected && (
                                <span className="selected-check" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Comparativa visual de grosor */}
            <div className="thickness-comparison">
                <h4>Comparativa de grosor</h4>
                <p className="comparison-note">
                    Ilustración aproximada del grosor del lente según el índice elegido.
                </p>
                <div className="comparison-graphic" aria-hidden="true">
                    {compatibleMaterials.map((material) => (
                        <div
                            key={material.id}
                            className={`lens-preview ${selectedMaterialId === material.id ? 'selected' : ''
                                }`}
                            style={{
                                '--thickness': `${30 / material.thinnessFactor}px`,
                            } as React.CSSProperties}
                        >
                            <div className="lens-shape" />
                            <span className="lens-label">{material.index}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <details className="material-faq">
                <summary>
                    <span aria-hidden="true">❓</span>
                    ¿Qué índice de lente necesito?
                </summary>
                <div className="faq-content">
                    <p>
                        El índice de refracción determina qué tan delgado puede ser tu lente.
                        A mayor graduación, mayor índice recomendamos:
                    </p>
                    <ul>
                        <li><strong>1.50 - 1.56:</strong> Graduaciones hasta ±2.00</li>
                        <li><strong>1.60:</strong> Graduaciones hasta ±4.00</li>
                        <li><strong>1.67:</strong> Graduaciones hasta ±6.00</li>
                        <li><strong>1.74:</strong> Graduaciones mayores a ±6.00</li>
                    </ul>
                    <p>
                        Elegir un índice más alto del necesario no es malo, pero puede
                        incrementar el costo sin un beneficio estético significativo.
                    </p>
                </div>
            </details>
        </div>
    );
}

export default MaterialStep;
