'use client';

import { useState, useRef } from 'react';

interface ImageUploaderProps {
    productSlug?: string;
    currentImages?: string[];
    onImagesChange: (images: string[]) => void;
}

export function ImageUploader({ productSlug = 'product', currentImages = [], onImagesChange }: ImageUploaderProps) {
    const [images, setImages] = useState<string[]>(currentImages);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        const newImages: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('productSlug', productSlug);

            try {
                const res = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (res.ok) {
                    const data = await res.json();
                    newImages.push(data.url);
                } else {
                    const error = await res.json();
                    alert(`Error subiendo ${file.name}: ${error.error}`);
                }
            } catch (error) {
                alert(`Error de conexión subiendo ${file.name}`);
            }
        }

        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImagesChange(updatedImages);
        setUploading(false);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleUpload(e.dataTransfer.files);
    };

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        onImagesChange(updatedImages);
    };

    return (
        <div>
            {/* Image Grid */}
            {images.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem'
                }}>
                    {images.map((img, index) => (
                        <div
                            key={index}
                            style={{
                                position: 'relative',
                                aspectRatio: '1',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: index === 0 ? '3px solid #3699ff' : '1px solid #e0e0e0',
                            }}
                        >
                            <img
                                src={img}
                                alt={`Producto ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {index === 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '5px',
                                    left: '5px',
                                    background: '#3699ff',
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                }}>
                                    Principal
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    background: '#f64e60',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                style={{
                    border: `2px dashed ${dragActive ? '#3699ff' : '#d0d0d0'}`,
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: dragActive ? '#f0f7ff' : '#fafafa',
                    transition: 'all 0.2s ease',
                }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleUpload(e.target.files)}
                    style={{ display: 'none' }}
                />

                {uploading ? (
                    <div>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                        <p style={{ margin: 0, color: '#666' }}>Subiendo imágenes...</p>
                    </div>
                ) : (
                    <div>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                        <p style={{ margin: 0, color: '#666', fontWeight: 500 }}>
                            Arrastra imágenes aquí o haz clic para seleccionar
                        </p>
                        <p style={{ margin: '0.5rem 0 0', color: '#999', fontSize: '0.85rem' }}>
                            Formatos: JPEG, PNG, WebP, GIF • Máximo 5MB por imagen
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
