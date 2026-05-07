# Auditoría de cumplimiento — CAMBIOS MEXILUX.docx

**Fecha:** 7 de mayo de 2026

Estado de los 11 bloques de requerimientos del documento, con archivos exactos a tocar para los pendientes.

Leyenda: ✅ cumplido · ⚠️ parcial · ❌ pendiente

---

## ✅ 1. SEO — Metadata de búsqueda

**Estado:** Cumplido.

`src/app/page.tsx` líneas 20-39:
- `title: 'Mexilux | Lentes de Diseñador: Estilo y Esencia Mexicana'` ✓ exacto al doc.
- `description` con el copy "El plus para tu estilo. ¿Godín, Patrón o Alucín?…" ✓ exacto.
- OpenGraph con `images: ['/logo-mexilux.png']` ✓ logo en OG.
- `src/app/layout.tsx` línea 99 usa `/logo-mexilux.png` como favicon/icon ✓.

**Detalle menor:** la metadata raíz del layout (línea 11) sigue con un título distinto ("Mexilux | Lentes y Armazones Premium…"). Sólo aplica a páginas que no overridean — el home sí lo overridea.

---

## ✅ 2. Quiz — Compartir en Instagram Stories

**Estado:** Cumplido en ambos quizzes.

`src/app/quiz/page.tsx` `handleShare` (líneas 346-397):
- Genera imagen con `html2canvas` ✓
- Incluye logo Mexilux en esquina, descripción del perfil, "¿Tú qué eres?" al fondo, link `mexilux.com/quiz` ✓
- Usa `navigator.canShare?.(shareData)` con `files` para abrir Instagram Stories ✓
- Fallback a descarga directa si Web Share API no está disponible ✓
- `src/components/home/HomeQuiz.tsx` replica el mismo handler.

---

## ✅ 3. Quiz — Auto-avance al seleccionar opción

**Estado:** Cumplido.

`src/app/quiz/page.tsx`:
- `handleFaceShapeSelect` (304-311) y `handlePersonalitySelect` (313-324) ejecutan `setTimeout(200ms)` y avanzan automáticamente al siguiente paso.
- En la navegación sólo queda el botón "← Anterior" (líneas 776-783); el botón "Siguiente" fue eliminado.

---

## ⚠️ 4. Emojis — Limpiar y actualizar

**Estado:** Parcial — falta eliminar uno.

`src/components/home/HomePageClient.tsx` líneas 41-60 tiene 3 trust badges:
1. "Página Mexa" ✓ con emoji 🇲🇽 y texto principal "Lo que está hecho en México está bien hecho" / subtexto "Página Mexa" — exacto al doc.
2. **"Pa' que no te preocupes" ❌ — el doc dice explícitamente "eliminar el de pa que no te preocupes".** Sigue presente con icono `ShieldCheck`.
3. "Ya vamos, hay mucho tráfico" ✓ con 🚛.

**Acción:** quitar el segundo objeto del array `TRUST_BADGES` en `HomePageClient.tsx`.

---

## ⚠️ 5. Etiquetas — Mexicano / Mexicana / Sin etiquetas

**Estado:** Parcial — inconsistencia entre catálogo y resto del sitio.

| Lugar | Estado | Detalle |
|---|---|---|
| `src/app/admin/productos/nuevo/page.tsx` líneas 281-283 | ✅ | `Mexicano` / `Mexicana` / `Sin etiquetas` con value `male/female/unisex` |
| `src/components/home/HomePageClient.tsx` (CATEGORIES + card "Sin etiquetas") | ✅ | Orden Mexicano → Mexicana → Sin etiquetas |
| `src/app/catalogo/page.tsx` línea 99 | ❌ | Aparece **"Todos"** en lugar de "Sin etiquetas" y al inicio en vez de al final |
| `src/components/layout/Header.tsx` (footer en `layout.tsx` líneas 290-296) | ✅ | Mexicano, Mexicana, Sin etiquetas en orden correcto |

**Acción:** en `src/app/catalogo/page.tsx` líneas 90-100, cambiar el primer link de `Todos` a `Sin etiquetas` y reordenar para que quede al final.

---

## ✅ 6. Hero Banner — Carrusel automático con 3 slides

**Estado:** Cumplido — implementación exacta.

