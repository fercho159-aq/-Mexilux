/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PASO 2: RECETA MÉDICA
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Permite al usuario:
 * - Seleccionar una receta guardada
 * - Ingresar una nueva receta manualmente
 * - Subir una imagen de su receta
 * - Agendar una cita para obtener receta
 */

'use client';

import React, { useState, useCallback } from 'react';
import { useConfiguratorActions, useLensConfiguratorStore } from '@/store/lens-configurator';
import {
    prescriptionSchema,
    PRESCRIPTION_LIMITS,
    isHighPrescription,
    recommendLensIndex,
    isPrescriptionExpired,
} from '@/lib/validations/prescription';
import type { Frame, PrescriptionSource, EyePrescription } from '@/types';

interface PrescriptionStepProps {
    frame: Frame;
    isAuthenticated: boolean;
    errors: string[];
    savedPrescriptions: Array<{
        id: string;
        name: string;
        issueDate: string;
        isExpired: boolean;
    }>;
}

// Valores iniciales para un ojo
const INITIAL_EYE: EyePrescription = {
    sphere: 0,
    cylinder: null,
    axis: null,
    add: null,
    pd: 31,
};

// Opciones de fuente de receta
const SOURCE_OPTIONS: Array<{
    id: PrescriptionSource;
    name: string;
    description: string;
    icon: string;
    requiresAuth: boolean;
}> = [
        {
            id: 'saved',
            name: 'Receta Guardada',
            description: 'Usa una receta de tu perfil',
            icon: '📋',
            requiresAuth: true,
        },
        {
            id: 'manual',
            name: 'Ingresar Manualmente',
            description: 'Tengo mi receta en papel',
            icon: '✍️',
            requiresAuth: false,
        },
        {
            id: 'upload',
            name: 'Subir Foto',
            description: 'Tomaré foto de mi receta',
            icon: '📷',
            requiresAuth: false,
        },
        {
            id: 'appointment',
            name: 'Agendar Cita',
            description: 'No tengo receta actualizada',
            icon: '📅',
            requiresAuth: false,
        },
    ];

