import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/admin';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dsoaglio6',
    api_key: process.env.CLOUDINARY_API_KEY || '432274618142451',
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    const session = await getAdminSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const productSlug = formData.get('productSlug') as string || 'product';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
            }, { status: 400 });
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'mexilux/products',
            public_id: `${productSlug}-${Date.now()}`,
            resource_type: 'image',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' }, // Max dimensions
                { quality: 'auto:best' }, // Automatic quality optimization
                { fetch_format: 'auto' }, // Automatic format (WebP when supported)
            ],
        });

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
    }
}

// Delete image from Cloudinary
export async function DELETE(request: Request) {
    const session = await getAdminSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { publicId } = await request.json();

        if (!publicId) {
            return NextResponse.json({ error: 'No publicId provided' }, { status: 400 });
        }

        await cloudinary.uploader.destroy(publicId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json({ error: 'Error deleting file' }, { status: 500 });
    }
}
