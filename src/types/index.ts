/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MEXILUX - Arquitectura de Datos para Tienda de Óptica
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Este archivo define todas las interfaces y tipos críticos del sistema.
 * La relación más compleja es entre Frame (Montura) y LensConfiguration.
 * 
 * Modelo de Negocio:
 * - Un usuario compra una MONTURA (Frame)
 * - Opcionalmente, añade una CONFIGURACIÓN DE LENTES (LensConfiguration)
 * - La configuración incluye: receta + material + tratamientos
 * - El precio final = precio_montura + precio_configuración
 */

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS BASE Y UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════

export type UUID = string;
export type ISODateString = string;
export type Currency = 'MXN' | 'USD';

/**
 * Género target para productos de moda
 */
export type Gender = 'male' | 'female' | 'unisex' | 'kids';

/**
 * Estados de un producto
 */
export type ProductStatus = 'active' | 'draft' | 'discontinued' | 'out_of_stock';

/**
 * Estados de una orden
 */
export type OrderStatus = 
  | 'pending_payment'
  | 'payment_confirmed'
  | 'in_production'       // Fabricando lentes
  | 'quality_control'     // Revisando lentes
  | 'ready_for_shipping'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

// ═══════════════════════════════════════════════════════════════════════════
// RECETA MÉDICA (Prescription)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Valores de prescripción para UN OJO
 * 
 * SPH (Esfera): Corrige miopía (-) o hipermetropía (+)
 * CYL (Cilindro): Corrige astigmatismo
 * AXIS (Eje): Orientación del astigmatismo (1-180 grados)
 * ADD (Adición): Para lentes progresivos, poder de lectura adicional
 * PD (Distancia Pupilar): Distancia del centro de pupila al centro nasal
 */
export interface EyePrescription {
  /** Esfera: rango típico -20.00 a +20.00, pasos de 0.25 */
  sphere: number;
  
  /** Cilindro: rango típico -6.00 a +6.00, pasos de 0.25. Null si no hay astigmatismo */
  cylinder: number | null;
  
  /** Eje: 1-180 grados. Obligatorio si cylinder tiene valor, null si no */
  axis: number | null;
  
  /** Adición: rango típico +0.75 a +3.50. Solo para progresivos/bifocales */
  add: number | null;
  
  /** Distancia pupilar específica del ojo (monocular PD) en mm */
  pd: number;
}

/**
 * Receta médica completa
 * Incluye prescripción de ambos ojos y metadatos
 */
export interface Prescription {
  id: UUID;
  userId: UUID;
  
  /** Nombre descriptivo dado por el usuario (ej: "Receta Dr. García 2024") */
  name: string;
  
  /** Prescripción del ojo derecho (OD - Oculus Dexter) */
  rightEye: EyePrescription;
  
  /** Prescripción del ojo izquierdo (OS - Oculus Sinister) */
  leftEye: EyePrescription;
  
  /** Distancia pupilar total (bipupilar) para referencia */
  totalPD: number;
  
  /** Fecha de emisión de la receta */
  issueDate: ISODateString;
  
  /** Fecha de expiración (típicamente 1-2 años después) */
  expirationDate: ISODateString;
  
  /** Nombre del doctor que emitió la receta */
  doctorName?: string;
  
  /** Número de cédula profesional del doctor */
  doctorLicense?: string;
  
  /** URL de la imagen escaneada de la receta original */
  scannedImageUrl?: string;
  
  /** Notas adicionales */
  notes?: string;
  
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ═══════════════════════════════════════════════════════════════════════════
// TIPO DE USO DE LENTES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Define el propósito principal de los lentes
 * Esto afecta qué materiales y tratamientos están disponibles
 */
export type LensUsageType = 
  | 'single_vision_distance'  // Visión sencilla para lejos (miopía/hipermetropía)
  | 'single_vision_near'      // Visión sencilla para cerca (presbicia leve)
  | 'single_vision_computer'  // Visión sencilla para computadora
  | 'bifocal'                 // Bifocales (lejos arriba, cerca abajo)
  | 'progressive'             // Progresivos (multifocal sin línea)
  | 'non_prescription';       // Sin graduación (solo montura o lentes de sol)

export interface LensUsageOption {
  id: LensUsageType;
  name: string;
  description: string;
  icon: string;
  requiresPrescription: boolean;
  requiresAdd: boolean; // Requiere valor ADD en la receta
  priceModifier: number; // Precio base adicional
}

// ═══════════════════════════════════════════════════════════════════════════
// MATERIAL DE LENTES (MICAS)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Índice de refracción del material
 * Mayor índice = lente más delgado para misma graduación
 */
export type LensIndex = '1.50' | '1.56' | '1.60' | '1.67' | '1.74';

/**
 * Material de la mica/cristal
 */
export interface LensMaterial {
  id: UUID;
  
