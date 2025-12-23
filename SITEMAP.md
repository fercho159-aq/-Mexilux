# Mexilux - Estructura del Sitio (Sitemap)

Este documento describe la arquitectura lógica del sitio de óptica Mexilux.

## 1.0 Home (Inicio) ✅
**Ruta:** `/`

### Secciones implementadas:
- **1.1 Hero Section** ✅ - Promoción principal con CTA "Reservar Cita"
- **1.2 Categorías Destacadas** ✅ - Hombre, Mujer, Niños
- **1.3 Buscador "Tu estilo"** ✅ - Quiz rápido (`/quiz`)
- **1.4 Testimonios y Sellos de Confianza** ✅ - Reseñas y badges de confianza

---

## 2.0 Catálogo (Shop) ✅
**Ruta:** `/catalogo`

### Secciones implementadas:
- **2.1 Filtros** ✅ - Forma, Material, Color, Marca, Género, Tipo, Precio
- **2.2 Grid de Productos** ✅ - Cards con wishlist, colores, ratings

### 2.3 Ficha de Producto (Single Product) ✅
**Ruta:** `/catalogo/[slug]`

- **2.3.1 Galería** ✅ - Imágenes con thumbnails y badge de descuento
- **2.3.2 Selector de Color/Tamaño** ✅ - Swatches interactivos y tallas
- **2.3.3 El Configurador de Lentes** ✅ - Link al wizard con preview de pasos

El Configurador (Wizard) está en `/configurador/[slug]`:
- **Paso A:** Tipo de visión (Monofocal/Progresivo/Sin aumento)
- **Paso B:** Ingreso de receta (Subir foto, manual, o guardadas)
- **Paso C:** Selección de Grosor (Índice 1.5, 1.6, 1.67, 1.74)
- **Paso D:** Tratamientos (Blue Light, Antireflejante, Fotocromático)
- **Paso E:** Resumen y agregar al carrito

---

## 3.0 Servicios Clínicos ✅
**Ruta:** `/servicios`

### Páginas implementadas:
- **3.1 Explicación de Exámenes** ✅ - Vista, Lentes de contacto, Pediátrico
- **3.2 Agendar Cita** ✅ - Booking System (`/servicios/citas`)

---

## 4.0 Usuario (Mi Cuenta) ✅
**Ruta:** `/cuenta`

### Páginas implementadas:
- **4.1 Dashboard** ✅ - Estadísticas rápidas y navegación
- **4.2 Mis Pedidos** ✅ - Historial y seguimiento (`/cuenta/pedidos`)
- **4.3 "Mi Salud Visual"** ✅ - Repositorio de recetas (`/cuenta/salud-visual`)
- **4.4 Reordenar LC** ✅ - Quick Reorder (`/cuenta/reorden`)

---

## 5.0 Footer / Legal ✅
**Rutas:** `/legal/*`

### Páginas implementadas:
- **5.1 Garantía y Devoluciones** ✅ - (`/legal/garantia`)
- **5.2 Preguntas Frecuentes (FAQ)** ✅ - (`/legal/faq`)

---

## Estructura de Archivos

```
src/app/
├── page.tsx                          # 1.0 Home
├── layout.tsx                        # Layout principal con header/footer
├── globals.css                       # Estilos globales
├── pages.css                         # Estilos de páginas internas
├── quiz/
│   └── page.tsx                      # 1.3 Quiz de estilo
├── catalogo/
│   ├── page.tsx                      # 2.0 Catálogo
│   ├── lentes-de-sol/
│   │   └── page.tsx                  # Lentes de sol
│   ├── lentes-oftalmicos/
│   │   └── page.tsx                  # Lentes oftálmicos
│   └── [slug]/
│       └── page.tsx                  # 2.3 Ficha de producto
├── configurador/
│   └── [slug]/
│       └── page.tsx                  # 2.3.3 Configurador de lentes
├── servicios/
│   ├── page.tsx                      # 3.0 Servicios
│   └── citas/
│       └── page.tsx                  # 3.2 Agendar cita
├── cuenta/
│   ├── page.tsx                      # 4.1 Dashboard
│   ├── pedidos/
│   │   └── page.tsx                  # 4.2 Mis pedidos
│   ├── salud-visual/
│   │   └── page.tsx                  # 4.3 Mi salud visual
│   └── reorden/
│       └── page.tsx                  # 4.4 Reordenar LC
├── legal/
│   ├── garantia/
│   │   └── page.tsx                  # 5.1 Garantía
│   ├── faq/
│   │   └── page.tsx                  # 5.2 FAQ
│   ├── privacidad/
│   │   └── page.tsx                  # Política de privacidad
│   └── terminos/
│       └── page.tsx                  # Términos y condiciones
├── contacto/
│   └── page.tsx                      # Página de contacto
├── buscar/
│   └── page.tsx                      # Búsqueda de productos
├── carrito/
│   └── page.tsx                      # Carrito de compras
├── marcas/
│   └── page.tsx                      # Página de marcas
├── envios/
│   └── page.tsx                      # Información de envíos
└── devoluciones/
    └── page.tsx                      # Política de devoluciones
```

---

## Componentes Reutilizables

```
src/components/
├── ui/
│   ├── NewsletterForm.tsx            # Formulario de newsletter (Client)
│   └── ThemeToggle.tsx               # Toggle de tema claro/oscuro
└── lens-configurator/
    ├── LensConfiguratorWizard.tsx    # Wizard principal
    ├── WizardProgress.tsx            # Barra de progreso
    ├── WizardNavigation.tsx          # Navegación del wizard
    ├── steps/
    │   ├── UsageTypeStep.tsx         # Paso: Tipo de visión
    │   ├── PrescriptionStep.tsx      # Paso: Receta
    │   ├── MaterialStep.tsx          # Paso: Material/Grosor
    │   ├── TreatmentsStep.tsx        # Paso: Tratamientos
    │   └── ReviewStep.tsx            # Paso: Resumen
    └── lens-configurator.css         # Estilos del configurador
```

---

## Próximos Pasos

1. **Integración de API** - Conectar con backend para productos reales
2. **Autenticación** - Implementar login/registro de usuarios
3. **Estado Global del Carrito** - Implementar estado global con Context o Zustand
4. **Sistema de pagos** - Integrar pasarela de pagos (Stripe/MercadoPago)
5. **Sistema de citas** - Backend para gestión de agenda
6. **Virtual Try-On** - Integrar AR SDK para probador virtual
7. **Panel de administración** - CRUD de productos y pedidos

