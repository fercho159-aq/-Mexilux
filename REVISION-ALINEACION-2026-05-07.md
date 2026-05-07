# Revisión de alineación y centrado de textos

**Fecha:** 7 de mayo de 2026
**Viewport:** Desktop 1440×900

Por orden de severidad. Cada hallazgo lleva la URL donde se ve y, cuando aplica, la pista de qué archivo tocar.

---

## 🔴 Problemas reales

### 1. Botón "Volver al inicio" del checkout es invisible
- **URL:** `/checkout/failure` y `/checkout/pending`
- **Síntoma:** El botón se ve casi en blanco (texto casi invisible sobre fondo negro).
- **Causa concreta** (verificada con `getComputedStyle`):
  - Clases aplicadas: `bg-black text-white rounded-lg font-medium`
  - Estilo calculado: `background: rgb(0,0,0)` ✓, **`color: rgb(29,29,31)` ❌** (debería ser `rgb(255,255,255)`)
- El `text-white` no se está aplicando. Probablemente la utility no llegó al CSS final de Tailwind v4 (orden de imports / safelist).
- **Fix rápido:** Forzar el color en el componente con `style={{color:'#fff'}}` o agregar `!text-white` mientras se arregla la build.

### 2. Hero del home: subtítulo con "ti?" huérfano y CTAs sin estilo de botón
- **URL:** `/` (sección hero)
- **Síntoma 1:** El subtítulo "¿O no sabes qué armazón es el bueno para ti?" rompe línea dejando "ti?" solo arriba de "Te tiramos paro". Genera "viuda" tipográfica.
- **Síntoma 2:** "Hacer quiz" y "Nuestra Historia" aparecen como texto plano negro sin contorno, fondo ni padding — quedan a nivel de simple link, pegados al ícono de scroll del mouse y casi sin separación entre sí. No parecen botones.
- **Acciones:**
  - Aumentar `max-width` del subtítulo o reescribir como una sola oración para evitar la viuda.
  - Aplicar el mismo `btn-primary` / `btn-outline` que ya usan otros CTAs (p.ej. "Suscribirse" o "Ver todo el blog") y separarlos con `gap` mayor.
  - El indicador de scroll (mouse) debería ir abajo del bloque, no entre los botones y el texto.

### 3. Cards del catálogo no se centran cuando hay pocos productos
- **URL:** `/catalogo/lentes-oftalmicos` (2 productos, grid de 4 columnas)
- **Síntoma:** "MAXIMUM Aviator" y "MAXIMUM 7350" quedan pegados a la izquierda; queda un hueco enorme a la derecha.
- **Verificación:** las cards están en x=77 y x=419 (centro 333) cuando el centro de la página es 720.
- **Acción:** En el grid, agregar `justify-content: center` (o usar `auto-fit` con `minmax`) para que el grupo se centre cuando hay menos hijos que columnas.

