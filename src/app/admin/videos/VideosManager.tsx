'use client';

import { useState } from 'react';
import { Check, Pencil, Eye, Trash2 } from 'lucide-react';

interface UGCVideo {
    id: string;
    name: string;
    video_url: string;
    thumbnail_url: string | null;
    is_verified: boolean;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

interface VideosManagerProps {
    initialVideos: UGCVideo[];
}

const emptyForm = {
    name: '',
    video_url: '',
    thumbnail_url: '',
    is_verified: false,
    sort_order: 0,
    is_active: true,
};

export default function VideosManager({ initialVideos }: VideosManagerProps) {
    const [videos, setVideos] = useState<UGCVideo[]>(initialVideos);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    const openCreate = () => {
        setForm({ ...emptyForm, sort_order: videos.length });
        setEditingId(null);
        setShowForm(true);
    };

    const openEdit = (video: UGCVideo) => {
        setForm({
            name: video.name,
            video_url: video.video_url,
            thumbnail_url: video.thumbnail_url || '',
            is_verified: video.is_verified,
            sort_order: video.sort_order,
            is_active: video.is_active,
        });
        setEditingId(video.id);
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.video_url.trim()) return;
        setLoading(true);

        try {
            const body = {
                name: form.name.trim(),
                video_url: form.video_url.trim(),
                thumbnail_url: form.thumbnail_url.trim() || null,
                is_verified: form.is_verified,
                sort_order: form.sort_order,
                is_active: form.is_active,
            };

            if (editingId) {
                const res = await fetch(`/api/admin/ugc-videos/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                if (res.ok) {
                    const { video } = await res.json();
                    setVideos(prev => prev.map(v => v.id === editingId ? video : v));
                }
            } else {
                const res = await fetch('/api/admin/ugc-videos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                if (res.ok) {
                    const { video } = await res.json();
                    setVideos(prev => [...prev, video]);
                }
            }
            resetForm();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este video?')) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/ugc-videos/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setVideos(prev => prev.filter(v => v.id !== id));
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (video: UGCVideo) => {
        const res = await fetch(`/api/admin/ugc-videos/${video.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...video, is_active: !video.is_active }),
        });
        if (res.ok) {
            const { video: updated } = await res.json();
            setVideos(prev => prev.map(v => v.id === video.id ? updated : v));
        }
    };

    const activeCount = videos.filter(v => v.is_active).length;

    return (
        <>
            {/* Stats */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1, padding: '16px 20px', background: '#fff', borderRadius: '10px', border: '1px solid #e8ecf1' }}>
                    <div style={{ fontSize: '12px', color: '#8c98a4', textTransform: 'uppercase', fontWeight: 600 }}>Total Videos</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e1e2d' }}>{videos.length}</div>
                </div>
                <div style={{ flex: 1, padding: '16px 20px', background: '#fff', borderRadius: '10px', border: '1px solid #e8ecf1' }}>
                    <div style={{ fontSize: '12px', color: '#8c98a4', textTransform: 'uppercase', fontWeight: 600 }}>Activos</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#1bc5bd' }}>{activeCount}</div>
                </div>
                <div style={{ flex: 1, padding: '16px 20px', background: '#fff', borderRadius: '10px', border: '1px solid #e8ecf1' }}>
                    <div style={{ fontSize: '12px', color: '#8c98a4', textTransform: 'uppercase', fontWeight: 600 }}>Inactivos</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#f64e60' }}>{videos.length - activeCount}</div>
                </div>
            </div>

