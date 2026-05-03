'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
    LENS_TYPES,
    NAHUAL_COLORS,
    NAHUAL_ADDITIONAL,
    CUSTOM_MICAS,
    ENTITUNEADOS_COLORS,
    SOLAZO_COLORS,
    TINT_STYLES,
    INTENSITY_LEVELS,
    prescriptionCostTier,
    type LensTypeId,
    type NahualAdditionalTreatment,
    type CustomMicaSubtype,
    type TintStyle,
    type IntensityLevel,
} from '@/lib/lens-configurator/constants';
import { MexiluxButton } from '@/components/ui/MexiluxButton';

interface PrescriptionData {
    rightSphere: number;
    rightCylinder: number;
    leftSphere: number;
    leftCylinder: number;
}

interface MexiluxConfig {
    hasPrescription: boolean | null;
    lensType: LensTypeId | null;
    nahualColor?: string;
    nahualAdditional?: NahualAdditionalTreatment;
    customMica?: CustomMicaSubtype;
    tintColor?: string;
    tintStyle?: TintStyle;
    intensity?: IntensityLevel;
    solazoColor?: string;
    prescription?: PrescriptionData;
    receiptUrl?: string;
}

interface Props {
    frameSlug: string;
    frameName: string;
    frameImage?: string;
    framePrice: number;
}

const formatPrice = (n: number) => `$${n.toLocaleString('es-MX')}`;

type Step = 1 | 2 | 3 | 4;

