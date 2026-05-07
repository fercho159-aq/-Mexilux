/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PASO 3: GRADUACIÓN (Flujo Mexilux)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Captura la receta del usuario por dos vías:
 * - Form manual con SPH/CYL/AXIS por ojo
 * - Subir foto de la receta
 *
 * Calcula la serie en base a la mayor graduación:
 * - 0.00 a 2.00       → Gratis (Serie 1)
 * - 2.25 a 4.00       → +$290 (Serie 2)
 * - 4.25 a 6.00       → +$590 (Serie 3)
 * - >6.00             → Asesor con teléfono
 *
 * Si el usuario eligió "El nahual" con color (≠ Obsidiana), solo se permite
 * hasta Serie 1; cualquier valor >2.00 manda directo al flujo de asesor.
 */

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Upload, Phone, Info, AlertTriangle } from 'lucide-react';
import { useConfiguratorActions, useLensConfiguratorStore } from '@/store/lens-configurator';
import type { Frame } from '@/types';

interface PrescriptionStepProps {
    frame: Frame;
    isAuthenticated: boolean;
    errors: string[];
    savedPrescriptions?: Array<{
        id: string;
        name: string;
        issueDate: string;
        isExpired: boolean;
    }>;
}

interface EyeForm {
    sphere: string;
    cylinder: string;
    axis: string;
}

const EMPTY_EYE: EyeForm = { sphere: '', cylinder: '', axis: '' };

/**
 * Determina la serie según la mayor magnitud absoluta de SPH/CYL en ambos ojos.
 */
function calculateSeries(
    rightEye: EyeForm,
    leftEye: EyeForm
): { series: 1 | 2 | 3 | 'asesor'; cost: number; max: number } {
    const values = [
        rightEye.sphere,
        rightEye.cylinder,
        leftEye.sphere,
        leftEye.cylinder,
    ]
        .map((v) => Math.abs(parseFloat(v) || 0))
        .filter((v) => !isNaN(v));

    const max = values.length ? Math.max(...values) : 0;

    if (max <= 2.0) return { series: 1, cost: 0, max };
    if (max <= 4.0) return { series: 2, cost: 290, max };
    if (max <= 6.0) return { series: 3, cost: 590, max };
    return { series: 'asesor', cost: 0, max };
}

