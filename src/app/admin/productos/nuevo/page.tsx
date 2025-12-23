'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../../admin/admin.css';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface Brand {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
}

export default function NuevoProductoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        brand_id: '',
        category_id: '',
        base_price: '',
        compare_at_price: '',
        description: '',
        frame_material: 'acetate',
        frame_shape: 'rectangular',
        gender: 'unisex',
        status: 'draft',
        sunglasses_only: false,
        is_featured: false,
        images: [] as string[],
    });

    useEffect(() => {
        // Fetch brands and categories
        fetch('/api/admin/brands').then(res => res.json()).then(data => setBrands(data.brands || []));
        fetch('/api/admin/categories').then(res => res.json()).then(data => setCategories(data.categories || []));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const generateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/productos');
            } else {
                const data = await res.json();
                alert('Error: ' + (data.error || 'No se pudo crear el producto'));
            }
        } catch (error) {
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-layout" style={{ paddingLeft: '265px' }}>
            <main className="admin-main" style={{ marginLeft: 0 }}>
                <div className="admin-content">
                    <header className="admin-page-header">
                        <div>
                            <Link href="/admin/productos" style={{ color: '#3699ff', textDecoration: 'none', fontSize: '0.85rem' }}>
                                ← Volver a productos
                            </Link>
                            <h1 className="admin-page-title" style={{ marginTop: '0.5rem' }}>Nuevo Producto</h1>
                        </div>
                    </header>

                    <form onSubmit={handleSubmit}>
                        <div className="admin-card" style={{ padding: '2rem' }}>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Información Básica</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#3f4254' }}>
                                        Nombre del Producto *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={generateSlug}
                                        required
                                        className="admin-select"
                                        style={{ width: '100%', padding: '10px 12px' }}
                                        placeholder="Ej: Ray-Ban Aviator Classic"
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#3f4254' }}>
                                        Slug (URL) *
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        required
                                        className="admin-select"
                                        style={{ width: '100%', padding: '10px 12px' }}
                                        placeholder="ray-ban-aviator-classic"
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#3f4254' }}>
                                        Marca *
                                    </label>
                                    <select
                                        name="brand_id"
                                        value={formData.brand_id}
                                        onChange={handleChange}
                                        required
                                        className="admin-select"
                                        style={{ width: '100%', padding: '10px 12px' }}
                                    >
                                        <option value="">Seleccionar marca...</option>
                                        {brands.map(brand => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#3f4254' }}>
                                        Categoría *
                                    </label>
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        required
                                        className="admin-select"
                                        style={{ width: '100%', padding: '10px 12px' }}
                                    >
                                        <option value="">Seleccionar categoría...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#3f4254' }}>
                                        Precio Base (MXN) *
                                    </label>
                                    <input
                                        type="number"
                                        name="base_price"
                                        value={formData.base_price}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="admin-select"
                                        style={{ width: '100%', padding: '10px 12px' }}
                                        placeholder="3499.00"
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#3f4254' }}>
                                        Precio Comparación (opcional)
                                    </label>
                                    <input
                                        type="number"
                                        name="compare_at_price"
                                        value={formData.compare_at_price}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        className="admin-select"
                                        style={{ width: '100%', padding: '10px 12px' }}
                                        placeholder="4299.00"
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#3f4254' }}>
                                    Descripción
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="admin-select"
                                    style={{ width: '100%', padding: '10px 12px', resize: 'vertical' }}
                                    placeholder="Describe el producto..."
                                />
                            </div>
                        </div>

                        <div className="admin-card" style={{ padding: '2rem', marginTop: '1.5rem' }}>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Imágenes del Producto</h2>
                            <p style={{ color: '#7e8299', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                La primera imagen será la imagen principal del producto. Puedes arrastrar para reordenar.
                            </p>
                            <ImageUploader
                                productSlug={formData.slug || 'nuevo-producto'}
                                currentImages={formData.images}
                                onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                            />
                        </div>
                        <div className="admin-card" style={{ padding: '2rem', marginTop: '1.5rem' }}>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Características</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#3f4254' }}>
                                        Material
                                    </label>
                                    <select name="frame_material" value={formData.frame_material} onChange={handleChange} className="admin-select" style={{ width: '100%', padding: '10px 12px' }}>
                                        <option value="acetate">Acetato</option>
                                        <option value="metal">Metal</option>
                                        <option value="titanium">Titanio</option>
                                        <option value="mixed">Mixto</option>
                                        <option value="plastic">Plástico</option>
                                        <option value="wood">Madera</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#3f4254' }}>
                                        Forma
                                    </label>
                                    <select name="frame_shape" value={formData.frame_shape} onChange={handleChange} className="admin-select" style={{ width: '100%', padding: '10px 12px' }}>
                                        <option value="rectangular">Rectangular</option>
                                        <option value="square">Cuadrado</option>
                                        <option value="round">Redondo</option>
                                        <option value="oval">Ovalado</option>
                                        <option value="aviator">Aviador</option>
                                        <option value="cat_eye">Cat Eye</option>
                                        <option value="wayfarer">Wayfarer</option>
                                        <option value="clubmaster">Clubmaster</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#3f4254' }}>
                                        Género
                                    </label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="admin-select" style={{ width: '100%', padding: '10px 12px' }}>
                                        <option value="unisex">Unisex</option>
                                        <option value="male">Mexicano</option>
                                        <option value="female">Mexicana</option>
                                        <option value="kids">Niños</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="admin-card" style={{ padding: '2rem', marginTop: '1.5rem' }}>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Estado y Visibilidad</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#3f4254' }}>
                                        Estado
                                    </label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="admin-select" style={{ width: '100%', padding: '10px 12px' }}>
                                        <option value="draft">Borrador</option>
                                        <option value="active">Activo</option>
                                        <option value="out_of_stock">Sin Stock</option>
                                    </select>
                                </div>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="sunglasses_only"
                                        checked={formData.sunglasses_only}
                                        onChange={handleChange}
                                        style={{ width: 18, height: 18 }}
                                    />
                                    <span style={{ fontWeight: 500, color: '#3f4254' }}>Solo Lentes de Sol</span>
                                </label>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleChange}
                                        style={{ width: 18, height: 18 }}
                                    />
                                    <span style={{ fontWeight: 500, color: '#3f4254' }}>Destacado</span>
                                </label>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <Link
                                href="/admin/productos"
                                style={{
                                    padding: '10px 20px',
                                    background: '#f3f6f9',
                                    color: '#7e8299',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    fontWeight: 500
                                }}
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '10px 24px',
                                    background: '#3699ff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 600,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'Guardando...' : 'Crear Producto'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
