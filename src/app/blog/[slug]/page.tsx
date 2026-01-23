/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BLOG - PÁGINA DE ARTÍCULO INDIVIDUAL
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPost from '@/components/blog/BlogPost';

// Artículos del blog (copia de los datos para el componente)
const BLOG_POSTS = [
    {
        id: 1,
        slug: 'lugares-magicos-mexico',
        title: 'México Mágico: 10 Lugares que Tienes que Visitar',
        excerpt: 'Desde las pirámides de Teotihuacán hasta las playas de Oaxaca, descubre los rincones más increíbles de nuestro país.',
        content: `
## La magia de México

México es un país lleno de contrastes y maravillas. Desde las antiguas civilizaciones hasta los paisajes naturales más impresionantes, hay algo para todos.

### 1. Teotihuacán, Estado de México 🏛️

Las pirámides del Sol y la Luna te dejarán sin palabras. Caminar por la Calzada de los Muertos es como viajar en el tiempo.

### 2. Oaxaca 🌺

La tierra del mezcal, el mole y las tradiciones más arraigadas. Monte Albán es imperdible.

### 3. San Miguel de Allende 🎨

Una ciudad que parece de cuento. Sus calles empedradas y arquitectura colonial te enamorarán.

### 4. Bacalar 💙

La laguna de los siete colores. El mejor secreto del Caribe mexicano.

### 5. Guanajuato 🎭

Callejones, leyendas y momias. Una experiencia única.

---

**¿Ya visitaste alguno de estos lugares?** Cuéntanos en redes sociales cuál es tu rincón favorito de México.
        `,
        category: 'México Mágico',
        categorySlug: 'mexico-magico',
        emoji: '🏛️',
        author: 'Equipo Mexilux',
        date: '2026-01-10',
        readTime: '5 min',
    },
    {
        id: 2,
        slug: 'mexicanos-inspiradores',
        title: 'Mexicanos que Valen la Pena Ver',
        excerpt: 'Conoce a los emprendedores, artistas y creadores mexicanos que están cambiando el juego.',
        content: `
## Mexicanos que están rompiendo paradigmas

En un mundo globalizado, los mexicanos estamos dejando huella en todas las industrias. Aquí te presentamos algunos que debes conocer.

### Emprendedores 💼

- **Daniel Vogel** - Fundador de Bitso, la cripto-exchange más grande de Latinoamérica
- **Blanca Treviño** - CEO de Softtek, empresa de TI con presencia global
- **Alfredo Harp Helú** - Banquero y filántropo que ha transformado Oaxaca

### Creativos 🎨

- **Guillermo del Toro** - El director de cine más chingón
- **Emmanuel Lubezki** - El Chivo, 3 Oscars consecutivos de cinematografía
- **Tania Libertad** - La voz de América Latina

### Deportistas 🏆

- **Canelo Álvarez** - El mejor boxeador libra por libra
- **Checo Pérez** - Haciendo historia en la F1
- **Ana Gabriela Guevara** - Leyenda del atletismo

---

**¿A quién agregarías a esta lista?** México está lleno de talento.
        `,
        category: 'Mexicanos Chingones',
        categorySlug: 'mexicanos-chingones',
        emoji: '🇲🇽',
        author: 'Equipo Mexilux',
        date: '2026-01-08',
        readTime: '4 min',
    },
    {
        id: 3,
        slug: 'comida-callejera-mexico',
        title: 'La Mejor Comida Callejera de México',
        excerpt: 'Un tour gastronómico por los tacos, tortas, y antojitos que hacen único a nuestro país.',
        content: `
## Los sabores de la calle

No hay mejor lugar para comer en México que en la calle. Aquí van nuestros favoritos.

### Los Tacos 🌮

- **Tacos al Pastor** - El clásico inmortal del trompo
- **Tacos de Canasta** - El desayuno del pueblo
- **Tacos de Birria** - Quesabirria con consomé, una religión

### Las Tortas 🥪

- **Torta Ahogada** - Jalisciense y picosa
- **Pambazo** - Bañado en salsa guajillo
- **Cemita Poblana** - Con pata y milanesa

### Los Antojitos 🫔

- **Esquites y Elotes** - Mayonesa, chile y limón
- **Tlayudas** - La pizza oaxaqueña
- **Gorditas** - Fritas o de comal

---

**Dale like si se te antojó algo.** 🤤
        `,
        category: 'Cosas Mexas',
        categorySlug: 'cosas-mexas',
        emoji: '🌮',
        author: 'Equipo Mexilux',
        date: '2026-01-05',
        readTime: '6 min',
    },
    {
        id: 4,
        slug: 'artesanias-mexicanas',
        title: 'Artesanías Mexicanas: Tesoros Hechos a Mano',
        excerpt: 'El arte popular mexicano es reconocido mundialmente. Conoce las técnicas ancestrales que siguen vivas.',
        content: `
## El arte de nuestras manos

Las artesanías mexicanas son patrimonio de la humanidad. Cada pieza cuenta una historia.

### Barro Negro de Oaxaca 🖤

Originario de San Bartolo Coyotepec, este barro tiene un brillo único que se logra sin esmalte.

### Talavera Poblana 🔵

Desde el siglo XVI, los artesanos de Puebla crean estas piezas coloridas siguiendo técnicas españolas y árabes.

### Alebrijes 🦎

Imaginación pura desde Oaxaca. Criaturas fantásticas pintadas a mano.

### Textiles 🧵

- **Huipiles** de Chiapas
- **Rebozos** de Tenancingo
- **Sarapes** de Saltillo

---

**Comprar artesanías es preservar nuestra cultura.** Siempre pregunta por el artesano.
        `,
        category: 'Cosas Mexas',
        categorySlug: 'cosas-mexas',
        emoji: '🎨',
        author: 'Equipo Mexilux',
        date: '2026-01-03',
        readTime: '5 min',
    },
    {
        id: 5,
        slug: 'frases-mexicanas',
        title: 'Frases Mexicanas que Solo Nosotros Entendemos',
        excerpt: '¿Qué significa "no manches"? ¿Y "aguas"? Un diccionario del español más chido.',
        content: `
## El diccionario del mexicano

Si no eres de aquí, probablemente no entiendas nada. Aquí te explicamos.

### Las Clásicas 🗣️

- **No manches** - Expresión de sorpresa (versión light de otra palabra)
- **¡Aguas!** - ¡Cuidado!
- **¿Qué onda?** - ¿Qué pasa? ¿Cómo estás?
- **Órale** - Sirve para todo: sí, wow, vamos, ok

### Las Confusas 🤔

- **Ahorita** - Puede ser ahora, en 5 minutos, mañana, o nunca
- **Chido/a** - Cool, genial, padre
- **Neta** - Verdad (¿neta? = ¿en serio?)
- **Fresa** - Persona presumida

### Las Extremas 🔥

- **Está cañón** - Está difícil
- **Me vale** - No me importa
- **Echarse un coyotito** - Dormir una siesta
- **Ponerse las pilas** - Ponerse activo

---

**Neta que el español mexicano es el más chido.** 🇲🇽
        `,
        category: 'Cosas Mexas',
        categorySlug: 'cosas-mexas',
        emoji: '💬',
        author: 'Equipo Mexilux',
        date: '2026-01-01',
        readTime: '3 min',
    },
    {
        id: 6,
        slug: 'playas-escondidas',
        title: 'Playas Escondidas de México',
        excerpt: 'Olvídate de Cancún. Estas playas secretas son el verdadero paraíso mexicano.',
        content: `
## Lejos del turismo masivo

México tiene más de 11,000 km de costa. Aquí van las playas que los locales no quieren que conozcas.

### Pacífico 🌅

- **Playa Escondida, Islas Marietas** - Solo accesible nadando
- **Mazunte, Oaxaca** - Hippie vibes y tortugas
- **Sayulita, Nayarit** - Surf y buena vibra

### Golfo y Caribe 🏝️

- **Bacalar, Quintana Roo** - La laguna de los 7 colores
- **Holbox** - Sin autos, solo paz
- **Isla Mujeres** - La original, no Cancún

### Mar de Cortés 🐚

- **Bahía de los Ángeles** - Ballenas y mantas
- **Loreto** - El acuario del mundo
- **Cabo Pulmo** - El arrecife más vivo de Norteamérica

---

**¿Cuál agregarías a la lista?** Hay tantas que no alcanzamos a mencionarlas todas.
        `,
        category: 'México Mágico',
        categorySlug: 'mexico-magico',
        emoji: '🏖️',
        author: 'Equipo Mexilux',
        date: '2025-12-28',
        readTime: '4 min',
    },
];

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find(p => p.slug === slug);

    if (!post) {
        return { title: 'Artículo no encontrado | Mexilux' };
    }

    return {
        title: `${post.title} | Blog Mexilux`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = BLOG_POSTS.find(p => p.slug === slug);

    if (!post) {
        notFound();
    }

    // Related posts
    const relatedPosts = BLOG_POSTS
        .filter(p => p.slug !== slug && p.categorySlug === post.categorySlug)
        .slice(0, 2);

    return <BlogPost post={post} relatedPosts={relatedPosts} />;
}
