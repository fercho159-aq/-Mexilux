import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./pages.css";
import Header from "@/components/layout/Header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mexilux.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mexilux | Lentes y Armazones Premium en México - Envío Gratis",
    template: "%s | Mexilux - Óptica Online",
  },
  description:
    "Compra lentes graduados, armazones de diseñador y lentes de sol con hasta 50% de descuento. Envío gratis en todo México. Garantía de 2 años. Configura tus lentes online en minutos.",
  keywords: [
    // Palabras clave de alta intención de compra
    "comprar lentes graduados online",
    "lentes con envío gratis México",
    "armazones baratos",
    "óptica online México",
    "lentes de sol originales",
    // Productos específicos
    "lentes progresivos precio",
    "lentes bifocales",
    "lentes antirreflejantes",
    "lentes blue ray para computadora",
    "lentes fotocromáticos",
    "lentes polarizados",
    // Marcas populares
    "armazones Ray-Ban México",
    "lentes Oakley originales",
    // Ubicación
    "óptica en línea México",
    "lentes graduados CDMX",
    "óptica envío a domicilio",
    // Servicios
    "examen de la vista",
    "graduar lentes online",
    "configurador de lentes",
  ],
  authors: [{ name: "Mexilux" }],
  creator: "Mexilux",
  publisher: "Mexilux",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "es-MX": siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "Mexilux",
    title: "Mexilux | Lentes Premium con Envío Gratis en México",
    description:
      "Armazones de diseñador desde $599. Lentes graduados con garantía de 2 años. Configura tus lentes en 3 pasos. Envío gratis a todo México.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mexilux - Lentes y Armazones Premium en México",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mexilux | Lentes Premium - Hasta 50% OFF",
    description: "Compra lentes graduados online. Envío gratis + Garantía 2 años. Configura tus lentes en minutos.",
    images: ["/og-image.jpg"],
    creator: "@mexilux",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Agregar cuando tengas las verificaciones
    // google: "tu-codigo-de-verificacion",
    // yandex: "tu-codigo",
  },
  category: "ecommerce",
};

// JSON-LD Structured Data para SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Mexilux",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
      sameAs: [
        "https://facebook.com/mexilux",
        "https://instagram.com/mexilux",
        "https://tiktok.com/@mexilux",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+52-55-1234-5678",
        contactType: "customer service",
        availableLanguage: "Spanish",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Mexilux",
      description: "Óptica online premium en México",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/catalogo?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Store",
      "@id": `${siteUrl}/#store`,
      name: "Mexilux - Óptica Online",
      image: `${siteUrl}/og-image.jpg`,
      priceRange: "$$",
      servesCuisine: "Óptica",
      address: {
        "@type": "PostalAddress",
        addressCountry: "MX",
        addressRegion: "Ciudad de México",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.4326",
        longitude: "-99.1332",
      },
      url: siteUrl,
      telephone: "+52-55-1234-5678",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "19:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "10:00",
          closes: "15:00",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "500",
        bestRating: "5",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: siteUrl,
        },
      ],
    },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        {/* Skip link para accesibilidad */}
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>

        {/* Header Component */}
        <Header />

        {/* Main content */}
        <div id="main-content">{children}</div>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-container">
            <div className="footer-grid">
              {/* Brand */}
              <div className="footer-section">
                <a href="/" className="footer-logo">
                  <span className="logo-text">Mexilux</span>
                </a>

                <div className="footer-social">
                  <a
                    href="https://facebook.com"
                    aria-label="Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://tiktok.com"
                    aria-label="TikTok"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Links */}
              <div className="footer-section">
                <h3>Tienda</h3>
                <ul>
                  <li>
                    <a href="/catalogo">Sin etiquetas</a>
                  </li>
                  <li>
                    <a href="/catalogo?genero=hombre">Mexicano</a>
                  </li>
                  <li>
                    <a href="/catalogo?genero=mujer">Mexicana</a>
                  </li>
                  <li>
                    <a href="/quiz">Hacer quiz</a>
                  </li>
                </ul>
              </div>

              <div className="footer-section">
                <h3>Información</h3>
                <ul>
                  <li>
                    <a href="/nosotros">Nosotros</a>
                  </li>
                  <li>
                    <a href="/envios">Envíos</a>
                  </li>
                  <li>
                    <a href="/legal/garantia">Garantía</a>
                  </li>
                </ul>
              </div>

              <div className="footer-section">
                <h3>Ayuda</h3>
                <ul>
                  <li>
                    <a href="/contacto">Contacto</a>
                  </li>
                  <li>
                    <a href="/devoluciones">Devoluciones</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <p>
                © {new Date().getFullYear()} Mexilux. Todos los derechos
                reservados.
              </p>
              <div className="footer-legal">
                <a href="/legal/privacidad">Política de privacidad</a>
                <a href="/legal/terminos">Términos y condiciones</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