export default function MexiluxConfigurator({ frameSlug, frameName, frameImage, framePrice }: Props) {
    const [step, setStep] = useState<Step>(1);
    const [config, setConfig] = useState<MexiluxConfig>({ hasPrescription: null, lensType: null });
    const [advisorPhone, setAdvisorPhone] = useState('');
    const [advisorSubmitted, setAdvisorSubmitted] = useState(false);

    const tier = useMemo(() => {
        if (!config.prescription) return null;
        const max = Math.max(
            Math.abs(config.prescription.rightSphere),
            Math.abs(config.prescription.rightCylinder),
            Math.abs(config.prescription.leftSphere),
            Math.abs(config.prescription.leftCylinder)
        );
        return prescriptionCostTier(max);
    }, [config.prescription]);

    const pricing = useMemo(() => {
        let lensTypePrice = 0;
        let extras = 0;

        if (config.lensType) {
            const lt = LENS_TYPES.find((l) => l.id === config.lensType);
            lensTypePrice = lt?.price ?? 0;
        }

        if (config.lensType === 'el-nahual') {
            const color = NAHUAL_COLORS.find((c) => c.id === config.nahualColor);
            const additional = NAHUAL_ADDITIONAL.find((a) => a.id === config.nahualAdditional);
            extras += (color?.price ?? 0) + (additional?.price ?? 0);
        }

        if (config.lensType === 'a-tu-antojo' && config.customMica) {
            const cm = CUSTOM_MICAS.find((c) => c.id === config.customMica);
            extras += cm?.price ?? 0;
        }

        const prescriptionCost = tier?.cost ?? 0;
        const total = framePrice + lensTypePrice + extras + prescriptionCost;
        return { lensTypePrice, extras, prescriptionCost, total };
    }, [config, framePrice, tier]);

    const requiresAdvisor = tier?.requiresAdvisor ?? false;

    const goNext = () => setStep((s) => (Math.min(4, s + 1) as Step));
    const goPrev = () => setStep((s) => (Math.max(1, s - 1) as Step));

    const canNext = (): boolean => {
        switch (step) {
            case 1:
                return config.hasPrescription !== null;
            case 2:
                if (!config.lensType) return false;
                if (config.lensType === 'el-nahual') {
                    return !!config.nahualColor && !!config.nahualAdditional;
                }
                if (config.lensType === 'a-tu-antojo') {
                    if (!config.customMica) return false;
                    if (config.customMica === 'entituneados') {
                        return !!config.tintColor && !!config.tintStyle && !!config.intensity;
                    }
                    if (config.customMica === 'solazo') {
                        return !!config.solazoColor;
                    }
                }
                return true;
            case 3:
                if (!config.hasPrescription) return true;
                return !!config.prescription || !!config.receiptUrl;
            case 4:
                return true;
            default:
                return false;
        }
    };

    const handleNextFromStep1 = (hasPrescription: boolean) => {
        setConfig((c) => ({ ...c, hasPrescription }));
    };

    const handleAdvisorSubmit = async () => {
        if (!advisorPhone.trim()) return;
        try {
            await fetch('/api/configurador/asesor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: advisorPhone,
                    frameSlug,
                    frameName,
                    prescription: config.prescription,
                    config,
                }),
            });
            setAdvisorSubmitted(true);
        } catch (e) {
            console.error('Asesor request failed', e);
            setAdvisorSubmitted(true);
        }
    };

    const handleAddToCart = () => {
        const lensType = LENS_TYPES.find((l) => l.id === config.lensType);
        const summaryName = `${frameName} · ${lensType?.name ?? 'Lentes'}`;
        const url = `/carrito?add=${frameSlug}&config=${encodeURIComponent(
            JSON.stringify({
                lensType: config.lensType,
                hasPrescription: config.hasPrescription,
                tier: tier?.tier,
                summary: summaryName,
                price: pricing.total,
            })
        )}`;
        window.location.href = url;
    };

    return (
        <div className="mexilux-configurator">
            <header className="mexilux-config__header">
                <div className="mexilux-config__product">
                    {frameImage && (
                        <img src={frameImage} alt={frameName} className="mexilux-config__product-img" />
                    )}
                    <div>
                        <p className="mexilux-config__product-eyebrow">Configurando</p>
                        <h1 className="mexilux-config__product-name">{frameName}</h1>
                        <p className="mexilux-config__product-price">{formatPrice(framePrice)}</p>
                    </div>
                </div>
                <Link href={`/catalogo/${frameSlug}`} className="mexilux-config__cancel">
                    ← Volver al producto
                </Link>
            </header>

            <div className="mexilux-config__progress">
                {[1, 2, 3, 4].map((s) => (
                    <div
                        key={s}
                        className={`mexilux-config__step-dot ${s === step ? 'is-active' : ''} ${s < step ? 'is-done' : ''}`}
                    >
                        <span>{s}</span>
                    </div>
                ))}
            </div>

            <main className="mexilux-config__main">
                {/* PASO 1: ¿Graduación? */}
                {step === 1 && (
                    <section className="mexilux-config__step">
                        <h2>¿Necesitas graduación?</h2>
                        <p className="mexilux-config__lead">Elige cómo quieres tus micas para comenzar.</p>

                        <div className="mexilux-config__choices">
                            <button
                                type="button"
                                className={`mexilux-config__choice ${config.hasPrescription === false ? 'is-selected' : ''}`}
                                onClick={() => handleNextFromStep1(false)}
                            >
                                <h3>Sin graduación</h3>
                                <p>Para vernos coquetos; recomendado si solo quieres protección para pantallas.</p>
                            </button>

                            <button
                                type="button"
                                className={`mexilux-config__choice ${config.hasPrescription === true ? 'is-selected' : ''}`}
                                onClick={() => handleNextFromStep1(true)}
                            >
                                <h3>Con graduación</h3>
                                <p>Soy cegatón; para miopía, hipermetropía y/o astigmatismo. <em>(Costo puede variar)</em></p>
                            </button>
                        </div>
                    </section>
                )}

                {/* PASO 2: Tipo de mica */}
                {step === 2 && (
                    <section className="mexilux-config__step">
                        <h2>Tipo de mica</h2>
                        <p className="mexilux-config__lead">
                            De cajón todos los lentes incluyen <strong>&ldquo;Pa la chamba&rdquo;</strong> (antirreflejo).
                        </p>

                        <div className="mexilux-config__lens-list">
                            {LENS_TYPES.map((lt) => {
                                const isSelected = config.lensType === lt.id;
                                return (
                                    <button
                                        key={lt.id}
                                        type="button"
                                        className={`mexilux-config__lens-card ${isSelected ? 'is-selected' : ''}`}
                                        onClick={() =>
                                            setConfig((c) => ({
                                                ...c,
                                                lensType: lt.id,
                                                nahualColor: undefined,
                                                nahualAdditional: undefined,
                                                customMica: undefined,
                                                tintColor: undefined,
                                                tintStyle: undefined,
                                                intensity: undefined,
                                                solazoColor: undefined,
                                            }))
                                        }
                                    >
                                        <div className="mexilux-config__lens-head">
                                            <strong>{lt.name}</strong>
                                            <span className="mexilux-config__lens-price">
                                                {lt.isIncluded ? 'Incluido' : lt.price > 0 ? `+${formatPrice(lt.price)}` : 'Ver opciones'}
                                            </span>
                                        </div>
                                        <span className="mexilux-config__lens-tagline">{lt.tagline}</span>
                                        <p>{lt.description}</p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Sub-flujo: El Nahual */}
                        {config.lensType === 'el-nahual' && (
                            <div className="mexilux-config__subflow">
                                <h3>Color del fotocromático</h3>
                                <div className="mexilux-config__swatch-grid">
                                    {NAHUAL_COLORS.map((color) => (
                                        <button
                                            key={color.id}
                                            type="button"
                                            className={`mexilux-config__swatch ${config.nahualColor === color.id ? 'is-selected' : ''}`}
                                            onClick={() => setConfig((c) => ({ ...c, nahualColor: color.id }))}
                                        >
                                            <span className="mexilux-config__swatch-circle" style={{ background: color.hex }} />
                                            <span className="mexilux-config__swatch-label">{color.label}</span>
                                            <span className="mexilux-config__swatch-price">
                                                {color.price > 0 ? `+${formatPrice(color.price)}` : 'Gratis'}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <h3 style={{ marginTop: '1.5rem' }}>Tratamiento adicional</h3>
                                <div className="mexilux-config__lens-list">
                                    {NAHUAL_ADDITIONAL.map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            className={`mexilux-config__lens-card ${config.nahualAdditional === opt.id ? 'is-selected' : ''}`}
                                            onClick={() => setConfig((c) => ({ ...c, nahualAdditional: opt.id }))}
                                        >
                                            <div className="mexilux-config__lens-head">
                                                <strong>{opt.label}</strong>
                                                <span className="mexilux-config__lens-price">
                                                    {opt.price > 0 ? `+${formatPrice(opt.price)}` : 'Gratis'}
                                                </span>
                                            </div>
                                            <p>{opt.description}</p>
                                        </button>
                                    ))}
                                </div>

                                {config.hasPrescription && (
                                    <p className="mexilux-config__note">
                                        Nota: con graduación, El Nahual aplica solo hasta la 1ª serie. Si tu graduación es mayor, te conectaremos con un asesor en el paso 3.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Sub-flujo: A tu antojo */}
                        {config.lensType === 'a-tu-antojo' && (
                            <div className="mexilux-config__subflow">
                                <h3>Tipo de mica personalizada</h3>
                                <div className="mexilux-config__lens-list">
                                    {CUSTOM_MICAS.map((cm) => (
                                        <button
                                            key={cm.id}
                                            type="button"
                                            className={`mexilux-config__lens-card ${config.customMica === cm.id ? 'is-selected' : ''}`}
                                            onClick={() =>
                                                setConfig((c) => ({
                                                    ...c,
                                                    customMica: cm.id,
                                                    tintColor: undefined,
                                                    tintStyle: undefined,
                                                    intensity: undefined,
                                                    solazoColor: undefined,
                                                }))
                                            }
                                        >
                                            <div className="mexilux-config__lens-head">
                                                <strong>{cm.name}</strong>
                                                <span className="mexilux-config__lens-price">+{formatPrice(cm.price)}</span>
                                            </div>
                                            <p>{cm.description}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* Entituneados */}
                                {config.customMica === 'entituneados' && (
                                    <>
                                        <h3 style={{ marginTop: '1.5rem' }}>Color</h3>
                                        <div className="mexilux-config__swatch-grid">
                                            {ENTITUNEADOS_COLORS.map((color) => (
                                                <button
                                                    key={color.id}
                                                    type="button"
                                                    className={`mexilux-config__swatch ${config.tintColor === color.id ? 'is-selected' : ''}`}
                                                    onClick={() => setConfig((c) => ({ ...c, tintColor: color.id }))}
                                                >
                                                    <span className="mexilux-config__swatch-circle" style={{ background: color.hex }} />
                                                    <span className="mexilux-config__swatch-label">{color.label}</span>
                                                </button>
                                            ))}
                                        </div>

                                        <h3 style={{ marginTop: '1.5rem' }}>Estilo</h3>
                                        <div className="mexilux-config__pill-row">
                                            {TINT_STYLES.map((s) => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    className={`mexilux-config__pill ${config.tintStyle === s.id ? 'is-selected' : ''}`}
                                                    onClick={() => setConfig((c) => ({ ...c, tintStyle: s.id }))}
                                                >
                                                    <strong>{s.label}</strong>
                                                    <small>{s.description}</small>
                                                </button>
                                            ))}
                                        </div>

                                        <h3 style={{ marginTop: '1.5rem' }}>Intensidad</h3>
                                        <div className="mexilux-config__pill-row">
                                            {INTENSITY_LEVELS.map((lvl) => (
                                                <button
                                                    key={lvl.id}
                                                    type="button"
                                                    className={`mexilux-config__pill ${config.intensity === lvl.id ? 'is-selected' : ''}`}
                                                    onClick={() => setConfig((c) => ({ ...c, intensity: lvl.id }))}
                                                >
                                                    <strong>{lvl.label}</strong>
                                                    <small>{lvl.description}</small>
                                                </button>
                                            ))}
                                        </div>

                                        {config.tintColor && config.intensity && (
                                            <p className="mexilux-config__preview">
                                                Tu selección: <strong>
                                                    {ENTITUNEADOS_COLORS.find((c) => c.id === config.tintColor)?.label.split(' ')[0]} {config.intensity}
                                                </strong>{' '}
                                                {config.tintStyle === 'amanecido' ? '(Amanecido)' : '(Parejito)'}
                                            </p>
                                        )}
                                    </>
                                )}

                                {/* Solazo */}
                                {config.customMica === 'solazo' && (
                                    <>
                                        <h3 style={{ marginTop: '1.5rem' }}>Color del polarizado</h3>
                                        <div className="mexilux-config__swatch-grid">
                                            {SOLAZO_COLORS.map((color) => (
                                                <button
                                                    key={color.id}
                                                    type="button"
                                                    className={`mexilux-config__swatch ${config.solazoColor === color.id ? 'is-selected' : ''}`}
                                                    onClick={() => setConfig((c) => ({ ...c, solazoColor: color.id }))}
                                                >
                                                    <span className="mexilux-config__swatch-circle" style={{ background: color.hex }} />
                                                    <span className="mexilux-config__swatch-label">{color.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* PASO 3: Detalle de graduación */}
                {step === 3 && config.hasPrescription && (
                    <section className="mexilux-config__step">
                        <h2>Tu receta médica</h2>
                        <p className="mexilux-config__lead">
                            Captura tu graduación o sube una foto de la receta.
                        </p>

                        <PrescriptionForm
                            value={config.prescription}
                            onChange={(p) => setConfig((c) => ({ ...c, prescription: p }))}
                        />

                        <div className="mexilux-config__upload">
                            <label htmlFor="receipt-upload" className="mexilux-config__upload-label">
                                O sube una foto de tu receta
                            </label>
                            <input
                                id="receipt-upload"
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const url = URL.createObjectURL(file);
                                    setConfig((c) => ({ ...c, receiptUrl: url }));
                                }}
                            />
                            {config.receiptUrl && <p className="mexilux-config__upload-hint">Receta cargada ✓</p>}
                        </div>

                        {tier && (
                            <div className={`mexilux-config__tier ${requiresAdvisor ? 'is-advisor' : ''}`}>
                                <strong>Rango: {tier.label}</strong>
                                <span>
                                    {requiresAdvisor
                                        ? 'Requiere cotización personalizada'
                                        : tier.cost === 0
                                            ? 'Sin costo extra'
                                            : `Costo extra: +${formatPrice(tier.cost!)}`}
                                </span>
                            </div>
                        )}

                        {requiresAdvisor && !advisorSubmitted && (
                            <div className="mexilux-config__advisor">
                                <p>
                                    Tu graduación supera la 3ª serie. Déjanos tu teléfono y un asesor te contactará para cotización personalizada.
                                </p>
                                <input
                                    type="tel"
                                    placeholder="Tu teléfono (10 dígitos)"
                                    value={advisorPhone}
                                    onChange={(e) => setAdvisorPhone(e.target.value)}
                                />
                                <MexiluxButton onClick={handleAdvisorSubmit} variant="primary">
                                    Solicitar cotización
                                </MexiluxButton>
                            </div>
                        )}

                        {requiresAdvisor && advisorSubmitted && (
                            <div className="mexilux-config__advisor is-success">
                                ✓ En breve se comunicará un asesor para darte cotización personalizada.
                            </div>
                        )}
                    </section>
                )}

                {/* PASO 4: Resumen */}
                {step === 4 && (
                    <section className="mexilux-config__step">
                        <h2>Resumen de tu configuración</h2>
                        <p className="mexilux-config__lead">Revisa antes de agregar al carrito.</p>

                        <ul className="mexilux-config__summary">
                            <li>
                                <span>Armazón: {frameName}</span>
                                <span>{formatPrice(framePrice)}</span>
                            </li>

                            {config.lensType && (
                                <li>
                                    <span>Tipo de mica: {LENS_TYPES.find((l) => l.id === config.lensType)?.name}</span>
                                    <span>
                                        {pricing.lensTypePrice === 0
                                            ? 'Incluido'
                                            : `+${formatPrice(pricing.lensTypePrice)}`}
                                    </span>
                                </li>
                            )}

                            {config.lensType === 'el-nahual' && (
                                <>
                                    {config.nahualColor && (
                                        <li>
                                            <span>Color: {NAHUAL_COLORS.find((c) => c.id === config.nahualColor)?.label}</span>
                                            <span>
                                                {(NAHUAL_COLORS.find((c) => c.id === config.nahualColor)?.price ?? 0) > 0
                                                    ? `+${formatPrice(NAHUAL_COLORS.find((c) => c.id === config.nahualColor)!.price)}`
                                                    : 'Gratis'}
                                            </span>
                                        </li>
                                    )}
                                    {config.nahualAdditional && config.nahualAdditional !== 'none' && (
                                        <li>
                                            <span>Tratamiento extra: {NAHUAL_ADDITIONAL.find((a) => a.id === config.nahualAdditional)?.label}</span>
                                            <span>
                                                {(NAHUAL_ADDITIONAL.find((a) => a.id === config.nahualAdditional)?.price ?? 0) > 0
                                                    ? `+${formatPrice(NAHUAL_ADDITIONAL.find((a) => a.id === config.nahualAdditional)!.price)}`
                                                    : 'Gratis'}
                                            </span>
                                        </li>
                                    )}
                                </>
                            )}

                            {config.lensType === 'a-tu-antojo' && config.customMica && (
                                <>
                                    <li>
                                        <span>Sub-tipo: {CUSTOM_MICAS.find((c) => c.id === config.customMica)?.name}</span>
                                        <span>+{formatPrice(CUSTOM_MICAS.find((c) => c.id === config.customMica)!.price)}</span>
                                    </li>
                                    {config.customMica === 'entituneados' && config.tintColor && (
                                        <li>
                                            <span>
                                                {ENTITUNEADOS_COLORS.find((c) => c.id === config.tintColor)?.label.split(' ')[0]} {config.intensity} ({config.tintStyle === 'amanecido' ? 'Amanecido' : 'Parejito'})
                                            </span>
                                            <span>—</span>
                                        </li>
                                    )}
                                    {config.customMica === 'solazo' && config.solazoColor && (
                                        <li>
                                            <span>{SOLAZO_COLORS.find((c) => c.id === config.solazoColor)?.label}</span>
                                            <span>—</span>
                                        </li>
                                    )}
                                </>
                            )}

                            {config.hasPrescription && tier && !requiresAdvisor && (
                                <li>
                                    <span>Graduación ({tier.label})</span>
                                    <span>{tier.cost === 0 ? 'Gratis' : `+${formatPrice(tier.cost!)}`}</span>
                                </li>
                            )}

                            {config.hasPrescription && requiresAdvisor && (
                                <li>
                                    <span>Graduación (Más de 6.00)</span>
                                    <span>Cotización por asesor</span>
                                </li>
                            )}

                            <li className="mexilux-config__total">
                                <span>Total{requiresAdvisor ? ' (sin graduación)' : ''}</span>
                                <span>{formatPrice(pricing.total)}</span>
                            </li>
                        </ul>

                        {!requiresAdvisor && (
                            <MexiluxButton onClick={handleAddToCart} variant="primary" size="lg" fullWidth>
                                Agregar a la bolsa
                            </MexiluxButton>
                        )}

                        {requiresAdvisor && !advisorSubmitted && (
                            <p className="mexilux-config__note">
                                Tu cotización requiere atención de un asesor (paso anterior). Vuelve al paso 3 para dejar tu teléfono.
                            </p>
                        )}
                    </section>
                )}
            </main>

            {/* Navegación */}
            <footer className="mexilux-config__nav">
                <MexiluxButton variant="ghost" onClick={goPrev} disabled={step === 1}>
                    ← Anterior
                </MexiluxButton>
                {step < 4 && (
                    <MexiluxButton
                        variant="primary"
                        onClick={() => {
                            if (step === 1 && !config.hasPrescription) {
                                // saltar el paso 3
                                setStep(2);
                                return;
                            }
                            if (step === 2 && !config.hasPrescription) {
                                setStep(4);
                                return;
                            }
                            goNext();
                        }}
                        disabled={!canNext()}
                    >
                        Siguiente →
                    </MexiluxButton>
                )}
            </footer>

            <style jsx>{`
                .mexilux-configurator {
                    max-width: 920px;
                    margin: 0 auto;
                    padding: 2rem 1.25rem 4rem;
                }
                .mexilux-config__header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 1rem;
                    border-bottom: 1px solid #eaeaea;
                    padding-bottom: 1rem;
                    margin-bottom: 1.5rem;
                }
                .mexilux-config__product {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .mexilux-config__product-img {
                    width: 72px;
                    height: 72px;
                    object-fit: contain;
                    background: #fafbfc;
                    border-radius: 12px;
                }
                .mexilux-config__product-eyebrow {
                    font-size: 0.75rem;
                    color: #8A6623;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin: 0;
                }
                .mexilux-config__product-name {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #152132;
                }
                .mexilux-config__product-price {
                    margin: 0.25rem 0 0;
                    font-size: 1rem;
                    color: #555;
                }
                .mexilux-config__cancel {
                    color: #555;
                    text-decoration: none;
                    font-size: 0.9rem;
                }
                .mexilux-config__progress {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                }
                .mexilux-config__step-dot {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: 2px solid #ddd;
                    color: #999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 0.9rem;
                }
                .mexilux-config__step-dot.is-active {
                    border-color: #152132;
                    color: #152132;
                    background: #fff;
                }
                .mexilux-config__step-dot.is-done {
                    border-color: #152132;
                    background: #152132;
                    color: #fff;
                }
                .mexilux-config__main {
                    background: #fff;
                    border-radius: 24px;
                    padding: clamp(1.5rem, 4vw, 2.5rem);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.05);
                }
                .mexilux-config__step h2 {
                    font-size: 1.6rem;
                    color: #152132;
                    margin: 0 0 0.5rem;
                }
                .mexilux-config__lead {
                    color: #555;
                    margin-bottom: 1.5rem;
                }
                .mexilux-config__choices {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .mexilux-config__choice {
                    background: #fff;
                    border: 2px solid #eee;
                    border-radius: 16px;
                    padding: 1.5rem;
                    text-align: left;
                    cursor: pointer;
                    transition: all 200ms;
                }
                .mexilux-config__choice:hover {
                    border-color: #152132;
                }
                .mexilux-config__choice.is-selected {
                    border-color: #152132;
                    background: #f7f8fa;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                }
                .mexilux-config__choice h3 {
                    margin: 0 0 0.5rem;
                    color: #152132;
                }
                .mexilux-config__choice p {
                    margin: 0;
                    color: #555;
                    font-size: 0.9rem;
                }
                .mexilux-config__lens-list {
                    display: grid;
                    gap: 0.75rem;
                }
                .mexilux-config__lens-card {
                    background: #fff;
                    border: 2px solid #eee;
                    border-radius: 14px;
                    padding: 1rem 1.25rem;
                    text-align: left;
                    cursor: pointer;
                    transition: all 200ms;
                }
                .mexilux-config__lens-card:hover {
                    border-color: #152132;
                }
                .mexilux-config__lens-card.is-selected {
                    border-color: #152132;
                    background: #f7f8fa;
                }
                .mexilux-config__lens-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }
                .mexilux-config__lens-price {
                    color: #8A6623;
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                .mexilux-config__lens-tagline {
                    display: block;
                    color: #888;
                    font-size: 0.8rem;
                    margin-top: 0.25rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .mexilux-config__lens-card p {
                    margin: 0.5rem 0 0;
                    color: #555;
                    font-size: 0.9rem;
                }
                .mexilux-config__subflow {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #eee;
                }
                .mexilux-config__subflow h3 {
                    color: #152132;
                    margin: 0 0 0.75rem;
                    font-size: 1.05rem;
                }
                .mexilux-config__swatch-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: 0.75rem;
                }
                .mexilux-config__swatch {
                    background: #fff;
                    border: 2px solid #eee;
                    border-radius: 12px;
                    padding: 0.75rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 200ms;
                }
                .mexilux-config__swatch.is-selected {
                    border-color: #152132;
                    background: #f7f8fa;
                }
                .mexilux-config__swatch-circle {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 2px solid #ffffff;
                    box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
                }
                .mexilux-config__swatch-label {
                    font-size: 0.8rem;
                    color: #152132;
                    text-align: center;
                }
                .mexilux-config__swatch-price {
                    font-size: 0.75rem;
                    color: #8A6623;
                    font-weight: 600;
                }
                .mexilux-config__pill-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                .mexilux-config__pill {
                    background: #fff;
                    border: 2px solid #eee;
                    border-radius: 999px;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 90px;
                    transition: all 200ms;
                }
                .mexilux-config__pill.is-selected {
                    border-color: #152132;
                    background: #152132;
                    color: #fff;
                }
                .mexilux-config__pill small {
                    font-size: 0.7rem;
                    opacity: 0.7;
                }
                .mexilux-config__preview {
                    margin-top: 1rem;
                    padding: 0.75rem 1rem;
                    background: #f7f8fa;
                    border-radius: 8px;
                    color: #152132;
                }
                .mexilux-config__upload {
                    margin-top: 1.5rem;
                    padding: 1rem;
                    border: 1.5px dashed #ddd;
                    border-radius: 12px;
                }
                .mexilux-config__upload-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #555;
                    font-weight: 500;
                }
                .mexilux-config__upload-hint {
                    color: #2e7d32;
                    margin-top: 0.5rem;
                }
                .mexilux-config__tier {
                    margin-top: 1.5rem;
                    padding: 1rem;
                    background: #f0fdf4;
                    border-left: 4px solid #16a34a;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .mexilux-config__tier.is-advisor {
                    background: #fff7ed;
                    border-left-color: #f59e0b;
                }
                .mexilux-config__advisor {
                    margin-top: 1rem;
                    padding: 1rem;
                    background: #f7f8fa;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .mexilux-config__advisor input {
                    padding: 0.6rem 1rem;
                    border: 1.5px solid #ddd;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                .mexilux-config__advisor.is-success {
                    background: #f0fdf4;
                    color: #166534;
                }
                .mexilux-config__note {
                    margin-top: 1rem;
                    color: #8A6623;
                    font-size: 0.85rem;
                }
                .mexilux-config__summary {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 1.5rem;
                    border-top: 1px solid #eee;
                }
                .mexilux-config__summary li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.85rem 0;
                    border-bottom: 1px solid #eee;
                    color: #555;
                }
                .mexilux-config__summary li.mexilux-config__total {
                    font-weight: 700;
                    color: #152132;
                    font-size: 1.15rem;
                    border-bottom: none;
                    padding-top: 1.25rem;
                }
                .mexilux-config__nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 1.5rem;
                }
                @media (max-width: 640px) {
                    .mexilux-config__choices {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

interface PrescriptionFormProps {
    value?: PrescriptionData;
    onChange: (p: PrescriptionData) => void;
}

function PrescriptionForm({ value, onChange }: PrescriptionFormProps) {
    const [data, setData] = useState<PrescriptionData>(
        value ?? { rightSphere: 0, rightCylinder: 0, leftSphere: 0, leftCylinder: 0 }
    );

    const update = (field: keyof PrescriptionData, n: number) => {
        const next = { ...data, [field]: n };
        setData(next);
        onChange(next);
    };

    return (
        <div className="rx-form">
            <div className="rx-form__row">
                <h4>Ojo derecho (OD)</h4>
                <label>
                    Esfera (SPH)
                    <input
                        type="number"
                        step="0.25"
                        min="-20"
                        max="20"
                        value={data.rightSphere}
                        onChange={(e) => update('rightSphere', parseFloat(e.target.value) || 0)}
                    />
                </label>
                <label>
                    Cilindro (CYL)
                    <input
                        type="number"
                        step="0.25"
                        min="-6"
                        max="6"
                        value={data.rightCylinder}
                        onChange={(e) => update('rightCylinder', parseFloat(e.target.value) || 0)}
                    />
                </label>
            </div>
            <div className="rx-form__row">
                <h4>Ojo izquierdo (OS)</h4>
                <label>
                    Esfera (SPH)
                    <input
                        type="number"
                        step="0.25"
                        min="-20"
                        max="20"
                        value={data.leftSphere}
                        onChange={(e) => update('leftSphere', parseFloat(e.target.value) || 0)}
                    />
                </label>
                <label>
                    Cilindro (CYL)
                    <input
                        type="number"
                        step="0.25"
                        min="-6"
                        max="6"
                        value={data.leftCylinder}
                        onChange={(e) => update('leftCylinder', parseFloat(e.target.value) || 0)}
                    />
                </label>
            </div>

            <style jsx>{`
                .rx-form {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .rx-form__row {
                    background: #f7f8fa;
                    border-radius: 12px;
                    padding: 1rem;
                }
                .rx-form__row h4 {
                    margin: 0 0 0.75rem;
                    color: #152132;
                    font-size: 1rem;
                }
                .rx-form__row label {
                    display: block;
                    margin-bottom: 0.75rem;
                    color: #555;
                    font-size: 0.85rem;
                }
                .rx-form__row input {
                    display: block;
                    width: 100%;
                    margin-top: 0.25rem;
                    padding: 0.5rem 0.75rem;
                    border: 1.5px solid #ddd;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                @media (max-width: 640px) {
                    .rx-form { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
