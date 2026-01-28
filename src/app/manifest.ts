import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mexilux - Óptica Premium Online',
    short_name: 'Mexilux',
    description: 'Compra lentes graduados y armazones premium online. Envío gratis en todo México.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#152132',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['shopping', 'health', 'lifestyle'],
    lang: 'es-MX',
    dir: 'ltr',
    prefer_related_applications: false,
  }
}
