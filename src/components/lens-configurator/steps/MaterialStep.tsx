/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PASO 2: TIPO DE MICA (Flujo Mexilux)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 4 opciones principales: Pa la chamba, La máquina de chambear,
 * El nahual, A tu antojo. Cada una con sub-flujo si aplica.
 */

'use client';

import React from 'react';
import { Monitor, Laptop, Sparkles, Palette, Sun, Brush } from 'lucide-react';
import { useConfiguratorActions, useLensConfiguratorStore } from '@/store/lens-configurator';
import type {
    Frame,
    MexiluxLensType,
    NahualColor,
    NahualTreatment,
    EntituneadoColor,
    EntituneadoStyle,
    EntituneadoIntensity,
    SolazoColor,
} from '@/types';

interface MaterialStepProps {
    frame: Frame;
    isAuthenticated: boolean;
    errors: string[];
}

interface LensTypeOption {
    id: MexiluxLensType;
    name: string;
    description: string;
    priceLabel: string;
    icon: React.ReactNode;
}

const LENS_TYPES: LensTypeOption[] = [
    {
        id: 'pa_la_chamba',
        name: 'Pa la chamba',
        description: 'Antirreflejo. Ideal si pasas hasta 4 hrs frente a pantallas.',
        priceLabel: 'Gratis',
        icon: <Monitor size={28} />,
    },
    {
        id: 'la_maquina_de_chambear',
        name: 'La máquina de chambear',
        description: 'Antirreflejo azul. Ideal si pasas más de 4 hrs frente a pantallas.',
        priceLabel: '+$450',
        icon: <Laptop size={28} />,
    },
    {
        id: 'el_nahual',
        name: 'El nahual',
        description: 'Fotocromático. Al sol oscurece como lente de sol; en interior queda claro.',
        priceLabel: 'desde Gratis',
        icon: <Sparkles size={28} />,
    },
    {
        id: 'a_tu_antojo',
        name: 'A tu antojo',
        description: 'Micas personalizadas: Entituneados (tintes) o Solazo (polarizado).',
        priceLabel: 'desde +$350',
        icon: <Palette size={28} />,
    },
];

const NAHUAL_COLORS: { id: NahualColor; name: string; price: string; hex: string }[] = [
    { id: 'obsidiana', name: 'Obsidiana (Negro)', price: 'Gratis', hex: '#1a1a1a' },
    { id: 'cenote', name: 'Cenote (Azul)', price: '+$490', hex: '#1e40af' },
    { id: 'elote', name: 'Elote (Amarillo)', price: '+$490', hex: '#facc15' },
    { id: 'ajolote', name: 'Ajolote (Rosa)', price: '+$490', hex: '#ec4899' },
];

const NAHUAL_TREATMENTS: { id: NahualTreatment; name: string; price: string }[] = [
    { id: 'sin', name: 'Sin tratamiento "Pa la chamba"', price: 'Gratis' },
    { id: 'pa_la_chamba', name: 'Con "Pa la chamba" (Antirreflejo)', price: 'Gratis' },
    { id: 'la_maquina', name: 'Con "La máquina de chambear" (Antirreflejo Azul)', price: '+$450' },
];

const ENTITUNEADO_COLORS: { id: EntituneadoColor; name: string; hex: string }[] = [
    { id: 'sangre_azteca', name: 'Sangre Azteca (Rojo)', hex: '#dc2626' },
    { id: 'obsidiana', name: 'Obsidiana (Negro)', hex: '#1a1a1a' },
    { id: 'cenote', name: 'Cenote (Azul)', hex: '#1e40af' },
    { id: 'cacao', name: 'Cacao (Café)', hex: '#78350f' },
    { id: 'nopal', name: 'Nopal (Verde)', hex: '#15803d' },
    { id: 'ajolote', name: 'Ajolote (Rosa)', hex: '#ec4899' },
    { id: 'elote', name: 'Elote (Amarillo)', hex: '#facc15' },
    { id: 'cempasuchil', name: 'Cempasúchil (Naranja)', hex: '#f97316' },
];

