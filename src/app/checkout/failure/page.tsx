
import Link from 'next/link';

export default function CheckoutFailurePage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold mb-2 text-gray-800">Hubo un problema</h1>
                <p className="text-gray-600 mb-6">
                    No pudimos procesar tu pago. Por favor intenta de nuevo.
                </p>
                <Link
                    href="/"
                    className="block w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
                >
                    Volver al inicio
                </Link>
            </div>
        </main>
    );
}
