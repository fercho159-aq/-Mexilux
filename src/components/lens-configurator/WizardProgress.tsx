/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WIZARD PROGRESS BAR
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Barra de progreso visual y navegable del wizard.
 * Cumple con estándares de accesibilidad WCAG 2.1 AA.
 */

'use client';

import React from 'react';
import type { ConfiguratorStep } from '@/types';

interface WizardProgressProps {
    steps: ConfiguratorStep[];
    stepsConfig: Record<ConfiguratorStep, { title: string; description: string }>;
    currentStep: ConfiguratorStep;
    completedSteps: ConfiguratorStep[];
    progress: number;
    onStepClick: (step: ConfiguratorStep) => void;
}

export function WizardProgress({
    steps,
    stepsConfig,
    currentStep,
    completedSteps,
    progress,
    onStepClick,
}: WizardProgressProps) {
    const currentIndex = steps.indexOf(currentStep);

    return (
        <nav
            className="wizard-progress"
            aria-label="Progreso del configurador"
        >
            {/* Barra de progreso visual */}
            <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progreso: ${progress}% completado`}
            >
                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Lista de pasos */}
            <ol className="steps-list" role="list">
                {steps.map((step, index) => {
                    const config = stepsConfig[step];
                    const isCompleted = completedSteps.includes(step);
                    const isCurrent = step === currentStep;
                    const isClickable = isCompleted || index <= currentIndex;

                    // Determinar estado para estilos y accesibilidad
                    let status: 'completed' | 'current' | 'pending' = 'pending';
                    if (isCompleted && !isCurrent) status = 'completed';
                    if (isCurrent) status = 'current';

                    return (
                        <li
                            key={step}
                            className={`step-item step-${status}`}
                        >
                            <button
                                type="button"
                                onClick={() => isClickable && onStepClick(step)}
                                disabled={!isClickable}
                                className="step-button"
                                aria-current={isCurrent ? 'step' : undefined}
                                aria-label={`
                  Paso ${index + 1}: ${config.title}. 
                  ${isCompleted ? 'Completado.' : ''} 
                  ${isCurrent ? 'Paso actual.' : ''}
                  ${isClickable ? 'Presiona para ir a este paso.' : 'No disponible aún.'}
                `}
                            >
                                {/* Indicador numérico/icono */}
                                <span className="step-indicator" aria-hidden="true">
                                    {isCompleted ? (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            className="check-icon"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </span>

                                {/* Texto del paso (visible en pantallas grandes) */}
                                <span className="step-text">
                                    <span className="step-number">Paso {index + 1}</span>
                                    <span className="step-title">{config.title}</span>
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default WizardProgress;
