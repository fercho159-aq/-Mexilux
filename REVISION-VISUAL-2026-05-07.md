# Revisión visual del sitio Mexilux

**Fecha:** 7 de mayo de 2026
**Entorno:** `npm run dev` en `localhost:3000`
**Resoluciones:** desktop 1440×900 / 1512×795, móvil 500px (CSS) — DPR ~1.85

A continuación los hallazgos ordenados por severidad. Cada uno indica la URL donde se reprodujo y, cuando aplica, el archivo a revisar.

---

## 🔴 Bugs (rompen funcionalidad o se ven mal)

### 1. Ruta `/configurador/[slug]` devuelve 404 con productos reales
- **URL probada:** `/configurador/maximum-aviator`
- **Síntoma:** Página 404 negra (la default de Next.js, no estilizada con la marca).
- **Causa:** `src/app/configurador/[slug]/page.tsx` usa un objeto `mockFrames` hardcoded con sólo 4 slugs (`ray-ban-aviator-classic`, etc.). Los productos reales de la BD (e.g. `maximum-aviator`, `maximum-7350`) caen en `notFound()`.
- **Impacto:** El configurador es una de las features estrella; ahora mismo no es accesible para ningún producto del catálogo real.
- **Acción sugerida:** Sustituir el mock por una llamada real a `getFrameBySlug` contra Prisma / la API.

### 2. Página 404 sin estilo de marca
- **Síntoma:** Cuando se cae cualquier ruta, aparece la 404 default de Next.js (fondo negro, "404 | This page could not be found.").
- **Acción:** Crear `src/app/not-found.tsx` con header, mensaje en español, y un CTA al home.

### 3. Headings de páginas legales se ven como texto pequeño
- **URLs:** `/legal/terminos`, `/legal/privacidad`, `/legal/garantia`, `/devoluciones`, `/legal/faq`.
- **Síntoma:** Los `<h1>` ("Términos y Condiciones", "Política de Privacidad", "Garantía y Devoluciones", "Política de Devoluciones", "Preguntas Frecuentes") aparecen del mismo tamaño que el subtítulo / body, no como hero.
- **Causa probable:** La clase `.legal-header h1` en el CSS global está sin estilos o pisada por reset.
- **Acción:** Aumentar `font-size` y peso para `.legal-header h1` (ej. `clamp(2rem, 5vw, 3.25rem)`, `font-weight: 700`).

### 4. Filtros del catálogo se cortan en móvil
- **URL:** `/catalogo/lentes-oftalmicos` y `/catalogo/lentes-de-sol` en ~500px.
- **Síntoma:** Los pills "Todas las formas / Todo material / Todas las marcas / Más populares" están en una sola fila y "Todas las marcas" se desborda fuera del viewport.
- **Acción:** Envolver con `flex-wrap: wrap` o convertirlos en un drawer/sheet en móvil.

### 5. Header sticky translúcido choca con secciones oscuras
- **URL:** Home (`/`) en la sección de blog cards y al hacer scroll.
- **Síntoma:** Las cards "Mexico Magico", "Mexicanos de Lujo", "Pa' la Muela", "Vista a las Raíces" tienen fondos de color saturado. Al pasar bajo el header sticky con `backdrop-filter`, el logo Mexilux y los iconos de cart/menú se mezclan visualmente con el texto blanco de las cards.
- **Acción:** Subir la opacidad de `.site-header` (ej. de translúcida a `rgba(255,255,255,.92)`), o agregar un `mask-gradient` en el borde inferior del header.

### 6. Mensaje de error inicial al primer load del dev server
- **Síntoma:** El primer request al home tras levantar `npm run dev` mostró `Application error: a server-side exception has occurred while loading localhost. Digest: 644489132`. Tras refrescar, ya carga bien.
- **Causa típica:** Race en un Server Component que aún no terminó de hidratar / Prisma generate. No es bloqueante en producción, pero conviene revisar logs.

---

## 🟡 Inconsistencias / mejoras

### 7. Dos rutas de "agendar cita" con UI distinta
- **URLs:** `/citas` (rich, con cards de servicios y bullets) y `/servicios/citas` (lista plana de radio buttons).
- **Acción:** Decidir cuál es la oficial y redirigir la otra (`redirect('/citas')` desde `src/app/servicios/citas/page.tsx`).

