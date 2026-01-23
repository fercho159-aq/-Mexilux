'use client';

import Link from 'next/link';

// Artículos del blog (copia de los datos para el componente)
const BLOG_POSTS = [
    {
        id: 1,
        slug: 'lugares-magicos-mexico',
        title: 'México Mágico: 10 Lugares que Tienes que Visitar',
        excerpt: 'Desde las pirámides de Teotihuacán hasta las playas de Oaxaca, descubre los rincones más increíbles de nuestro país.',
        category: 'México Mágico',
        categorySlug: 'mexico-magico',
        image: '/blog/mexico-magico.jpg',
        emoji: '🏛️',
        author: 'Equipo Mexilux',
        date: '2026-01-10',
        readTime: '5 min',
        featured: true,
    },
    {
        id: 2,
        slug: 'mexicanos-inspiradores',
        title: 'Mexicanos que Valen la Pena Ver',
        excerpt: 'Conoce a los emprendedores, artistas y creadores mexicanos que están cambiando el juego.',
        category: 'Mexicanos Chingones',
        categorySlug: 'mexicanos-chingones',
        image: '/blog/mexicanos.jpg',
        emoji: '🇲🇽',
        author: 'Equipo Mexilux',
        date: '2026-01-08',
        readTime: '4 min',
        featured: true,
    },
    {
        id: 3,
        slug: 'comida-callejera-mexico',
        title: 'La Mejor Comida Callejera de México',
        excerpt: 'Un tour gastronómico por los tacos, tortas, y antojitos que hacen único a nuestro país.',
        category: 'Cosas Mexas',
        categorySlug: 'cosas-mexas',
        image: '/blog/comida.jpg',
        emoji: '🌮',
        author: 'Equipo Mexilux',
        date: '2026-01-05',
        readTime: '6 min',
        featured: false,
    },
    {
        id: 4,
        slug: 'artesanias-mexicanas',
        title: 'Artesanías Mexicanas: Tesoros Hechos a Mano',
        excerpt: 'El arte popular mexicano es reconocido mundialmente. Conoce las técnicas ancestrales que siguen vivas.',
        category: 'Cosas Mexas',
        categorySlug: 'cosas-mexas',
        image: '/blog/artesanias.jpg',
        emoji: '🎨',
        author: 'Equipo Mexilux',
        date: '2026-01-03',
        readTime: '5 min',
        featured: false,
    },
    {
        id: 5,
        slug: 'frases-mexicanas',
        title: 'Frases Mexicanas que Solo Nosotros Entendemos',
        excerpt: '¿Qué significa "no manches"? ¿Y "aguas"? Un diccionario del español más chido.',
        category: 'Cosas Mexas',
        categorySlug: 'cosas-mexas',
        image: '/blog/frases.jpg',
        emoji: '💬',
        author: 'Equipo Mexilux',
        date: '2026-01-01',
        readTime: '3 min',
        featured: false,
    },
    {
        id: 6,
        slug: 'playas-escondidas',
        title: 'Playas Escondidas de México',
        excerpt: 'Olvídate de Cancún. Estas playas secretas son el verdadero paraíso mexicano.',
        category: 'México Mágico',
        categorySlug: 'mexico-magico',
        image: '/blog/playas.jpg',
        emoji: '🏖️',
        author: 'Equipo Mexilux',
        date: '2025-12-28',
        readTime: '4 min',
        featured: false,
    },
];

const CATEGORIES = [
    { name: 'Todos', slug: 'todos', emoji: '📚' },
    { name: 'Cosas Mexas', slug: 'cosas-mexas', emoji: '🌶️' },
    { name: 'México Mágico', slug: 'mexico-magico', emoji: '✨' },
    { name: 'Mexicanos Chingones', slug: 'mexicanos-chingones', emoji: '💪' },
];

