'use client';

import Link from 'next/link';
import { deleteProduct } from './actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductActionsProps {
    productId: string;
    productSlug: string;
}

export function ProductActions({ productId, productSlug }: ProductActionsProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteProduct(productId);
            if (result.success) {
                router.refresh();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            alert('Ocurrió un error inesperado al eliminar');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="action-buttons">
            <Link
                href={`/admin/productos/${productId}`}
                className="btn-icon"
                title="Editar"
            >
                ✏️
            </Link>

            <Link
                href={`/catalogo/${productSlug}`}
                target="_blank"
                className="btn-icon"
                title="Ver en tienda"
            >
                👁️
            </Link>

            <button
                className="btn-icon delete"
                title="Eliminar"
                onClick={handleDelete}
                disabled={isDeleting}
                style={{ opacity: isDeleting ? 0.5 : 1 }}
            >
                {isDeleting ? '⏳' : '🗑️'}
            </button>
        </div>
    );
}
