/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WIZARD NAVIGATION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Botones de navegación del wizard (Anterior/Siguiente/Completar).
 */

'use client';

import React from 'react';

interface WizardNavigationProps {
    isFirstStep: boolean;
    isLastStep: boolean;
    canProceed: boolean;
    onPrev: () => void;
    onNext: () => void;
    onComplete: () => void;
}

export function WizardNavigation({
    isFirstStep,
    isLastStep,
    canProceed,
    onPrev,
    onNext,
    onComplete,
}: WizardNavigationProps) {
    return (
        <footer className="wizard-navigation">
            <div className="nav-container">
                {/* Botón Anterior */}
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={isFirstStep}
                    className="nav-button nav-prev"
                    aria-label="Ir al paso anterior"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="nav-icon"
                        aria-hidden="true"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span>Anterior</span>
                </button>

                {/* Botón Siguiente o Completar */}
                {isLastStep ? (
                    <button
                        type="button"
                        onClick={onComplete}
                        disabled={!canProceed}
                        className="nav-button nav-complete"
                        aria-label="Completar configuración y agregar al carrito"
                    >
                        <span>Agregar al Carrito</span>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="nav-icon"
                            aria-hidden="true"
                        >
                            <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onNext}
                        disabled={!canProceed}
                        className="nav-button nav-next"
                        aria-label={canProceed ? 'Continuar al siguiente paso' : 'Completa este paso para continuar'}
                    >
                        <span>Continuar</span>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="nav-icon"
                            aria-hidden="true"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Hint de progreso */}
            {!canProceed && !isLastStep && (
                <p className="nav-hint" role="status">
                    Completa las selecciones de este paso para continuar
                </p>
            )}
        </footer>
    );
}

export default WizardNavigation;
