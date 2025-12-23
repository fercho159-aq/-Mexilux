/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PASO 5: REVISIÓN Y CONFIRMACIÓN
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use client';

import React, { useMemo } from 'react';
import { useLensConfiguratorStore } from '@/store/lens-configurator';
import type { Frame } from '@/types';

interface ReviewStepProps {
    frame: Frame;
    isAuthenticated: boolean;
    errors: string[];
    onComplete: () => void;
}

// Datos mock (en producción vendrían del store o API)
const USAGE_TYPE_NAMES: Record<string, string> = {
    single_vision_distance: 'Visión de Lejos',
    single_vision_near: 'Visión de Cerca',
    single_vision_computer: 'Visión de Computadora',
    bifocal: 'Bifocales',
    progressive: 'Progresivos',
    non_prescription: 'Sin Graduación',
};

const MATERIAL_NAMES: Record<string, { name: string; price: number }> = {
    'mat-150': { name: 'Estándar (1.50)', price: 0 },
    'mat-156': { name: 'Delgado (1.56)', price: 400 },
    'mat-160': { name: 'Extra Delgado (1.60)', price: 800 },
    'mat-167': { name: 'Ultra Delgado (1.67)', price: 1200 },
    'mat-174': { name: 'Premium Ultra Fino (1.74)', price: 2000 },
    'mat-poly': { name: 'Policarbonato', price: 600 },
};

const TREATMENT_NAMES: Record<string, { name: string; price: number }> = {
    'treat-ar': { name: 'Antirreflejante Premium', price: 350 },
    'treat-blue': { name: 'Filtro de Luz Azul', price: 450 },
    'treat-photo': { name: 'Fotocromático (Transitions)', price: 1800 },
    'treat-polar': { name: 'Polarizado', price: 1200 },
    'treat-scratch': { name: 'Anti-Rayado Premium', price: 200 },
    'treat-hydro': { name: 'Hidrofóbico + Oleofóbico', price: 250 },
};

const USAGE_TYPE_PRICES: Record<string, number> = {
    single_vision_distance: 500,
    single_vision_near: 500,
    single_vision_computer: 600,
    bifocal: 1200,
    progressive: 2000,
    non_prescription: 0,
};