  name: string;
  description: string;
  
  /** Índice de refracción */
  index: LensIndex;
  
  /** Es adecuado para graduaciones altas */
  highPrescriptionSuitable: boolean;
  
  /** Rango máximo de graduación recomendado */
  maxSphereRecommended: number;
  
  /** Grosor relativo (1-5, donde 1 es más grueso) */
  thinnessFactor: number;
  
  /** Es policarbonato (más resistente a impactos) */
  isPolycarbonate: boolean;
  
  /** Bloquea rayos UV naturalmente */
  hasUVProtection: boolean;
  
  price: number;
  currency: Currency;
  
  /** Imagen ilustrativa del grosor comparativo */
  comparisonImageUrl?: string;
  
  /** Disponible para el público */
  isActive: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// TRATAMIENTOS Y COBERTURAS
// ═══════════════════════════════════════════════════════════════════════════

export type TreatmentCategory = 
  | 'coating'           // Recubrimientos (antirreflejante, etc)
  | 'tint'              // Tintes/colores
  | 'photochromic'      // Fotocromático (Transitions)
  | 'blue_light'        // Filtro de luz azul
  | 'polarized';        // Polarizado

/**
 * Tratamiento o cobertura adicional para lentes
 */
export interface LensTreatment {
  id: UUID;
  
  name: string;
  shortName: string;
  description: string;
  
  category: TreatmentCategory;
  
  /** Beneficios clave (para mostrar en UI) */
  benefits: string[];
  
  /** Incompatible con otros tratamientos (IDs) */
  incompatibleWith: UUID[];
  
  /** Requiere ciertos materiales (IDs). Vacío = compatible con todos */
  requiresMaterials: UUID[];
  
  /** No disponible para ciertos tipos de uso */
  excludedUsageTypes: LensUsageType[];
  
  price: number;
  currency: Currency;
  
  iconUrl?: string;
  imageUrl?: string;
  
  /** Orden de display en la UI */
  sortOrder: number;
  
  isActive: boolean;
  isPopular: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE LENTES (El objeto complejo central)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Estado del configurador (wizard steps)
 */
export type ConfiguratorStep = 
  | 'usage_type'        // Paso 1: Seleccionar tipo de uso
  | 'prescription'      // Paso 2: Ingresar/seleccionar receta
  | 'material'          // Paso 3: Elegir material
  | 'treatments'        // Paso 4: Seleccionar tratamientos
  | 'review';           // Paso 5: Revisar y confirmar

/**
 * Fuente de la receta médica
 */
export type PrescriptionSource = 
  | 'saved'             // Receta guardada en el perfil
  | 'manual'            // Ingresada manualmente
  | 'upload'            // Subida como imagen para revisión
  | 'appointment';      // Será obtenida en cita agendada

/**
 * Configuración completa de lentes
 * Este es el objeto que se guarda cuando el usuario completa el wizard
 */
export interface LensConfiguration {
  id: UUID;
  
  /** ID de la montura asociada */
  frameId: UUID;
  
  /** Paso actual del wizard */
  currentStep: ConfiguratorStep;
  
  /** El wizard ha sido completado */
  isComplete: boolean;
  
  // ─── PASO 1: TIPO DE USO ───────────────────────────────────────────────
  usageType: LensUsageType | null;
  
  // ─── PASO 2: RECETA ────────────────────────────────────────────────────
  prescriptionSource: PrescriptionSource | null;
  
  /** ID de receta guardada (si source = 'saved') */
  savedPrescriptionId: UUID | null;
  
  /** Receta ingresada manualmente (si source = 'manual') */
  manualPrescription: Omit<Prescription, 'id' | 'userId' | 'createdAt' | 'updatedAt'> | null;
  
  /** URL de imagen subida (si source = 'upload') */
  uploadedPrescriptionUrl: string | null;
  
  /** ID de cita agendada (si source = 'appointment') */
  appointmentId: UUID | null;
  
  // ─── PASO 3: MATERIAL ──────────────────────────────────────────────────
  materialId: UUID | null;
  
