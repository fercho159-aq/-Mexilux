'use client';

import Link from 'next/link';

interface BlogPostProps {
    post: {
        title: string;
        date: string;
        content: string;
        category: string;
        categorySlug: string;
        author: string;
        readTime: string;
        emoji: string;
        slug: string;
    };
    relatedPosts: any[];
}

export default function BlogPost({ post, relatedPosts }: BlogPostProps) {
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