export function ReviewStep({ frame, errors, onComplete }: ReviewStepProps) {
    const configuration = useLensConfiguratorStore((state) => state.configuration);

    // Calcular precios
    const pricing = useMemo(() => {
        if (!configuration) {
            return {
                frame: 0,
                usageType: 0,
                material: 0,
                treatments: 0,
                subtotal: 0,
                discount: 0,
                total: 0,
            };
        }

        const framePrice = frame.basePrice;
        const usageTypePrice = configuration.usageType
            ? USAGE_TYPE_PRICES[configuration.usageType] || 0
            : 0;
        const materialPrice = configuration.materialId
            ? MATERIAL_NAMES[configuration.materialId]?.price || 0
            : 0;
        const treatmentsPrice = configuration.treatmentIds.reduce((sum, id) => {
            return sum + (TREATMENT_NAMES[id]?.price || 0);
        }, 0);

        const subtotal = framePrice + usageTypePrice + materialPrice + treatmentsPrice;
        const discount = 0; // Aquí se aplicarían cupones

        return {
            frame: framePrice,
            usageType: usageTypePrice,
            material: materialPrice,
            treatments: treatmentsPrice,
            subtotal,
            discount,
            total: subtotal - discount,
        };
    }, [configuration, frame.basePrice]);

    // Formatear moneda
    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString('es-MX')} MXN`;
    };

    // Obtener imagen del frame
    const frameImage = frame.colorVariants.find(
        (v) => v.id === frame.defaultColorVariantId
    )?.images[0]?.url;

    // Formatear receta para display
    const formatPrescription = () => {
        if (!configuration?.manualPrescription) {
            return null;
        }

        const rx = configuration.manualPrescription;
        return {
            rightEye: rx.rightEye,
            leftEye: rx.leftEye,
        };
    };

    const prescription = formatPrescription();

    if (!configuration) {
        return (
            <div className="review-error">
                <p>Error: No se encontró la configuración. Por favor, inicia de nuevo.</p>
            </div>
        );
    }

    return (
        <div className="review-step">
            {/* Header con imagen del producto */}
            <div className="review-product">
                <img
                    src={frameImage || '/placeholder-frame.jpg'}
                    alt={frame.name}
                    className="review-product-image"
                />
                <div className="review-product-info">
                    <h3 className="review-product-name">{frame.name}</h3>
                    <p className="review-product-brand">{frame.brand.name}</p>
                    <p className="review-product-price">{formatCurrency(frame.basePrice)}</p>
                </div>
            </div>

            {/* Resumen de configuración */}
            <div className="review-sections">
                {/* Tipo de Uso */}
                <section className="review-section">
                    <h4 className="section-title">
                        <span className="section-number">1</span>
                        Tipo de Uso
                    </h4>
                    <div className="section-content">
                        <span className="config-value">
                            {configuration.usageType
                                ? USAGE_TYPE_NAMES[configuration.usageType]
                                : 'No seleccionado'}
                        </span>
                        {pricing.usageType > 0 && (
                            <span className="config-price">
                                +{formatCurrency(pricing.usageType)}
                            </span>
                        )}
                    </div>
                </section>

                {/* Receta */}
                <section className="review-section">
                    <h4 className="section-title">
                        <span className="section-number">2</span>
                        Receta Médica
                    </h4>
                    <div className="section-content">
                        {configuration.usageType === 'non_prescription' ? (
                            <span className="config-value">Sin graduación</span>
                        ) : prescription ? (
                            <div className="prescription-summary">
                                <table className="rx-summary-table" aria-label="Resumen de receta">
                                    <thead>
                                        <tr>
                                            <th>Ojo</th>
                                            <th>Esfera</th>
                                            <th>Cilindro</th>
                                            <th>Eje</th>
                                            <th>PD</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Derecho</td>
                                            <td>{prescription.rightEye.sphere.toFixed(2)}</td>
                                            <td>
                                                {prescription.rightEye.cylinder?.toFixed(2) || '-'}
                                            </td>
                                            <td>{prescription.rightEye.axis || '-'}°</td>
                                            <td>{prescription.rightEye.pd}mm</td>
                                        </tr>
                                        <tr>
                                            <td>Izquierdo</td>
                                            <td>{prescription.leftEye.sphere.toFixed(2)}</td>
                                            <td>
                                                {prescription.leftEye.cylinder?.toFixed(2) || '-'}
                                            </td>
                                            <td>{prescription.leftEye.axis || '-'}°</td>
                                            <td>{prescription.leftEye.pd}mm</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : configuration.uploadedPrescriptionUrl ? (
                            <span className="config-value">
                                ✅ Imagen de receta subida
                            </span>
                        ) : configuration.appointmentId ? (
                            <span className="config-value">
                                📅 Pendiente de cita médica
                            </span>
                        ) : (
                            <span className="config-value config-warning">
                                ⚠️ No se ha proporcionado receta
                            </span>
                        )}
                    </div>
                </section>

                {/* Material */}
                <section className="review-section">
                    <h4 className="section-title">
                        <span className="section-number">3</span>
                        Material del Cristal
                    </h4>
                    <div className="section-content">
                        <span className="config-value">
                            {configuration.materialId
                                ? MATERIAL_NAMES[configuration.materialId]?.name
                                : 'No seleccionado'}
                        </span>
                        {pricing.material > 0 && (
                            <span className="config-price">
                                +{formatCurrency(pricing.material)}
                            </span>
                        )}
                    </div>
                </section>

                {/* Tratamientos */}
                <section className="review-section">
                    <h4 className="section-title">
                        <span className="section-number">4</span>
                        Tratamientos
                    </h4>
                    <div className="section-content">
                        {configuration.treatmentIds.length === 0 ? (
                            <span className="config-value">Sin tratamientos adicionales</span>
                        ) : (
                            <ul className="treatments-list">
                                {configuration.treatmentIds.map((treatmentId) => {
                                    const treatment = TREATMENT_NAMES[treatmentId];
                                    return (
                                        <li key={treatmentId} className="treatment-item">
                                            <span className="treatment-name">
                                                {treatment?.name || treatmentId}
                                            </span>
                                            <span className="treatment-price">
                                                +{formatCurrency(treatment?.price || 0)}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </section>
            </div>

            {/* Desglose de precios */}
            <div className="price-breakdown">
                <h4 className="breakdown-title">Resumen de Precio</h4>

                <dl className="breakdown-list">
                    <div className="breakdown-row">
                        <dt>Montura</dt>
                        <dd>{formatCurrency(pricing.frame)}</dd>
                    </div>

                    {pricing.usageType > 0 && (
                        <div className="breakdown-row">
                            <dt>Tipo de lente</dt>
                            <dd>+{formatCurrency(pricing.usageType)}</dd>
                        </div>
                    )}

                    {pricing.material > 0 && (
                        <div className="breakdown-row">
                            <dt>Material</dt>
                            <dd>+{formatCurrency(pricing.material)}</dd>
                        </div>
                    )}

                    {pricing.treatments > 0 && (
                        <div className="breakdown-row">
                            <dt>Tratamientos</dt>
                            <dd>+{formatCurrency(pricing.treatments)}</dd>
                        </div>
                    )}

                    {pricing.discount > 0 && (
                        <div className="breakdown-row discount">
                            <dt>Descuento</dt>
                            <dd>-{formatCurrency(pricing.discount)}</dd>
                        </div>
                    )}

                    <div className="breakdown-row total">
                        <dt>Total</dt>
                        <dd>{formatCurrency(pricing.total)}</dd>
                    </div>
                </dl>
            </div>

            {/* Tiempo de producción */}
            <div className="production-notice" role="note">
                <span className="notice-icon" aria-hidden="true">⏱️</span>
                <div className="notice-content">
                    <strong>Tiempo estimado de producción:</strong>
                    <p>
                        {configuration.usageType === 'progressive'
                            ? '7-10 días hábiles'
                            : configuration.usageType === 'bifocal'
                                ? '5-7 días hábiles'
                                : '3-5 días hábiles'}
                    </p>
                </div>
            </div>

            {/* Garantía */}
            <div className="warranty-notice" role="note">
                <span className="notice-icon" aria-hidden="true">🛡️</span>
                <div className="notice-content">
                    <strong>Garantía incluida:</strong>
                    <ul>
                        <li>1 año en defectos de fabricación</li>
                        <li>30 días de adaptación para progresivos</li>
                        <li>Ajustes gratuitos de por vida</li>
                    </ul>
                </div>
            </div>

            {/* Errores globales */}
            {errors.length > 0 && (
                <div className="review-errors" role="alert">
                    <h4>Por favor corrige los siguientes errores:</h4>
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* CTA */}
            <div className="review-cta">
                <button
                    type="button"
                    onClick={onComplete}
                    className="complete-button"
                    disabled={errors.length > 0}
                    aria-label="Agregar configuración al carrito"
                >
                    <span>Agregar al Carrito</span>
                    <span className="cta-price">{formatCurrency(pricing.total)}</span>
                </button>

                <p className="cta-hint">
                    Podrás revisar y modificar tu pedido antes de pagar
                </p>
            </div>
        </div>
    );
}

export default ReviewStep;
