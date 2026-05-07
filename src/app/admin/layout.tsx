import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';
import type { Metadata } from 'next';
import './admin.css';

export const metadata: Metadata = {
    title: 'Admin | Mexilux',
    robots: 'noindex, nofollow',
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check if on login page
    const session = await getAdminSession();

    return (
        <div className="admin-layout">
            {children}
        </div>
    );
}
