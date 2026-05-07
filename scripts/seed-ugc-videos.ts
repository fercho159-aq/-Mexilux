import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_VIDEOS = [
    {
        name: 'Jennifer',
        video_url: 'https://videos.pexels.com/video-files/5530915/5530915-uhd_1440_2560_25fps.mp4',
        thumbnail_url: 'https://images.pexels.com/videos/5530915/pexels-photo-5530915.jpeg?auto=compress&cs=tinysrgb&w=400',
        is_verified: true,
        sort_order: 1,
        is_active: true,
    },
    {
        name: 'Carlos',
        video_url: 'https://videos.pexels.com/video-files/5530903/5530903-uhd_1440_2560_25fps.mp4',
        thumbnail_url: 'https://images.pexels.com/videos/5530903/pexels-photo-5530903.jpeg?auto=compress&cs=tinysrgb&w=400',
        is_verified: true,
        sort_order: 2,
        is_active: true,
    },
    {
        name: 'María',
        video_url: 'https://videos.pexels.com/video-files/5530908/5530908-uhd_1440_2560_25fps.mp4',
        thumbnail_url: 'https://images.pexels.com/videos/5530908/pexels-photo-5530908.jpeg?auto=compress&cs=tinysrgb&w=400',
        is_verified: false,
        sort_order: 3,
        is_active: true,
    },
];

async function main() {
    console.log('🎬 Seeding UGC videos...');

    // Delete existing and create new
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
