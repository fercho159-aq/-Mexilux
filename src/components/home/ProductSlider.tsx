'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ScrollAnimate } from '@/components/ui/ScrollAnimate';

export interface SliderProduct {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    image: string;
    slug: string;
}

interface Props {
    title: string;
    subtitle?: string;
    products: SliderProduct[];
}

const formatPrice = (price: number) => `$${price.toLocaleString('es-MX')}`;

export default function ProductSlider({ title, subtitle, products }: Props) {
    if (!products.length) return null;

    return (
        <section className="product-slider-section" aria-label={title}>
            <div className="section-container">
                <ScrollAnimate animation="fade-up">
                    <div className="product-slider__header">
                        <h2 className="section-title">{title}</h2>
                        {subtitle && <p className="section-description">{subtitle}</p>}
                    </div>
                </ScrollAnimate>

                <div className="product-slider__track">
                    {products.map((p) => (
                        <Link
                            key={p.id}
                            href={`/catalogo/${p.slug}`}
                            className="product-slider__card"
                        >
                            <div className="product-slider__image">
                                {p.image ? (
                                    <Image
                                        src={p.image}
                                        alt={p.name}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        sizes="(max-width: 768px) 70vw, 280px"
                                    />
                                ) : (
                                    <div className="product-slider__placeholder" />
                                )}
                            </div>
                            <div className="product-slider__info">
                                <span className="product-slider__brand">{p.brand}</span>
                                <h3 className="product-slider__name">{p.name}</h3>
                                <div className="product-slider__price">
                                    <span className="product-slider__price-current">
                                        {formatPrice(p.price)}
                                    </span>
                                    {p.originalPrice && (
                                        <span className="product-slider__price-old">
                                            {formatPrice(p.originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .product-slider-section {
                    padding: 3.5rem 0 2.5rem;
                }
                .product-slider__header {
                    text-align: center;
                    margin-bottom: 1.75rem;
                }
                .product-slider__track {
                    display: flex;
                    gap: 1rem;
                    overflow-x: auto;
                    padding: 0.5rem 1rem 1.5rem;
                    scroll-snap-type: x mandatory;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: thin;
                }
                .product-slider__track::-webkit-scrollbar {
                    height: 6px;
                }
                .product-slider__track::-webkit-scrollbar-thumb {
                    background: rgba(21, 33, 50, 0.2);
                    border-radius: 3px;
                }
                .product-slider__card {
                    flex: 0 0 280px;
                    scroll-snap-align: start;
                    background: #ffffff;
                    border: 1px solid #efefef;
                    border-radius: 16px;
                    padding: 1rem;
                    text-decoration: none;
                    color: inherit;
                    transition: transform 200ms, box-shadow 200ms;
                }
                .product-slider__card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.08);
                }
                .product-slider__image {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 4/3;
                    background: #fafbfc;
                    border-radius: 12px;
                    overflow: hidden;
                    margin-bottom: 0.75rem;
                }
                .product-slider__placeholder {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #eef0f3, #fafbfc);
                }
                .product-slider__info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .product-slider__brand {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #8A6623;
                    font-weight: 600;
                }
                .product-slider__name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #152132;
                    margin: 0;
                }
                .product-slider__price {
                    display: flex;
                    gap: 0.5rem;
                    align-items: baseline;
                    margin-top: 0.25rem;
                }
                .product-slider__price-current {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #152132;
                }
                .product-slider__price-old {
                    font-size: 0.85rem;
                    color: #999;
                    text-decoration: line-through;
                }
                @media (max-width: 768px) {
                    .product-slider__card {
                        flex-basis: 240px;
                    }
                }
            `}</style>
        </section>
    );
}
