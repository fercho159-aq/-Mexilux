/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LENS CONFIGURATOR WIZARD - COMPONENTE PRINCIPAL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Wizard multi-paso para configurar lentes graduados:
 * 1. Tipo de Uso
 * 2. Receta Médica
 * 3. Material de la Mica
 * 4. Tratamientos
 * 5. Revisión y Confirmación
 * 
 * CONSIDERACIONES DE ACCESIBILIDAD:
 * - Navegación completa por teclado
 * - ARIA labels descriptivos
 * - Focus management entre pasos
 * - Soporte para alto contraste
 * - Tipografía escalable
 */

'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    useLensConfiguratorStore,
    useConfiguratorState,
    useConfiguratorActions,
} from '@/store/lens-configurator';
import type { ConfiguratorStep, Frame } from '@/types';

// Sub-componentes del wizard
import { UsageTypeStep } from './steps/UsageTypeStep';
import { PrescriptionStep } from './steps/PrescriptionStep';
import { MaterialStep } from './steps/MaterialStep';
import { TreatmentsStep } from './steps/TreatmentsStep';
import { ReviewStep } from './steps/ReviewStep';
import { WizardProgress } from './WizardProgress';
import { WizardNavigation } from './WizardNavigation';

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════════

interface LensConfiguratorWizardProps {
    /** La montura seleccionada */
    frame: Frame;

    /** Recetas guardadas del usuario (si está logueado) */
    savedPrescriptions?: Array<{
        id: string;
        name: string;
        issueDate: string;
        isExpired: boolean;
    }>;

    /** Usuario está autenticado */
    isAuthenticated?: boolean;

    /** Callback cuando la configuración se completa */
    onComplete?: (configurationId: string) => void;

    /** Callback cuando el usuario cancela */
    onCancel?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE PASOS
// ═══════════════════════════════════════════════════════════════════════════

const STEPS_CONFIG: Record<
    ConfiguratorStep,
    {
        title: string;
        description: string;
        ariaLabel: string;
    }
> = {
    usage_type: {
        title: '¿Para qué necesitas tus lentes?',
        description: 'Selecciona el tipo de uso principal',
        ariaLabel: 'Paso 1: Seleccionar tipo de uso de los lentes',
    },
    prescription: {
        title: 'Tu receta médica',
        description: 'Ingresa o selecciona tu graduación',
        ariaLabel: 'Paso 2: Ingresar información de la receta médica',
    },
    material: {
        title: 'Material del cristal',
        description: 'Elige el material ideal para tu graduación',
        ariaLabel: 'Paso 3: Seleccionar material de los cristales',
    },
    treatments: {
        title: 'Tratamientos y coberturas',
        description: 'Personaliza tus lentes con protecciones adicionales',
        ariaLabel: 'Paso 4: Seleccionar tratamientos opcionales',
    },
    review: {
        title: 'Revisa tu configuración',
        description: 'Confirma los detalles antes de agregar al carrito',
        ariaLabel: 'Paso 5: Revisar y confirmar la configuración',
    },
};

const STEPS_ORDER: ConfiguratorStep[] = [
    'usage_type',
    'prescription',
    'material',
    'treatments',
    'review',
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export function LensConfiguratorWizard({
    frame,
    savedPrescriptions = [],
    isAuthenticated = false,
    onComplete,
    onCancel,
}: LensConfiguratorWizardProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Refs para manejo de focus
    const stepContainerRef = useRef<HTMLDivElement>(null);
    const announcerRef = useRef<HTMLDivElement>(null);

    // Store
    const {
        configuration,
        currentStep,
        isLoading,
        stepErrors,
        completedSteps,
        progress,
        canProceed,
    } = useConfiguratorState();

    const {
        initConfiguration,
        goToStep,
        nextStep,
        prevStep,
        finalizeConfiguration,
        reset,
    } = useConfiguratorActions();

    // ─────────────────────────────────────────────────────────────────────────
    // INICIALIZACIÓN
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        // Verificar si hay una configuración existente para este frame
        if (!configuration || configuration.frameId !== frame.id) {
            initConfiguration(frame.id, frame.basePrice);
        }

        // Sincronizar paso desde URL si existe
        const stepFromUrl = searchParams.get('step') as ConfiguratorStep | null;
        if (stepFromUrl && STEPS_ORDER.includes(stepFromUrl)) {
            goToStep(stepFromUrl);
        }
    }, [frame.id, frame.basePrice, configuration, initConfiguration, goToStep, searchParams]);