  // ─── PASO 4: TRATAMIENTOS ──────────────────────────────────────────────
  treatmentIds: UUID[];
  
  // ─── PRECIOS CALCULADOS ────────────────────────────────────────────────
  pricing: LensConfigurationPricing | null;
  
  // ─── METADATOS ─────────────────────────────────────────────────────────
  createdAt: ISODateString;
  updatedAt: ISODateString;
  
  /** TTL para limpieza automática de configuraciones abandonadas */
  expiresAt: ISODateString;
}

/**
 * Desglose de precios de la configuración
 */
export interface LensConfigurationPricing {
  /** Precio base por tipo de uso */
  usageTypePrice: number;
  
  /** Precio del material */
  materialPrice: number;
  
  /** Suma de precios de tratamientos */
  treatmentsPrice: number;
  
  /** Subtotal de la configuración (sin montura) */
  subtotal: number;
  
  /** Descuento aplicado (si aplica) */
  discount: number;
  
  /** Total de la configuración */
  total: number;
  
  currency: Currency;
}

// ═══════════════════════════════════════════════════════════════════════════
// MONTURA (FRAME) - PRODUCTO PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Forma de la montura
 */
export type FrameShape = 
  | 'rectangular'
  | 'round'
  | 'cat_eye'
  | 'aviator'
  | 'square'
  | 'oval'
  | 'geometric'
  | 'browline'
  | 'wrap';

/**
 * Material de la montura
 */
export type FrameMaterial = 
  | 'acetate'
  | 'metal'
  | 'titanium'
  | 'tr90'           // Plástico flexible
  | 'wood'
  | 'mixed';         // Combinación

/**
 * Tipo de montura
 */
export type FrameType = 
  | 'full_rim'       // Aro completo
  | 'semi_rimless'   // Semi al aire
  | 'rimless';       // Al aire

/**
 * Dimensiones de la montura (en mm)
 */
export interface FrameDimensions {
  /** Ancho del lente */
  lensWidth: number;
  
  /** Alto del lente */
  lensHeight: number;
  
  /** Ancho del puente */
  bridgeWidth: number;
  
  /** Largo de la varilla */
  templeLength: number;
  
  /** Ancho total de la montura */
  totalWidth: number;
}

/**
 * Una variante de color de la montura
 */
export interface FrameColorVariant {
  id: UUID;
  
  /** Nombre del color (ej: "Negro Mate", "Carey Habana") */
  colorName: string;
  
  /** Código hex del color principal */
  colorHex: string;
  
  /** Código hex del color secundario (si aplica) */
  secondaryColorHex?: string;
  
  /** SKU único para esta variante */
  sku: string;
  
  /** URLs de imágenes (múltiples ángulos) */
  images: FrameImage[];
  
  /** URL del modelo 3D para probador virtual */
  model3dUrl?: string;
  
  /** Stock disponible */
  stockQuantity: number;
  
  isDefault: boolean;
}

export interface FrameImage {
  url: string;
  alt: string;
  type: 'front' | 'side' | 'angle' | 'folded' | 'detail' | 'on_model';
  sortOrder: number;
}

/**
 * Montura - El producto principal
 */
export interface Frame {
  id: UUID;
  
  /** Nombre del modelo */
  name: string;
  
  /** Slug para URL */
  slug: string;
  
  /** Descripción corta */
  shortDescription: string;
  
  /** Descripción completa (puede ser HTML/Markdown) */
  fullDescription: string;
  
  /** Marca */
  brand: Brand;
  
  /** Categorías */
  categories: Category[];
  
  /** Tags para búsqueda */
  tags: string[];
  
  // ─── CARACTERÍSTICAS FÍSICAS ───────────────────────────────────────────
  shape: FrameShape;
  material: FrameMaterial;
  frameType: FrameType;
  dimensions: FrameDimensions;
  
  /** Peso en gramos */
  weight: number;
  
  /** Género target */
  gender: Gender;
  
  /** Tamaños de cara recomendados */
  faceSizeRecommendation: ('small' | 'medium' | 'large')[];
  
  // ─── VARIANTES DE COLOR ────────────────────────────────────────────────
  colorVariants: FrameColorVariant[];
  
  /** Variante de color seleccionada por defecto */
  defaultColorVariantId: UUID;
  
  // ─── PRECIOS ───────────────────────────────────────────────────────────
  /** Precio base (solo montura, sin lentes) */
  basePrice: number;
  
