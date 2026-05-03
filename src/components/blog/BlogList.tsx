'use client';

import Link from 'next/link';

const BLOG_POSTS = [
    {
        id: 1,
        slug: 'lugares-magicos-mexico',
        title: 'Mexico Magico: 10 Lugares que Tienes que Visitar',
        excerpt: 'Desde las piramides de Teotihuacan hasta las playas de Oaxaca, descubre los rincones mas increibles de nuestro pais.',
        category: 'Mexico Magico',
        categorySlug: 'mexico-magico',
        image: '/blog/mexico-magico.jpg',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        author: 'Equipo Mexilux',
        date: '2026-01-10',
        readTime: '5 min',
        featured: true,
    },
    {
        id: 2,
        slug: 'mexicanos-inspiradores',
        title: 'Mexicanos que Vale la Pena Voltear a Ver',
        excerpt: 'Conoce a los emprendedores, artistas y creadores mexicanos que estan cambiando el juego.',
        category: 'Mexicanos de Lujo',
        categorySlug: 'mexicanos-de-lujo',
        image: '/blog/mexicanos.jpg',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        author: 'Equipo Mexilux',
        date: '2026-01-08',
        readTime: '4 min',
        featured: true,
    },
    {
        id: 3,
        slug: 'comida-callejera-mexico',
        title: 'La Mejor Comida Callejera de Mexico',
        excerpt: 'Un tour gastronomico por los tacos, tortas, y antojitos que hacen unico a nuestro pais.',
        category: "Pa' la Muela",
        categorySlug: 'pa-la-muela',
        image: '/blog/comida.jpg',
        gradient: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
        author: 'Equipo Mexilux',
        date: '2026-01-05',
        readTime: '6 min',
        featured: false,
    },
    {
        id: 4,
        slug: 'artesanias-mexicanas',
        title: 'Artesanias Mexicanas: Tesoros Hechos a Mano',
        excerpt: 'El arte popular mexicano es reconocido mundialmente. Conoce las tecnicas ancestrales que siguen vivas.',
        category: 'Vista a las Raices',
        categorySlug: 'vista-a-las-raices',
        image: '/blog/artesanias.jpg',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        author: 'Equipo Mexilux',
        date: '2026-01-03',
        readTime: '5 min',
        featured: false,
    },
    {
        id: 5,
        slug: 'dia-de-muertos-tradicion',
        title: 'Dia de Muertos: Una Tradicion que nos Define',
        excerpt: 'Mas alla del Halloween, el Dia de Muertos celebra la vida y la memoria. Conoce su historia y significado.',
        category: 'Vista a las Raices',
        categorySlug: 'vista-a-las-raices',
        image: '/blog/dia-muertos.jpg',
        gradient: 'linear-gradient(135deg, #6b4c9a 0%, #e91e63 100%)',
        author: 'Equipo Mexilux',
        date: '2026-01-01',
        readTime: '4 min',
        featured: false,
    },
    {
        id: 6,
        slug: 'frases-mexicanas',
        title: 'Frases Mexicanas que Solo Nosotros Entendemos',
        excerpt: 'Que significa "no manches"? Y "aguas"? Un diccionario del español mas chido.',
        category: "Pa' la Muela",
        categorySlug: 'pa-la-muela',
        image: '/blog/frases.jpg',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
        author: 'Equipo Mexilux',
        date: '2025-12-30',
        readTime: '3 min',
        featured: false,
    },
    {
        id: 7,
        slug: 'restaurantes-cdmx',
        title: 'Restaurantes en CDMX que Tienes que Probar',
        excerpt: 'De la comida callejera a los restaurantes de autor. Los mejores sabores de la Ciudad de Mexico.',
        category: "Pa' la Muela",
        categorySlug: 'pa-la-muela',
        image: '/blog/restaurantes.jpg',
        gradient: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
        author: 'Equipo Mexilux',
        date: '2025-12-28',
        readTime: '4 min',
        featured: false,
    },
    {
        id: 8,
        slug: 'playas-escondidas',
        title: 'Playas Escondidas de Mexico',
        excerpt: 'Olvidate de Cancun. Estas playas secretas son el verdadero paraiso mexicano.',
        category: 'Mexico Magico',
        categorySlug: 'mexico-magico',
        image: '/blog/playas.jpg',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        author: 'Equipo Mexilux',
        date: '2025-12-25',
        readTime: '4 min',
        featured: false,
    },
    {
        id: 9,
        slug: 'yalitza-aparicio-historia',
        title: 'Yalitza Aparicio: De Oaxaca al Mundo',
        excerpt: 'La historia de la actriz que rompio barreras y puso a Mexico en los ojos del mundo.',
        category: 'Mexicanos de Lujo',
        categorySlug: 'mexicanos-de-lujo',
        image: '/blog/yalitza.jpg',
        gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        author: 'Equipo Mexilux',
        date: '2025-12-22',
        readTime: '5 min',
        featured: false,
    },
];