    // ─────────────────────────────────────────────────────────────────────────
    // SINCRONIZACIÓN CON URL
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        // Actualizar URL cuando cambia el paso
        const params = new URLSearchParams(searchParams.toString());
        params.set('step', currentStep);

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [currentStep, router, searchParams]);

    // ─────────────────────────────────────────────────────────────────────────
    // MANEJO DE FOCUS (ACCESIBILIDAD)
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        // Mover focus al contenedor del paso cuando cambia
        if (stepContainerRef.current) {
            stepContainerRef.current.focus();
        }

        // Anunciar el nuevo paso a lectores de pantalla
        if (announcerRef.current) {
            const stepConfig = STEPS_CONFIG[currentStep];
            announcerRef.current.textContent = `${stepConfig.ariaLabel}. ${stepConfig.description}`;
        }
    }, [currentStep]);

    // ─────────────────────────────────────────────────────────────────────────
    // NAVEGACIÓN POR TECLADO
    // ─────────────────────────────────────────────────────────────────────────

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            // Alt + ← = Paso anterior
            if (event.altKey && event.key === 'ArrowLeft') {
                event.preventDefault();
                prevStep();
            }

            // Alt + → = Paso siguiente (si es válido)
            if (event.altKey && event.key === 'ArrowRight' && canProceed) {
                event.preventDefault();
                nextStep();
            }

            // Escape = Cancelar (con confirmación)
            if (event.key === 'Escape' && onCancel) {
                event.preventDefault();
                if (window.confirm('¿Estás seguro de que deseas cancelar la configuración?')) {
                    reset();
                    onCancel();
                }
            }
        },
        [prevStep, nextStep, canProceed, onCancel, reset]
    );

    // ─────────────────────────────────────────────────────────────────────────
    // HANDLERS
    // ─────────────────────────────────────────────────────────────────────────

    const handleStepClick = (step: ConfiguratorStep) => {
        goToStep(step);
    };

    const handleComplete = () => {
        if (!configuration) return;

        finalizeConfiguration();
        onComplete?.(configuration.id);
    };

    const handleCancel = () => {
        if (window.confirm('¿Estás seguro de que deseas cancelar? Perderás tu configuración actual.')) {
            reset();
            onCancel?.();
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER DEL PASO ACTUAL
    // ─────────────────────────────────────────────────────────────────────────

    const renderCurrentStep = () => {
        const stepConfig = STEPS_CONFIG[currentStep];

        const stepProps = {
            frame,
            isAuthenticated,
            errors: stepErrors[currentStep] || [],
        };

        switch (currentStep) {
            case 'usage_type':
                return <UsageTypeStep {...stepProps} />;

            case 'prescription':
                return (
                    <PrescriptionStep
                        {...stepProps}
                        savedPrescriptions={savedPrescriptions}
                    />
                );

            case 'material':
                return <MaterialStep {...stepProps} />;

            case 'treatments':
                return <TreatmentsStep {...stepProps} />;

            case 'review':
                return (
                    <ReviewStep
                        {...stepProps}
                        onComplete={handleComplete}
                    />
                );

            default:
                return null;
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────

    if (!configuration) {
        return (
            <div
                className="lens-configurator-loading"
                role="status"
                aria-label="Cargando configurador"
            >
                <div className="loading-spinner" aria-hidden="true" />
                <p>Preparando el configurador de lentes...</p>
            </div>
        );
    }

    const stepConfig = STEPS_CONFIG[currentStep];
    const currentStepIndex = STEPS_ORDER.indexOf(currentStep);
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === STEPS_ORDER.length - 1;

    return (
        <div
            className="lens-configurator"
            onKeyDown={handleKeyDown}
            role="form"
            aria-label="Configurador de lentes"
        >
            {/* Anunciador para lectores de pantalla */}
            <div
                ref={announcerRef}
                className="sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            />

            {/* Header con información del producto */}
            <header className="configurator-header">
                <div className="product-summary">
                    <img
                        src={
                            frame.colorVariants.find((v) => v.id === frame.defaultColorVariantId)
                                ?.images[0]?.url || '/placeholder-frame.jpg'
                        }
                        alt={frame.name}
                        className="product-thumbnail"
                    />
                    <div className="product-info">
                        <h1 className="product-name">{frame.name}</h1>
                        <p className="product-brand">{frame.brand.name}</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleCancel}
                    className="cancel-button"
                    aria-label="Cancelar configuración y volver al catálogo"
                >
                    <span aria-hidden="true">✕</span>
                    <span className="cancel-text">Cancelar</span>
                </button>
            </header>

            {/* Barra de progreso */}
            <WizardProgress
                steps={STEPS_ORDER}
                stepsConfig={STEPS_CONFIG}
                currentStep={currentStep}
                completedSteps={completedSteps}
                progress={progress}
                onStepClick={handleStepClick}
            />

            {/* Contenido del paso actual */}
            <main
                ref={stepContainerRef}
                className="step-container"
                tabIndex={-1}
                role="region"
                aria-label={stepConfig.ariaLabel}
            >
                <div className="step-header">
                    <h2 className="step-title">{stepConfig.title}</h2>
                    <p className="step-description">{stepConfig.description}</p>
                </div>

                {/* Errores del paso */}
                {stepErrors[currentStep] && stepErrors[currentStep].length > 0 && (
                    <div
                        className="step-errors"
                        role="alert"
                        aria-label="Errores de validación"
                    >
                        <ul>
                            {stepErrors[currentStep].map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Contenido específico del paso */}
                <div className="step-content">
                    {renderCurrentStep()}
                </div>
            </main>

            {/* Navegación del wizard */}
            <WizardNavigation
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                canProceed={canProceed}
                onPrev={prevStep}
                onNext={nextStep}
                onComplete={handleComplete}
            />

            {/* Ayuda contextual */}
            <aside className="configurator-help" aria-label="Ayuda y atajos de teclado">
                <details>
                    <summary>
                        <span className="help-icon" aria-hidden="true">?</span>
                        Ayuda y atajos de teclado
                    </summary>
                    <div className="help-content">
                        <h3>Atajos de teclado</h3>
                        <ul>
                            <li>
                                <kbd>Alt</kbd> + <kbd>←</kbd> Paso anterior
                            </li>
                            <li>
                                <kbd>Alt</kbd> + <kbd>→</kbd> Paso siguiente
                            </li>
                            <li>
                                <kbd>Esc</kbd> Cancelar
                            </li>
                        </ul>

                        <h3>¿Necesitas ayuda?</h3>
                        <p>
                            Si tienes dudas sobre tu receta o qué opciones elegir,
                            puedes <a href="/citas">agendar una cita</a> con uno de
                            nuestros optometristas.
                        </p>
                    </div>
                </details>
            </aside>
        </div>
    );
}

export default LensConfiguratorWizard;
