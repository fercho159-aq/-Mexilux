# CLAUDE.md — Mexilux: Guía de Implementación

Stack: **Next.js 16 App Router · TypeScript · Tailwind CSS v4 · Zustand · Zod · Prisma · MercadoPago · Cloudinary**

Antes de tocar código, leer:
- `ARCHITECTURE.md` — modelo de datos, configurador de lentes, accesibilidad
- `SITEMAP.md` — rutas implementadas y estado actual
- `docs/CAMBIOS MEXILUX.md` — especificación completa de cambios con imágenes de referencia en `docs/images/`

---

## Cambios requeridos

### 1 · SEO — Metadata de búsqueda (navegador)

**Archivo:** `src/app/layout.tsx` o en cada `page.tsx` con `export const metadata`

Actualizar el metadata de la página principal (`src/app/page.tsx`):

```ts
export const metadata = {
  title: "Mexilux | Lentes de Diseñador: Estilo y Esencia Mexicana",
  description: "El plus para tu estilo. ¿Godín, Patrón o Alucín? Tenemos el armazón que define tu modo. Personaliza tus lentes con tintes para la chamba o la playa. Explora 'Viendo México' y dale una mirada clara a nuestras raíces. Lo hecho en México, bien hecho.",
}
```

También colocar el logo de Mexilux en la metadata Open Graph y como favicon.

---

### 2 · Quiz — Compartir en Instagram Stories

**Archivos:** `src/app/quiz/page.tsx`, `src/components/quiz/FaceAnalyzer.tsx`

**Requerimiento:** En lugar de que el resultado del quiz se descargue como imagen, agregar botón **"Compartir"** que:
1. Genere una imagen automática con `html2canvas` (ya instalado) que incluya:
   - Resultado de personalidad (Godín / Patrón / Alucín)
   - Descripción del resultado
   - Logo de Mexilux (pequeño, esquina)
   - Texto "¿Tú qué eres?" al fondo
2. Use Web Share API (`navigator.share`) con `files` para abrir Instagram Stories directamente:
   ```ts
   await navigator.share({ files: [imageFile], title: '¿Tú qué eres?' })
   ```
3. Fallback: si Web Share API no está disponible, descargar la imagen.

Este mismo comportamiento aplica tanto para el quiz de `src/app/quiz/page.tsx` como para el quiz embebido en la página principal `src/components/home/HomeQuiz.tsx`.

---

### 3 · Quiz — Auto-avance al seleccionar opción

**Archivos:** `src/app/quiz/page.tsx`, `src/components/home/HomeQuiz.tsx`

Actualmente el usuario selecciona una opción y luego tiene que darle a "Siguiente". Cambiar a que **al tocar/hacer clic en una opción, avance automáticamente** a la siguiente pregunta sin botón adicional. Agregar una transición suave (200ms) entre preguntas.

---

### 4 · Emojis — Limpiar y actualizar

**Archivo:** `src/components/home/HomePageClient.tsx` y cualquier otro componente del home que use emojis.

- **Conservar:** Los emojis de la sección "Página Mexa" y "Ya vamos hay mucho tráfic…"
- **Eliminar:** El emoji de "Pa que no te preocupes"
- En la sección "Página Mexa": texto principal → **"Lo que está hecho en México está bien hecho"**, subtexto → **"Página Mexa"**
- Reemplazar emojis por íconos de `lucide-react` o SVGs más limpios donde sea apropiado.

---

### 5 · Etiquetas de género — Actualizar

**Archivos:** `src/components/catalog/CatalogFilters.tsx`, `src/app/admin/categorias/page.tsx`, Prisma seed/schema si tiene valores hardcodeados.

Cambiar etiquetas de:
- `"Hombre"` → mantener **"Hombre"**
- `"Mujer"` → mantener **"Mujer"**
- `"Todos"` / `"Unisex"` / lo que sea el tercero → cambiar a **"Sin etiquetas"**

Orden en UI: **Mexicano → Mexicana → Sin etiquetas**

---

### 6 · Hero Banner — Carrusel automático con 3 slides

**Archivo:** `src/components/home/HeroGSAP.tsx`

Reemplazar el hero estático por un carrusel que cambia automáticamente cada 5s. Los 3 slides son:

**Slide 1 — "Ya te la sabes"**
- Texto: _¿O no sabes qué armazón es para ti? ¿Godín, Patrón o Alucín? Tenemos el armazón que define tu estilo._
- Botones: `[Hacer quiz]` → `/quiz` y `[Nuestra historia]` → `/nosotros`
- Referencia visual: `docs/images/image7.jpeg` y `docs/images/image8.png`

**Slide 2 — "Productos nuevos"**
- Botón: `[Ver stock nuevo]` → `/catalogo?sort=nuevo`

