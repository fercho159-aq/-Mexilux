import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MexiluxConfigurator from '@/components/lens-configurator/MexiluxConfigurator';
import { getFrameBySlug } from '@/lib/db/frames';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const frame = await getFrameBySlug(slug);

    if (!frame) {
        return { title: 'Producto no encontrado | Mexilux' };
    }

    return {
        title: `Configurar lentes para ${frame.name} | Mexilux`,
        description: `Personaliza tus lentes para ${frame.name} de ${frame.brand?.name ?? 'Mexilux'}.`,
    };
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ConfiguradorPage({ params }: PageProps) {
    const { slug } = await params;
    const frame = await getFrameBySlug(slug);

    if (!frame) {
        notFound();
    }

    const basePrice =
        typeof frame.base_price === 'number'
            ? frame.base_price
            : frame.base_price?.toNumber?.() ?? 0;
    const defaultVariant = frame.frame_color_variants?.[0];
    const defaultImage = defaultVariant?.frame_images?.[0]?.url;

    return (
        <main className="configurador-page">
            <MexiluxConfigurator
                frameSlug={frame.slug}
                frameName={frame.name}
                frameImage={defaultImage}
                framePrice={basePrice}
            />
        </main>
    );
}
