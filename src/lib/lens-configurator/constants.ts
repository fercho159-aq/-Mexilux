/**
 * Constantes del configurador de lentes Mexilux (lenguaje del cliente).
 * Centraliza nombres, precios y opciones para que UI, store y resumen
 * lean de la misma fuente.
 */

export type LensTypeId = 'pa-la-chamba' | 'la-maquina-de-chambear' | 'el-nahual' | 'a-tu-antojo';

export interface LensTypeOption {
    id: LensTypeId;
    name: string;
    tagline: string;
    description: string;
    price: number;
    isIncluded?: boolean;
    hasSubFlow?: boolean;
}

export const LENS_TYPES: LensTypeOption[] = [
    {
        id: 'pa-la-chamba',
        name: 'Pa la chamba',
        tagline: 'Antirreflejo',
        description: '0–4 hrs/día frente a pantallas. Incluido de cajón.',
        price: 0,
        isIncluded: true,
    },
    {
        id: 'la-maquina-de-chambear',
        name: 'La máquina de chambear',
        tagline: 'Antirreflejo azul',
        description: '+4 hrs/día frente a pantallas. Filtra luz azul.',
        price: 450,
    },
    {
        id: 'el-nahual',
        name: 'El nahual',
        tagline: 'Fotocromático',
        description: 'Cambia de color con la luz del sol.',
        price: 0,
        hasSubFlow: true,
    },
    {
        id: 'a-tu-antojo',
        name: 'A tu antojo',
        tagline: 'Micas personalizadas',
        description: 'Tintes (Entituneados) o Polarizado (Solazo).',
        price: 0,
        hasSubFlow: true,
    },
];

export interface ColorOption {
    id: string;
    label: string;
    hex: string;
    price: number;
}

export const NAHUAL_COLORS: ColorOption[] = [
    { id: 'obsidiana', label: 'Obsidiana (Negro)', hex: '#1a1a1a', price: 0 },
    { id: 'cenote', label: 'Cenote (Azul)', hex: '#1e88e5', price: 490 },
    { id: 'elote', label: 'Elote (Amarillo)', hex: '#fdd835', price: 490 },
    { id: 'ajolote', label: 'Ajolote (Rosa)', hex: '#ec407a', price: 490 },
];

export type NahualAdditionalTreatment = 'none' | 'pa-la-chamba' | 'la-maquina-de-chambear';

export const NAHUAL_ADDITIONAL: Array<{
    id: NahualAdditionalTreatment;
    label: string;
    description: string;
    price: number;
}> = [
    { id: 'none', label: 'Sin tratamiento adicional', description: 'Solo el fotocromático', price: 0 },
    { id: 'pa-la-chamba', label: 'Con "Pa la chamba"', description: 'Antirreflejo incluido', price: 0 },
    { id: 'la-maquina-de-chambear', label: 'Con "La máquina de chambear"', description: 'Antirreflejo azul', price: 450 },
];

export type CustomMicaSubtype = 'entituneados' | 'solazo';

export interface CustomMicaOption {
    id: CustomMicaSubtype;
    name: string;
    description: string;
    price: number;
}

export const CUSTOM_MICAS: CustomMicaOption[] = [
    {
        id: 'entituneados',
        name: 'Entituneados',
        description: 'Tintes Parejito (uniforme) o Amanecido (degradado).',
        price: 350,
    },
    {
        id: 'solazo',
        name: 'Solazo',
        description: 'Polarizado para carreteras y playa.',
        price: 750,
    },
];

export const ENTITUNEADOS_COLORS: ColorOption[] = [
    { id: 'sangre-azteca', label: 'Sangre Azteca (Rojo)', hex: '#c62828', price: 0 },
    { id: 'obsidiana', label: 'Obsidiana (Negro)', hex: '#1a1a1a', price: 0 },
    { id: 'cenote', label: 'Cenote (Azul)', hex: '#1e88e5', price: 0 },
    { id: 'cacao', label: 'Cacao (Café)', hex: '#5d4037', price: 0 },
    { id: 'nopal', label: 'Nopal (Verde)', hex: '#388e3c', price: 0 },
    { id: 'ajolote', label: 'Ajolote (Rosa)', hex: '#ec407a', price: 0 },
    { id: 'elote', label: 'Elote (Amarillo)', hex: '#fdd835', price: 0 },
    { id: 'cempasuchil', label: 'Cempasúchil (Naranja)', hex: '#ff7043', price: 0 },
];

export type TintStyle = 'parejito' | 'amanecido';

export const TINT_STYLES: Array<{ id: TintStyle; label: string; description: string }> = [
    { id: 'parejito', label: 'Parejito', description: 'Color uniforme en toda la mica' },
    { id: 'amanecido', label: 'Amanecido', description: 'Degradado de arriba hacia abajo' },
];

export type IntensityLevel = 'I' | 'II' | 'III';

export const INTENSITY_LEVELS: Array<{ id: IntensityLevel; label: string; description: string }> = [
    { id: 'I', label: 'I', description: 'Tono ligero' },
    { id: 'II', label: 'II', description: 'Tono medio' },
    { id: 'III', label: 'III', description: 'Tono intenso' },
];

export const SOLAZO_COLORS: ColorOption[] = [
    { id: 'obsidiana', label: 'Obsidiana (Negro)', hex: '#1a1a1a', price: 0 },
    { id: 'cacao', label: 'Cacao (Café)', hex: '#5d4037', price: 0 },
];

export type PrescriptionTier = 1 | 2 | 3 | 'asesor';

export interface PrescriptionTierResult {
    tier: PrescriptionTier;
    cost: number | null;
    requiresAdvisor: boolean;
    label: string;
}

export function prescriptionCostTier(maxAbsValue: number): PrescriptionTierResult {
    if (maxAbsValue <= 2.0) return { tier: 1, cost: 0, requiresAdvisor: false, label: '0.00 a 2.00' };
    if (maxAbsValue <= 4.0) return { tier: 2, cost: 290, requiresAdvisor: false, label: '2.25 a 4.00' };
    if (maxAbsValue <= 6.0) return { tier: 3, cost: 590, requiresAdvisor: false, label: '4.25 a 6.00' };
    return { tier: 'asesor', cost: null, requiresAdvisor: true, label: 'Más de 6.00' };
}
