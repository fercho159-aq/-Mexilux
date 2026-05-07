/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PASO 1: SIN GRADUACIÓN / CON GRADUACIÓN (Flujo Mexilux)
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use client';

import React from 'react';
import { Glasses, Eye } from 'lucide-react';
import { useConfiguratorActions, useLensConfiguratorStore } from '@/store/lens-configurator';
import type { Frame, LensUsageType } from '@/types';

interface UsageTypeStepProps {
    frame: Frame;
    isAuthenticated: boolean;
    errors: string[];
}

interface UsageOption {
    id: LensUsageType;
    name: string;
    description: string;
    icon: React.ReactNode;
    note?: string;
}

const OPTIONS: UsageOption[] = [
    {
        id: 'non_prescription',
        name: 'Sin graduación',
        description: 'Para vernos coquetos. Recomendado si solo quieres protección para pantallas.',
        icon: <Glasses size={32} />,
    },
    {
        id: 'single_vision_distance',
        name: 'Con graduación',
        description: 'Soy cegatón. Para miopía, hipermetropía y/o astigmatismo.',
        icon: <Eye size={32} />,
        note: 'El costo puede variar según tu graduación.',
    },
];

export function UsageTypeStep({ frame, errors }: UsageTypeStepProps) {
    const { setUsageType } = useConfiguratorActions();
    const selectedType = useLensConfiguratorStore((s) => s.configuration?.usageType);

    // Si la montura es solo de sol, forzar sin graduación
    const optionsToShow = frame.sunglassesOnly
        ? OPTIONS.filter((o) => o.id === 'non_prescription')
        : OPTIONS;

    const handleSelect = (type: LensUsageType) => {
        setUsageType(type);
    };

    return (
        <div className="usage-type-step mexilux-step">
            <div
                role="radiogroup"
                aria-label="Tipo de lentes"
                className="mexilux-options-grid"
            >
                {optionsToShow.map((option) => {
                    const isSelected =
                        option.id === 'non_prescription'
                            ? selectedType === 'non_prescription'
                            : selectedType !== null && selectedType !== 'non_prescription';

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => handleSelect(option.id)}
                            className={`mexilux-card ${isSelected ? 'selected' : ''}`}
                            role="radio"
                            aria-checked={isSelected}
                        >
                            <span className="mexilux-card__icon" aria-hidden="true">
                                {option.icon}
                            </span>
                            <div className="mexilux-card__body">
                                <h3 className="mexilux-card__title">{option.name}</h3>
                                <p className="mexilux-card__desc">{option.description}</p>
                                {option.note && (
                                    <span className="mexilux-card__note">{option.note}</span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {frame.sunglassesOnly && (
                <p className="mexilux-help" role="note">
                    Esta montura es exclusiva para lentes de sol y no acepta graduación.
                </p>
            )}

            <style jsx>{`
                .mexilux-step {
                    padding: 1rem 0;
                }
                .mexilux-options-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.25rem;
                    margin-bottom: 1rem;
                }
                .mexilux-card {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 2rem 1.5rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 20px;
                    background: #ffffff;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: inherit;
                    width: 100%;
                }
                .mexilux-card:hover {
                    border-color: #152132;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(21, 33, 50, 0.08);
                }
                .mexilux-card.selected {
                    border-color: #152132;
                    background: #f7f8fa;
                    box-shadow: 0 6px 16px rgba(21, 33, 50, 0.12);
                }
                .mexilux-card__icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    background: #f1f5f9;
                    color: #152132;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .mexilux-card__title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0 0 0.4rem;
                    color: #152132;
                }
                .mexilux-card__desc {
                    font-size: 0.95rem;
                    color: #475569;
                    margin: 0;
                    line-height: 1.5;
                }
                .mexilux-card__note {
                    display: inline-block;
                    margin-top: 0.5rem;
                    font-size: 0.8rem;
                    color: #94a3b8;
                    font-style: italic;
                }
                .mexilux-help {
                    margin-top: 1rem;
                    color: #475569;
                    font-size: 0.875rem;
                }
            `}</style>
        </div>
    );
}

export default UsageTypeStep;