export default function BlogList() {
    const featuredPosts = BLOG_POSTS.filter(post => post.featured);
    const regularPosts = BLOG_POSTS.filter(post => !post.featured);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <main className="blog-page">
            {/* Hero */}
            <section className="blog-hero">
                <div className="blog-hero-content">
                    <span className="blog-hero-badge">🇲🇽 Blog</span>
                    <h1 className="blog-hero-title">
                        Cosas Mexas
                    </h1>
                    <p className="blog-hero-subtitle">
                        Historias, lugares y personas que hacen grande a México
                    </p>
                </div>
            </section>

            {/* Categories */}
            <section className="blog-categories">
                <div className="blog-container">
                    <div className="categories-scroll">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={cat.slug === 'todos' ? '/blog' : `/blog/categoria/${cat.slug}`}
                                className="category-chip"
                            >
                                <span className="category-emoji">{cat.emoji}</span>
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
                <section className="blog-featured">
                    <div className="blog-container">
                        <h2 className="section-label">✨ Destacados</h2>
                        <div className="featured-grid">
                            {featuredPosts.map((post) => (
                                <article key={post.id} className="featured-card">
                                    <Link href={`/blog/${post.slug}`} className="featured-image-link">
                                        <div className="featured-image">
                                            <span className="featured-emoji">{post.emoji}</span>
                                        </div>
                                        <div className="featured-overlay">
                                            <span className="featured-category">{post.category}</span>
                                        </div>
                                    </Link>
                                    <div className="featured-content">
                                        <h3 className="featured-title">
                                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h3>
                                        <p className="featured-excerpt">{post.excerpt}</p>
                                        <div className="featured-meta">
                                            <span className="post-date">{formatDate(post.date)}</span>
                                            <span className="post-read-time">· {post.readTime} lectura</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Posts Grid */}
            <section className="blog-posts">
                <div className="blog-container">
                    <h2 className="section-label">📖 Últimos Artículos</h2>
                    <div className="posts-grid">
                        {regularPosts.map((post) => (
                            <article key={post.id} className="post-card">
                                <Link href={`/blog/${post.slug}`} className="post-image-link">
                                    <div className="post-image">
                                        <span className="post-emoji">{post.emoji}</span>
                                    </div>
                                </Link>
                                <div className="post-content">
                                    <span className="post-category">{post.category}</span>
                                    <h3 className="post-title">
                                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h3>
                                    <p className="post-excerpt">{post.excerpt}</p>
                                    <div className="post-meta">
                                        <span className="post-date">{formatDate(post.date)}</span>
                                        <span className="post-read-time">· {post.readTime}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="blog-newsletter">
                <div className="blog-container">
                    <div className="newsletter-card">
                        <div className="newsletter-content">
                            <span className="newsletter-emoji">📬</span>
                            <h3>¿Te late lo mexa?</h3>
                            <p>Suscríbete y recibe las mejores historias de México directo a tu inbox.</p>
                        </div>
                        <form className="newsletter-form">
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="newsletter-input"
                            />
                            <button type="submit" className="btn btn-primary">
                                Suscribirme
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .blog-page {
                    padding-top: 80px;
                    min-height: 100vh;
                    background: #fafafa;
                }

                .blog-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                /* Hero */
                .blog-hero {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    padding: 80px 20px;
                    text-align: center;
                    color: white;
                }

                .blog-hero-badge {
                    display: inline-block;
                    padding: 8px 16px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 20px;
                    font-size: 14px;
                    margin-bottom: 16px;
                }

                .blog-hero-title {
                    font-size: clamp(2.5rem, 6vw, 4rem);
                    font-weight: 800;
                    margin: 0 0 16px;
                    background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .blog-hero-subtitle {
                    font-size: 1.25rem;
                    opacity: 0.8;
                    margin: 0;
                }

                /* Categories */
                .blog-categories {
                    padding: 24px 0;
                    background: white;
                    border-bottom: 1px solid #eee;
                    position: sticky;
                    top: 60px;
                    z-index: 100;
                }

                .categories-scroll {
                    display: flex;
                    gap: 12px;
                    overflow-x: auto;
                    padding-bottom: 8px;
                    scrollbar-width: none;
                }

                .categories-scroll::-webkit-scrollbar {
                    display: none;
                }

                .category-chip {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background: #f5f5f5;
                    border-radius: 25px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #333;
                    white-space: nowrap;
                    transition: all 0.2s ease;
                    text-decoration: none;
                }

                .category-chip:hover {
                    background: #1a1a2e;
                    color: white;
                }

                .category-emoji {
                    font-size: 16px;
                }

                /* Section Label */
                .section-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin: 0 0 24px;
                }

                /* Featured */
                .blog-featured {
                    padding: 48px 0;
                }

                .featured-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 24px;
                }

                .featured-card {
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .featured-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                }

                .featured-image-link {
                    display: block;
                    position: relative;
                }

                .featured-image {
                    height: 200px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .featured-emoji {
                    font-size: 64px;
                }

                .featured-overlay {
                    position: absolute;
                    bottom: 12px;
                    left: 12px;
                }

                .featured-category {
                    padding: 6px 12px;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    border-radius: 15px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .featured-content {
                    padding: 24px;
                }

                .featured-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0 0 12px;
                    line-height: 1.3;
                }

                .featured-title a {
                    color: #1a1a2e;
                    text-decoration: none;
                }

                .featured-title a:hover {
                    color: #667eea;
                }

                .featured-excerpt {
                    color: #666;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    margin: 0 0 16px;
                }

                .featured-meta, .post-meta {
                    font-size: 0.85rem;
                    color: #999;
                }

                /* Posts Grid */
                .blog-posts {
                    padding: 48px 0;
                }

                .posts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                }

                .post-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                    transition: all 0.3s ease;
                }

                .post-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
                }

                .post-image-link {
                    display: block;
                }

                .post-image {
                    height: 160px;
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .post-emoji {
                    font-size: 48px;
                }

                .post-content {
                    padding: 20px;
                }

                .post-category {
                    font-size: 12px;
                    font-weight: 600;
                    color: #667eea;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .post-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 8px 0 12px;
                    line-height: 1.4;
                }

                .post-title a {
                    color: #1a1a2e;
                    text-decoration: none;
                }

                .post-title a:hover {
                    color: #667eea;
                }

                .post-excerpt {
                    color: #666;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    margin: 0 0 12px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Newsletter */
                .blog-newsletter {
                    padding: 48px 0 80px;
                }

                .newsletter-card {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border-radius: 24px;
                    padding: 48px;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    gap: 32px;
                    color: white;
                }

                .newsletter-content {
                    flex: 1;
                    min-width: 280px;
                }

                .newsletter-emoji {
                    font-size: 48px;
                    display: block;
                    margin-bottom: 16px;
                }

                .newsletter-content h3 {
                    font-size: 1.5rem;
                    margin: 0 0 8px;
                }

                .newsletter-content p {
                    opacity: 0.8;
                    margin: 0;
                }

                .newsletter-form {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .newsletter-input {
                    padding: 14px 20px;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    min-width: 250px;
                }

                @media (max-width: 768px) {
                    .blog-hero {
                        padding: 60px 20px;
                    }

                    .featured-grid {
                        grid-template-columns: 1fr;
                    }

                    .newsletter-card {
                        padding: 32px 24px;
                        flex-direction: column;
                        text-align: center;
                    }

                    .newsletter-form {
                        width: 100%;
                        flex-direction: column;
                    }

                    .newsletter-input {
                        min-width: 100%;
                    }
                }
            `}</style>
        </main>
    );
}