### 8. Algunas imágenes de productos no cargan en el listado
- **URL:** `/catalogo/lentes-oftalmicos` en desktop — la card "MAXIMUM Aviator" mostró un placeholder gris vacío en el primer load (la card de "MAXIMUM 7350" sí mostró imagen). En móvil ambas cargaron.
- **Causa probable:** Lazy-load + `Next/Image` que aún no resolvió el src para arriba del fold.
- **Acción:** Añadir `priority` a la primera card visible o `placeholder="blur"` para evitar el "hueco" mientras carga.

### 9. Badge "NUEVO" se ve cortado en la ficha de producto
- **URL:** `/catalogo/maximum-aviator`
- **Síntoma:** En el top-left de la galería del producto se ve sólo la curva inferior de una letra (parece "U" o "J"), que es un badge "NUEVO" posicionado fuera del recorte de la card.
- **Acción:** Revisar `position` y `overflow` del contenedor de `.product-gallery` en `ProductGallery.tsx`.

### 10. Imágenes externas de Pexels devuelven 503
- **URL:** Home (carrusel de testimonios "Descubre cómo luce").
- **Síntoma:** Network log muestra `pexels.com/videos/.../photo.jpg` devolviendo 503 (rate limit / hotlink protection).
- **Acción:** Subir thumbnails locales o usar Cloudinary para los videos UGC en lugar de hotlinkear a Pexels.

### 11. El home depende mucho de scroll-trigger animations que esconden contenido
- **Síntoma:** Mientras se hace scroll, varios slots del home aparecen "vacíos/blancos" hasta que la animación dispare. Si un usuario hace scroll rápido al final, ve la página en blanco antes del footer.
- **Acción:** Marcar elementos críticos con `opacity: 1` por default y sólo animar entrada (`from`-only). Asegurar que `ScrollTrigger.refresh()` corra después de `load`.

### 12. La carpeta `src/app/catalogo/[slug]` no existe en disco pero la ruta funciona
- **Detalle:** Los enlaces de las cards apuntan a `/catalogo/{slug}` y la URL resuelve (porque hay un `app/catalogo/page.tsx` con catch-all dinámico embebido o un middleware), pero al revisar con `Glob` no aparece un archivo `[slug]/page.tsx`. Vale la pena confirmar dónde se está manejando ese routing para evitar comportamiento sorpresivo.

---

## 🟢 Lo que está muy bien

- **Diseño general:** Tipografías, paletas y tono ("Página Mexicana", "Cosas Mexas", "¿Qué se te perdió?", "Pa' que no te preocupes") son consistentes y refrescantes.
- **Marcas (`/marcas`):** Excelente layout con cards destacadas (Ray-Ban, Oakley, Gucci, Tom Ford) y grid completo de marcas con conteos.
- **Blog (`/blog`):** Hero "Cosas Mexas" muy logrado, filtros con iconos, cards con gradientes de color por categoría.
- **Citas (`/citas`):** Servicios, duración y precio claros; flujo en pasos numerados.
- **Cuenta (`/cuenta`):** Split-screen con benefits a la izquierda y form de login/registro a la derecha — moderno y claro. En móvil colapsa correctamente al form.
- **Quiz (`/quiz`):** UI agradable, opción de escaneo facial + selección manual con iconos geométricos por tipo de rostro.
- **Admin login (`/admin/login`):** Card centrada con gradiente azul oscuro, distinta de la tienda — buen anclaje visual.
- **Empty states:** El de "No hay polarizados disponibles" en `/catalogo/lentes-de-sol` está bien resuelto con icono y CTA.
- **Mobile:** En general las páginas se adaptan bien, salvo los puntos del catálogo y el hero del home.

---

## Páginas no revisadas en visual

Estas requieren sesión iniciada y/o datos de prueba; no las recorrí esta vez:
- `/cuenta/dashboard`, `/cuenta/pedidos`, `/cuenta/salud-visual`, `/cuenta/reorden` (dashboard sí mostró un layout placeholder "Hola, Usuario", pero sin datos reales).
- Todo `/admin/*` excepto el login (panel, productos, categorías, marcas, citas, cupones, videos, usuarios, configuración).

Si quieres que las revise, dime con qué credenciales (o crea un usuario de prueba) y vuelvo a barrerlas.

---

## Próximos pasos sugeridos (orden de impacto)

1. Conectar el configurador a la BD real (#1) — bloquea conversión.
2. Corregir los `<h1>` de páginas legales (#3) — afecta SEO y profesionalismo.
3. `not-found.tsx` con marca (#2).
4. Filtros de catálogo en móvil (#4).
5. Header sticky vs blog cards (#5).
6. Decidir `/citas` vs `/servicios/citas` (#7).
