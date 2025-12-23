/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PASO 1: SELECCIÓN DE TIPO DE USO
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use client';

import React from 'react';
import { useConfiguratorActions } from '@/store/lens-configurator';
import { useLensConfiguratorStore } from '@/store/lens-configurator';
import type { Frame, LensUsageType } from '@/types';

interface UsageTypeStepProps {
    frame: Frame;
    isAuthenticated: boolean;
    errors: string[];
}

// Opciones de tipo de uso con descripciones
const USAGE_OPTIONS: Array<{
    id: LensUsageType;
    name: string;
    description: string;
    icon: string;
    helpText: string;
    requiresPrescription: boolean;
}> = [
        {
            id: 'single_vision_distance',
            name: 'Visión de Lejos',
            description: 'Para ver claramente a distancia (conducir, ver TV)',
            icon: '🚗',
            helpText: 'Ideal si tienes miopía o hipermetropía sin presbicia',
            requiresPrescription: true,
        },
        {
            id: 'single_vision_near',
            name: 'Visión de Cerca',
            description: 'Para lectura y trabajo de cerca',
            icon: '📖',
            helpText: 'Para quienes necesitan ayuda solo para leer',
            requiresPrescription: true,
        },
        {
            id: 'single_vision_computer',
            name: 'Visión de Computadora',
            description: 'Optimizado para distancia de pantalla (50-70cm)',
            icon: '💻',
            helpText: 'Reduce fatiga visual en uso prolongado de pantallas',
            requiresPrescription: true,
        },
        {
            id: 'progressive',
            name: 'Progresivos',
            description: 'Para ver bien a todas las distancias sin líneas visibles',
            icon: '👓',
            helpText: 'La solución más versátil para presbicia',
            requiresPrescription: true,
        },
        {
            id: 'bifocal',
            name: 'Bifocales',
            description: 'Dos zonas de visión: lejos arriba, cerca abajo',
            icon: '🔲',
            helpText: 'Opción clásica para presbicia con línea divisoria',
            requiresPrescription: true,
        },
        {
            id: 'non_prescription',
            name: 'Sin Graduación',
            description: 'Solo la montura o lentes de sol sin aumento',
            icon: '🕶️',
            helpText: 'Para uso cosmético o protección solar',
            requiresPrescription: false,
        },
    ];

export function UsageTypeStep({ frame, errors }: UsageTypeStepProps) {
    const { setUsageType } = useConfiguratorActions();
    const selectedType = useLensConfiguratorStore(
        (state) => state.configuration?.usageType
    );

    // Filtrar opciones incompatibles con el frame
    const availableOptions = USAGE_OPTIONS.filter((option) => {
        // Si el frame es solo para lentes de sol, solo mostrar 'non_prescription'
        if (frame.sunglassesOnly && option.requiresPrescription) {
            return false;
        }
        // Si el frame no soporta graduación, ocultar opciones que la requieren
        if (!frame.supportsGraduatedLenses && option.requiresPrescription) {
            return false;
        }
        return true;
    });

    const handleSelect = (type: LensUsageType) => {
        setUsageType(type);
    };

    return (
        <div className="usage-type-step">
            <fieldset>
                <legend className="sr-only">
                    Selecciona el tipo de uso para tus lentes
                </legend>

                <div
                    className="options-grid"
                    role="radiogroup"
                    aria-label="Tipo de uso de los lentes"
                >
                    {availableOptions.map((option) => {
                        const isSelected = selectedType === option.id;

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => handleSelect(option.id)}
                                className={`usage-option ${isSelected ? 'selected' : ''}`}
                                role="radio"
                                aria-checked={isSelected}
                                aria-describedby={`${option.id}-help`}
                            >
                                <span className="option-icon" aria-hidden="true">
                                    {option.icon}
                                </span>

                                <div className="option-content">
                                    <span className="option-name">{option.name}</span>
                                    <span className="option-description">{option.description}</span>
                                </div>

                                {isSelected && (
                                    <span className="selected-indicator" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                    </span>
                                )}

                                {/* Help text (visible en hover/focus) */}
                                <span id={`${option.id}-help`} className="option-help">
                                    {option.helpText}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            {/* Nota informativa sobre prescripción */}
            {selectedType && selectedType !== 'non_prescription' && (
                <div className="prescription-notice" role="note">
                    <span className="notice-icon" aria-hidden="true">ℹ️</span>
                    <p>
                        En el siguiente paso necesitarás tu receta médica actualizada.
                        Si no la tienes, puedes{' '}
                        <a href="/citas">agendar una cita</a> con nuestros optometristas.
                    </p>
                </div>
            )}

            {/* Mensaje para lentes de sol */}
            {frame.sunglassesOnly && (
                <div className="sunglasses-notice" role="note">
                    <span className="notice-icon" aria-hidden="true">🕶️</span>
                    <p>
                        Este modelo es exclusivo para lentes de sol y no acepta graduación.
                    </p>
                </div>
            )}
        </div>
    );
}

export default UsageTypeStep;