`src/components/home/HeroCarousel.tsx`:
- 3 slides con los textos pedidos al pie de la letra.
- Slide 1 "Ya te la sabes" con desc completo y botones `Hacer quiz` (→ `/quiz`) y `Nuestra historia` (→ `/nosotros`) ✓
- Slide 2 "Productos nuevos" con CTA `Ver stock nuevo` (→ `/catalogo?sort=nuevo`) ✓
- Slide 3 "Viendo México" con copy completo y CTA `Echemosle un ojo` (→ `/blog`) ✓
- `AUTOPLAY_MS = 5000` ✓ rotación automática 5s.
- Pausa al hacer hover ✓.
- Dots de navegación con role="tablist" + aria-selected ✓.
- Flechas prev/next ✓.
- Botones usan `MexiluxButton` con `rounded-full`, `active:scale-95` (efecto presión móvil) y hover blanco→oscuro ✓ — exactamente como pide el doc estilo Ben & Frank.

---

## ✅ 7. Orden de la página principal

**Estado:** Cumplido.

`src/components/home/HomePageClient.tsx` líneas 138-487, en este orden:
1. `<HeroCarousel />` ✓
2. Trust badges ✓
3. `<ProductSlider title="Pues ya de una no?" …/>` ✓ — texto exacto al doc.
4. Categorías: Mexicano + (Hombre), Mexicana + (Mujer), Sin etiquetas como card grande aparte ✓
5. Blog "Viendo México" en `blog-preview-grid` con `repeat(2, 1fr)` (2×2) y descripción "Redescubre el país a través de nuestra mirada. Lugares, Cultura, sabor y más." ✓
6. Quiz embebido con título "¿Godín, Patrón o Alucín?" + sub "Tenemos el armazón que define tu modo. Contesta el quiz." ✓ exacto.
7. Tratamientos con los 4 nombres pedidos:
   - "Pa la chamba" → `/tratamientos/pa-la-chamba`
   - "La máquina de chambear" → `/tratamientos/la-maquina-de-chambear`
   - "Solazo" → `/tratamientos/solazo`
   - "Entituneados" → `/tratamientos/entituneados`
   ✓ con `href` a páginas detalle (cumple "ENLAZAR CON PAGINAS APARTE").
8. `<TestimonialsCarousel />` al final ✓ (testimonios al cierre, como pide el doc).
9. Newsletter ✓.

---

## ⚠️ 8. Blog — Arreglar páginas

**Estado:** Cumplido en UI, falta detalle de metadata.

- `src/components/blog/BlogList.tsx` línea 211: H1 "Viendo México" ✓
- Subtítulo correcto ✓
- `featured-grid` y `posts-grid` usan `grid-template-columns: repeat(2, 1fr)` (líneas 433 y 522) → 2×2 ✓
- **Pendiente menor:** `src/app/blog/page.tsx` línea 11 sigue con `title: 'Blog | Mexilux - Cosas Mexas'`. Cambiar a "Viendo México".

---

## ⚠️ 9. Redes sociales — Links funcionales

**Estado:** Parcial — solo Instagram tiene URL real.

`src/app/layout.tsx` líneas 252-282:
- ✅ Instagram → `https://www.instagram.com/mexilux/` con `target="_blank" rel="noopener noreferrer"`.
- ❌ Facebook → `https://facebook.com` (placeholder, sin cuenta real).
- ❌ TikTok → `https://tiktok.com` (placeholder).

`target="_blank" rel="noopener noreferrer"` está en los 3, así que el comportamiento de "nueva pestaña" sí cumple. Sólo faltan las URLs reales del cliente.

**Acción:** confirmar URLs reales de Facebook y TikTok con el cliente y reemplazar los hrefs en `layout.tsx`.

---

## ❌ 10. Configurador — Nuevo flujo "Lo compro flow mexa"

**Estado:** Botón sí, flujo NO.

### Botón principal — ✅ Cumplido
`src/components/product/ProductActions.tsx` línea 25:
- Texto exacto "Lo compro, quiero el flow mexa" ✓
- Forma semi-ovalada (`rounded-full`) ✓
- Hover y `active:scale-95` ✓
- Lleva al configurador `/configurador/[slug]` ✓

### Pasos del wizard — ❌ NO refactorizado al lenguaje Mexilux

El wizard en `src/components/lens-configurator/` tiene 5 pasos con lenguaje técnico genérico, **no el flujo simplificado del doc**:

| Doc pide | Código tiene |
|---|---|
| **Paso 1**: Sin graduación / Con graduación (2 opciones simples) | `UsageTypeStep.tsx` con 6 opciones técnicas: Visión de Lejos, Visión de Cerca, Visión de Computadora, Progresivos, Bifocales, Sin Graduación |
| **Paso 2**: Tipo de mica con nombres Mexilux | `MaterialStep.tsx` con índices técnicos: 1.50, 1.56, 1.60, 1.67, 1.74 |
| **Tratamientos**: "Pa la chamba" gratis, "La máquina de chambear" +$450, "El nahual" con colores Obsidiana/Cenote/Elote/Ajolote, "A tu antojo" con Entituneados/Solazo | `TreatmentsStep.tsx` con: "Antirreflejante Premium" $350, "Filtro de Luz Azul" $450, "Fotocromático" $1800, "Polarizado" $1200 |
| **Sub-flujo Entituneados**: 8 colores (Sangre Azteca, Obsidiana, Cenote, Cacao, Nopal, Ajolote, Elote, Cempasúchil) × 2 estilos (Parejito/Amanecido) × 3 niveles (I/II/III) | No existe |
| **Sub-flujo Solazo**: Obsidiana/Cacao | No existe |
| **Graduación**: serie 1 (0-2) gratis, serie 2 (2.25-4) +$290, serie 3 (4.25-6) +$590, +6 → asesor con teléfono | `PrescriptionStep.tsx` valida rangos pero **no aplica los costos por serie ni el flujo de asesor** |
| **Subir receta** como alternativa al form manual | Existe upload pero no integrado al flujo simplificado |

**Acción:** refactor mayor de los 5 step files. La validación de graduación ya está en `src/lib/validations/prescription.ts` y se puede reusar; falta:
1. Reescribir `UsageTypeStep` a 2 botones grandes (Sin graduación / Con graduación) con copy del doc.
2. Reemplazar `MaterialStep` por una pantalla "Tipo de mica" con las 4 opciones del doc.
3. Implementar sub-flujos para "El nahual" (4 colores + tratamiento) y "A tu antojo" (Entituneados con 3 sub-pasos / Solazo con 2 colores).
4. Conectar costos de graduación por serie al `lens-configurator` store.
5. Pantalla "asesor" con captura de teléfono cuando graduación >6.

---

## ✅ 11. Checkout — Simplificar flujo

**Estado:** Cumplido en lo que pide el doc.

`src/components/checkout/CheckoutClient.tsx`:
- Línea 27: `FREE_SHIPPING_THRESHOLD = 1690` ✓ exacto al doc.
- Línea 28: `FIRST_PURCHASE_DISCOUNT = 200` ✓ exacto al doc.
- Línea 25 / 33: `CheckoutMode = 'guest' | 'register'`, default `guest` ✓.
- Línea 65: `shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99` ✓ envío gratis sobre $1,690.
- Línea 66: `registerDiscount = mode === 'register' ? FIRST_PURCHASE_DISCOUNT : 0` ✓ -$200 al registrarse.
- Línea 197: opción "Continuar como invitado" ✓.
- MercadoPago integrado en línea 327.

**Pendiente del doc original ya validado en revisión visual previa:** el botón "Volver al inicio" del `/checkout/failure` y `/checkout/pending` tiene el bug de color (texto invisible). Es ortogonal al doc, ya está reportado en `REVISION-ALINEACION-2026-05-07.md` #1.

---

## Resumen ejecutivo

| # | Requerimiento | Estado |
|---|---|---|
| 1 | SEO metadata | ✅ |
| 2 | Quiz Web Share | ✅ |
| 3 | Quiz auto-avance | ✅ |
| 4 | Emojis limpiar | ⚠️ falta quitar "Pa' que no te preocupes" |
| 5 | Etiquetas Mexicano/Mexicana/Sin etiquetas | ⚠️ catálogo aún dice "Todos" |
| 6 | Hero carrusel 3 slides | ✅ |
| 7 | Orden de la home | ✅ |
| 8 | Blog Viendo México | ⚠️ falta cambiar metadata title |
| 9 | Redes sociales | ⚠️ Facebook y TikTok placeholders |
| 10 | **Configurador con lenguaje Mexilux** | ❌ pendiente — la mayor obra que queda |
| 11 | Checkout simplificado | ✅ |

**Cumplido completamente:** 6 de 11.
**Parcial (fix rápido):** 4 de 11 — son cambios de 1-3 líneas cada uno.
**Pendiente real (refactor):** 1 de 11 — el configurador es donde está concentrado el trabajo restante del doc.

---

## Cambios rápidos sugeridos (orden de impacto)

1. **#10 Configurador** (1-2 días) — el más grande: refactor de 5 step files a las opciones Mexilux con sub-flujos Entituneados/Solazo y costo por serie de graduación.
2. **#5 catálogo "Todos" → "Sin etiquetas"** (5 min) — `src/app/catalogo/page.tsx` líneas 90-100.
3. **#4 quitar badge "Pa' que no te preocupes"** (2 min) — `src/components/home/HomePageClient.tsx` líneas 48-53.
4. **#9 actualizar URLs reales de Facebook y TikTok** (5 min) — `src/app/layout.tsx` líneas 253 y 273. Requiere confirmar URLs con el cliente.
5. **#8 cambiar metadata "Cosas Mexas" → "Viendo México"** (1 min) — `src/app/blog/page.tsx` línea 11.