const CATEGORIES = [
    {
        name: 'Todos',
        slug: 'todos',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        name: 'Mexico Magico',
        slug: 'mexico-magico',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 21l1.5-4.5M21 21l-1.5-4.5M12 3l2 7h7l-5.5 4 2 7L12 17l-5.5 4 2-7L3 10h7l2-7z" />
            </svg>
        ),
    },
    {
        name: 'Mexicanos de Lujo',
        slug: 'mexicanos-de-lujo',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
        ),
    },
    {
        name: "Pa' la Muela",
        slug: 'pa-la-muela',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8h1a4 4 0 010 8h-1" />
                <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
        ),
    },
    {
        name: 'Vista a las Raices',
        slug: 'vista-a-las-raices',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
    },
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
                    <span className="blog-hero-badge">Blog</span>
                    <h1 className="blog-hero-title">
                        Viendo México
                    </h1>
                    <p className="blog-hero-subtitle">
                        Redescubre el país a través de nuestra mirada. Lugares, Cultura, sabor y los mexicanos que están moviendo al mundo.
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
                                <span className="category-icon">{cat.icon}</span>
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
                        <h2 className="section-label">Destacados</h2>
                        <div className="featured-grid">
                            {featuredPosts.map((post) => (
                                <article key={post.id} className="featured-card">
                                    <Link href={`/blog/${post.slug}`} className="featured-image-link">
                                        <div className="featured-image" style={{ background: post.gradient }}>
                                            <span style={{ fontSize: '1rem', color: 'white', fontWeight: 700, opacity: 0.6 }}>
                                                {post.category}
                                            </span>
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
                                            <span className="post-read-time"> &middot; {post.readTime} lectura</span>
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
                    <h2 className="section-label">Ultimos Articulos</h2>
                    <div className="posts-grid">
                        {regularPosts.map((post) => (
                            <article key={post.id} className="post-card">
                                <Link href={`/blog/${post.slug}`} className="post-image-link">
                                    <div className="post-image" style={{ background: post.gradient }}>
                                        <span style={{ fontSize: '0.75rem', color: 'white', fontWeight: 600, opacity: 0.6 }}>
                                            {post.category}
                                        </span>
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
                                        <span className="post-read-time"> &middot; {post.readTime}</span>
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
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, marginBottom: '12px' }}>
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <h3>Te late lo mexa?</h3>
                            <p>Suscribete y recibe las mejores historias de Mexico directo a tu inbox.</p>
                        </div>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
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

                .blog-hero {
                    background: linear-gradient(135deg, #152132 0%, #1e293b 100%);
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
                    font-weight: 600;
                    margin-bottom: 16px;
                }

                .blog-hero-title {
                    font-size: clamp(2.5rem, 6vw, 4rem);
                    font-weight: 800;
                    margin: 0 0 16px;
                    letter-spacing: -0.03em;
                }

                .blog-hero-subtitle {
                    font-size: 1.25rem;
                    opacity: 0.7;
                    margin: 0;
                }

                .blog-categories {
                    padding: 20px 0;
                    background: white;
                    border-bottom: 1px solid #eee;
                    position: sticky;
                    top: 60px;
                    z-index: 100;
                }

                .categories-scroll {
                    display: flex;
                    gap: 10px;
                    overflow-x: auto;
                    padding-bottom: 4px;
                    scrollbar-width: none;
                }

                .categories-scroll::-webkit-scrollbar {
                    display: none;
                }

                .category-chip {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 16px;
                    background: #f5f5f7;
                    border-radius: 25px;
                    font-size: 13px;
                    font-weight: 500;
                    color: #333;
                    white-space: nowrap;
                    transition: all 0.2s ease;
                    text-decoration: none;
                }

                .category-chip:hover {
                    background: #152132;
                    color: white;
                }

                .category-icon {
                    display: flex;
                    align-items: center;
                }

                .section-label {
                    font-size: 13px;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin: 0 0 20px;
                }

                .blog-featured {
                    padding: 48px 0;
                }

                .featured-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 24px;
                }
                @media (max-width: 720px) {
                    .featured-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .featured-card {
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .featured-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                }

                .featured-image-link {
                    display: block;
                    position: relative;
                }

                .featured-image {
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .featured-overlay {
                    position: absolute;
                    bottom: 12px;
                    left: 12px;
                }

                .featured-category {
                    padding: 6px 12px;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(8px);
                    color: white;
                    border-radius: 15px;
                    font-size: 11px;
                    font-weight: 600;
                }

                .featured-content {
                    padding: 24px;
                }

                .featured-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0 0 10px;
                    line-height: 1.3;
                }

                .featured-title a {
                    color: #0f172a;
                    text-decoration: none;
                }

                .featured-title a:hover {
                    color: #152132;
                    text-decoration: underline;
                }

                .featured-excerpt {
                    color: #64748b;
                    font-size: 0.9375rem;
                    line-height: 1.6;
                    margin: 0 0 14px;
                }

                .featured-meta, .post-meta {
                    font-size: 0.8125rem;
                    color: #94a3b8;
                }

                .blog-posts {
                    padding: 48px 0;
                }

                .posts-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                }
                @media (max-width: 720px) {
                    .posts-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .post-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 1px 8px rgba(0,0,0,0.04);
                    transition: all 0.3s ease;
                }

                .post-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                }

                .post-image-link {
                    display: block;
                }

                .post-image {
                    height: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .post-content {
                    padding: 20px;
                }

                .post-category {
                    font-size: 11px;
                    font-weight: 700;
                    color: #8A6623;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .post-title {
                    font-size: 1.0625rem;
                    font-weight: 600;
                    margin: 6px 0 10px;
                    line-height: 1.4;
                }

                .post-title a {
                    color: #0f172a;
                    text-decoration: none;
                }

                .post-title a:hover {
                    text-decoration: underline;
                }

                .post-excerpt {
                    color: #64748b;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    margin: 0 0 10px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .blog-newsletter {
                    padding: 48px 0 80px;
                }

                .newsletter-card {
                    background: linear-gradient(135deg, #152132 0%, #1e293b 100%);
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

                .newsletter-content h3 {
                    font-size: 1.5rem;
                    margin: 0 0 8px;
                }

                .newsletter-content p {
                    opacity: 0.7;
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
