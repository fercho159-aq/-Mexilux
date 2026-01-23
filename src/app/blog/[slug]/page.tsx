/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BLOG - PÁGINA DE ARTÍCULO INDIVIDUAL
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Artículos del blog (mismos que en page.tsx - después esto puede venir de DB)
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

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Simple markdown-like rendering
    const renderContent = (content: string) => {
        return content
            .split('\n')
            .map((line, i) => {
                if (line.startsWith('## ')) {
                    return <h2 key={i} className="content-h2">{line.replace('## ', '')}</h2>;
                }
                if (line.startsWith('### ')) {
                    return <h3 key={i} className="content-h3">{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('- **')) {
                    const match = line.match(/- \*\*(.+?)\*\* - (.+)/);
                    if (match) {
                        return (
                            <p key={i} className="content-list-item">
                                <strong>{match[1]}</strong> - {match[2]}
                            </p>
                        );
                    }
                }
                if (line.startsWith('- ')) {
                    return <p key={i} className="content-list-item">• {line.replace('- ', '')}</p>;
                }
                if (line.startsWith('---')) {
                    return <hr key={i} className="content-divider" />;
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="content-bold">{line.replace(/\*\*/g, '')}</p>;
                }
                if (line.trim()) {
                    return <p key={i} className="content-paragraph">{line}</p>;
                }
                return null;
            });
    };

    // Related posts
    const relatedPosts = BLOG_POSTS
        .filter(p => p.slug !== slug && p.categorySlug === post.categorySlug)
        .slice(0, 2);

    return (
        <main className="blog-post-page">
            {/* Header */}
            <header className="post-header">
                <div className="post-header-content">
                    <Link href="/blog" className="back-link">
                        ← Volver al blog
                    </Link>
                    <span className="post-category-badge">{post.category}</span>
                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-meta">
                        <span className="post-author">{post.author}</span>
                        <span className="meta-divider">·</span>
                        <span className="post-date">{formatDate(post.date)}</span>
                        <span className="meta-divider">·</span>
                        <span className="post-read-time">{post.readTime} lectura</span>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            <div className="post-featured-image">
                <div className="featured-image-bg">
                    <span className="featured-emoji">{post.emoji}</span>
                </div>
            </div>

            {/* Content */}
            <article className="post-content">
                <div className="post-container">
                    {renderContent(post.content)}
                </div>
            </article>

            {/* Share */}
            <section className="post-share">
                <div className="post-container">
                    <p className="share-label">Comparte este artículo:</p>
                    <div className="share-buttons">
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://mexilux.vercel.app/blog/${post.slug}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="share-btn share-twitter"
                        >
                            𝕏 Twitter
                        </a>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - https://mexilux.vercel.app/blog/${post.slug}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="share-btn share-whatsapp"
                        >
                            📱 WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="related-posts">
                    <div className="post-container">
                        <h2 className="related-title">Artículos relacionados</h2>
                        <div className="related-grid">
                            {relatedPosts.map((related) => (
                                <Link key={related.id} href={`/blog/${related.slug}`} className="related-card">
                                    <span className="related-emoji">{related.emoji}</span>
                                    <h3>{related.title}</h3>
                                    <span className="related-read-time">{related.readTime}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <style jsx>{`
                .blog-post-page {
                    padding-top: 80px;
                    min-height: 100vh;
                    background: #fff;
                }

                .post-container {
                    max-width: 700px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                /* Header */
                .post-header {
                    padding: 48px 20px;
                    text-align: center;
                    background: #fafafa;
                }

                .post-header-content {
                    max-width: 700px;
                    margin: 0 auto;
                }

                .back-link {
                    display: inline-block;
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 24px;
                    text-decoration: none;
                }

                .back-link:hover {
                    color: #1a1a2e;
                }

                .post-category-badge {
                    display: inline-block;
                    padding: 6px 14px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    margin-bottom: 16px;
                }

                .post-title {
                    font-size: clamp(1.75rem, 4vw, 2.5rem);
                    font-weight: 800;
                    color: #1a1a2e;
                    margin: 0 0 20px;
                    line-height: 1.2;
                }

                .post-meta {
                    color: #666;
                    font-size: 14px;
                }

                .meta-divider {
                    margin: 0 8px;
                    opacity: 0.5;
                }

                /* Featured Image */
                .post-featured-image {
                    margin: -24px auto 0;
                    max-width: 800px;
                    padding: 0 20px;
                }

                .featured-image-bg {
                    height: 300px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
                }

                .featured-emoji {
                    font-size: 100px;
                }

                /* Content */
                .post-content {
                    padding: 48px 0;
                }

                :global(.content-h2) {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1a1a2e;
                    margin: 48px 0 16px;
                }

                :global(.content-h3) {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1a1a2e;
                    margin: 32px 0 12px;
                }

                :global(.content-paragraph) {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: #444;
                    margin: 0 0 16px;
                }

                :global(.content-list-item) {
                    font-size: 1.05rem;
                    line-height: 1.7;
                    color: #444;
                    margin: 8px 0;
                    padding-left: 8px;
                }

                :global(.content-bold) {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1a1a2e;
                    margin: 24px 0;
                }

                :global(.content-divider) {
                    border: none;
                    border-top: 2px solid #eee;
                    margin: 40px 0;
                }

                /* Share */
                .post-share {
                    padding: 32px 0;
                    border-top: 1px solid #eee;
                }

                .share-label {
                    font-size: 14px;
                    color: #666;
                    margin: 0 0 16px;
                }

                .share-buttons {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .share-btn {
                    padding: 12px 20px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .share-twitter {
                    background: #1a1a2e;
                    color: white;
                }

                .share-whatsapp {
                    background: #25D366;
                    color: white;
                }

                .share-btn:hover {
                    transform: translateY(-2px);
                    opacity: 0.9;
                }

                /* Related */
                .related-posts {
                    padding: 48px 0 80px;
                    background: #fafafa;
                }

                .related-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0 0 24px;
                    color: #1a1a2e;
                }

                .related-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 16px;
                }

                .related-card {
                    background: white;
                    padding: 24px;
                    border-radius: 16px;
                    text-decoration: none;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                    transition: all 0.3s ease;
                }

                .related-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
                }

                .related-emoji {
                    font-size: 32px;
                    display: block;
                    margin-bottom: 12px;
                }

                .related-card h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1a1a2e;
                    margin: 0 0 8px;
                    line-height: 1.4;
                }

                .related-read-time {
                    font-size: 13px;
                    color: #999;
                }

                @media (max-width: 768px) {
                    .featured-image-bg {
                        height: 200px;
                    }

                    .featured-emoji {
                        font-size: 64px;
                    }
                }
            `}</style>
        </main>
    );
}
