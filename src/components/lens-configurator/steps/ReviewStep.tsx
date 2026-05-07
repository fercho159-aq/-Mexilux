/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PASO FINAL: RESUMEN (Flujo Mexilux)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Muestra el desglose completo del pedido con:
 * - Frame
 * - Tipo de mica + sub-opciones
 * - Graduación con su serie y costo
 * - Total con desglose
 */

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { useLensConfiguratorStore } from '@/store/lens-configurator';
import type {
    Frame,
    MexiluxLensConfig,
    EntituneadoColor,
    NahualColor,
    SolazoColor,
} from '@/types';

interface ReviewStepProps {
    frame: Frame;
    isAuthenticated: boolean;
    errors: string[];
    onComplete: () => void;
}

const NAHUAL_COLOR_LABELS: Record<NahualColor, string> = {
    obsidiana: 'Obsidiana (Negro)',
    cenote: 'Cenote (Azul)',
    elote: 'Elote (Amarillo)',
    ajolote: 'Ajolote (Rosa)',
};

const NAHUAL_COLOR_PRICE: Record<NahualColor, number> = {
    obsidiana: 0,
    cenote: 490,
    elote: 490,
    ajolote: 490,
};

const ENTITUNEADO_COLOR_LABELS: Record<EntituneadoColor, string> = {
    sangre_azteca: 'Sangre Azteca (Rojo)',
    obsidiana: 'Obsidiana (Negro)',
    cenote: 'Cenote (Azul)',
    cacao: 'Cacao (Café)',
    nopal: 'Nopal (Verde)',
    ajolote: 'Ajolote (Rosa)',
    elote: 'Elote (Amarillo)',
    cempasuchil: 'Cempasúchil (Naranja)',
};

const SOLAZO_COLOR_LABELS: Record<SolazoColor, string> = {
    obsidiana: 'Obsidiana (Negro)',
    cacao: 'Cacao (Café)',
};

interface PriceLine {
    label: string;
    sublabel?: string;
    amount: number;
}

function buildPriceLines(m: MexiluxLensConfig | undefined): PriceLine[] {
    const lines: PriceLine[] = [];
    if (!m?.lensType) return lines;

    switch (m.lensType) {
        case 'pa_la_chamba':
            lines.push({ label: 'Mica "Pa la chamba" (Antirreflejo)', amount: 0 });
            break;
        case 'la_maquina_de_chambear':
            lines.push({ label: 'Mica "La máquina de chambear" (Antirreflejo Azul)', amount: 450 });
            break;
        case 'el_nahual': {
            const colorLabel = m.nahualColor ? NAHUAL_COLOR_LABELS[m.nahualColor] : '—';
            const colorPrice = m.nahualColor ? NAHUAL_COLOR_PRICE[m.nahualColor] : 0;
            lines.push({
                label: 'Mica "El nahual" (Fotocromático)',
                sublabel: `Color: ${colorLabel}`,
                amount: colorPrice,
            });
            if (m.nahualTreatment === 'la_maquina') {
                lines.push({
                    label: 'Tratamiento "La máquina de chambear"',
                    amount: 450,
                });
            } else if (m.nahualTreatment === 'pa_la_chamba') {
                lines.push({
                    label: 'Tratamiento "Pa la chamba" (incluido)',
                    amount: 0,
                });
            }
            break;
        }
        case 'a_tu_antojo': {
            if (m.atuAntojoType === 'entituneados') {
                const colorLabel = m.entituneadoColor
                    ? ENTITUNEADO_COLOR_LABELS[m.entituneadoColor]
                    : '—';
                const styleLabel =
                    m.entituneadoStyle === 'parejito'
                        ? 'Parejito'
                        : m.entituneadoStyle === 'amanecido'
                            ? 'Amanecido'
                            : '—';
                const intensityLabel = m.entituneadoIntensity || '—';
                lines.push({
                    label: '"Entituneados" (Tintes)',
                    sublabel: `${colorLabel} · ${styleLabel} · Nivel ${intensityLabel}`,
                    amount: 350,
                });
            } else if (m.atuAntojoType === 'solazo') {
                const colorLabel = m.solazoColor ? SOLAZO_COLOR_LABELS[m.solazoColor] : '—';
                lines.push({
                    label: '"Solazo" (Polarizado)',
                    sublabel: `Color: ${colorLabel}`,
                    amount: 750,
                });
            }
            break;
        }
    }

    // Graduación (si aplica)
    if (m.prescriptionSeries && m.prescriptionSeries !== 'asesor' && m.prescriptionSeries > 1) {
        lines.push({
            label: `Graduación · Serie ${m.prescriptionSeries}`,
            amount: m.prescriptionExtraCost,
        });
    } else if (m.prescriptionSeries === 1) {
        lines.push({ label: 'Graduación · Serie 1', amount: 0 });
    } else if (m.prescriptionSeries === 'asesor') {
        lines.push({ label: 'Graduación · Cotización por asesor', amount: 0 });
    }

    return lines;
}

const formatPrice = (n: number): string =>
    n === 0 ? 'Gratis' : `$${n.toLocaleString('es-MX')}`;