export function PrescriptionStep({ frame }: PrescriptionStepProps) {
    const { updateMexiluxConfig, setManualPrescription, setUploadedPrescription, setPrescriptionSource } =
        useConfiguratorActions();
    const m = useLensConfiguratorStore((s) => s.configuration?.mexiluxConfig);

    const [mode, setMode] = useState<'manual' | 'upload' | 'advisor'>('manual');
    const [rightEye, setRightEye] = useState<EyeForm>(EMPTY_EYE);
    const [leftEye, setLeftEye] = useState<EyeForm>(EMPTY_EYE);
    const [phone, setPhone] = useState('');
    const [phoneSent, setPhoneSent] = useState(false);
    const [uploadFileName, setUploadFileName] = useState<string | null>(null);

    // Recalcular serie cada vez que cambien los valores
    const series = useMemo(() => calculateSeries(rightEye, leftEye), [rightEye, leftEye]);

    // Restricción: si "El nahual" con color (≠ obsidiana) y serie > 1, mandar a asesor
    const nahualColorRequiresAdvisor =
        m?.lensType === 'el_nahual' &&
        m.nahualColor &&
        m.nahualColor !== 'obsidiana' &&
        series.series !== 1;

    const finalSeries = nahualColorRequiresAdvisor ? 'asesor' : series.series;

    // Sincronizar serie y costo con el store
    useEffect(() => {
        updateMexiluxConfig({
            prescriptionSeries: finalSeries,
            prescriptionExtraCost: finalSeries === 'asesor' ? 0 : series.cost,
        });

        // Guardar prescripción manual cuando hay datos válidos
        const hasData = rightEye.sphere !== '' || leftEye.sphere !== '';
        if (mode === 'manual' && hasData) {
            setPrescriptionSource('manual');
            const parseEye = (e: EyeForm) => ({
                sphere: parseFloat(e.sphere) || 0,
                cylinder: e.cylinder ? parseFloat(e.cylinder) : null,
                axis: e.axis ? parseInt(e.axis, 10) : null,
                add: null,
                pd: 31,
            });
            setManualPrescription({
                name: 'Receta Mexilux',
                rightEye: parseEye(rightEye),
                leftEye: parseEye(leftEye),
                totalPD: 62,
                issueDate: new Date().toISOString(),
                expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rightEye, leftEye, mode, finalSeries, series.cost]);

    // Si la serie cae en asesor, mostrar el flujo de asesor
    useEffect(() => {
        if (finalSeries === 'asesor' && mode !== 'advisor') {
            setMode('advisor');
        }
    }, [finalSeries, mode]);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadFileName(file.name);
        // En producción esto subiría a Cloudinary; aquí solo guardamos el nombre.
        const fakeUrl = `local://${file.name}`;
        setUploadedPrescription(fakeUrl);
        setPrescriptionSource('upload');
    };

    const handleSubmitPhone = () => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length < 10) return;
        updateMexiluxConfig({ advisorPhone: cleaned });
        setPhoneSent(true);
    };

    return (
        <div className="prescription-step mexilux-step">
            {/* Selector de modo */}
            {finalSeries !== 'asesor' && (
                <div className="mexilux-mode-tabs" role="tablist">
                    <button
                        role="tab"
                        aria-selected={mode === 'manual'}
                        className={`mexilux-tab ${mode === 'manual' ? 'active' : ''}`}
                        onClick={() => setMode('manual')}
                    >
                        Llenar receta
                    </button>
                    <button
                        role="tab"
                        aria-selected={mode === 'upload'}
                        className={`mexilux-tab ${mode === 'upload' ? 'active' : ''}`}
                        onClick={() => setMode('upload')}
                    >
                        Subir foto
                    </button>
                </div>
            )}

            {/* MODO MANUAL */}
            {mode === 'manual' && finalSeries !== 'asesor' && (
                <div className="mexilux-prescription-form">
                    <div className="mexilux-eye-card">
                        <h4>Ojo derecho (OD)</h4>
                        <div className="mexilux-eye-row">
                            <label>
                                Esfera (SPH)
                                <input
                                    type="number"
                                    step="0.25"
                                    min="-20"
                                    max="20"
                                    placeholder="0.00"
                                    value={rightEye.sphere}
                                    onChange={(e) =>
                                        setRightEye({ ...rightEye, sphere: e.target.value })
                                    }
                                />
                            </label>
                            <label>
                                Cilindro (CYL)
                                <input
                                    type="number"
                                    step="0.25"
                                    min="-6"
                                    max="6"
                                    placeholder="0.00"
                                    value={rightEye.cylinder}
                                    onChange={(e) =>
                                        setRightEye({ ...rightEye, cylinder: e.target.value })
                                    }
                                />
                            </label>
                            <label>
                                Eje
                                <input
                                    type="number"
                                    min="1"
                                    max="180"
                                    placeholder="180"
                                    value={rightEye.axis}
                                    onChange={(e) => setRightEye({ ...rightEye, axis: e.target.value })}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="mexilux-eye-card">
                        <h4>Ojo izquierdo (OI)</h4>
                        <div className="mexilux-eye-row">
                            <label>
                                Esfera (SPH)
                                <input
                                    type="number"
                                    step="0.25"
                                    min="-20"
                                    max="20"
                                    placeholder="0.00"
                                    value={leftEye.sphere}
                                    onChange={(e) => setLeftEye({ ...leftEye, sphere: e.target.value })}
                                />
                            </label>
                            <label>
                                Cilindro (CYL)
                                <input
                                    type="number"
                                    step="0.25"
                                    min="-6"
                                    max="6"
                                    placeholder="0.00"
                                    value={leftEye.cylinder}
                                    onChange={(e) =>
                                        setLeftEye({ ...leftEye, cylinder: e.target.value })
                                    }
                                />
                            </label>
                            <label>
                                Eje
                                <input
                                    type="number"
                                    min="1"
                                    max="180"
                                    placeholder="180"
                                    value={leftEye.axis}
                                    onChange={(e) => setLeftEye({ ...leftEye, axis: e.target.value })}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Indicador de serie */}
                    {(rightEye.sphere !== '' || leftEye.sphere !== '') && (
                        <div className="mexilux-series-indicator">
                            <Info size={18} />
                            <div>
                                <strong>
                                    {series.series === 1 && 'Tu graduación entra en la Serie 1'}
                                    {series.series === 2 && 'Tu graduación entra en la Serie 2'}
                                    {series.series === 3 && 'Tu graduación entra en la Serie 3'}
                                </strong>
                                <span>
                                    {series.cost === 0
                                        ? 'Sin costo extra de graduación'
                                        : `+$${series.cost} por graduación`}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* MODO UPLOAD */}
            {mode === 'upload' && finalSeries !== 'asesor' && (
                <div className="mexilux-upload">
                    <label className="mexilux-upload-zone">
                        <Upload size={32} />
                        <strong>Sube tu receta</strong>
                        <span>Acepta JPG, PNG o PDF · máx 10 MB</span>
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleUpload}
                            style={{ display: 'none' }}
                        />
                    </label>
                    {uploadFileName && (
                        <p className="mexilux-upload-confirm">
                            Subiste <strong>{uploadFileName}</strong>. Un asesor la revisará para
                            calcular tu costo.
                        </p>
                    )}
                </div>
            )}

            {/* MODO ASESOR (graduación >6 o restricción de El nahual) */}
            {finalSeries === 'asesor' && (
                <div className="mexilux-advisor">
                    <div className="mexilux-advisor__head">
                        <AlertTriangle size={28} />
                        <div>
                            <h3>Tu graduación necesita atención personalizada</h3>
                            <p>
                                {nahualColorRequiresAdvisor
                                    ? 'Los colores fotocromáticos diferentes de Obsidiana solo aplican para Serie 1. Te conectamos con un asesor.'
                                    : 'Tu graduación supera los 6.00. Para darte la mejor opción te conectamos con un asesor.'}
                            </p>
                        </div>
                    </div>

                    {!phoneSent ? (
                        <div className="mexilux-advisor__form">
                            <label>
                                <Phone size={18} />
                                Tu teléfono (10 dígitos)
                                <input
                                    type="tel"
                                    placeholder="55 1234 5678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </label>
                            <button
                                type="button"
                                className="mexilux-advisor__cta"
                                disabled={phone.replace(/\D/g, '').length < 10}
                                onClick={handleSubmitPhone}
                            >
                                Solicitar asesor
                            </button>
                        </div>
                    ) : (
                        <div className="mexilux-advisor__sent">
                            <strong>¡Listo!</strong> En breve se comunicará un asesor para darte
                            cotización personalizada.
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                .mexilux-step { padding: 1rem 0; }
                .mexilux-mode-tabs {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                }
                .mexilux-tab {
                    flex: 1;
                    padding: 0.875rem 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    background: #ffffff;
                    cursor: pointer;
                    font-weight: 600;
                    color: #475569;
                    transition: all 0.2s;
                }
                .mexilux-tab:hover { border-color: #152132; }
                .mexilux-tab.active {
                    border-color: #152132;
                    background: #152132;
                    color: #ffffff;
                }
                .mexilux-prescription-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .mexilux-eye-card {
                    background: #f7f8fa;
                    border-radius: 14px;
                    padding: 1.25rem;
                }
                .mexilux-eye-card h4 {
                    margin: 0 0 0.75rem;
                    color: #152132;
                    font-size: 1rem;
                }
                .mexilux-eye-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 0.75rem;
                }
                .mexilux-eye-row label {
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                    font-size: 0.85rem;
                    color: #475569;
                    font-weight: 600;
                }
                .mexilux-eye-row input {
                    padding: 0.625rem 0.75rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 1rem;
                    color: #152132;
                    background: #ffffff;
                }
                .mexilux-eye-row input:focus {
                    outline: none;
                    border-color: #152132;
                }
                .mexilux-series-indicator {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: #ecfdf5;
                    border-left: 3px solid #16a34a;
                    border-radius: 8px;
                    color: #166534;
                }
                .mexilux-series-indicator strong { display: block; }
                .mexilux-series-indicator span {
                    display: block;
                    font-size: 0.85rem;
                    color: #16a34a;
                    margin-top: 0.25rem;
                }
                .mexilux-upload-zone {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 3rem 2rem;
                    border: 2px dashed #cbd5e1;
                    border-radius: 16px;
                    background: #f7f8fa;
                    cursor: pointer;
                    color: #475569;
                    transition: all 0.2s;
                }
                .mexilux-upload-zone:hover {
                    border-color: #152132;
                    background: #f1f5f9;
                }
                .mexilux-upload-zone strong {
                    font-size: 1.05rem;
                    color: #152132;
                }
                .mexilux-upload-zone span {
                    font-size: 0.85rem;
                }
                .mexilux-upload-confirm {
                    margin-top: 1rem;
                    color: #16a34a;
                    font-size: 0.9rem;
                }
                .mexilux-advisor {
                    background: #fff7ed;
                    border-left: 3px solid #f97316;
                    border-radius: 12px;
                    padding: 1.5rem;
                }
                .mexilux-advisor__head {
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                    color: #9a3412;
                    margin-bottom: 1rem;
                }
                .mexilux-advisor__head h3 {
                    margin: 0 0 0.25rem;
                    font-size: 1.1rem;
                }
                .mexilux-advisor__head p {
                    margin: 0;
                    font-size: 0.9rem;
                    color: #7c2d12;
                }
                .mexilux-advisor__form label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    color: #7c2d12;
                    margin-bottom: 0.75rem;
                    flex-wrap: wrap;
                }
                .mexilux-advisor__form input {
                    flex: 1;
                    padding: 0.625rem 0.75rem;
                    border: 2px solid #fed7aa;
                    border-radius: 10px;
                    background: #ffffff;
                    font-size: 1rem;
                    min-width: 200px;
                }
                .mexilux-advisor__cta {
                    padding: 0.75rem 1.5rem;
                    background: #f97316;
                    color: #ffffff;
                    border: none;
                    border-radius: 999px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .mexilux-advisor__cta:hover:not(:disabled) {
                    background: #ea580c;
                }
                .mexilux-advisor__cta:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .mexilux-advisor__sent {
                    padding: 1rem;
                    background: #ecfdf5;
                    border-radius: 8px;
                    color: #166534;
                }
            `}</style>
        </div>
    );
}

export default PrescriptionStep;
