'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function ProductFilters({ brands }: { brands: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="admin-filters-bar">
            <select
                className="admin-select"
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                defaultValue={searchParams.get('brand') || ''}
            >
                <option value="">Todas las marcas</option>
                {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                ))}
            </select>

            <select
                className="admin-select"
                onChange={(e) => handleFilterChange('status', e.target.value)}
                defaultValue={searchParams.get('status') || ''}
            >
                <option value="">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="draft">Borrador</option>
                <option value="out_of_stock">Sin stock</option>
            </select>
        </div>
    );
}