### 4. Las cards "Cosas Mexas" del home no están alineadas con su heading
- **URL:** `/` sección de blog cards
- **Síntoma:** El H2 "Cosas Mexas" y el subtítulo están centrados al ancho de página (centro x=720). Pero las 4 cards de blog (Mexico Magico, Mexicanos de Lujo, Pa' la Muela, Vista a las Raíces) empiezan en x=51 y terminan en x=1115 (centro x=583). **Las cards están corridas ~140px a la izquierda respecto al título.**
- **Acción:** Asegurar que el container del grid use el mismo `max-width` y `margin: 0 auto` que el header de la sección.

### 5. Cards de "Tiempos de entrega" en `/envios` también se quedan a la izquierda
- **URL:** `/envios`
- **Síntoma:** Las 2 cards "Solo armazón" y "Con lentes graduados" ocupan los primeros 2/3 del ancho, dejando el tercio derecho vacío. Crea sensación de página inacabada.
- **Acción:** Misma solución que #3 — `justify-content: center` o convertir a 2 columnas centradas.

### 6. Marcas destacadas: las cards no quedan a la misma altura
- **URL:** `/marcas`
- **Síntoma:** Las cards "Gucci" y "Tom Ford" tienen un badge "Premium" debajo del nombre, mientras que "Oakley" y "Ray-Ban" no. Como resultado, la descripción ("Alta moda italiana...", "El ícono del estilo desde 1937...") empieza en posiciones verticales diferentes en cada card — la fila pierde el ritmo horizontal.
- **Acción:** Reservar el espacio del badge con un placeholder vacío (height fijo) en las cards sin badge, o mover el badge a la esquina superior derecha (overlay) para que no afecte el flow.

### 7. Bullets de `/citas` quedan con uno huérfano
- **URL:** `/citas`
- **Síntoma:** Bajo el subtítulo aparecen 4 features con check verde: "Optometristas certificados", "Equipo de última generación", "Resultados en el momento" en una fila, y "Sin costo con compra de lentes" sola en una segunda fila. Centradas pero descompensadas.
- **Acción:** O ponerlos los 4 en una sola fila (con texto más corto/ancho mayor), o dividir 2+2.

---

## 🟡 Inconsistencias menores

### 8. Header sticky deja ver contenido debajo
- **URL:** `/catalogo/maximum-aviator` y otras con scroll
- **Síntoma:** Al hacer scroll, el breadcrumb "Catálogo / MAXIMUM Aviator" pasa por DEBAJO del logo Mexilux y los iconos del header, mostrándose a través. El header tiene `backdrop-filter` pero su fondo casi transparente no oculta texto.
- **Acción:** Subir la opacidad del fondo del header a `rgba(255,255,255,.92)` o similar.

### 9. Ícono decorativo del catálogo desalineado con el H1
- **URL:** `/catalogo/lentes-oftalmicos` y `/catalogo/lentes-de-sol`
- **Síntoma:** En el hero hay un icono SVG decorativo (lentes / sol) flotando a la izquierda mientras el H1 "Lentes Oftálmicos" / "Lentes Polarizados" está perfectamente centrado al ancho. El icono no está sobre el título ni a un costado simétrico — sólo cuelga arriba-izquierda.
- **Acción:** O centrar el icono encima del título, o duplicarlo a la derecha como elemento de marco simétrico, o quitarlo.

### 10. Tabs de categoría del blog quedan pegadas a la izquierda
- **URL:** `/blog`
- **Síntoma:** "Todos / Mexico Magico / Mexicanos de Lujo / Pa' la Muela / Vista a las Raíces" arrancan en x=148 y ocupan ~500px. Como están sobre un fondo que cubre todo el ancho, parecen huérfanas.
- **Acción:** Centrarlas (`justify-content: center`) o convertirlas en pills con scroll horizontal.

### 11. "DESTACADOS" label queda anclado a la izquierda
- **URL:** `/blog`
- **Síntoma:** Igual que las tabs — el texto pequeño "DESTACADOS" arriba de las cards aparece a x=148. Las cards también arrancan en x=148. Es coherente entre sí pero visualmente la sección arranca al margen izquierdo en vez de respetar un container centrado.
- **Acción:** O centrar todo el contenido del blog en un `max-width: 1200px; margin: 0 auto`, o respetar el patrón del resto del sitio.

### 12. Headings de páginas legales se ven como párrafo
- **URL:** `/legal/terminos`, `/legal/privacidad`, `/legal/garantia`, `/devoluciones`, `/legal/faq`
- **Síntoma:** Ya lo flagueé en el reporte previo. El `<h1>` no tiene tamaño/peso de hero — se confunde con el subtítulo.
- **Acción:** Reglas para `.legal-header h1`: `font-size: clamp(2rem, 5vw, 3.25rem); font-weight: 700;`

### 13. Trust badges del home: alineación left dentro de columnas, pero fila no llena el ancho
- **URL:** `/` (sección bajo el hero)
- **Síntoma:** "Página Mexicana / Pa' que no te preocupes / Ya vamos, hay mucho tráfico" sit en flex-row con texto izquierdo dentro de cada columna. La fila al completo va de x≈355 a x≈1130 — el grupo está aproximadamente centrado, pero las columnas tienen anchos distintos (los textos de un badge pueden ser más largos que de otro), lo que mueve el centro óptico.
- **Acción:** Forzar `flex: 1` y `min-width: 0` en cada badge para que ocupen tercios iguales.

---

## 🟢 Lo que está alineado correctamente

- **Marcas (`/marcas`):** Hero centrado, grid de 4 cards bien distribuido en todo el ancho.
- **Producto detalle (`/catalogo/[slug]`):** Galería a la izquierda, info a la derecha; el panel de info es totalmente left-aligned (correcto para texto descriptivo) y la galería ocupa su columna completa.
- **Quiz (`/quiz`):** Todo bien centrado — progress bar, pregunta, CTA principal, divisor "o selecciona manualmente", grid de tipos de rostro. Es la página más cuidada en alineación.
- **Cuenta (`/cuenta`):** Split 50/50 con left panel oscuro (texto left-aligned, intencional) y right panel con form (labels izquierda, inputs full width). Coherente.
- **Admin login (`/admin/login`):** Card centrada vertical y horizontalmente con todo el contenido al centro — perfecta.
- **Búsqueda (`/buscar`):** Búsqueda y chips de búsquedas populares, todo perfectamente centrado.
- **Páginas legales (devoluciones, garantía, términos, privacidad):** Body text correctamente left-aligned. Sólo falla el tamaño del H1 (#12).
- **Newsletter (footer del home):** "Recibe ofertas exclusivas" + form input + botón — todo centrado correctamente.
- **Footer:** Grid de 4 columnas (brand+social, TIENDA, INFORMACIÓN, AYUDA) con sus headings y links left-aligned dentro de columnas. Bien.

---

## Próximos pasos por impacto

1. **#1** — color del botón en checkout (5 min, alta visibilidad).
2. **#3 y #5** — centrar grids cuando hay pocos hijos (`justify-content: center` o `place-content: center`). 1 fix sirve para varias páginas.
3. **#4** — alinear container del bloque "Cosas Mexas" con su heading.
4. **#6** — placeholder vertical en cards sin badge.
5. **#2** — refactor del hero del home (subtítulo + CTAs estilizados).
6. **#7, #8, #9, #10, #11, #12, #13** — pulidas tipográficas y de container; en bloque pueden cerrarse en una mañana.
