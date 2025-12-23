'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GalleryImage {
    url: string;
    alt: string | null;
}

interface ProductGalleryProps {
    images: GalleryImage[];
    productName: string;
    discount?: number;
}

export default function ProductGallery({ images, productName, discount }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const currentImage = images[selectedIndex];

    return (
        <section className="product-gallery" aria-label="Galería de imágenes">
            <div className="gallery-main">
                <div className="gallery-image">
                    {currentImage?.url ? (
                        <Image
                            src={currentImage.url}
                            alt={currentImage.alt || productName}
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    ) : (
                        <span className="gallery-emoji" aria-hidden="true">👓</span>
                    )}
                </div>
                {discount && discount > 0 && (
                    <span className="gallery-badge">-{discount}%</span>
                )}
            </div>

            {images.length > 1 && (
                <div className="gallery-thumbnails">
                    {images.map((image, idx) => (
                        <button
                            key={idx}
                            className={`thumbnail ${idx === selectedIndex ? 'active' : ''}`}
                            aria-label={image.alt || `Imagen ${idx + 1}`}
                            onClick={() => setSelectedIndex(idx)}
                            style={{
                                border: idx === selectedIndex ? '2px solid #0071e3' : '2px solid transparent',
                                opacity: idx === selectedIndex ? 1 : 0.7,
                            }}
                        >
                            {image.url ? (
                                <Image
                                    src={image.url}
                                    alt={image.alt || ''}
                                    width={60}
                                    height={60}
                                    style={{ objectFit: 'contain' }}
                                />
                            ) : (
                                <span>👓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}