            {/* Header */}
            <header className="admin-page-header">
                <h1 className="admin-page-title">Videos UGC</h1>
                <button
                    onClick={openCreate}
                    style={{ padding: '10px 20px', background: '#3699ff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                    + Nuevo Video
                </button>
            </header>

            {/* Form Modal */}
            {showForm && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '14px', padding: '28px',
                        width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto',
                    }}>
                        <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 700, color: '#1e1e2d' }}>
                            {editingId ? 'Editar Video' : 'Nuevo Video'}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={labelStyle}>Nombre del creador *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Ej: María López"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>URL del video *</label>
                                <input
                                    type="url"
                                    value={form.video_url}
                                    onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
                                    placeholder="https://..."
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>URL del thumbnail</label>
                                <input
                                    type="url"
                                    value={form.thumbnail_url}
                                    onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                                    placeholder="https://... (opcional)"
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Orden</label>
                                    <input
                                        type="number"
                                        value={form.sort_order}
                                        onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ ...labelStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '22px' }}>
                                        <input
                                            type="checkbox"
                                            checked={form.is_verified}
                                            onChange={e => setForm(f => ({ ...f, is_verified: e.target.checked }))}
                                            style={{ width: '16px', height: '16px' }}
                                        />
                                        Verificado
                                    </label>
                                    <label style={{ ...labelStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="checkbox"
                                            checked={form.is_active}
                                            onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                                            style={{ width: '16px', height: '16px' }}
                                        />
                                        Activo
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
                            <button onClick={resetForm} style={{ padding: '10px 20px', background: '#f3f6f9', color: '#5e6278', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading || !form.name.trim() || !form.video_url.trim()}
                                style={{
                                    padding: '10px 24px', background: loading ? '#93c5fd' : '#3699ff', color: 'white',
                                    border: 'none', borderRadius: '6px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
                                }}
                            >
                                {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Preview Modal */}
            {previewUrl && (
                <div
                    onClick={() => setPreviewUrl(null)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}
                >
                    <video
                        src={previewUrl}
                        controls
                        autoPlay
                        style={{ maxWidth: '400px', maxHeight: '80vh', borderRadius: '14px' }}
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Table */}
            <div className="admin-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>Preview</th>
                            <th>Nombre</th>
                            <th>URL</th>
                            <th style={{ width: '80px' }}>Orden</th>
                            <th style={{ width: '90px' }}>Verificado</th>
                            <th style={{ width: '80px' }}>Estado</th>
                            <th style={{ width: '120px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.map((video) => (
                            <tr key={video.id}>
                                <td>
                                    <button
                                        onClick={() => setPreviewUrl(video.video_url)}
                                        style={{
                                            width: '48px', height: '48px', borderRadius: '8px',
                                            background: video.thumbnail_url ? `url(${video.thumbnail_url}) center/cover` : '#1e1e2d',
                                            border: 'none', cursor: 'pointer', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', position: 'relative',
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ opacity: 0.9 }}>
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                    </button>
                                </td>
                                <td>
                                    <strong style={{ display: 'block', fontSize: '13px' }}>{video.name}</strong>
                                    {video.is_verified && (
                                        <span style={{ fontSize: '10px', color: '#3699ff', fontWeight: 600 }}>
                                            <Check size={14} /> Verificado
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <span style={{
                                        fontSize: '12px', color: '#8c98a4', maxWidth: '200px',
                                        display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    }}>
                                        {video.video_url}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center', fontWeight: 600 }}>{video.sort_order}</td>
                                <td style={{ textAlign: 'center' }}>
                                    {video.is_verified ? (
                                        <span style={{ color: '#3699ff', fontSize: '16px' }}><Check size={14} /></span>
                                    ) : (
                                        <span style={{ color: '#ccc' }}>—</span>
                                    )}
                                </td>
                                <td>
                                    <button
                                        onClick={() => toggleActive(video)}
                                        className={`badge ${video.is_active ? 'badge-active' : 'badge-draft'}`}
                                        style={{ border: 'none', cursor: 'pointer' }}
                                    >
                                        {video.is_active ? 'Activo' : 'Inactivo'}
                                    </button>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-icon" title="Editar" onClick={() => openEdit(video)}><Pencil size={14} /></button>
                                        <button className="btn-icon" title="Preview" onClick={() => setPreviewUrl(video.video_url)}><Eye size={14} /></button>
                                        <button className="btn-icon delete" title="Eliminar" onClick={() => handleDelete(video.id)}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {videos.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#8c98a4' }}>
                                    <div style={{ marginBottom: '8px' }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                                            <polygon points="23 7 16 12 23 17 23 7" />
                                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                        </svg>
                                    </div>
                                    No hay videos. Agrega el primero.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#5e6278',
    marginBottom: '6px',
    textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e4e6ef',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
};
