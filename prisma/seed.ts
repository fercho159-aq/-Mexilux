/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SEED - Datos iniciales de prueba para Mexilux
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Ejecutar con: npx prisma db seed
 * O manualmente: npm run db:seed
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...\n');

    // ═══════════════════════════════════════════════════════════════════════════
    // BRANDS
    // ═══════════════════════════════════════════════════════════════════════════
    console.log('📦 Creando marcas...');

    const brands = await Promise.all([
        prisma.brands.upsert({
            where: { slug: 'ray-ban' },
            update: {},
            create: {
                name: 'Ray-Ban',
                slug: 'ray-ban',
                description: 'Marca icónica de lentes desde 1937',
                is_luxury: false,
            },
        }),
        prisma.brands.upsert({
            where: { slug: 'oakley' },
            update: {},
            create: {
                name: 'Oakley',
                slug: 'oakley',
                description: 'Lentes deportivos de alto rendimiento',
                is_luxury: false,
            },
        }),
        prisma.brands.upsert({
            where: { slug: 'gucci' },
            update: {},
            create: {
                name: 'Gucci',
                slug: 'gucci',
                description: 'Lujo italiano en cada detalle',
                is_luxury: true,
            },
        }),
        prisma.brands.upsert({
            where: { slug: 'tom-ford' },
            update: {},
            create: {
                name: 'Tom Ford',
                slug: 'tom-ford',
                description: 'Elegancia contemporánea',
                is_luxury: true,
            },
        }),
        prisma.brands.upsert({
            where: { slug: 'prada' },
            update: {},
            create: {
                name: 'Prada',
                slug: 'prada',
                description: 'Moda italiana de lujo',
                is_luxury: true,
            },
        }),
        prisma.brands.upsert({
            where: { slug: 'carolina-herrera' },
            update: {},
            create: {
                name: 'Carolina Herrera',
                slug: 'carolina-herrera',
                description: 'Elegancia venezolana',
                is_luxury: true,
            },
        }),
    ]);

    console.log(`   ✅ ${brands.length} marcas creadas\n`);

    // ═══════════════════════════════════════════════════════════════════════════
    // CATEGORIES
    // ═══════════════════════════════════════════════════════════════════════════
    console.log('📁 Creando categorías...');

    const categories = await Promise.all([
        prisma.categories.upsert({
            where: { slug: 'lentes-de-sol' },
            update: {},
            create: {
                name: 'Lentes de Sol',
                slug: 'lentes-de-sol',
                sort_order: 1,
            },
        }),
        prisma.categories.upsert({
            where: { slug: 'lentes-oftalmicos' },
            update: {},
            create: {
                name: 'Lentes Oftálmicos',
                slug: 'lentes-oftalmicos',
                sort_order: 2,
            },
        }),
        prisma.categories.upsert({
            where: { slug: 'hombre' },
            update: {},
            create: {
                name: 'Hombre',
                slug: 'hombre',
                sort_order: 3,
            },
        }),
        prisma.categories.upsert({
            where: { slug: 'mujer' },
            update: {},
            create: {
                name: 'Mujer',
                slug: 'mujer',
                sort_order: 4,
            },
        }),
        prisma.categories.upsert({
            where: { slug: 'ninos' },
            update: {},
            create: {
                name: 'Niños',
                slug: 'ninos',
                sort_order: 5,
            },
        }),
    ]);

    console.log(`   ✅ ${categories.length} categorías creadas\n`);

    // ═══════════════════════════════════════════════════════════════════════════
    // FRAMES (PRODUCTOS)
    // ═══════════════════════════════════════════════════════════════════════════
    console.log('👓 Creando monturas (frames)...');

    const rayBan = brands.find(b => b.slug === 'ray-ban')!;
    const oakley = brands.find(b => b.slug === 'oakley')!;
    const gucci = brands.find(b => b.slug === 'gucci')!;
    const tomFord = brands.find(b => b.slug === 'tom-ford')!;
    const prada = brands.find(b => b.slug === 'prada')!;
    const carolinaHerrera = brands.find(b => b.slug === 'carolina-herrera')!;

    const catSol = categories.find(c => c.slug === 'lentes-de-sol')!;
    const catOft = categories.find(c => c.slug === 'lentes-oftalmicos')!;
    const catHombre = categories.find(c => c.slug === 'hombre')!;
    const catMujer = categories.find(c => c.slug === 'mujer')!;

    // Productos de ejemplo
    const framesData = [
        {
            name: 'Aviator Classic',
            slug: 'ray-ban-aviator-classic',
            short_description: 'El icónico estilo aviador que nunca pasa de moda',
            full_description: 'Los lentes Ray-Ban Aviator son un clásico atemporal. Diseñados originalmente para pilotos de la Fuerza Aérea de EE.UU., se han convertido en un símbolo de estilo y sofisticación.',
            brand_id: rayBan.id,
            shape: 'aviator' as const,
            material: 'metal' as const,
            frame_type: 'full_rim' as const,
            lens_width: 58,
            lens_height: 48,
            bridge_width: 14,
            temple_length: 135,
            total_width: 140,
            weight: 26,
            gender: 'unisex' as const,
            base_price: 3499,
            compare_at_price: 4199,
            is_bestseller: true,
            is_featured: true,
            average_rating: 4.8,
            review_count: 234,
            sunglasses_only: true,
            supports_graduated_lenses: false,
            tags: ['aviador', 'clásico', 'piloto', 'metal'],
            categories: [catSol.id, catHombre.id, catMujer.id],
            colors: [
                { name: 'Dorado', hex: '#C9A227', sku: 'RB-AV-GOLD-001', is_default: true, stock: 15 },
                { name: 'Plateado', hex: '#C0C0C0', sku: 'RB-AV-SILV-001', stock: 12 },
                { name: 'Negro', hex: '#000000', sku: 'RB-AV-BLK-001', stock: 20 },
            ],
        },
        {
            name: 'Wayfarer',
            slug: 'ray-ban-wayfarer',
            short_description: 'El clásico moderno por excelencia',
            full_description: 'Ray-Ban Wayfarer es sinónimo de cool desde 1956. Su silueta inconfundible ha sido llevada por celebridades y amantes del estilo durante décadas.',
            brand_id: rayBan.id,
            shape: 'square' as const,
            material: 'acetate' as const,
            frame_type: 'full_rim' as const,
            lens_width: 52,
            lens_height: 44,
            bridge_width: 18,
            temple_length: 150,
            total_width: 145,
            weight: 29,
            gender: 'unisex' as const,
            base_price: 3299,
            is_bestseller: true,
            is_featured: true,
            average_rating: 4.9,
            review_count: 345,
            sunglasses_only: true,
            supports_graduated_lenses: false,
            tags: ['wayfarer', 'clásico', 'acetato', 'cuadrado'],
            categories: [catSol.id, catHombre.id, catMujer.id],
            colors: [
                { name: 'Negro Brillante', hex: '#000000', sku: 'RB-WF-BLK-001', is_default: true, stock: 25 },
                { name: 'Carey', hex: '#8B4513', sku: 'RB-WF-TORT-001', stock: 18 },
            ],
        },
        {
            name: 'Clubmaster',
            slug: 'ray-ban-clubmaster',
            short_description: 'Estilo retro con un toque moderno',
            full_description: 'El Clubmaster combina acetato con metal para un look intelectual y sofisticado que trasciende generaciones.',
            brand_id: rayBan.id,
            shape: 'browline' as const,
            material: 'mixed' as const,
            frame_type: 'full_rim' as const,
            lens_width: 51,
            lens_height: 42,
            bridge_width: 21,
            temple_length: 145,
            total_width: 142,
            weight: 32,
            gender: 'unisex' as const,
            base_price: 3599,
            is_new: true,
            is_featured: true,
            average_rating: 4.7,
            review_count: 156,
            sunglasses_only: false,
            supports_graduated_lenses: true,
            tags: ['clubmaster', 'retro', 'browline', 'mixto'],
            categories: [catOft.id, catHombre.id, catMujer.id],
            colors: [
                { name: 'Negro/Dorado', hex: '#000000', secondary_hex: '#C9A227', sku: 'RB-CM-BLKGLD-001', is_default: true, stock: 20 },
                { name: 'Carey/Negro', hex: '#8B4513', secondary_hex: '#000000', sku: 'RB-CM-TORTBLK-001', stock: 15 },
            ],
        },
        {
            name: 'Holbrook',
            slug: 'oakley-holbrook',
            short_description: 'Diseño clásico para un estilo de vida activo',
            full_description: 'Oakley Holbrook combina un diseño clásico con la tecnología de lentes de alto rendimiento. Perfecto para el día a día y actividades deportivas.',
            brand_id: oakley.id,
            shape: 'square' as const,
            material: 'tr90' as const,
            frame_type: 'full_rim' as const,
            lens_width: 55,
            lens_height: 44,
            bridge_width: 18,
            temple_length: 137,
            total_width: 143,
            weight: 25,
            gender: 'male' as const,
            base_price: 2899,
            is_new: true,
            is_featured: true,
            average_rating: 4.7,
            review_count: 189,
            sunglasses_only: true,
            supports_graduated_lenses: false,
            tags: ['deportivo', 'holbrook', 'cuadrado', 'ligero'],
            categories: [catSol.id, catHombre.id],
            colors: [
                { name: 'Negro Mate', hex: '#1a1a1a', sku: 'OAK-HB-MBLK-001', is_default: true, stock: 22 },
                { name: 'Azul Marino', hex: '#1E40AF', sku: 'OAK-HB-NVY-001', stock: 14 },
            ],
        },
        {
            name: 'GG0061S',
            slug: 'gucci-gg0061s',
            short_description: 'Elegancia italiana con el distintivo Gucci',
            full_description: 'Los lentes Gucci GG0061S representan la máxima expresión del lujo italiano. Fabricados con los mejores materiales y un diseño impecable.',
            brand_id: gucci.id,
            shape: 'cat_eye' as const,
            material: 'acetate' as const,
            frame_type: 'full_rim' as const,
            lens_width: 56,
            lens_height: 46,
            bridge_width: 17,
            temple_length: 140,
            total_width: 145,
            weight: 35,
            gender: 'female' as const,
            base_price: 6999,
            is_bestseller: true,
            is_featured: true,
            average_rating: 4.9,
            review_count: 156,
            sunglasses_only: false,
            supports_graduated_lenses: true,
            tags: ['lujo', 'cat eye', 'acetato', 'elegante'],
            categories: [catOft.id, catMujer.id],
            colors: [
                { name: 'Carey Habana', hex: '#8B4513', sku: 'GUC-0061-HAVN-001', is_default: true, stock: 8 },
                { name: 'Negro', hex: '#000000', sku: 'GUC-0061-BLK-001', stock: 6 },
            ],
        },
        {
            name: 'FT5401',
            slug: 'tom-ford-ft5401',
            short_description: 'Sofisticación moderna con firma Tom Ford',
            full_description: 'Tom Ford FT5401 encarna la esencia del lujo contemporáneo. Líneas limpias y acabados premium para quienes buscan lo mejor.',
            brand_id: tomFord.id,
            shape: 'rectangular' as const,
            material: 'acetate' as const,
            frame_type: 'full_rim' as const,
            lens_width: 53,
            lens_height: 36,
            bridge_width: 17,
            temple_length: 145,
            total_width: 140,
            weight: 28,
            gender: 'male' as const,
            base_price: 5499,
            compare_at_price: 6299,
            is_new: true,
            average_rating: 4.6,
            review_count: 98,
            sunglasses_only: false,
            supports_graduated_lenses: true,
            tags: ['lujo', 'rectangular', 'ejecutivo', 'premium'],
            categories: [catOft.id, catHombre.id],
            colors: [
                { name: 'Negro Brillante', hex: '#000000', sku: 'TF-5401-BLK-001', is_default: true, stock: 10 },
                { name: 'Carey Oscuro', hex: '#654321', sku: 'TF-5401-DKRT-001', stock: 8 },
                { name: 'Azul Noche', hex: '#191970', sku: 'TF-5401-MNVY-001', stock: 5 },
            ],
        },
        {
            name: 'SPR 01W',
            slug: 'prada-spr-01w',
            short_description: 'Geometría audaz con espíritu Prada',
            full_description: 'Prada SPR 01W presenta una silueta geométrica distintiva que captura la esencia de la moda contemporánea italiana.',
            brand_id: prada.id,
            shape: 'geometric' as const,
            material: 'acetate' as const,
            frame_type: 'full_rim' as const,
            lens_width: 54,
            lens_height: 45,
            bridge_width: 19,
            temple_length: 140,
            total_width: 144,
            weight: 30,
            gender: 'female' as const,
            base_price: 4899,
            is_new: true,
            average_rating: 4.7,
            review_count: 87,
            sunglasses_only: false,
            supports_graduated_lenses: true,
            tags: ['geometrico', 'moderno', 'italiano', 'premium'],
            categories: [catOft.id, catMujer.id],
            colors: [
                { name: 'Negro', hex: '#000000', sku: 'PRA-01W-BLK-001', is_default: true, stock: 12 },
                { name: 'Burdeos', hex: '#722F37', sku: 'PRA-01W-BURG-001', stock: 9 },
            ],
        },
        {
            name: 'CH0001',
            slug: 'carolina-herrera-ch0001',
            short_description: 'Elegancia femenina con toques florales',
            full_description: 'Carolina Herrera CH0001 celebra la feminidad con un diseño que combina delicadeza y sofisticación. Ideal para la mujer moderna.',
            brand_id: carolinaHerrera.id,
            shape: 'round' as const,
            material: 'metal' as const,
            frame_type: 'full_rim' as const,
            lens_width: 52,
            lens_height: 48,
            bridge_width: 18,
            temple_length: 140,
            total_width: 138,
            weight: 22,
            gender: 'female' as const,
            base_price: 3899,
            is_featured: true,
            average_rating: 4.8,
            review_count: 67,
            sunglasses_only: false,
            supports_graduated_lenses: true,
            tags: ['redondo', 'elegante', 'femenino', 'ligero'],
            categories: [catOft.id, catMujer.id],
            colors: [
                { name: 'Oro Rosa', hex: '#B76E79', sku: 'CH-0001-RGLD-001', is_default: true, stock: 14 },
                { name: 'Dorado', hex: '#FFD700', sku: 'CH-0001-GLD-001', stock: 11 },
            ],
        },
    ];

    for (const frameData of framesData) {
        const { categories: catIds, colors, ...frameFields } = frameData;

        // Verificar si ya existe
        const existing = await prisma.frames.findUnique({ where: { slug: frameData.slug } });

        if (existing) {
            console.log(`   → Frame "${frameData.name}" ya existe, saltando...`);
            continue;
        }

        const frame = await prisma.frames.create({
            data: {
                ...frameFields,
                lens_width: frameFields.lens_width,
                lens_height: frameFields.lens_height,
                bridge_width: frameFields.bridge_width,
                temple_length: frameFields.temple_length,
                total_width: frameFields.total_width,
                weight: frameFields.weight,
                base_price: frameFields.base_price,
                compare_at_price: frameFields.compare_at_price || null,
                average_rating: frameFields.average_rating,
            },
        });

        // Crear relaciones con categorías
        for (const catId of catIds) {
            await prisma.frame_categories.create({
                data: {
                    frame_id: frame.id,
                    category_id: catId,
                },
            });
        }

        // Crear variantes de color
        for (const color of colors) {
            const variant = await prisma.frame_color_variants.create({
                data: {
                    frame_id: frame.id,
                    color_name: color.name,
                    color_hex: color.hex,
                    secondary_color_hex: (color as any).secondary_hex || null,
                    sku: color.sku,
                    stock_quantity: color.stock,
                    is_default: color.is_default || false,
                },
            });

            // Crear imagen placeholder
            await prisma.frame_images.create({
                data: {
                    color_variant_id: variant.id,
                    url: `/images/products/${frameData.slug}-${color.hex.replace('#', '')}.jpg`,
                    alt: `${frameData.name} - ${color.name}`,
                    image_type: 'front',
                    sort_order: 0,
                },
            });
        }

        console.log(`   ✅ Frame "${frameData.name}" creado con ${colors.length} colores`);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LENS MATERIALS
    // ═══════════════════════════════════════════════════════════════════════════
    console.log('\n💎 Creando materiales de lentes...');

    const materials = [
        { name: 'CR-39 Estándar', lens_index: '1.50', price: 0, thinness_factor: 1, high_prescription_suitable: false, max_sphere_recommended: 2.00 },
        { name: 'Policarbonato', lens_index: '1.59', price: 400, thinness_factor: 2, is_polycarbonate: true, has_uv_protection: true, high_prescription_suitable: false, max_sphere_recommended: 4.00 },
        { name: 'Alto Índice 1.60', lens_index: '1.60', price: 800, thinness_factor: 3, has_uv_protection: true, high_prescription_suitable: true, max_sphere_recommended: 6.00 },
        { name: 'Alto Índice 1.67', lens_index: '1.67', price: 1200, thinness_factor: 4, has_uv_protection: true, high_prescription_suitable: true, max_sphere_recommended: 10.00 },
        { name: 'Ultra Delgado 1.74', lens_index: '1.74', price: 1800, thinness_factor: 5, has_uv_protection: true, high_prescription_suitable: true, max_sphere_recommended: 15.00 },
    ];

    for (let i = 0; i < materials.length; i++) {
        const mat = materials[i];
        await prisma.lens_materials.upsert({
            where: { id: `00000000-0000-0000-0000-00000000000${i + 1}` },
            update: {},
            create: {
                name: mat.name,
                lens_index: mat.lens_index,
                price: mat.price,
                thinness_factor: mat.thinness_factor,
                is_polycarbonate: mat.is_polycarbonate || false,
                has_uv_protection: mat.has_uv_protection || false,
                high_prescription_suitable: mat.high_prescription_suitable || false,
                max_sphere_recommended: mat.max_sphere_recommended,
                sort_order: i + 1,
                is_active: true,
            },
        });
    }

    console.log(`   ✅ ${materials.length} materiales creados\n`);

    // ═══════════════════════════════════════════════════════════════════════════
    // LENS TREATMENTS
    // ═══════════════════════════════════════════════════════════════════════════
    console.log('✨ Creando tratamientos de lentes...');

    const treatments = [
        { name: 'Antirreflejante Básico', short_name: 'AR Básico', category: 'coating' as const, price: 300, is_popular: true, benefits: ['Reduce reflejos', 'Mejor visión nocturna'] },
        { name: 'Antirreflejante Premium', short_name: 'AR Premium', category: 'coating' as const, price: 600, is_popular: true, benefits: ['Súper hidrofóbico', 'Fácil limpieza', 'Anti-rayas'] },
        { name: 'Filtro Luz Azul', short_name: 'Blue Block', category: 'blue_light' as const, price: 400, is_popular: true, benefits: ['Reduce fatiga visual', 'Mejor sueño', 'Ideal para pantallas'] },
        { name: 'Fotocromático', short_name: 'Transitions', category: 'photochromic' as const, price: 1500, is_popular: true, benefits: ['Se oscurece con el sol', '100% UV', 'Todo en uno'] },
        { name: 'Polarizado', short_name: 'Polarizado', category: 'polarized' as const, price: 800, is_popular: false, benefits: ['Elimina deslumbramiento', 'Ideal para conducir', 'Colores más vivos'] },
        { name: 'Tinte Degradado', short_name: 'Degradado', category: 'tint' as const, price: 300, is_popular: false, benefits: ['Estilo único', 'Reducción de luz', 'Múltiples colores'] },
    ];

    for (let i = 0; i < treatments.length; i++) {
        const treat = treatments[i];
        await prisma.lens_treatments.upsert({
            where: { id: `10000000-0000-0000-0000-00000000000${i + 1}` },
            update: {},
            create: {
                name: treat.name,
                short_name: treat.short_name,
                category: treat.category,
                price: treat.price,
                is_popular: treat.is_popular,
                benefits: treat.benefits,
                sort_order: i + 1,
                is_active: true,
            },
        });
    }

    console.log(`   ✅ ${treatments.length} tratamientos creados\n`);

    console.log('════════════════════════════════════════');
    console.log('🎉 Seed completado exitosamente!');
    console.log('════════════════════════════════════════\n');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Error en seed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
