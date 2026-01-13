import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_VIDEOS = [
    {
        name: 'Jennifer',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4',
        thumbnail_url: null,
        is_verified: true,
        sort_order: 1,
        is_active: true,
    },
    {
        name: 'Carlos',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-under-multicolored-lights-1237-large.mp4',
        thumbnail_url: null,
        is_verified: true,
        sort_order: 2,
        is_active: true,
    },
    {
        name: 'María',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-modeling-looking-at-the-camera-39881-large.mp4',
        thumbnail_url: null,
        is_verified: false,
        sort_order: 3,
        is_active: true,
    },
];

async function main() {
    console.log('🎬 Seeding UGC videos...');

    for (const video of SEED_VIDEOS) {
        await prisma.ugc_videos.upsert({
            where: { id: video.name }, // Will fail, forcing create
            update: {},
            create: video,
        });
        console.log(`  ✅ Created: ${video.name}`);
    }

    // Just create them all
    await prisma.ugc_videos.deleteMany({});
    await prisma.ugc_videos.createMany({
        data: SEED_VIDEOS,
    });

    console.log('🎬 UGC videos seeded successfully!');
}

main()
    .catch((e) => {
        console.error('Error seeding UGC videos:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