**Slide 3 — "El Blog / Viendo México"**
- Texto grande: **"Viendo México"**
- Descripción: _Redescubre el país a través de nuestra mirada. Lugares, Cultura, sabor y los mexicanos que están moviendo al mundo._
- Botón: `[Echemosle un ojo]` → `/blog`

**Especificación de botones (aplica a TODO el sitio):**
- Forma: semi-ovalada (`rounded-full` o `rounded-3xl`)
- Desktop hover: cambia de blanco a gris oscuro/negro con transición 200ms
- Mobile: efecto de presión con `active:scale-95`
- Referencia: estilo Ben & Frank (ver `docs/images/image8.png`)
- El carrusel debe tener indicadores de punto (dots) y permitir navegación manual.

---

### 7 · Orden de la página principal

**Archivo:** `src/components/home/HomePageClient.tsx`

Orden correcto de secciones (de arriba a abajo):

1. Banner/Hero movible (carrusel — punto 6)
2. Línea horizontal de productos deslizable — texto: **"Pues ya de una no?"** (ver `docs/images/image10.png`)
3. Categorías — ver punto 5 y diseño en `docs/images/image11.jpeg` y `docs/images/image12.png`
4. Blog — 4 cuadrículas, 2 en la misma fila, cambiar "Cosas Mexas" → **"Viendo México"** con descripción: _Redescubre el país a través de nuestra mirada. Lugares, Cultura, sabor y más_
5. Quiz embebido — cambiar **"¿Ya sabes cuál?"** por **"¿Godín, Patrón o Alucín? Tenemos el armazón que define tu modo. Contesta el quiz"**
6. Tratamientos (ver punto abajo)
7. Reseñas/Testimonios (mover hasta el final)

#### Categorías — diseño específico
- Conservar cuadros actuales pero **2 por fila**
- Texto dentro del cuadro: nombre principal + _(Hombre)_ o _(Mujer)_ entre paréntesis abajo
- Usar los dibujos existentes en el sitio (ver `docs/images/image13.jpeg`)
- Orden: **Mexicano → Mexicana → Sin etiquetas**

#### Tratamientos — renombrar
| Nombre anterior | Nombre nuevo | Descripción |
|---|---|---|
| Antireflejante | **"Pa la chamba"** | Ideal para 0–4 hrs frente a pantallas |
| Antiazul / Blueray | **"La máquina de chambear"** | Ideal para +4 hrs frente a pantallas |
| Polarizado | **"Solazo"** | Para carreteras, playa y flow |
| Tintes | **"Entituneados"** | Parejito (uniforme) o Amanecido (degradado) |

Agregar links a páginas de detalle de cada tratamiento.

---

### 8 · Blog — Arreglar páginas

**Archivos:** `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/components/blog/BlogList.tsx`, `src/components/blog/BlogPost.tsx`

Ver referencia en `docs/images/image16.png`. Arreglar el diseño de las páginas del blog para que se vean correctas. El listado debe mostrar 4 artículos en grid de 2×2. Cambiar título de sección de "Cosas Mexas" a **"Viendo México"**.

---

### 9 · Redes sociales — Links funcionales

**Archivo:** `src/components/layout/Header.tsx` y footer (buscar en `src/app/layout.tsx`)

Los íconos de redes sociales deben abrir en nueva pestaña las cuentas reales:
- Instagram: `https://www.instagram.com/mexilux/` (confirmar URL real con el cliente)
- Verificar que todos los íconos de redes tengan `target="_blank" rel="noopener noreferrer"`.

---

### 10 · Página de producto — Nuevo flujo de configurador

**Archivos:** `src/components/product/ProductActions.tsx`, `src/components/lens-configurator/LensConfiguratorWizard.tsx` y sus steps

#### Botón principal
Reemplazar los botones actuales por un único botón:
> **"Lo compro, quiero el flow mexa"**

- Forma: semi-ovalada
- Hover: sombrea (ver especificación de botones en punto 6)
- Mobile: efecto de presión
- Al hacer clic abre el configurador como modal o navega a `/configurador/[slug]`

#### Flujo del configurador — adaptar al lenguaje Mexilux

El wizard ya existe en `src/components/lens-configurator/`. Adaptar los pasos con el siguiente contenido:

**Paso 1 — ¿Graduación?**

| Opción | Descripción |
|---|---|
| "Sin graduación" | Para vernos coquetos; recomendado si solo quieres protección para pantallas |
| "Con graduación" | Soy cegatón; para miopía, hipermetropía y/o astigmatismo _(Costo puede variar)_ |

**Paso 2 — Tipo de mica**

> Nota: De cajón todos los lentes incluyen **"Pa la chamba"** (antirreflejo) — mostrarlo como incluido.

