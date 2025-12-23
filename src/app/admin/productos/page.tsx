import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';
import prisma from '@/lib/db/prisma';
import Link from 'next/link';
import { AdminSidebar } from '../dashboard/AdminSidebar';
import { ProductFilters } from './ProductFilters';
import { ProductActions } from './ProductActions';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminProductosPage({ searchParams }: PageProps) {
    const session = await getAdminSession();

    if (!session) {
        redirect('/admin/login');
    }

    const params = await searchParams;
    const brandFilter = params.brand as string | undefined;
    const statusFilter = params.status as string | undefined;

    // Build prisma query
    const where: any = {};
    if (brandFilter) where.brand = { name: brandFilter };
    if (statusFilter) where.status = statusFilter;

    // Fetch data
    const [products, brands] = await Promise.all([
        prisma.frames.findMany({
            where,
            include: {
                brand: true,
                frame_color_variants: {
                    take: 1, // Only need one to check stock
                }
            },
            orderBy: { created_at: 'desc' },
        }),
        prisma.brands.findMany({ select: { name: true } })
    ]);

    return (
        <div className="admin-layout">
            <AdminSidebar session={session} />

            <main className="admin-main">
                <div className="admin-content">
                    <header className="admin-page-header">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <h1 className="admin-page-title">Todos los Productos</h1>
                            <p style={{ color: '#b5b5c3', fontSize: '0.9rem', margin: 0 }}>
                                {products.length} productos encontrados
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <ProductFilters brands={brands.map(b => b.name)} />

                            <Link
                                href="/admin/productos/nuevo"
                                className="admin-select"
                                style={{
                                    backgroundColor: '#3699ff',
                                    color: 'white',
                                    border: 'none',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 600
                                }}
                            >
                                + Nuevo Producto
                            </Link>
                        </div>
                    </header>

                    <div className="admin-card">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '30%' }}>Producto</th>
                                    <th style={{ width: '15%' }}>Marca</th>
                                    <th style={{ width: '15%' }}>Precio</th>
                                    <th style={{ width: '15%' }}>Stock</th>
                                    <th style={{ width: '10%' }}>Estado</th>
                                    <th style={{ width: '15%' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                                            No se encontraron productos con los filtros seleccionados
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => {
                                        const price = Number(product.base_price);
                                        const comparePrice = product.compare_at_price ? Number(product.compare_at_price) : null;
                                        const stock = product.frame_color_variants.reduce((acc, v) => acc + v.stock_quantity, 0);

                                        // Stock status class
                                        const stockClass = stock > 20 ? 'stock-high' : stock > 5 ? 'stock-medium' : 'stock-low';

                                        // Status Badge config
                                        let badgeClass = 'badge-draft';
                                        let statusLabel: string = product.status;
                                        if (product.status === 'active') { badgeClass = 'badge-active'; statusLabel = 'Activo'; }
                                        if (product.status === 'out_of_stock') { badgeClass = 'badge-out'; statusLabel = 'Sin Stock'; }

                                        return (
                                            <tr key={product.id}>
                                                <td>
                                                    <div className="col-product">
                                                        <div className="product-icon">
                                                            {product.sunglasses_only ? '🕶️' : '👓'}
                                                        </div>
                                                        <div className="product-info">
                                                            <span className="product-name">{product.name}</span>
                                                            <span className="product-slug">{product.slug}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{product.brand.name}</td>
                                                <td>
                                                    <div className="col-price">
                                                        <span className="text-price">${price.toLocaleString('es-MX')}</span>
                                                        {comparePrice && (
                                                            <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#b5b5c3' }}>
                                                                ${comparePrice.toLocaleString('es-MX')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={stockClass}>
                                                        {stock} unidades
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${badgeClass}`}>
                                                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                                                        {statusLabel}
                                                    </span>
                                                </td>
                                                <td>
                                                    <ProductActions productId={product.id} productSlug={product.slug} />
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