export function PrescriptionStep({
    frame,
    isAuthenticated,
    errors,
    savedPrescriptions,
}: PrescriptionStepProps) {
    const {
        setPrescriptionSource,
        selectSavedPrescription,
        setManualPrescription,
        setUploadedPrescription,
        linkAppointment,
    } = useConfiguratorActions();

    const configuration = useLensConfiguratorStore((state) => state.configuration);
    const selectedSource = configuration?.prescriptionSource;
    const usageType = configuration?.usageType;

    // Estado local para el formulario manual
    const [manualForm, setManualForm] = useState({
        name: '',
        rightEye: { ...INITIAL_EYE },
        leftEye: { ...INITIAL_EYE },
        totalPD: 62,
        issueDate: new Date().toISOString().split('T')[0],
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Si es sin graduación, skip este paso
    if (usageType === 'non_prescription') {
        return (
            <div className="prescription-skip">
                <p className="skip-message">
                    <span aria-hidden="true">✅</span>
                    No necesitas receta para lentes sin graduación.
                    Continúa al siguiente paso.
                </p>
            </div>
        );
    }

    // Determinar si necesita ADD
    const needsAdd = usageType === 'progressive' || usageType === 'bifocal';

    // Handlers
    const handleSourceSelect = (source: PrescriptionSource) => {
        // Verificar si requiere autenticación
        const option = SOURCE_OPTIONS.find((o) => o.id === source);
        if (option?.requiresAuth && !isAuthenticated) {
            // Redirigir a login con return URL
            window.location.href = `/login?returnTo=/configurador/${frame.slug}`;
            return;
        }
        setPrescriptionSource(source);
    };

    const handleEyeChange = (
        eye: 'rightEye' | 'leftEye',
        field: keyof EyePrescription,
        value: number | null
    ) => {
        setManualForm((prev) => ({
            ...prev,
            [eye]: {
                ...prev[eye],
                [field]: value,
            },
        }));
    };

    const handleManualSubmit = useCallback(() => {
        // Validar con Zod
        const result = prescriptionSchema.safeParse(manualForm);

        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                errors[issue.path.join('.')] = issue.message;
            });
            setFormErrors(errors);
            return;
        }

        setFormErrors({});
        setManualPrescription(result.data);
    }, [manualForm, setManualPrescription]);

    // Generar opciones para los selects
    const generateOptions = (min: number, max: number, step: number, prefix = '') => {
        const options: Array<{ value: number; label: string }> = [];
        for (let i = min; i <= max; i += step) {
            const formatted = i > 0 ? `+${i.toFixed(2)}` : i.toFixed(2);
            options.push({ value: i, label: `${prefix}${formatted}` });
        }
        return options;
    };

    const sphereOptions = generateOptions(
        PRESCRIPTION_LIMITS.sphere.min,
        PRESCRIPTION_LIMITS.sphere.max,
        PRESCRIPTION_LIMITS.sphere.step
    );

    const cylinderOptions = [
        { value: 0, label: '0.00 (Sin astigmatismo)' },
        ...generateOptions(
            PRESCRIPTION_LIMITS.cylinder.min,
            -0.25,
            PRESCRIPTION_LIMITS.cylinder.step
        ),
    ];

    const axisOptions = Array.from({ length: 180 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}°`,
    }));

    const addOptions = generateOptions(
        PRESCRIPTION_LIMITS.add.min,
        PRESCRIPTION_LIMITS.add.max,
        PRESCRIPTION_LIMITS.add.step
    );

    return (
        <div className="prescription-step">
            {/* Selector de fuente */}
            <div className="source-selector">
                <h3 className="section-title">¿Cómo quieres ingresar tu receta?</h3>

                <div className="source-options" role="radiogroup" aria-label="Fuente de la receta">
                    {SOURCE_OPTIONS.map((option) => {
                        const isSelected = selectedSource === option.id;
                        const isDisabled = option.requiresAuth && !isAuthenticated;
                        const hasSavedPrescriptions = savedPrescriptions.length > 0;

                        // Ocultar "Receta Guardada" si no hay ninguna
                        if (option.id === 'saved' && !hasSavedPrescriptions) {
                            return null;
                        }

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => handleSourceSelect(option.id)}
                                className={`source-option ${isSelected ? 'selected' : ''}`}
                                role="radio"
                                aria-checked={isSelected}
                                disabled={isDisabled}
                                aria-disabled={isDisabled}
                            >
                                <span className="source-icon" aria-hidden="true">
                                    {option.icon}
                                </span>
                                <span className="source-name">{option.name}</span>
                                <span className="source-description">{option.description}</span>

                                {isDisabled && (
                                    <span className="auth-required">Requiere cuenta</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Contenido según la fuente seleccionada */}
            {selectedSource === 'saved' && (
                <SavedPrescriptionSelector
                    prescriptions={savedPrescriptions}
                    selectedId={configuration?.savedPrescriptionId || null}
                    onSelect={selectSavedPrescription}
                />
            )}

            {selectedSource === 'manual' && (
                <ManualPrescriptionForm
                    form={manualForm}
                    errors={formErrors}
                    needsAdd={needsAdd}
                    sphereOptions={sphereOptions}
                    cylinderOptions={cylinderOptions}
                    axisOptions={axisOptions}
                    addOptions={addOptions}
                    onEyeChange={handleEyeChange}
                    onFieldChange={(field, value) =>
                        setManualForm((prev) => ({ ...prev, [field]: value }))
                    }
                    onSubmit={handleManualSubmit}
                />
            )}

            {selectedSource === 'upload' && (
                <PrescriptionUploader
                    currentUrl={configuration?.uploadedPrescriptionUrl || null}
                    onUpload={setUploadedPrescription}
                />
            )}

            {selectedSource === 'appointment' && (
                <AppointmentScheduler
                    linkedAppointmentId={configuration?.appointmentId || null}
                    onLink={linkAppointment}
                />
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTES
// ═══════════════════════════════════════════════════════════════════════════

interface SavedPrescriptionSelectorProps {
    prescriptions: Array<{
        id: string;
        name: string;
        issueDate: string;
        isExpired: boolean;
    }>;
    selectedId: string | null;
    onSelect: (id: string) => void;
}

function SavedPrescriptionSelector({
    prescriptions,
    selectedId,
    onSelect,
}: SavedPrescriptionSelectorProps) {
    return (
        <div className="saved-prescriptions">
            <h4>Selecciona una receta</h4>
            <ul className="prescription-list" role="listbox" aria-label="Recetas guardadas">
                {prescriptions.map((rx) => (
                    <li key={rx.id}>
                        <button
                            type="button"
                            onClick={() => !rx.isExpired && onSelect(rx.id)}
                            className={`prescription-item ${selectedId === rx.id ? 'selected' : ''} ${rx.isExpired ? 'expired' : ''
                                }`}
                            role="option"
                            aria-selected={selectedId === rx.id}
                            disabled={rx.isExpired}
                        >
                            <span className="rx-name">{rx.name}</span>
                            <span className="rx-date">
                                Emitida: {new Date(rx.issueDate).toLocaleDateString('es-MX')}
                            </span>
                            {rx.isExpired && (
                                <span className="rx-expired-badge">Expirada</span>
                            )}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

interface ManualPrescriptionFormProps {
    form: {
        name: string;
        rightEye: EyePrescription;
        leftEye: EyePrescription;
        totalPD: number;
        issueDate: string;
        expirationDate: string;
    };
    errors: Record<string, string>;
    needsAdd: boolean;
    sphereOptions: Array<{ value: number; label: string }>;
    cylinderOptions: Array<{ value: number; label: string }>;
    axisOptions: Array<{ value: number; label: string }>;
    addOptions: Array<{ value: number; label: string }>;
    onEyeChange: (
        eye: 'rightEye' | 'leftEye',
        field: keyof EyePrescription,
        value: number | null
    ) => void;
    onFieldChange: (field: string, value: unknown) => void;
    onSubmit: () => void;
}

function ManualPrescriptionForm({
    form,
    errors,
    needsAdd,
    sphereOptions,
    cylinderOptions,
    axisOptions,
    addOptions,
    onEyeChange,
    onFieldChange,
    onSubmit,
}: ManualPrescriptionFormProps) {
    return (
        <div className="manual-prescription-form">
            <h4>Ingresa los datos de tu receta</h4>

            {/* Ayuda visual */}
            <div className="prescription-help" role="note">
                <details>
                    <summary>
                        <span aria-hidden="true">❓</span>
                        ¿Cómo leer mi receta?
                    </summary>
                    <div className="help-content">
                        <img
                            src="/images/prescription-guide.svg"
                            alt="Diagrama explicativo de una receta oftalmológica"
                        />
                        <ul>
                            <li><strong>OD</strong>: Ojo derecho (Right Eye)</li>
                            <li><strong>OS</strong>: Ojo izquierdo (Left Eye)</li>
                            <li><strong>SPH</strong>: Esfera - Corrige miopía (-) o hipermetropía (+)</li>
                            <li><strong>CYL</strong>: Cilindro - Corrige astigmatismo</li>
                            <li><strong>AXIS</strong>: Eje del astigmatismo (1° a 180°)</li>
                            <li><strong>ADD</strong>: Adición para lectura (solo progresivos/bifocales)</li>
                            <li><strong>PD</strong>: Distancia pupilar en milímetros</li>
                        </ul>
                    </div>
                </details>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
                className="rx-form"
            >
                {/* Nombre de la receta */}
                <div className="form-field">
                    <label htmlFor="rx-name">Nombre para identificar esta receta</label>
                    <input
                        type="text"
                        id="rx-name"
                        value={form.name}
                        onChange={(e) => onFieldChange('name', e.target.value)}
                        placeholder="Ej: Receta Dr. García 2024"
                        aria-describedby={errors.name ? 'rx-name-error' : undefined}
                    />
                    {errors.name && (
                        <span id="rx-name-error" className="field-error" role="alert">
                            {errors.name}
                        </span>
                    )}
                </div>

                {/* Tabla de graduación */}
                <table className="rx-table" role="grid" aria-label="Valores de graduación">
                    <thead>
                        <tr>
                            <th scope="col">Ojo</th>
                            <th scope="col">Esfera (SPH)</th>
                            <th scope="col">Cilindro (CYL)</th>
                            <th scope="col">Eje (AXIS)</th>
                            {needsAdd && <th scope="col">Adición (ADD)</th>}
                            <th scope="col">PD (mm)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(['rightEye', 'leftEye'] as const).map((eye) => {
                            const label = eye === 'rightEye' ? 'Derecho (OD)' : 'Izquierdo (OS)';
                            const eyeData = form[eye];
                            const hasCylinder = eyeData.cylinder !== null && eyeData.cylinder !== 0;

                            return (
                                <tr key={eye}>
                                    <th scope="row">{label}</th>

                                    {/* Esfera */}
                                    <td>
                                        <select
                                            value={eyeData.sphere}
                                            onChange={(e) =>
                                                onEyeChange(eye, 'sphere', parseFloat(e.target.value))
                                            }
                                            aria-label={`Esfera ojo ${label}`}
                                        >
                                            {sphereOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Cilindro */}
                                    <td>
                                        <select
                                            value={eyeData.cylinder || 0}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                onEyeChange(eye, 'cylinder', val === 0 ? null : val);
                                                // Reset axis si no hay cilindro
                                                if (val === 0) {
                                                    onEyeChange(eye, 'axis', null);
                                                }
                                            }}
                                            aria-label={`Cilindro ojo ${label}`}
                                        >
                                            {cylinderOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Eje */}
                                    <td>
                                        <select
                                            value={eyeData.axis || ''}
                                            onChange={(e) =>
                                                onEyeChange(
                                                    eye,
                                                    'axis',
                                                    e.target.value ? parseInt(e.target.value) : null
                                                )
                                            }
                                            disabled={!hasCylinder}
                                            aria-label={`Eje ojo ${label}`}
                                            aria-describedby={!hasCylinder ? 'axis-disabled-hint' : undefined}
                                        >
                                            <option value="">-</option>
                                            {axisOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Adición (si aplica) */}
                                    {needsAdd && (
                                        <td>
                                            <select
                                                value={eyeData.add || ''}
                                                onChange={(e) =>
                                                    onEyeChange(
                                                        eye,
                                                        'add',
                                                        e.target.value ? parseFloat(e.target.value) : null
                                                    )
                                                }
                                                aria-label={`Adición ojo ${label}`}
                                            >
                                                <option value="">Selecciona</option>
                                                {addOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    )}

                                    {/* PD monocular */}
                                    <td>
                                        <input
                                            type="number"
                                            value={eyeData.pd}
                                            onChange={(e) =>
                                                onEyeChange(eye, 'pd', parseFloat(e.target.value) || 0)
                                            }
                                            min={PRESCRIPTION_LIMITS.pd.monocular.min}
                                            max={PRESCRIPTION_LIMITS.pd.monocular.max}
                                            step={0.5}
                                            aria-label={`Distancia pupilar ojo ${label}`}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Hint para eje */}
                <p id="axis-disabled-hint" className="sr-only">
                    El eje solo se puede ingresar cuando hay un valor de cilindro
                </p>

                {/* PD Total y fechas */}
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="rx-total-pd">Distancia Pupilar Total (PD)</label>
                        <input
                            type="number"
                            id="rx-total-pd"
                            value={form.totalPD}
                            onChange={(e) => onFieldChange('totalPD', parseFloat(e.target.value) || 0)}
                            min={PRESCRIPTION_LIMITS.pd.binocular.min}
                            max={PRESCRIPTION_LIMITS.pd.binocular.max}
                            step={1}
                        />
                        <span className="field-hint">
                            Suma de ambos PDs: {form.rightEye.pd + form.leftEye.pd}mm
                        </span>
                    </div>

                    <div className="form-field">
                        <label htmlFor="rx-issue-date">Fecha de emisión</label>
                        <input
                            type="date"
                            id="rx-issue-date"
                            value={form.issueDate}
                            onChange={(e) => onFieldChange('issueDate', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>

                {/* Recomendación de índice */}
                {isHighPrescription(form.rightEye.sphere, form.rightEye.cylinder) ||
                    isHighPrescription(form.leftEye.sphere, form.leftEye.cylinder) ? (
                    <div className="high-rx-notice" role="alert">
                        <span aria-hidden="true">💡</span>
                        <p>
                            Tu graduación es alta. Te recomendamos un material de índice{' '}
                            <strong>
                                {recommendLensIndex(
                                    Math.max(
                                        Math.abs(form.rightEye.sphere),
                                        Math.abs(form.leftEye.sphere)
                                    ),
                                    Math.max(
                                        Math.abs(form.rightEye.cylinder || 0),
                                        Math.abs(form.leftEye.cylinder || 0)
                                    )
                                )}
                            </strong>{' '}
                            o superior para lentes más delgados.
                        </p>
                    </div>
                ) : null}

                <button type="submit" className="submit-button">
                    Guardar y continuar
                </button>
            </form>
        </div>
    );
}

interface PrescriptionUploaderProps {
    currentUrl: string | null;
    onUpload: (url: string) => void;
}

function PrescriptionUploader({ currentUrl, onUpload }: PrescriptionUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        // Simular upload - en producción usaría un servicio real
        try {
            // TODO: Implementar upload real
            const fakeUrl = URL.createObjectURL(file);
            onUpload(fakeUrl);
        } catch (error) {
            console.error('Error uploading:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="prescription-uploader">
            <h4>Sube una foto de tu receta</h4>

            <div className="upload-zone">
                <input
                    type="file"
                    id="rx-upload"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="sr-only"
                />

                <label htmlFor="rx-upload" className="upload-label">
                    {isUploading ? (
                        <span>Subiendo...</span>
                    ) : currentUrl ? (
                        <>
                            <img
                                src={currentUrl}
                                alt="Vista previa de la receta subida"
                                className="upload-preview"
                            />
                            <span>Cambiar imagen</span>
                        </>
                    ) : (
                        <>
                            <span className="upload-icon" aria-hidden="true">📷</span>
                            <span>Haz clic o arrastra tu receta aquí</span>
                            <span className="upload-hint">JPG, PNG o PDF. Máximo 10MB.</span>
                        </>
                    )}
                </label>
            </div>

            <p className="upload-note">
                Nuestro equipo revisará tu receta y te contactará si hay alguna duda.
            </p>
        </div>
    );
}

interface AppointmentSchedulerProps {
    linkedAppointmentId: string | null;
    onLink: (id: string) => void;
}

function AppointmentScheduler({ linkedAppointmentId, onLink }: AppointmentSchedulerProps) {
    return (
        <div className="appointment-scheduler">
            <h4>Agenda tu examen de la vista</h4>

            {linkedAppointmentId ? (
                <div className="appointment-linked">
                    <span className="linked-icon" aria-hidden="true">✅</span>
                    <p>Tienes una cita agendada. Después de tu examen, agregaremos tu receta automáticamente.</p>
                </div>
            ) : (
                <div className="appointment-cta">
                    <p>
                        Si no tienes una receta actualizada (menos de 1 año),
                        agenda una cita con nuestros optometristas certificados.
                    </p>

                    <a href="/citas" className="schedule-button">
                        <span aria-hidden="true">📅</span>
                        Agendar Cita
                    </a>

                    <p className="appointment-hint">
                        Después de tu cita, tu receta se vinculará automáticamente a esta orden.
                    </p>
                </div>
            )}
        </div>
    );
}

export default PrescriptionStep;
