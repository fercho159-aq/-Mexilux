-- ═══════════════════════════════════════════════════════════════════════════
-- INSERCIÓN DE PRODUCTO: MAXIMUM Aviator Titanium
-- Armazón tipo piloto de titanio, ligero y flexible
-- ═══════════════════════════════════════════════════════════════════════════

-- NOTA: Ejecuta este script en Neon Console (https://console.neon.tech)
-- La marca MAXIMUM Eye Wear ya existe de la inserción anterior

-- ═══════════════════════════════════════════════════════════════════════════
-- PASO 1: Insertar el armazón piloto (frame)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO frames (
    id,
    name,
    slug,
    short_description,
    full_description,
    brand_id,
    shape,
    material,
    frame_type,
    lens_width,
    lens_height,
    bridge_width,
    temple_length,
    total_width,
    weight,
    gender,
    face_size_recommendation,
    base_price,
    currency,
    supports_graduated_lenses,
    sunglasses_only,
    tags,
    status,
    is_new,
    is_bestseller,
    is_featured,
    created_at,
    updated_at
)
VALUES (
    uuid_generate_v4(),
    'MAXIMUM Aviator',
    'maximum-aviator',
    'Armazón tipo piloto de titanio 100%, ultraligero y flexible',
    'Armazón clásico estilo aviador fabricado en titanio puro al 100%. Su icónico diseño de doble puente combina elegancia atemporal con tecnología moderna. Extremadamente ligero (apenas 12g) y flexible, ofrece máxima comodidad para uso prolongado. El acabado gunmetal le da un toque sofisticado y versátil que combina con cualquier estilo.',
    (SELECT id FROM brands WHERE slug = 'maximum-eye-wear'),
    'aviator',
    'titanium',
    'full_rim',
    57.0,      -- lens_width (mm)
    50.0,      -- lens_height (mm) - estimado
    17.0,      -- bridge_width (mm)
    145.0,     -- temple_length (mm)
    140.0,     -- total_width (mm) - estimado
    12.0,      -- weight (g) - titanio es muy ligero
    'unisex',
    ARRAY['medium', 'large']::face_size[],
    2799.00,   -- precio base en MXN
    'MXN',
    true,      -- soporta lentes graduados
    false,     -- no es solo para sol
    ARRAY['titanio', 'aviator', 'piloto', 'ligero', 'flexible', 'premium', 'clasico']::text[],
    'active',
    true,      -- es nuevo
    false,     -- no es bestseller aún
    true,      -- destacado
    NOW(),
    NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PASO 2: Asociar el armazón con la categoría de lentes oftálmicos
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO frame_categories (frame_id, category_id)
VALUES (
    (SELECT id FROM frames WHERE slug = 'maximum-aviator'),
    (SELECT id FROM categories WHERE slug = 'lentes-oftalmicos')
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PASO 3: Insertar la variante de color (Gunmetal)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO frame_color_variants (
    id,
    frame_id,
    color_name,
    color_hex,
    sku,
    stock_quantity,
    is_default,
    created_at,
    updated_at
)
VALUES (
    uuid_generate_v4(),
    (SELECT id FROM frames WHERE slug = 'maximum-aviator'),
    'Gunmetal',
    '#2A3439',
    'MAX-AVIATOR-GUNMETAL',
    10,
    true,
    NOW(),
    NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PASO 4: Insertar las imágenes del producto
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO frame_images (id, color_variant_id, url, alt, image_type, sort_order, created_at)
VALUES 
(
    uuid_generate_v4(),
    (SELECT id FROM frame_color_variants WHERE sku = 'MAX-AVIATOR-GUNMETAL'),
    '/armazon-2/1.png',
    'MAXIMUM Aviator Titanio Gunmetal - Vista Angular',
    'angle',
    1,
    NOW()
),
(
    uuid_generate_v4(),
    (SELECT id FROM frame_color_variants WHERE sku = 'MAX-AVIATOR-GUNMETAL'),
    '/armazon-2/2.png',
    'MAXIMUM Aviator Titanio Gunmetal - Vista Frontal',
    'front',
    2,
    NOW()
),
(
    uuid_generate_v4(),
    (SELECT id FROM frame_color_variants WHERE sku = 'MAX-AVIATOR-GUNMETAL'),
    '/armazon-2/3.png',
    'MAXIMUM Aviator Titanio Gunmetal - Vista Lateral',
    'side',
    3,
    NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN: Consulta para confirmar que se insertó correctamente
-- ═══════════════════════════════════════════════════════════════════════════
SELECT 
    f.name,
    f.slug,
    f.base_price,
    b.name as brand_name,
    fcv.color_name,
    fcv.sku,
    fi.url as image_url
FROM frames f
JOIN brands b ON f.brand_id = b.id
LEFT JOIN frame_color_variants fcv ON f.id = fcv.frame_id
LEFT JOIN frame_images fi ON fcv.id = fi.color_variant_id
WHERE f.slug = 'maximum-aviator';