export function ReviewStep({ frame, onComplete }: ReviewStepProps) {
    const config = useLensConfiguratorStore((s) => s.configuration);
    const framePrice = useLensConfiguratorStore((s) => s.framePrice);

    const priceLines = useMemo(() => buildPriceLines(config?.mexiluxConfig), [config?.mexiluxConfig]);

    const lensesTotal = priceLines.reduce((sum, l) => sum + l.amount, 0);
    const total = framePrice + lensesTotal;

    const variantImage =
        frame.colorVariants.find((v) => v.id === frame.defaultColorVariantId)?.images[0]?.url ||
        '/placeholder-frame.jpg';

    const isAdvisor = config?.mexiluxConfig?.prescriptionSeries === 'asesor';

    return (
        <div className="review-step mexilux-step">
            <div className="mexilux-review-grid">
                {/* Producto */}
                <div className="mexilux-review-card">
                    <div className="mexilux-review-frame">
                        <Image
                            src={variantImage}
                            alt={frame.name}
                            width={120}
                            height={120}
                            style={{ objectFit: 'contain' }}
                        />
                        <div>
                            <p className="mexilux-review-brand">{frame.brand.name}</p>
                            <h3 className="mexilux-review-name">{frame.name}</h3>
                            <p className="mexilux-review-price">{formatPrice(framePrice)}</p>
                        </div>
                    </div>
                </div>

                {/* Desglose */}
                <div className="mexilux-review-card">
                    <h4 className="mexilux-review-section-title">Tu configuración</h4>
                    <ul className="mexilux-price-list">
                        {priceLines.length === 0 ? (
                            <li className="mexilux-price-empty">
                                Vuelve atrás para elegir el tipo de mica.
                            </li>
                        ) : (
                            priceLines.map((line, idx) => (
                                <li key={idx} className="mexilux-price-line">
                                    <div>
                                        <span>{line.label}</span>
                                        {line.sublabel && (
                                            <small className="mexilux-price-sub">{line.sublabel}</small>
                                        )}
                                    </div>
                                    <strong>{formatPrice(line.amount)}</strong>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Total */}
                <div className="mexilux-review-card mexilux-review-card--total">
                    <div className="mexilux-total-row">
                        <span>Armazón</span>
                        <strong>{formatPrice(framePrice)}</strong>
                    </div>
                    <div className="mexilux-total-row">
                        <span>Lentes y tratamientos</span>
                        <strong>{formatPrice(lensesTotal)}</strong>
                    </div>
                    <div className="mexilux-total-row mexilux-total-row--main">
                        <span>Total estimado</span>
                        <strong>{formatPrice(total)}</strong>
                    </div>
                    {isAdvisor && (
                        <p className="mexilux-total-note">
                            * Tu graduación requiere cotización personalizada. Un asesor confirmará
                            el costo final.
                        </p>
                    )}
                </div>

                <button type="button" className="mexilux-review-cta" onClick={onComplete}>
                    <ShoppingBag size={18} />
                    Confirmar y agregar a la bolsa
                </button>
            </div>

            <style jsx>{`
                .mexilux-step { padding: 1rem 0; }
                .mexilux-review-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .mexilux-review-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 1.25rem;
                }
                .mexilux-review-frame {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .mexilux-review-brand {
                    margin: 0;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #94a3b8;
                    font-weight: 600;
                }
                .mexilux-review-name {
                    margin: 0.25rem 0;
                    color: #152132;
                    font-size: 1.1rem;
                }
                .mexilux-review-price {
                    margin: 0;
                    font-weight: 700;
                    color: #152132;
                }
                .mexilux-review-section-title {
                    margin: 0 0 0.75rem;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #152132;
                }
                .mexilux-price-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .mexilux-price-line {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 0.625rem 0;
                    border-bottom: 1px dashed #e2e8f0;
                    color: #334155;
                    font-size: 0.9rem;
                }
                .mexilux-price-line:last-child { border-bottom: none; }
                .mexilux-price-line strong { color: #152132; white-space: nowrap; }
                .mexilux-price-sub {
                    display: block;
                    color: #94a3b8;
                    font-size: 0.8rem;
                    margin-top: 0.15rem;
                }
                .mexilux-price-empty {
                    color: #94a3b8;
                    font-style: italic;
                }
                .mexilux-review-card--total {
                    background: #f7f8fa;
                    border-color: #cbd5e1;
                }
                .mexilux-total-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.4rem 0;
                    font-size: 0.9rem;
                    color: #475569;
                }
                .mexilux-total-row--main {
                    margin-top: 0.5rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid #cbd5e1;
                    font-size: 1.05rem;
                    color: #152132;
                }
                .mexilux-total-row strong { color: #152132; }
                .mexilux-total-note {
                    margin: 0.5rem 0 0;
                    font-size: 0.75rem;
                    color: #f97316;
                }
                .mexilux-review-cta {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 1rem 1.5rem;
                    background: #152132;
                    color: #ffffff;
                    border: none;
                    border-radius: 999px;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .mexilux-review-cta:hover {
                    background: #0f172a;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 16px rgba(21, 33, 50, 0.15);
                }
                .mexilux-review-cta:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
}

export default ReviewStep;
