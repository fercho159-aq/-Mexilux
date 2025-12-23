/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STORE DEL CONFIGURADOR DE LENTES (ZUSTAND)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Maneja el estado del wizard de configuración con:
 * - Persistencia automática en localStorage
 * - TTL para expiración de configuraciones abandonadas
 * - Sincronización con URL para navegación
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
    ConfiguratorStep,
    LensConfiguration,
    LensUsageType,
    PrescriptionSource,
    Prescription,
    LensConfigurationPricing,
    UUID,
} from '@/types';

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS DEL STORE
// ═══════════════════════════════════════════════════════════════════════════

interface LensConfiguratorState {
    // ─── ESTADO DEL WIZARD ─────────────────────────────────────────────────
    configuration: LensConfiguration | null;

    // ─── DATOS DE REFERENCIA ───────────────────────────────────────────────
    /** Frame ID actual (viene de la página de producto) */
    frameId: UUID | null;

    /** Precio base del frame (para calcular totales) */
    framePrice: number;

    // ─── UI STATE ──────────────────────────────────────────────────────────
    /** Paso actual visible */
    currentStep: ConfiguratorStep;

    /** El wizard está cargando datos */
    isLoading: boolean;

    /** Errores de validación por paso */
    stepErrors: Partial<Record<ConfiguratorStep, string[]>>;

    /** Pasos completados */
    completedSteps: ConfiguratorStep[];

    // ─── ACCIONES ──────────────────────────────────────────────────────────
    /** Inicializa una nueva configuración */
    initConfiguration: (frameId: UUID, framePrice: number) => void;

    /** Carga una configuración existente */
    loadConfiguration: (config: LensConfiguration) => void;

    /** Navega a un paso específico */
    goToStep: (step: ConfiguratorStep) => void;

    /** Avanza al siguiente paso */
    nextStep: () => void;

    /** Retrocede al paso anterior */
    prevStep: () => void;

    /** Actualiza el tipo de uso */
    setUsageType: (usageType: LensUsageType) => void;

    /** Actualiza la fuente de la receta */
    setPrescriptionSource: (source: PrescriptionSource) => void;

    /** Selecciona una receta guardada */
    selectSavedPrescription: (prescriptionId: UUID) => void;

    /** Guarda una receta ingresada manualmente */
    setManualPrescription: (
        prescription: Omit<Prescription, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    ) => void;

    /** Guarda la URL de una receta subida */
    setUploadedPrescription: (url: string) => void;

    /** Vincula una cita agendada */
    linkAppointment: (appointmentId: UUID) => void;

    /** Selecciona el material */
    setMaterial: (materialId: UUID) => void;

    /** Toggle de un tratamiento */
    toggleTreatment: (treatmentId: UUID) => void;

    /** Establece múltiples tratamientos */
    setTreatments: (treatmentIds: UUID[]) => void;

    /** Actualiza los precios calculados */
    updatePricing: (pricing: LensConfigurationPricing) => void;

    /** Marca un paso como completado */
    completeStep: (step: ConfiguratorStep) => void;

    /** Establece errores para un paso */
    setStepErrors: (step: ConfiguratorStep, errors: string[]) => void;

    /** Limpia errores de un paso */
    clearStepErrors: (step: ConfiguratorStep) => void;

    /** Marca la configuración como completa */
    finalizeConfiguration: () => void;

    /** Resetea todo el configurador */
    reset: () => void;

    /** Verifica si se puede avanzar al siguiente paso */
    canProceed: () => boolean;

    /** Obtiene el progreso del wizard (0-100) */
    getProgress: () => number;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

const STEPS_ORDER: ConfiguratorStep[] = [
    'usage_type',
    'prescription',
    'material',
    'treatments',
    'review',
];

const STORAGE_KEY = 'mexilux-lens-configurator';
const TTL_DAYS = 7;

/**
 * Genera un ID único simple
 */
const generateId = (): UUID => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calcula la fecha de expiración
 */
const getExpirationDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + TTL_DAYS);
    return date.toISOString();
};

/**
 * Verifica si una configuración ha expirado
 */
const isExpired = (expiresAt: string): boolean => {
    return new Date(expiresAt) < new Date();
};

// ═══════════════════════════════════════════════════════════════════════════
// ESTADO INICIAL
// ═══════════════════════════════════════════════════════════════════════════

