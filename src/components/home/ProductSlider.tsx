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

        </section>
    );
}
