/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VALIDACIÓN DE RECETA MÉDICA CON ZOD 4
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Implementa validación robusta de recetas oftalmológicas con:
 * - Rangos médicamente válidos
 * - Reglas de dependencia (ej: axis requiere cylinder)
 * - Mensajes de error educativos
 * 
 * Compatible con Zod 4.x API
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES DE VALIDACIÓN
// ═══════════════════════════════════════════════════════════════════════════

export const PRESCRIPTION_LIMITS = {
    // Esfera (SPH)
    sphere: {
        min: -20.0,
        max: 20.0,
        step: 0.25,
    },
    // Cilindro (CYL)
    cylinder: {
        min: -6.0,
        max: 6.0,
        step: 0.25,
    },
    // Eje (AXIS)
    axis: {
        min: 1,
        max: 180,
        step: 1,
    },
    // Adición (ADD) - para progresivos
    add: {
        min: 0.75,
        max: 3.5,
        step: 0.25,
    },
    // Distancia Pupilar (PD)
    pd: {
        // PD monocular (un ojo)
        monocular: {
            min: 25,
            max: 40,
        },
        // PD binocular (total)
        binocular: {
            min: 54,
            max: 74,
        },
    },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES DE VALIDACIÓN AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Valida que un número esté en pasos de 0.25
 */
const isValidStep = (value: number, step: number): boolean => {
    const multiplier = 1 / step;
    return Number.isInteger(value * multiplier);
};

/**
 * Mensaje de error para valores fuera de rango
 */
const rangeError = (field: string, min: number, max: number): string =>
    `${field} debe estar entre ${min > 0 ? '+' : ''}${min} y ${max > 0 ? '+' : ''}${max}`;

/**
 * Mensaje de error para pasos inválidos
 */
const stepError = (field: string, step: number): string =>
    `${field} debe ser en incrementos de ${step} (ej: 0.25, 0.50, 0.75, 1.00)`;

// ═══════════════════════════════════════════════════════════════════════════
// ESQUEMAS ZOD 4
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Esquema para Esfera (SPH)
 */
export const sphereSchema = z
    .number({ message: 'La esfera (SPH) es requerida y debe ser un número' })
    .min(PRESCRIPTION_LIMITS.sphere.min, {
        message: rangeError(
            'La esfera',
            PRESCRIPTION_LIMITS.sphere.min,
            PRESCRIPTION_LIMITS.sphere.max
        ),
    })
    .max(PRESCRIPTION_LIMITS.sphere.max, {
        message: rangeError(
            'La esfera',
            PRESCRIPTION_LIMITS.sphere.min,
            PRESCRIPTION_LIMITS.sphere.max
        ),
    })
    .refine((val) => isValidStep(val, PRESCRIPTION_LIMITS.sphere.step), {
        message: stepError('La esfera', PRESCRIPTION_LIMITS.sphere.step),
    });

/**
 * Esquema para Cilindro (CYL)
 */
export const cylinderSchema = z
    .number({ message: 'El cilindro debe ser un número' })
    .min(PRESCRIPTION_LIMITS.cylinder.min, {
        message: rangeError(
            'El cilindro',
            PRESCRIPTION_LIMITS.cylinder.min,
            PRESCRIPTION_LIMITS.cylinder.max
        ),
    })
    .max(PRESCRIPTION_LIMITS.cylinder.max, {
        message: rangeError(
            'El cilindro',
            PRESCRIPTION_LIMITS.cylinder.min,
            PRESCRIPTION_LIMITS.cylinder.max
        ),
    })
    .refine((val) => isValidStep(val, PRESCRIPTION_LIMITS.cylinder.step), {
        message: stepError('El cilindro', PRESCRIPTION_LIMITS.cylinder.step),
    })
    .nullable();

/**
 * Esquema para Eje (AXIS)
 */
export const axisSchema = z
    .number({ message: 'El eje debe ser un número' })
    .int({ message: 'El eje debe ser un número entero' })
    .min(PRESCRIPTION_LIMITS.axis.min, {
        message: rangeError(
            'El eje',
            PRESCRIPTION_LIMITS.axis.min,
            PRESCRIPTION_LIMITS.axis.max
        ),
    })
    .max(PRESCRIPTION_LIMITS.axis.max, {
        message: rangeError(
            'El eje',
            PRESCRIPTION_LIMITS.axis.min,
            PRESCRIPTION_LIMITS.axis.max
        ),
    })
    .nullable();

/**
 * Esquema para Adición (ADD)
 */
export const addSchema = z
    .number({ message: 'La adición debe ser un número' })
    .min(PRESCRIPTION_LIMITS.add.min, {
        message: rangeError(
            'La adición',
            PRESCRIPTION_LIMITS.add.min,
            PRESCRIPTION_LIMITS.add.max
        ),
    })
    .max(PRESCRIPTION_LIMITS.add.max, {
        message: rangeError(
            'La adición',
            PRESCRIPTION_LIMITS.add.min,
            PRESCRIPTION_LIMITS.add.max
        ),
    })
    .refine((val) => isValidStep(val, PRESCRIPTION_LIMITS.add.step), {
        message: stepError('La adición', PRESCRIPTION_LIMITS.add.step),
    })
    .nullable();

/**
 * Esquema para PD monocular
 */
export const pdMonocularSchema = z
    .number({ message: 'La distancia pupilar es requerida y debe ser un número' })
    .min(PRESCRIPTION_LIMITS.pd.monocular.min, {
        message: `La distancia pupilar debe ser al menos ${PRESCRIPTION_LIMITS.pd.monocular.min}mm`,
    })
    .max(PRESCRIPTION_LIMITS.pd.monocular.max, {
        message: `La distancia pupilar no puede exceder ${PRESCRIPTION_LIMITS.pd.monocular.max}mm`,
    });

/**
 * Esquema para prescripción de UN OJO
 */
export const eyePrescriptionSchema = z
    .object({
        sphere: sphereSchema,
        cylinder: cylinderSchema,
        axis: axisSchema,
        add: addSchema,
        pd: pdMonocularSchema,
    })
    .refine(
        (data) => {
            // Si hay cilindro, debe haber eje
            if (data.cylinder !== null && data.cylinder !== 0 && data.axis === null) {
                return false;
            }
            return true;
        },
        {
            message:
                'El eje (AXIS) es requerido cuando hay un valor de cilindro (CYL). El eje indica la orientación del astigmatismo.',
            path: ['axis'],
        }
    )
    .refine(
        (data) => {
            // Si no hay cilindro, el eje debe ser null o 0
            if (
                (data.cylinder === null || data.cylinder === 0) &&
                data.axis !== null &&
                data.axis !== 0
            ) {
                return false;
            }
            return true;
        },
        {
            message:
                'El eje (AXIS) solo aplica cuando hay astigmatismo. Si el cilindro es 0, deja el eje vacío.',
            path: ['axis'],
        }
    );

/**
 * Esquema para la receta completa
 */
export const prescriptionSchema = z
    .object({
        name: z
            .string()
            .min(1, { message: 'Dale un nombre a tu receta para identificarla fácilmente' })
            .max(100, { message: 'El nombre no puede exceder 100 caracteres' }),

        rightEye: eyePrescriptionSchema,
        leftEye: eyePrescriptionSchema,

        totalPD: z
            .number()
            .min(PRESCRIPTION_LIMITS.pd.binocular.min, {
                message: `La distancia pupilar total debe ser al menos ${PRESCRIPTION_LIMITS.pd.binocular.min}mm`,
            })
            .max(PRESCRIPTION_LIMITS.pd.binocular.max, {
                message: `La distancia pupilar total no puede exceder ${PRESCRIPTION_LIMITS.pd.binocular.max}mm`,
            }),

        issueDate: z.string().refine(
            (date) => {
                const parsed = new Date(date);
                return !isNaN(parsed.getTime());
            },
            { message: 'Fecha de emisión inválida' }
        ),

        expirationDate: z.string().refine(
            (date) => {
                const parsed = new Date(date);
                return !isNaN(parsed.getTime());
            },
            { message: 'Fecha de expiración inválida' }
        ),

        doctorName: z.string().max(200).optional(),
        doctorLicense: z.string().max(50).optional(),
        scannedImageUrl: z.string().url().optional(),
        notes: z.string().max(1000).optional(),
    })
    .refine(
        (data) => {
            // La fecha de expiración debe ser posterior a la de emisión
            const issue = new Date(data.issueDate);
            const expiration = new Date(data.expirationDate);
            return expiration > issue;
        },
        {
            message: 'La fecha de expiración debe ser posterior a la fecha de emisión',
            path: ['expirationDate'],
        }
    )
    .refine(
        (data) => {
            // La suma de PDs monoculares debe aproximarse al PD total
            const calculatedTotal = data.rightEye.pd + data.leftEye.pd;
            const tolerance = 2; // Permitimos 2mm de diferencia
            return Math.abs(calculatedTotal - data.totalPD) <= tolerance;
        },
        {
            message:
                'La suma de las distancias pupilares de cada ojo debe ser aproximadamente igual a la distancia pupilar total',
            path: ['totalPD'],
        }
    );

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS INFERIDOS
// ═══════════════════════════════════════════════════════════════════════════

export type EyePrescriptionInput = z.input<typeof eyePrescriptionSchema>;
export type EyePrescriptionOutput = z.output<typeof eyePrescriptionSchema>;
export type PrescriptionInput = z.input<typeof prescriptionSchema>;
export type PrescriptionOutput = z.output<typeof prescriptionSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// VALIDADORES DE ALTO NIVEL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Verifica si una graduación es "alta" y requiere lentes de mayor índice
 */
export const isHighPrescription = (sphere: number, cylinder: number | null): boolean => {
    const absSphere = Math.abs(sphere);
    const absCylinder = Math.abs(cylinder || 0);

    // Consideramos alta si la esfera es >= 4 o el cilindro es >= 2
    return absSphere >= 4 || absCylinder >= 2;
};

/**
 * Recomienda el índice de lente basado en la graduación
 */
export type RecommendedIndex = '1.50' | '1.56' | '1.60' | '1.67' | '1.74';

export const recommendLensIndex = (
    sphere: number,
    cylinder: number | null
): RecommendedIndex => {
    const absSphere = Math.abs(sphere);
    const absCylinder = Math.abs(cylinder || 0);
    const totalPower = absSphere + absCylinder;

    if (totalPower <= 2) return '1.50';
    if (totalPower <= 4) return '1.56';
    if (totalPower <= 6) return '1.60';
    if (totalPower <= 8) return '1.67';
    return '1.74';
};

/**
 * Verifica si la receta ha expirado
 */
export const isPrescriptionExpired = (expirationDate: string): boolean => {
    return new Date(expirationDate) < new Date();
};

/**
 * Calcula la edad de la receta en días
 */
export const prescriptionAgeInDays = (issueDate: string): number => {
    const issue = new Date(issueDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - issue.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
