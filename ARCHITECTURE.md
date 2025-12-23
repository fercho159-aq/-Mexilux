# 🏗️ Arquitectura Técnica - Mexilux (Tienda de Óptica)

## 📋 Resumen Ejecutivo

Este documento describe la arquitectura técnica para una tienda online de Óptica y Optometría, diseñada para manejar la complejidad de un producto híbrido: moda (monturas) + salud (lentes graduados + servicios médicos).

---

## 🧠 Decisiones de Diseño Clave

### 1. Validación de Receta Médica

**Implementación:** `src/lib/validations/prescription.ts`

El sistema valida recetas oftalmológicas con:

| Campo | Rango Válido | Paso | Notas |
|-------|-------------|------|-------|
| **Esfera (SPH)** | -20.00 a +20.00 | 0.25 | Corrige miopía (-) o hipermetropía (+) |
| **Cilindro (CYL)** | -6.00 a +6.00 | 0.25 | Corrige astigmatismo |
| **Eje (AXIS)** | 1° a 180° | 1 | Orientación del astigmatismo |
| **Adición (ADD)** | +0.75 a +3.50 | 0.25 | Solo para progresivos/bifocales |
| **PD Monocular** | 25mm a 40mm | 0.5 | Distancia pupilar por ojo |
| **PD Total** | 54mm a 74mm | 1 | Distancia pupilar total |

**Reglas de Dependencia:**
- Si `CYL ≠ 0`, entonces `AXIS` es **obligatorio**
- Si `CYL = 0`, entonces `AXIS` debe ser `null`
- `ADD` solo aplica cuando `usageType` es `progressive` o `bifocal`
- La suma de PDs monoculares debe aproximarse (±2mm) al PD total

**Recomendación Automática de Índice:**
```typescript
totalPower = |SPH| + |CYL|

if (totalPower <= 2) → 1.50
if (totalPower <= 4) → 1.56
if (totalPower <= 6) → 1.60
if (totalPower <= 8) → 1.67
else → 1.74
```

---

### 2. Persistencia del Estado del Configurador

**Implementación:** `src/store/lens-configurator.ts`

**Estrategia:**
1. **Zustand + persist middleware** → Guarda estado en `localStorage`
2. **TTL de 7 días** → Las configuraciones expiran automáticamente
3. **URL State Sync** → El paso actual se sincroniza en URL (`?step=material`)
4. **Debounced Autosave** → Cada cambio actualiza `updatedAt`

**Estructura del Storage:**
```typescript
{
  key: 'mexilux-lens-configurator',
  data: {
    configuration: LensConfiguration,
    frameId: UUID,
    framePrice: number,
    currentStep: ConfiguratorStep,
    completedSteps: ConfiguratorStep[]
  }
}
```

**Beneficios:**
- El usuario puede cerrar el navegador y continuar después
- Navegación con botones back/forward del navegador
- URLs compartibles para cada paso

---

### 3. Accesibilidad (a11y) para Usuarios con Problemas de Visión

**Implementación:** `src/components/lens-configurator/lens-configurator.css`

| Característica | Implementación |
|----------------|----------------|
| **Contraste WCAG AAA** | Variables CSS con soporte para `prefers-contrast: more` |
| **Tipografía Base Grande** | `font-size: 1.125rem` (18px) como base |
| **Focus Visible** | Outline de 3px con color de alto contraste |
| **Modo Alto Contraste** | Media query `prefers-contrast: more` |
| **Modo Oscuro** | Media query `prefers-color-scheme: dark` |
| **Reducir Movimiento** | Media query `prefers-reduced-motion: reduce` |
| **Screen Reader** | Clase `.sr-only`, `aria-labels`, `role` en todos los componentes |
| **Navegación por Teclado** | `Alt+←` para anterior, `Alt+→` para siguiente, `Escape` para cancelar |

---

## 📁 Estructura de Archivos