  /** Precio antes de descuento (si aplica) */
  compareAtPrice?: number;
  
  currency: Currency;
  
  // ─── COMPATIBILIDAD CON LENTES ─────────────────────────────────────────
  /** Esta montura acepta lentes graduados */
  supportsGraduatedLenses: boolean;
  
  /** Solo para lentes de sol (no acepta graduación) */
  sunglassesOnly: boolean;
  
  /** Índices de lente compatibles (por forma/tamaño) */
  compatibleLensIndexes: LensIndex[];
  
  // ─── METADATOS ─────────────────────────────────────────────────────────
  status: ProductStatus;
  
  /** Nuevo lanzamiento */
  isNew: boolean;
  
  /** Es bestseller */
  isBestseller: boolean;
  
  /** Producto destacado */
  isFeatured: boolean;
  
  /** Rating promedio (1-5) */
  averageRating: number;
  
  /** Número de reseñas */
  reviewCount: number;
  
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ═══════════════════════════════════════════════════════════════════════════
// ENTIDADES DE SOPORTE
// ═══════════════════════════════════════════════════════════════════════════

export interface Brand {
  id: UUID;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  isLuxury: boolean;
}

export interface Category {
  id: UUID;
  name: string;
  slug: string;
  parentId?: UUID;
  imageUrl?: string;
  sortOrder: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// CARRITO Y CHECKOUT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Item del carrito
 * La relación Frame + LensConfiguration es la clave
 */
export interface CartItem {
  id: UUID;
  
  /** Montura seleccionada */
  frame: Frame;
  
  /** Variante de color elegida */
  colorVariantId: UUID;
  
  /** Configuración de lentes (null si es solo montura) */
  lensConfiguration: LensConfiguration | null;
  
  /** Cantidad (típicamente 1 para lentes) */
  quantity: number;
  
  /** Precio unitario calculado */
  unitPrice: number;
  
  /** Precio total del item */
  totalPrice: number;
  
  addedAt: ISODateString;
}

export interface Cart {
  id: UUID;
  userId?: UUID; // Null para carritos anónimos
  items: CartItem[];
  
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  
  currency: Currency;
  
  /** Código de cupón aplicado */
  couponCode?: string;
  
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ═══════════════════════════════════════════════════════════════════════════
// CITAS MÉDICAS
// ═══════════════════════════════════════════════════════════════════════════

export type AppointmentType = 
  | 'eye_exam'              // Examen de la vista
  | 'contact_lens_fitting'  // Adaptación de lentes de contacto
  | 'follow_up'             // Seguimiento
  | 'frame_adjustment';     // Ajuste de montura

export type AppointmentStatus = 
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Appointment {
  id: UUID;
  userId: UUID;
  
  type: AppointmentType;
  status: AppointmentStatus;
  
  /** Fecha y hora de inicio */
  startTime: ISODateString;
  
  /** Duración en minutos */
  durationMinutes: number;
  
  /** Sucursal/ubicación */
  locationId: UUID;
  
  /** Optometrista asignado */
  optometristId?: UUID;
  
  /** Notas del paciente */
  patientNotes?: string;
  
  /** Notas internas del staff */
  staffNotes?: string;
  
  /** ID de la receta generada (si aplica) */
  resultingPrescriptionId?: UUID;
  
  /** ID de la configuración de lentes vinculada */
  linkedLensConfigurationId?: UUID;
  
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ═══════════════════════════════════════════════════════════════════════════
// USUARIO
// ═══════════════════════════════════════════════════════════════════════════

export interface User {
  id: UUID;
  
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  
  /** Fecha de nacimiento (para recomendaciones de lentes por edad) */
  birthDate?: ISODateString;
  
  /** Foto de perfil */
  avatarUrl?: string;
  
  /** Recetas médicas guardadas */
  prescriptions: Prescription[];
  
  /** Direcciones guardadas */
  addresses: Address[];
  
  /** Preferencia de accesibilidad: tamaño de texto */
  accessibilityFontSize: 'normal' | 'large' | 'extra_large';
  
  /** Preferencia de accesibilidad: alto contraste */
  accessibilityHighContrast: boolean;
  
  /** Preferencia de accesibilidad: reducir movimiento */
  accessibilityReduceMotion: boolean;
  
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Address {
  id: UUID;
  
  label: string; // "Casa", "Trabajo", etc.
  
  street: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  isDefault: boolean;
}