const initialState: Omit<
    LensConfiguratorState,
    | 'initConfiguration'
    | 'loadConfiguration'
    | 'goToStep'
    | 'nextStep'
    | 'prevStep'
    | 'setUsageType'
    | 'setPrescriptionSource'
    | 'selectSavedPrescription'
    | 'setManualPrescription'
    | 'setUploadedPrescription'
    | 'linkAppointment'
    | 'setMaterial'
    | 'toggleTreatment'
    | 'setTreatments'
    | 'updatePricing'
    | 'completeStep'
    | 'setStepErrors'
    | 'clearStepErrors'
    | 'finalizeConfiguration'
    | 'reset'
    | 'canProceed'
    | 'getProgress'
> = {
    configuration: null,
    frameId: null,
    framePrice: 0,
    currentStep: 'usage_type',
    isLoading: false,
    stepErrors: {},
    completedSteps: [],
};

// ═══════════════════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════════════════

export const useLensConfiguratorStore = create<LensConfiguratorState>()(
    persist(
        (set, get) => ({
            ...initialState,

            // ─────────────────────────────────────────────────────────────────────
            // INICIALIZACIÓN
            // ─────────────────────────────────────────────────────────────────────

            initConfiguration: (frameId, framePrice) => {
                const now = new Date().toISOString();

                set({
                    frameId,
                    framePrice,
                    currentStep: 'usage_type',
                    completedSteps: [],
                    stepErrors: {},
                    configuration: {
                        id: generateId(),
                        frameId,
                        currentStep: 'usage_type',
                        isComplete: false,
                        usageType: null,
                        prescriptionSource: null,
                        savedPrescriptionId: null,
                        manualPrescription: null,
                        uploadedPrescriptionUrl: null,
                        appointmentId: null,
                        materialId: null,
                        treatmentIds: [],
                        pricing: null,
                        createdAt: now,
                        updatedAt: now,
                        expiresAt: getExpirationDate(),
                    },
                });
            },

            loadConfiguration: (config) => {
                // Verificar si ha expirado
                if (isExpired(config.expiresAt)) {
                    get().reset();
                    return;
                }

                set({
                    configuration: config,
                    frameId: config.frameId,
                    currentStep: config.currentStep,
                });
            },

            // ─────────────────────────────────────────────────────────────────────
            // NAVEGACIÓN
            // ─────────────────────────────────────────────────────────────────────

            goToStep: (step) => {
                const state = get();
                const stepIndex = STEPS_ORDER.indexOf(step);
                const currentIndex = STEPS_ORDER.indexOf(state.currentStep);

                // Solo permitir ir a pasos anteriores o al siguiente si el actual está completo
                if (
                    stepIndex <= currentIndex ||
                    state.completedSteps.includes(state.currentStep)
                ) {
                    set({
                        currentStep: step,
                        configuration: state.configuration
                            ? {
                                ...state.configuration,
                                currentStep: step,
                                updatedAt: new Date().toISOString(),
                            }
                            : null,
                    });
                }
            },

            nextStep: () => {
                const state = get();
                if (!state.canProceed()) return;

                const currentIndex = STEPS_ORDER.indexOf(state.currentStep);
                if (currentIndex < STEPS_ORDER.length - 1) {
                    const nextStep = STEPS_ORDER[currentIndex + 1];

                    // Marcar el paso actual como completado
                    const completedSteps = state.completedSteps.includes(state.currentStep)
                        ? state.completedSteps
                        : [...state.completedSteps, state.currentStep];

                    set({
                        currentStep: nextStep,
                        completedSteps,
                        configuration: state.configuration
                            ? {
                                ...state.configuration,
                                currentStep: nextStep,
                                updatedAt: new Date().toISOString(),
                            }
                            : null,
                    });
                }
            },

            prevStep: () => {
                const state = get();
                const currentIndex = STEPS_ORDER.indexOf(state.currentStep);

                if (currentIndex > 0) {
                    const prevStep = STEPS_ORDER[currentIndex - 1];

                    set({
                        currentStep: prevStep,
                        configuration: state.configuration
                            ? {
                                ...state.configuration,
                                currentStep: prevStep,
                                updatedAt: new Date().toISOString(),
                            }
                            : null,
                    });
                }
            },

            // ─────────────────────────────────────────────────────────────────────
            // PASO 1: TIPO DE USO
            // ─────────────────────────────────────────────────────────────────────

            setUsageType: (usageType) => {
                set((state) => ({
                    configuration: state.configuration
                        ? {
                            ...state.configuration,
                            usageType,
                            // Reset pasos dependientes si cambia el tipo
                            materialId: null,
                            treatmentIds: [],
                            pricing: null,
                            updatedAt: new Date().toISOString(),
                        }
                        : null,
                }));
            },

            // ─────────────────────────────────────────────────────────────────────
            // PASO 2: RECETA
            // ─────────────────────────────────────────────────────────────────────

            setPrescriptionSource: (source) => {
                set((state) => ({
                    configuration: state.configuration
                        ? {
                            ...state.configuration,
                            prescriptionSource: source,
                            // Reset datos de receta previos
                            savedPrescriptionId: null,
                            manualPrescription: null,
                            uploadedPrescriptionUrl: null,
                            appointmentId: null,
                            updatedAt: new Date().toISOString(),
                        }
                        : null,
                }));
            },

            selectSavedPrescription: (prescriptionId) => {
                set((state) => ({
                    configuration: state.configuration
                        ? {
                            ...state.configuration,
                            savedPrescriptionId: prescriptionId,
                            updatedAt: new Date().toISOString(),
                        }
                        : null,
                }));
            },

            setManualPrescription: (prescription) => {
                set((state) => ({
                    configuration: state.configuration
                        ? {
                            ...state.configuration,
                            manualPrescription: prescription,
                            updatedAt: new Date().toISOString(),
                        }
                        : null,
                }));
            },

            setUploadedPrescription: (url) => {
                set((state) => ({
                    configuration: state.configuration
                        ? {
                            ...state.configuration,
                            uploadedPrescriptionUrl: url,
                            updatedAt: new Date().toISOString(),
                        }
                        : null,
                }));
            },

            linkAppointment: (appointmentId) => {
                set((state) => ({
                    configuration: state.configuration
                        ? {
                            ...state.configuration,
                            appointmentId,
                            updatedAt: new Date().toISOString(),
                        }
                        : null,
                }));
            },

            // ─────────────────────────────────────────────────────────────────────
            // PASO 3: MATERIAL
            // ─────────────────────────────────────────────────────────────────────

            setMaterial: (materialId) => {
                set((state) => ({
                    configuration: state.configuration
                        ? {
                            ...state.configuration,
                            materialId,
                            // Algunos tratamientos pueden no ser compatibles, los validaremos después
                            updatedAt: new Date().toISOString(),
                        }
                        : null,
                }));
            },

            // ─────────────────────────────────────────────────────────────────────
            // PASO 4: TRATAMIENTOS
            // ─────────────────────────────────────────────────────────────────────

            toggleTreatment: (treatmentId) => {
                set((state) => {
                    if (!state.configuration) return state;

                    const currentTreatments = state.configuration.treatmentIds;
                    const newTreatments = currentTreatments.includes(treatmentId)
                        ? currentTreatments.filter((id) => id !== treatmentId)
                        : [...currentTreatments, treatmentId];

                    return {
                        configuration: {
                            ...state.configuration,
                            treatmentIds: newTreatments,
                            updatedAt: new Date().toISOString(),
                        },
                    };
                });
            },

            setTreatments: (treatmentIds) => {
                set((state) => ({
                    configuration: state.configuration
                        ? {
                            ...state.configuration,
                            treatmentIds,
                            updatedAt: new Date().toISOString(),
                        }
                        : null,
                }));
            },

            // ─────────────────────────────────────────────────────────────────────
            // PRECIOS
            // ─────────────────────────────────────────────────────────────────────

            updatePricing: (pricing) => {
                set((state) => ({
                    configuration: state.configuration
                        ? {
                            ...state.configuration,
                            pricing,
                            updatedAt: new Date().toISOString(),
                        }
                        : null,
                }));
            },

            // ─────────────────────────────────────────────────────────────────────
            // CONTROL DE PASOS
            // ─────────────────────────────────────────────────────────────────────

            completeStep: (step) => {
                set((state) => ({
                    completedSteps: state.completedSteps.includes(step)
                        ? state.completedSteps
                        : [...state.completedSteps, step],
                }));
            },

            setStepErrors: (step, errors) => {
                set((state) => ({
                    stepErrors: {
                        ...state.stepErrors,
                        [step]: errors,
                    },
                }));
            },

            clearStepErrors: (step) => {
                set((state) => {
                    const { [step]: _, ...rest } = state.stepErrors;
                    return { stepErrors: rest };
                });
            },

            // ─────────────────────────────────────────────────────────────────────
            // FINALIZACIÓN
            // ─────────────────────────────────────────────────────────────────────

            finalizeConfiguration: () => {
                set((state) => ({
                    configuration: state.configuration
                        ? {
                            ...state.configuration,
                            isComplete: true,
                            updatedAt: new Date().toISOString(),
                        }
                        : null,
                }));
            },

            reset: () => {
                set(initialState);
            },

            // ─────────────────────────────────────────────────────────────────────
            // HELPERS
            // ─────────────────────────────────────────────────────────────────────

            canProceed: () => {
                const state = get();
                const config = state.configuration;

                if (!config) return false;

                const errors = state.stepErrors[state.currentStep];
                if (errors && errors.length > 0) return false;

                switch (state.currentStep) {
                    case 'usage_type':
                        return config.usageType !== null;

                    case 'prescription':
                        if (config.usageType === 'non_prescription') return true;
                        if (!config.prescriptionSource) return false;

                        switch (config.prescriptionSource) {
                            case 'saved':
                                return config.savedPrescriptionId !== null;
                            case 'manual':
                                return config.manualPrescription !== null;
                            case 'upload':
                                return config.uploadedPrescriptionUrl !== null;
                            case 'appointment':
                                return config.appointmentId !== null;
                            default:
                                return false;
                        }

                    case 'material':
                        return config.materialId !== null;

                    case 'treatments':
                        // Tratamientos son opcionales
                        return true;

                    case 'review':
                        return config.isComplete;

                    default:
                        return false;
                }
            },

            getProgress: () => {
                const state = get();
                const totalSteps = STEPS_ORDER.length;
                const currentIndex = STEPS_ORDER.indexOf(state.currentStep);

                // Base progress by current step
                const baseProgress = (currentIndex / totalSteps) * 100;

                // Add partial progress if can proceed
                const stepProgress = state.canProceed() ? (1 / totalSteps) * 100 : 0;

                return Math.min(Math.round(baseProgress + stepProgress), 100);
            },
        }),
        {
            name: STORAGE_KEY,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                configuration: state.configuration,
                frameId: state.frameId,
                framePrice: state.framePrice,
                currentStep: state.currentStep,
                completedSteps: state.completedSteps,
            }),
            onRehydrateStorage: () => (state) => {
                // Verificar expiración al cargar desde storage
                if (state?.configuration && isExpired(state.configuration.expiresAt)) {
                    state.reset();
                }
            },
        }
    )
);

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook para obtener solo el estado de lectura
 */
export const useConfiguratorState = () =>
    useLensConfiguratorStore((state) => ({
        configuration: state.configuration,
        currentStep: state.currentStep,
        isLoading: state.isLoading,
        stepErrors: state.stepErrors,
        completedSteps: state.completedSteps,
        progress: state.getProgress(),
        canProceed: state.canProceed(),
    }));

/**
 * Hook para obtener solo las acciones
 */
export const useConfiguratorActions = () =>
    useLensConfiguratorStore((state) => ({
        initConfiguration: state.initConfiguration,
        goToStep: state.goToStep,
        nextStep: state.nextStep,
        prevStep: state.prevStep,
        setUsageType: state.setUsageType,
        setPrescriptionSource: state.setPrescriptionSource,
        selectSavedPrescription: state.selectSavedPrescription,
        setManualPrescription: state.setManualPrescription,
        setUploadedPrescription: state.setUploadedPrescription,
        linkAppointment: state.linkAppointment,
        setMaterial: state.setMaterial,
        toggleTreatment: state.toggleTreatment,
        setTreatments: state.setTreatments,
        updatePricing: state.updatePricing,
        finalizeConfiguration: state.finalizeConfiguration,
        reset: state.reset,
    }));

export default useLensConfiguratorStore;