```
src/
├── types/
│   └── index.ts                      # Interfaces de TypeScript
│
├── lib/
│   ├── utils.ts                      # Utilidades (cn, etc.)
│   └── validations/
│       └── prescription.ts           # Esquemas Zod para recetas
│
├── store/
│   └── lens-configurator.ts          # Estado global (Zustand)
│
├── components/
│   └── lens-configurator/
│       ├── index.ts                  # Barrel exports
│       ├── lens-configurator.css     # Estilos con accesibilidad
│       ├── LensConfiguratorWizard.tsx
│       ├── WizardProgress.tsx
│       ├── WizardNavigation.tsx
│       └── steps/
│           ├── UsageTypeStep.tsx
│           ├── PrescriptionStep.tsx
│           ├── MaterialStep.tsx
│           ├── TreatmentsStep.tsx
│           └── ReviewStep.tsx
│
└── app/
    └── configurador/
        └── [slug]/
            └── page.tsx              # Página del configurador
```

---

## 🔗 Modelo de Datos (Relaciones Clave)

```
┌─────────────────────────────────────────────────────────────────┐
│                           CartItem                              │
├─────────────────────────────────────────────────────────────────┤
│  - id: UUID                                                      │
│  - frame: Frame ────────────────────┐                           │
│  - colorVariantId: UUID             │                           │
│  - lensConfiguration: LensConfig ───┼───► Precio Final          │
│  - quantity: number                 │     = Frame.basePrice     │
│  - unitPrice: number                │     + LensConfig.pricing  │
│  - totalPrice: number               │                           │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                       LensConfiguration                         │
├─────────────────────────────────────────────────────────────────┤
│  - id: UUID                                                      │
│  - frameId: UUID                                                 │
│  - currentStep: ConfiguratorStep                                │
│  - isComplete: boolean                                           │
│                                                                  │
│  ┌─ PASO 1 ─────────────────────────────────────────────────┐   │
│  │ usageType: LensUsageType                                  │   │
│  │   └─ 'single_vision_distance' | 'progressive' | ...      │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ PASO 2 ─────────────────────────────────────────────────┐   │
│  │ prescriptionSource: PrescriptionSource                    │   │
│  │   └─ 'saved' | 'manual' | 'upload' | 'appointment'       │   │
│  │                                                           │   │
│  │ savedPrescriptionId: UUID | null                          │   │
│  │ manualPrescription: Prescription | null                   │   │
│  │ uploadedPrescriptionUrl: string | null                    │   │
│  │ appointmentId: UUID | null                                │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ PASO 3 ─────────────────────────────────────────────────┐   │
│  │ materialId: UUID | null                                   │   │
│  │   └─ Referencia a LensMaterial                           │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ PASO 4 ─────────────────────────────────────────────────┐   │
│  │ treatmentIds: UUID[]                                      │   │
│  │   └─ Array de referencias a LensTreatment                │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ PRECIOS ────────────────────────────────────────────────┐   │
│  │ pricing: {                                                │   │
│  │   usageTypePrice: number,                                 │   │
│  │   materialPrice: number,                                  │   │
│  │   treatmentsPrice: number,                                │   │
│  │   subtotal: number,                                       │   │
│  │   discount: number,                                       │   │
│  │   total: number                                           │   │
│  │ }                                                         │   │
│  └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Cómo Usar

### Desarrollo
```bash
npm run dev
```

### Build de Producción
```bash
npm run build
```

### Acceder al Configurador
```
http://localhost:3000/configurador/ray-ban-aviator-classic
```

---

## 📝 Próximos Pasos

1. **API Backend** → Implementar endpoints para:
   - `GET /api/frames/[slug]`
   - `GET /api/materials`
   - `GET /api/treatments`
   - `POST /api/configurations`
   - `GET /api/user/prescriptions`

2. **Probador Virtual** → Integrar SDK de AR (WebXR o similar)

3. **Pasarela de Pago** → Integrar Stripe/MercadoPago

4. **Sistema de Citas** → Calendario con disponibilidad de optometristas

5. **Panel de Administración** → CRUD de productos y órdenes

---

## 🛠️ Tech Stack

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS + CSS Variables |
| **Estado** | Zustand (con persist) |
| **Validación** | Zod 4 |
| **Componentes UI** | Radix UI Primitives |
| **Íconos** | Lucide React |
