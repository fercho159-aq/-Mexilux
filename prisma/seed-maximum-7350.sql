-- ═══════════════════════════════════════════════════════════════════════════
-- INSERCIÓN DE PRODUCTO: MAXIMUM Eye Wear 7350
-- Armazón cuadrado de titanio, ligero y flexible
-- ═══════════════════════════════════════════════════════════════════════════

-- NOTA: Ejecuta estos scripts en tu consola de Neon (https://console.neon.tech)
-- en el orden indicado.

-- ═══════════════════════════════════════════════════════════════════════════
-- PASO 1: Insertar la marca (si no existe)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO brands (id, name, slug, description, is_luxury, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'MAXIMUM Eye Wear',
    'maximum-eye-wear',
    'Armazones premium de titanio 100%. Diseño elegante, ligero y flexible.',
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- PASO 2: Verificar que existe la categoría para lentes oftálmicos
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO categories (id, name, slug, sort_order, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'Lentes Oftálmicos',
    'lentes-oftalmicos',
    1,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- PASO 3: Insertar el armazón (frame)
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
    compare_at_price,
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
    'MAXIMUM 7350',
    'maximum-7350',
    'Armazón cuadrado de titanio 100%, esquinas redondeadas',
    'Armazón premium fabricado en titanio 100%. Su diseño cuadrado con esquinas suavemente redondeadas ofrece un look moderno y sofisticado. Extremadamente ligero y flexible, ideal para uso prolongado. Perfecto para graduaciones altas gracias a su resistencia.',
    (SELECT id FROM brands WHERE slug = 'maximum-eye-wear'),
    'square',
    'titanium',
    'full_rim',
    53.0,      -- lens_width (mm)
    45.0,      -- lens_height (mm) - estimado
    18.0,      -- bridge_width (mm)
    147.0,     -- temple_length (mm)
    137.0,     -- total_width (mm) - estimado
    12.0,      -- weight (g) - titanio es muy ligero
    'unisex',
    ARRAY['medium', 'large']::face_size[],
    2499.00,   -- precio base en MXN
    2999.00,   -- precio antes de descuento
    'MXN',
    true,      -- soporta lentes graduados
    false,     -- no es solo para sol
    ARRAY['titanio', 'ligero', 'flexible', 'premium', 'resistente']::text[],
    'active',
    true,      -- es nuevo
    false,     -- no es bestseller aún
    true,      -- destacado
    NOW(),
    NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PASO 4: Asociar el armazón con la categoría de lentes oftálmicos
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO frame_categories (frame_id, category_id)
VALUES (
    (SELECT id FROM frames WHERE slug = 'maximum-7350'),
    (SELECT id FROM categories WHERE slug = 'lentes-oftalmicos')
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PASO 5: Insertar la variante de color (Plata)
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
    (SELECT id FROM frames WHERE slug = 'maximum-7350'),
    'Plata',
    '#C0C0C0',
    'MAX-7350-SILVER',
    10,
    true,
    NOW(),
    NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PASO 6: Insertar las imágenes del producto
-- NOTA: Reemplaza las URLs con las URLs reales de Cloudinary después de subir
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO frame_images (id, color_variant_id, url, alt, image_type, sort_order, created_at)
VALUES 
(
    uuid_generate_v4(),
    (SELECT id FROM frame_color_variants WHERE sku = 'MAX-7350-SILVER'),
    '/armazon-1/1.png',
    'MAXIMUM 7350 Titanio Plata - Vista Frontal',
    'front',
    1,
    NOW()
),
(
    uuid_generate_v4(),
    (SELECT id FROM frame_color_variants WHERE sku = 'MAX-7350-SILVER'),
    '/armazon-1/2.png',
    'MAXIMUM 7350 Titanio Plata - Vista Angular',
    'angle',
    2,
    NOW()
),
(
    uuid_generate_v4(),
    (SELECT id FROM frame_color_variants WHERE sku = 'MAX-7350-SILVER'),
    '/armazon-1/3.png',
    'MAXIMUM 7350 Titanio Plata - Vista Lateral',
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
    fcv.sku
FROM frames f
JOIN brands b ON f.brand_id = b.id
LEFT JOIN frame_color_variants fcv ON f.id = fcv.frame_id
WHERE f.slug = 'maximum-7350';
