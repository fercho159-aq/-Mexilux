import Link from 'next/link';

export default function NotFoundPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#f5f5f7]">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-6xl mb-4">🤠</div>
                <h1 className="text-3xl font-bold mb-3 text-[#152132]">¿Qué se te perdió?</h1>
                <p className="text-gray-600 mb-8">
                    Esta página no existe. Pero no te preocupes, en Mexilux siempre encontramos lo que buscas.
                </p>
                <Link
                    href="/"
                    className="inline-block py-3 px-8 bg-[#152132] text-white rounded-full font-medium hover:bg-[#1d1e21] transition"
                    style={{ color: '#fff' }}
                >
                    Volver al inicio
                </Link>
            </div>
        </main>
    );
}
