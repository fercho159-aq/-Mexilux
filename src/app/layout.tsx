import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./pages.css";

export const metadata: Metadata = {
  title: {
    default: "Mexilux | Óptica Premium",
    template: "%s | Mexilux",
  },
  description:
    "Descubre nuestra colección de monturas de diseñador y lentes graduados personalizados. Agenda tu examen de la vista con nuestros optometristas certificados.",
  keywords: [
    "óptica",
    "lentes graduados",
    "monturas",
    "optometría",
    "examen de la vista",
    "lentes de sol",
    "Ray-Ban",
    "Oakley",
    "lentes progressivos",
  ],
  authors: [{ name: "Mexilux" }],
  creator: "Mexilux",
  publisher: "Mexilux",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://mexilux.com",
    siteName: "Mexilux",
    title: "Mexilux | Óptica Premium",
    description:
      "Monturas de diseñador y lentes graduados personalizados en México",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mexilux - Óptica Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mexilux | Óptica Premium",
    description: "Monturas de diseñador y lentes graduados personalizados",
    images: ["/og-image.jpg"],
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
      <head />
      <body suppressHydrationWarning>
        {/* Skip link para accesibilidad */}
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>

        {/* Header */}
        <header className="site-header">
          <div className="header-container">
            <a href="/" className="logo" aria-label="Mexilux - Ir al inicio">
              <span className="logo-icon">👁️</span>
              <span className="logo-text">Mexilux</span>
            </a>

            <nav className="main-nav" aria-label="Navegación principal">
              <ul className="nav-list">
                <li>
                  <a href="/catalogo">Catálogo</a>
                </li>
                <li>
                  <a href="/catalogo/lentes-de-sol">Polarizados</a>
                </li>
                <li>
                  <a href="/catalogo/lentes-oftalmicos">Oftálmicos</a>
                </li>
                <li>
                  <a href="/nosotros">Nosotros</a>
                </li>
              </ul>
            </nav>

            <div className="header-actions">
              <a
                href="/buscar"
                className="header-action"
                aria-label="Buscar productos"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </a>
              <a
                href="/cuenta"
                className="header-action"
                aria-label="Mi cuenta"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </a>
              <a
                href="/carrito"
                className="header-action cart-action"
                aria-label="Carrito de compras"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span className="cart-count" aria-label="0 productos">
                  0
                </span>
              </a>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div id="main-content">{children}</div>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-container">
            <div className="footer-grid">
              {/* Brand */}
              <div className="footer-section">
                <a href="/" className="footer-logo">
                  <span className="logo-icon">👁️</span>
                  <span className="logo-text">Mexilux</span>
                </a>
                <p className="footer-tagline">
                  Tu centro de salud visual premium en México.
                </p>
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
                    <a href="/catalogo">Todos los productos</a>
                  </li>
                  <li>
                    <a href="/catalogo/lentes-de-sol">Lentes de sol</a>
                  </li>
                  <li>
                    <a href="/catalogo/lentes-oftalmicos">
                      Lentes oftálmicos
                    </a>
                  </li>
                  <li>
                    <a href="/marcas">Marcas</a>
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
                    <a href="/legal/faq">Preguntas frecuentes</a>
                  </li>
                  <li>
                    <a href="/envios">Envíos</a>
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
