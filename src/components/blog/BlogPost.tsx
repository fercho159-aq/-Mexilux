'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { Smartphone } from 'lucide-react';

interface BlogPostProps {
    post: {
        title: string;
        date: string;
        content: string;
        category: string;
        categorySlug: string;
        author: string;
        readTime: string;
        emoji: ReactNode;
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
                            <Smartphone className="inline-block" size={14} /> WhatsApp
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


        </main>
    );
}