const ENTITUNEADO_STYLES: { id: EntituneadoStyle; name: string; hint: string }[] = [
    { id: 'parejito', name: 'Parejito', hint: 'Toda la mica con tinte uniforme' },
    { id: 'amanecido', name: 'Amanecido', hint: 'Tinte desvanecido (degradado)' },
];

const ENTITUNEADO_INTENSITIES: EntituneadoIntensity[] = ['I', 'II', 'III'];

const SOLAZO_COLORS: { id: SolazoColor; name: string; hex: string }[] = [
    { id: 'obsidiana', name: 'Obsidiana (Negro)', hex: '#1a1a1a' },
    { id: 'cacao', name: 'Cacao (Café)', hex: '#78350f' },
];

const COLOR_NAMES: Record<EntituneadoColor, string> = {
    sangre_azteca: 'Sangre Azteca',
    obsidiana: 'Obsidiana',
    cenote: 'Cenote',
    cacao: 'Cacao',
    nopal: 'Nopal',
    ajolote: 'Ajolote',
    elote: 'Elote',
    cempasuchil: 'Cempasúchil',
};

export function MaterialStep({ frame }: MaterialStepProps) {
    const { updateMexiluxConfig } = useConfiguratorActions();
    const m = useLensConfiguratorStore((s) => s.configuration?.mexiluxConfig);

    const handleLensType = (lensType: MexiluxLensType) => {
        // Reset sub-opciones cuando se cambia el tipo principal
        updateMexiluxConfig({
            lensType,
            nahualColor: null,
            nahualTreatment: null,
            atuAntojoType: null,
            entituneadoColor: null,
            entituneadoStyle: null,
            entituneadoIntensity: null,
            solazoColor: null,
        });
    };

    return (
        <div className="material-step mexilux-step">
            {/* Aviso de "Pa la chamba" incluido */}
            <div className="mexilux-info-strip" role="note">
                Todos los lentes incluyen de cajón el tratamiento <strong>&quot;Pa la chamba&quot;</strong> (antirreflejo).
            </div>

            {/* Selector principal */}
            <div className="mexilux-options-grid" role="radiogroup" aria-label="Tipo de mica">
                {LENS_TYPES.map((opt) => {
                    const isSelected = m?.lensType === opt.id;
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleLensType(opt.id)}
                            className={`mexilux-card ${isSelected ? 'selected' : ''}`}
                            role="radio"
                            aria-checked={isSelected}
                        >
                            <span className="mexilux-card__icon" aria-hidden="true">
                                {opt.icon}
                            </span>
                            <div className="mexilux-card__body">
                                <div className="mexilux-card__head">
                                    <h3 className="mexilux-card__title">{opt.name}</h3>
                                    <span className="mexilux-card__price">{opt.priceLabel}</span>
                                </div>
                                <p className="mexilux-card__desc">{opt.description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Sub-flujo: El nahual */}
            {m?.lensType === 'el_nahual' && (
                <section className="mexilux-subflow" aria-label="Opciones El nahual">
                    <h4 className="mexilux-subflow__title">Escoge color de tu nahual</h4>
                    <div className="mexilux-color-grid">
                        {NAHUAL_COLORS.map((c) => {
                            const isSel = m.nahualColor === c.id;
                            return (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => updateMexiluxConfig({ nahualColor: c.id })}
                                    className={`mexilux-color-chip ${isSel ? 'selected' : ''}`}
                                >
                                    <span
                                        className="mexilux-color-swatch"
                                        style={{ background: c.hex }}
                                        aria-hidden="true"
                                    />
                                    <span className="mexilux-color-info">
                                        <strong>{c.name}</strong>
                                        <span>{c.price}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <h4 className="mexilux-subflow__title">Y el tratamiento</h4>
                    <div className="mexilux-stack">
                        {NAHUAL_TREATMENTS.map((t) => {
                            const isSel = m.nahualTreatment === t.id;
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => updateMexiluxConfig({ nahualTreatment: t.id })}
                                    className={`mexilux-row-option ${isSel ? 'selected' : ''}`}
                                >
                                    <span>{t.name}</span>
                                    <span className="mexilux-card__price">{t.price}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Sub-flujo: A tu antojo */}
            {m?.lensType === 'a_tu_antojo' && (
                <section className="mexilux-subflow" aria-label="Opciones A tu antojo">
                    <h4 className="mexilux-subflow__title">¿Tinte o polarizado?</h4>
                    <div className="mexilux-options-grid">
                        <button
                            type="button"
                            onClick={() =>
                                updateMexiluxConfig({
                                    atuAntojoType: 'entituneados',
                                    solazoColor: null,
                                })
                            }
                            className={`mexilux-card ${m.atuAntojoType === 'entituneados' ? 'selected' : ''}`}
                            aria-pressed={m.atuAntojoType === 'entituneados'}
                        >
                            <span className="mexilux-card__icon" aria-hidden="true">
                                <Brush size={28} />
                            </span>
                            <div className="mexilux-card__body">
                                <div className="mexilux-card__head">
                                    <h3 className="mexilux-card__title">Entituneados</h3>
                                    <span className="mexilux-card__price">+$350</span>
                                </div>
                                <p className="mexilux-card__desc">
                                    Tintes a tu manera. Parejito o Amanecido en 8 colores.
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                updateMexiluxConfig({
                                    atuAntojoType: 'solazo',
                                    entituneadoColor: null,
                                    entituneadoStyle: null,
                                    entituneadoIntensity: null,
                                })
                            }
                            className={`mexilux-card ${m.atuAntojoType === 'solazo' ? 'selected' : ''}`}
                            aria-pressed={m.atuAntojoType === 'solazo'}
                        >
                            <span className="mexilux-card__icon" aria-hidden="true">
                                <Sun size={28} />
                            </span>
                            <div className="mexilux-card__body">
                                <div className="mexilux-card__head">
                                    <h3 className="mexilux-card__title">Solazo</h3>
                                    <span className="mexilux-card__price">+$750</span>
                                </div>
                                <p className="mexilux-card__desc">
                                    Polarizado. Para carreteras, playa y flow.
                                </p>
                            </div>
                        </button>
                    </div>

                    {/* Entituneados sub-flujo */}
                    {m.atuAntojoType === 'entituneados' && (
                        <>
                            <h4 className="mexilux-subflow__title">Escoge color</h4>
                            <div className="mexilux-color-grid">
                                {ENTITUNEADO_COLORS.map((c) => {
                                    const isSel = m.entituneadoColor === c.id;
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() =>
                                                updateMexiluxConfig({ entituneadoColor: c.id })
                                            }
                                            className={`mexilux-color-chip ${isSel ? 'selected' : ''}`}
                                        >
                                            <span
                                                className="mexilux-color-swatch"
                                                style={{ background: c.hex }}
                                                aria-hidden="true"
                                            />
                                            <span className="mexilux-color-info">
                                                <strong>{c.name}</strong>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {m.entituneadoColor && (
                                <>
                                    <h4 className="mexilux-subflow__title">Escoge estilo</h4>
                                    <div className="mexilux-stack">
                                        {ENTITUNEADO_STYLES.map((s) => {
                                            const isSel = m.entituneadoStyle === s.id;
                                            return (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={() =>
                                                        updateMexiluxConfig({ entituneadoStyle: s.id })
                                                    }
                                                    className={`mexilux-row-option ${isSel ? 'selected' : ''}`}
                                                >
                                                    <span>
                                                        <strong>{s.name}</strong>
                                                        <small style={{ display: 'block', color: '#94a3b8' }}>
                                                            {s.hint}
                                                        </small>
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {m.entituneadoColor && m.entituneadoStyle && (
                                <>
                                    <h4 className="mexilux-subflow__title">Nivel de intensidad</h4>
                                    <div className="mexilux-intensity-grid">
                                        {ENTITUNEADO_INTENSITIES.map((i) => {
                                            const isSel = m.entituneadoIntensity === i;
                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() =>
                                                        updateMexiluxConfig({ entituneadoIntensity: i })
                                                    }
                                                    className={`mexilux-intensity ${isSel ? 'selected' : ''}`}
                                                >
                                                    {COLOR_NAMES[m.entituneadoColor!]} {i}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Solazo sub-flujo */}
                    {m.atuAntojoType === 'solazo' && (
                        <>
                            <h4 className="mexilux-subflow__title">Escoge color del Solazo</h4>
                            <div className="mexilux-color-grid">
                                {SOLAZO_COLORS.map((c) => {
                                    const isSel = m.solazoColor === c.id;
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => updateMexiluxConfig({ solazoColor: c.id })}
                                            className={`mexilux-color-chip ${isSel ? 'selected' : ''}`}
                                        >
                                            <span
                                                className="mexilux-color-swatch"
                                                style={{ background: c.hex }}
                                                aria-hidden="true"
                                            />
                                            <span className="mexilux-color-info">
                                                <strong>{c.name}</strong>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </section>
            )}

            <style jsx>{`
                .mexilux-step { padding: 1rem 0; }
                .mexilux-info-strip {
                    background: #f1f5f9;
                    border-left: 3px solid #152132;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.25rem;
                    font-size: 0.9rem;
                    color: #334155;
                }
                .mexilux-options-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .mexilux-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1.25rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 16px;
                    background: #ffffff;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    width: 100%;
                    color: inherit;
                }
                .mexilux-card:hover {
                    border-color: #152132;
                    transform: translateY(-2px);
                }
                .mexilux-card.selected {
                    border-color: #152132;
                    background: #f7f8fa;
                }
                .mexilux-card__icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: #f1f5f9;
                    color: #152132;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .mexilux-card__body { flex: 1; }
                .mexilux-card__head {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .mexilux-card__title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin: 0;
                    color: #152132;
                }
                .mexilux-card__price {
                    font-weight: 700;
                    color: #16a34a;
                    font-size: 0.95rem;
                }
                .mexilux-card__desc {
                    font-size: 0.875rem;
                    color: #475569;
                    margin: 0.4rem 0 0;
                    line-height: 1.5;
                }
                .mexilux-subflow {
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #e2e8f0;
                }
                .mexilux-subflow__title {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #152132;
                    margin: 1.25rem 0 0.75rem;
                }
                .mexilux-color-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 0.5rem;
                }
                .mexilux-color-chip {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    background: #ffffff;
                    cursor: pointer;
                    transition: all 0.15s;
                    text-align: left;
                    color: inherit;
                }
                .mexilux-color-chip:hover { border-color: #152132; }
                .mexilux-color-chip.selected {
                    border-color: #152132;
                    background: #f7f8fa;
                }
                .mexilux-color-swatch {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    flex-shrink: 0;
                }
                .mexilux-color-info {
                    display: flex;
                    flex-direction: column;
                    font-size: 0.85rem;
                }
                .mexilux-color-info strong { color: #152132; }
                .mexilux-color-info span { color: #16a34a; font-size: 0.8rem; }
                .mexilux-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .mexilux-row-option {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    background: #ffffff;
                    cursor: pointer;
                    text-align: left;
                    color: inherit;
                    font-size: 0.95rem;
                }
                .mexilux-row-option:hover { border-color: #152132; }
                .mexilux-row-option.selected {
                    border-color: #152132;
                    background: #f7f8fa;
                }
                .mexilux-intensity-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                }
                .mexilux-intensity {
                    padding: 1rem 0.5rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    background: #ffffff;
                    cursor: pointer;
                    font-weight: 600;
                    color: #152132;
                    font-size: 0.9rem;
                }
                .mexilux-intensity:hover { border-color: #152132; }
                .mexilux-intensity.selected {
                    border-color: #152132;
                    background: #152132;
                    color: #ffffff;
                }
            `}</style>
        </div>
    );
}

export default MaterialStep;
