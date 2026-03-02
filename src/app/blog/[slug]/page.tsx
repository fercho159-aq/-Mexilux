/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BLOG - PÁGINA DE ARTÍCULO INDIVIDUAL
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPost from '@/components/blog/BlogPost';
import { Landmark, Palette, MessageCircle, UtensilsCrossed, Palmtree, Users, Flame, Star } from 'lucide-react';

// Artículos del blog (datos sincronizados con BlogList)
const BLOG_POSTS = [
    {
        id: 1,
        slug: 'lugares-magicos-mexico',
        title: 'México Mágico: 10 Lugares que Tienes que Visitar',
        excerpt: 'Desde las pirámides de Teotihuacán hasta las playas de Oaxaca, descubre los rincones más increíbles de nuestro país.',
        content: `
## La magia de México

México es un país lleno de contrastes y maravillas. Desde las antiguas civilizaciones hasta los paisajes naturales más impresionantes, hay algo para todos.

### 1. Teotihuacán, Estado de México

Las pirámides del Sol y la Luna te dejarán sin palabras. Caminar por la Calzada de los Muertos es como viajar en el tiempo.

### 2. Oaxaca

La tierra del mezcal, el mole y las tradiciones más arraigadas. Monte Albán es imperdible.

### 3. San Miguel de Allende

Una ciudad que parece de cuento. Sus calles empedradas y arquitectura colonial te enamorarán.

### 4. Bacalar

La laguna de los siete colores. El mejor secreto del Caribe mexicano.

### 5. Guanajuato

Callejones, leyendas y momias. Una experiencia única.

---

**¿Ya visitaste alguno de estos lugares?** Cuéntanos en redes sociales cuál es tu rincón favorito de México.
        `,
        category: 'México Mágico',
        categorySlug: 'mexico-magico',
        emoji: <Landmark size={64} />,
        author: 'Equipo Mexilux',
        date: '2026-01-10',
        readTime: '5 min',
    },
    {
        id: 2,
        slug: 'mexicanos-inspiradores',
        title: 'Mexicanos que Vale la Pena Voltear a Ver',
        excerpt: 'Conoce a los emprendedores, artistas y creadores mexicanos que están cambiando el juego.',
        content: `
## Mexicanos que están rompiendo paradigmas

En un mundo globalizado, los mexicanos estamos dejando huella en todas las industrias. Aquí te presentamos algunos que debes conocer.

### Emprendedores

- **Daniel Vogel** - Fundador de Bitso, la cripto-exchange más grande de Latinoamérica
- **Blanca Treviño** - CEO de Softtek, empresa de TI con presencia global
- **Alfredo Harp Helú** - Banquero y filántropo que ha transformado Oaxaca

### Creativos

- **Guillermo del Toro** - El director de cine más chingón
- **Emmanuel Lubezki** - El Chivo, 3 Oscars consecutivos de cinematografía
- **Tania Libertad** - La voz de América Latina

### Deportistas

- **Canelo Álvarez** - El mejor boxeador libra por libra
- **Checo Pérez** - Haciendo historia en la F1
- **Ana Gabriela Guevara** - Leyenda del atletismo

---

**¿A quién agregarías a esta lista?** México está lleno de talento.
        `,
        category: 'Mexicanos de Lujo',
        categorySlug: 'mexicanos-de-lujo',
        emoji: <Users size={64} />,
        author: 'Equipo Mexilux',
        date: '2026-01-08',
        readTime: '4 min',
    },
    {
        id: 3,
        slug: 'comida-callejera-mexico',
        title: 'La Mejor Comida Callejera de México',
        excerpt: 'Un tour gastronómico por los tacos, tortas, y antojitos que hacen único a nuestro país.',
        content: `
## Los sabores de la calle

No hay mejor lugar para comer en México que en la calle. Aquí van nuestros favoritos.

### Los Tacos

- **Tacos al Pastor** - El clásico inmortal del trompo
- **Tacos de Canasta** - El desayuno del pueblo
- **Tacos de Birria** - Quesabirria con consomé, una religión

### Las Tortas

- **Torta Ahogada** - Jalisciense y picosa
- **Pambazo** - Bañado en salsa guajillo
- **Cemita Poblana** - Con pata y milanesa

### Los Antojitos

- **Esquites y Elotes** - Mayonesa, chile y limón
- **Tlayudas** - La pizza oaxaqueña
- **Gorditas** - Fritas o de comal

---

**Dale like si se te antojó algo.**
        `,
        category: "Pa' la Muela",
        categorySlug: 'pa-la-muela',
        emoji: <UtensilsCrossed size={64} />,
        author: 'Equipo Mexilux',
        date: '2026-01-05',
        readTime: '6 min',
    },
    {
        id: 4,
        slug: 'artesanias-mexicanas',
        title: 'Artesanías Mexicanas: Tesoros Hechos a Mano',
        excerpt: 'El arte popular mexicano es reconocido mundialmente. Conoce las técnicas ancestrales que siguen vivas.',
        content: `
## El arte de nuestras manos

Las artesanías mexicanas son patrimonio de la humanidad. Cada pieza cuenta una historia.

### Barro Negro de Oaxaca

Originario de San Bartolo Coyotepec, este barro tiene un brillo único que se logra sin esmalte.

### Talavera Poblana

Desde el siglo XVI, los artesanos de Puebla crean estas piezas coloridas siguiendo técnicas españolas y árabes.

### Alebrijes

Imaginación pura desde Oaxaca. Criaturas fantásticas pintadas a mano.

### Textiles

- **Huipiles** de Chiapas
- **Rebozos** de Tenancingo
- **Sarapes** de Saltillo

---

**Comprar artesanías es preservar nuestra cultura.** Siempre pregunta por el artesano.
        `,
        category: 'Vista a las Raíces',
        categorySlug: 'vista-a-las-raices',
        emoji: <Palette size={64} />,
        author: 'Equipo Mexilux',
        date: '2026-01-03',
        readTime: '5 min',
    },
    {
        id: 5,
        slug: 'dia-de-muertos-tradicion',
        title: 'Día de Muertos: Una Tradición que nos Define',
        excerpt: 'Más allá del Halloween, el Día de Muertos celebra la vida y la memoria. Conoce su historia y significado.',
        content: `
## Una celebración que honra la vida

El Día de Muertos no es un día triste. Es una fiesta, un reencuentro con los que ya no están. Una tradición que la UNESCO declaró Patrimonio Cultural Inmaterial de la Humanidad.

### Los orígenes

Las civilizaciones prehispánicas como los mexicas, mayas y purépechas ya celebraban a sus muertos. Con la llegada de los españoles, se fusionó con las tradiciones católicas del Día de Todos los Santos.

### La ofrenda

El altar es el corazón de la celebración. Cada elemento tiene un significado:

- **Cempasúchil** - Las flores guían a los difuntos con su aroma
- **Papel picado** - Representa el viento y la fragilidad de la vida
- **Pan de muerto** - Ofrenda gastronómica por excelencia
- **Calaveritas de azúcar** - Representan a los difuntos con dulzura
- **Velas** - Iluminan el camino de regreso

### Celebraciones icónicas

- **Mixquic** - La celebración más tradicional de CDMX
- **Pátzcuaro** - Los pescadores cruzan el lago con velas
- **Oaxaca** - Comparsas, mezcal y tradición

---

**El Día de Muertos nos recuerda que la muerte es parte de la vida.** Y que el amor trasciende todo.
        `,
        category: 'Vista a las Raíces',
        categorySlug: 'vista-a-las-raices',
        emoji: <Flame size={64} />,
        author: 'Equipo Mexilux',
        date: '2026-01-01',
        readTime: '4 min',
    },
    {
        id: 6,
        slug: 'frases-mexicanas',
        title: 'Frases Mexicanas que Solo Nosotros Entendemos',
        excerpt: '¿Qué significa "no manches"? ¿Y "aguas"? Un diccionario del español más chido.',
        content: `
## El diccionario del mexicano

Si no eres de aquí, probablemente no entiendas nada. Aquí te explicamos.

### Las Clásicas

- **No manches** - Expresión de sorpresa (versión light de otra palabra)
- **¡Aguas!** - ¡Cuidado!
- **¿Qué onda?** - ¿Qué pasa? ¿Cómo estás?
- **Órale** - Sirve para todo: sí, wow, vamos, ok

### Las Confusas

- **Ahorita** - Puede ser ahora, en 5 minutos, mañana, o nunca
- **Chido/a** - Cool, genial, padre
- **Neta** - Verdad (¿neta? = ¿en serio?)
- **Fresa** - Persona presumida

### Las Extremas

- **Está cañón** - Está difícil
- **Me vale** - No me importa
- **Echarse un coyotito** - Dormir una siesta
- **Ponerse las pilas** - Ponerse activo

---

**Neta que el español mexicano es el más chido.**
        `,
        category: "Pa' la Muela",
        categorySlug: 'pa-la-muela',
        emoji: <MessageCircle size={64} />,
        author: 'Equipo Mexilux',
        date: '2025-12-30',
        readTime: '3 min',
    },
    {
        id: 7,
        slug: 'restaurantes-cdmx',
        title: 'Restaurantes en CDMX que Tienes que Probar',
        excerpt: 'De la comida callejera a los restaurantes de autor. Los mejores sabores de la Ciudad de México.',
        content: `
## La capital gastronómica

La Ciudad de México es una de las capitales gastronómicas del mundo. Aquí van nuestras recomendaciones.

### Alta cocina mexicana

- **Pujol** - Enrique Olvera reinventa la cocina mexicana
- **Quintonil** - Jorge Vallejo y sus sabores de mercado elevados
- **Rosetta** - Elena Reygadas y su cocina de autor en la Roma

### Cantinas con historia

- **La Ópera** - Donde Pancho Villa dejó un balazo en el techo
- **Salón Corona** - Las mejores tortas de la ciudad desde 1928
- **La Polar** - Cerveza artesanal desde antes de que fuera moda

### Street food imperdible

- **Tacos El Huequito** - Tacos al pastor desde 1959
- **El Vilsito** - De día mecánico, de noche taquería
- **Tortas de Don Polo** - La torta cubana definitiva

---

**CDMX se come caminando.** Sal a explorar y deja que tu nariz te guíe.
        `,
        category: "Pa' la Muela",
        categorySlug: 'pa-la-muela',
        emoji: <Star size={64} />,
        author: 'Equipo Mexilux',
        date: '2025-12-28',
        readTime: '4 min',
    },
    {
        id: 8,
        slug: 'playas-escondidas',
        title: 'Playas Escondidas de México',
        excerpt: 'Olvídate de Cancún. Estas playas secretas son el verdadero paraíso mexicano.',
        content: `
## Lejos del turismo masivo

México tiene más de 11,000 km de costa. Aquí van las playas que los locales no quieren que conozcas.

### Pacífico

- **Playa Escondida, Islas Marietas** - Solo accesible nadando
- **Mazunte, Oaxaca** - Hippie vibes y tortugas
- **Sayulita, Nayarit** - Surf y buena vibra

### Golfo y Caribe

- **Bacalar, Quintana Roo** - La laguna de los 7 colores
- **Holbox** - Sin autos, solo paz
- **Isla Mujeres** - La original, no Cancún

### Mar de Cortés

- **Bahía de los Ángeles** - Ballenas y mantas
- **Loreto** - El acuario del mundo
- **Cabo Pulmo** - El arrecife más vivo de Norteamérica

---

**¿Cuál agregarías a la lista?** Hay tantas que no alcanzamos a mencionarlas todas.
        `,
        category: 'México Mágico',
        categorySlug: 'mexico-magico',
        emoji: <Palmtree size={64} />,
        author: 'Equipo Mexilux',
        date: '2025-12-25',
        readTime: '4 min',
    },
    {
        id: 9,
        slug: 'yalitza-aparicio-historia',
        title: 'Yalitza Aparicio: De Oaxaca al Mundo',
        excerpt: 'La historia de la actriz que rompió barreras y puso a México en los ojos del mundo.',
        content: `
## Una historia que inspira

Yalitza Aparicio no buscaba la fama. Era maestra de preescolar en Tlaxiaco, Oaxaca, cuando su hermana la convenció de ir a un casting. El resto es historia.

### Roma y el mundo

Alfonso Cuarón la eligió para protagonizar Roma, una película basada en sus recuerdos de infancia en la Ciudad de México. Yalitza interpretó a Cleo, una trabajadora doméstica, con una naturalidad que conmovió al mundo entero.

### Reconocimientos

- **Nominación al Oscar** - Primera mujer indígena nominada a Mejor Actriz
- **Lista TIME 100** - Entre las personas más influyentes del mundo
- **Embajadora de la UNESCO** - Por los derechos de los pueblos indígenas

### Más allá del cine

Yalitza se convirtió en una voz para las comunidades indígenas de México. Activista por los derechos de las trabajadoras del hogar y defensora de la diversidad.

---

**Yalitza demostró que el talento no tiene fronteras, idioma ni color de piel.**
        `,
        category: 'Mexicanos de Lujo',
        categorySlug: 'mexicanos-de-lujo',
        emoji: <Star size={64} />,
        author: 'Equipo Mexilux',
        date: '2025-12-22',
        readTime: '5 min',
    },
];

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find(p => p.slug === slug);

    if (!post) {
        return { title: 'Artículo no encontrado | Mexilux' };
    }

    return {
        title: `${post.title} | Blog Mexilux`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = BLOG_POSTS.find(p => p.slug === slug);

    if (!post) {
        notFound();
    }

    // Related posts
    const relatedPosts = BLOG_POSTS
        .filter(p => p.slug !== slug && p.categorySlug === post.categorySlug)
        .slice(0, 2);

    return <BlogPost post={post} relatedPosts={relatedPosts} />;
}