| Opción | Precio |
|---|---|
| "Pa la chamba" (Antirreflejo) — 0–4 hrs/día frente a pantallas | **Gratis** |
| "La máquina de chambear" (Antirreflejo azul) — +4 hrs/día | **+$450** |
| "El nahual" (Fotocromático) | Ver sub-opciones |
| "A tu antojo" (Micas personalizadas) | Ver sub-opciones |

**Sub-opciones "El nahual" (Fotocromático)**

Colores:
- Obsidiana (Negro) — Gratis
- Cenote (Azul) — +$490
- Elote (Amarillo) — +$490
- Ajolote (Rosa) — +$490

Tratamiento adicional:
- Sin tratamiento "Pa la chamba"
- Con "Pa la chamba" (Antirreflejo) — **Gratis**
- Con "La máquina de chambear" (Antirreflejo Azul) — **+$450**

Si eligió con graduación: aplican criterios de graduación pero **solo hasta la 1ª serie**. Si supera la primera serie → flujo de asesor.

**Sub-opciones "A tu antojo" (Micas personalizadas)**

| Tipo | Precio |
|---|---|
| Entituneados (Tintes) | +$350 |
| Solazo (Polarizado) | +$750 |

*Entituneados — flujo:*
1. Color: Sangre Azteca (Rojo), Obsidiana (Negro), Cenote (Azul), Cacao (Café), Nopal (Verde), Ajolote (Rosa), Elote (Amarillo), Cempasúchil (Naranja)
2. Estilo: Parejito (uniforme) / Amanecido (degradado)
3. Intensidad: I, II, III (ej. "Sangre Azteca I")

*Solazo — colores:* Obsidiana (Negro) / Cacao (Café)

Si se puede mostrar una preview de la mica al seleccionar color/estilo, hacerlo.

**Paso 3 — Graduación (si eligió "Con graduación")**

Referencia UI en `docs/images/image17.png`. Dos formas para capturar: formulario manual + opción de subir foto de receta.

Lógica de costo por rango (la graduación más alta de cualquier ojo determina la serie):

| Esfera o Cilindro (máximo de ambos ojos) | Costo extra |
|---|---|
| 0.00 a 2.00 | **Gratis** |
| 2.25 a 4.00 | **+$290** |
| 4.25 a 6.00 | **+$590** |
| Más de 6.00 | Solicitar teléfono → mensaje: _"En breve se comunicará un asesor para darte cotización personalizada."_ |

La validación de rangos ya existe en `src/lib/validations/prescription.ts` — reusar y extender.

**Paso 4 — Resumen**
Mostrar todo lo seleccionado con precios desglosados antes de agregar al carrito.

Referencia visual general del flujo: `docs/images/image18.png` (Ben & Frank). Adaptar al estilo Mexilux.

---

### 11 · Checkout — Simplificar flujo

**Archivos:** `src/app/checkout/page.tsx`, `src/components/checkout/CheckoutClient.tsx`, `src/components/checkout/checkout.css`

**Problema actual:** El resumen aparece dos veces. Hay que bajar para ver el formulario de pago. Los tratamientos no se suman al total. Ver `docs/images/image19.png` y `docs/images/image20.png`.

**Solución:**

1. Primera pantalla = resumen completo del pedido (lo que hoy aparece en `docs/images/image21.png`). El resumen debe incluir frame + mica + tratamientos + graduación con todos los precios desglosados.
2. Botón "Proceder al pago" → ir directamente a formulario de pago (ver `docs/images/image22.png`). Sin pantalla intermedia redundante.
3. No abrir apps externas automáticamente. Si el usuario quiere loguearse, que haga clic manual en "Ingresa con tu cuenta".

**Flujo de registro/invitado:**
- Ofrecer opción: continuar como **invitado** o **registrarse**.
- Al registrarse: descuento de **$200 MXN** en la primera compra.
- Si subtotal > **$1,690 MXN**: envío **gratis** (mostrar en resumen).

---

## Convenciones del proyecto

- No agregar comentarios innecesarios al código. Solo si el "por qué" es no obvio.
- Usar `lucide-react` para íconos.
- Tailwind CSS v4 para estilos. No usar `styled-components` ni CSS-in-JS.
- Zustand para estado global (`src/store/`).
- Validación con Zod (`src/lib/validations/`).
- Tipos en `src/types/index.ts`.
- Imágenes: subir a Cloudinary vía el endpoint existente `src/app/api/admin/upload/route.ts`.
- MercadoPago ya integrado — no cambiar la lógica de pagos, solo el flujo de UI.

## Cómo correr en desarrollo

```bash
npm install
npm run dev
# → http://localhost:3000
```

```bash
# Seed de base de datos
npm run db:seed
```
