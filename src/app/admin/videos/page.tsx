import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';
import prisma from '@/lib/db/prisma';
import { AdminSidebar } from '../dashboard/AdminSidebar';
import VideosManager from './VideosManager';
import '../admin.css';

export default async function AdminVideosPage() {
    const session = await getAdminSession();
    if (!session) redirect('/admin/login');

    const videos = await prisma.ugc_videos.findMany({
        orderBy: { sort_order: 'asc' },
    });

    const serialized = videos.map(v => ({
        ...v,
        id: v.id,
        created_at: v.created_at.toISOString(),
        updated_at: v.updated_at.toISOString(),
    }));

    return (
        <div className="admin-layout">
            <AdminSidebar session={session} />
            <main className="admin-main">
                <div className="admin-content">
                    <VideosManager initialVideos={serialized} />
                </div>
            </main>
        </div>
    );
}
