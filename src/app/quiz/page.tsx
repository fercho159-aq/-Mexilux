/**
 * ═══════════════════════════════════════════════════════════════════════════
 * QUIZ MEXILUX - ¿Qué tipo de Mexicano eres?
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * - 8 tipos de rostro con recomendación de armazones
 * - 8 perfiles de personalidad (Buchón, Bellaco, Whitexican, etc.)
 * - 5 preguntas con sistema de puntaje
 * - Escaneo Visual Mexilux (IA) para detección de rostro y tono de piel
 * - Resultados personalizados estilo Spotify Wrapped
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import FaceAnalyzer, { AnalysisResult } from '@/components/quiz/FaceAnalyzer';
import { Glasses, Share2 } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// PERFILES DE PERSONALIDAD (8 perfiles)
// ═══════════════════════════════════════════════════════════════════════════

const PERSONALITY_PROFILES: Record<string, {
    name: string;
    emoji: string;
    description: string;
    lensStyle: string;
}> = {
    buchon: {
        name: 'El Buchón',
        emoji: '🤠',
        description: 'Eres de presencia fuerte. Te gusta destacar. No pasas desapercibido y ni quieres hacerlo.',
        lensStyle: 'Lentes que digan "Estos tú no los tienes".',
    },
    bellaco: {
        name: 'El Bellaco',
        emoji: '🔥',
        description: 'Carismático, coqueto natural, intenso, actitud primero. Te gusta gustar.',
        lensStyle: 'Lentes que aumenten el magnetismo.',
    },
    whitexican: {
        name: 'El Whitexican',
        emoji: '🏖️',
        description: 'Estético, minimalista, vibe internacional. Elegante sin exagerar.',
        lensStyle: 'Lentes discretos pero se nota que hay cash.',
    },
    alucin: {
        name: 'El Alucín',
        emoji: '✨',
        description: 'Ambicioso, proyectas tu gran éxito (aunque todavía lo estés construyendo). Energía intensa.',
        lensStyle: 'Lentes que muestren que mueves las pacas de billetes.',
    },
    godin: {
        name: 'El Godín',
        emoji: '💼',
        description: 'Eres responsable, confiable, estable. Tú eres el que sí cumple.',
        lensStyle: 'Tus lentes deben transmitir profesionalismo.',
    },
    influencer: {
        name: 'El Influencer',
        emoji: '📱',
        description: 'Eres creativo, aprecias la imagen primero, siempre listo para cámara. Cuidas estética y tendencias.',
        lensStyle: 'Lentes que se vean bien en tus stories.',
    },
    fresita: {
        name: 'El Fresita',
        emoji: '🍓',
        description: 'Eres educado(a), limpio(a), amable y "bien portado(a)". Te gusta verte bien sin exagerar.',
        lensStyle: 'Tus lentes deben ser coquetos y modernos.',
    },
    patron: {
        name: 'El Patrón',
        emoji: '👑',
        description: 'Eres líder natural. Impones respeto. Tú sabes qpd.',
        lensStyle: 'Tus lentes deben ser símbolo de tu autoridad.',
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS DE ROSTRO (8 tipos según PDF)
// ═══════════════════════════════════════════════════════════════════════════

const FACE_TYPES: Record<string, {
    name: string;
    icon: string;
    description: string;
    recommendedShapes: string[];
}> = {
    ovalado: {
        name: 'Ovalado',
        icon: '○',
        description: 'Frente ligeramente más ancha que la mandíbula, mentón redondeado, proporciones equilibradas',
        recommendedShapes: ['Cualquier forma te queda', 'Aviador', 'Cuadrado', 'Cat Eye'],
    },
    rectangulo: {
        name: 'Rectángulo',
        icon: '▭',
        description: 'Más largo que ancho, frente alta y barbilla alargada, mandíbula marcada',
        recommendedShapes: ['Redondo', 'Ovalado', 'Aviador curvo', 'Oversize'],
    },
    redondo: {
        name: 'Redondo',
        icon: '●',
        description: 'Mejillas llenas, sin ángulos definidos, largo y ancho casi iguales',
        recommendedShapes: ['Rectangular', 'Cuadrado', 'Aviador', 'Cat Eye'],
    },
    cuadrado: {
        name: 'Cuadrado',
        icon: '■',
        description: 'Mandíbula ancha y marcada, frente amplia y recta, longitud y anchura similares',
        recommendedShapes: ['Redondo', 'Ovalado', 'Cat Eye', 'Aviador curvo'],
    },
    triangulo_invertido: {
        name: 'Triángulo Invertido',
        icon: '▽',
        description: 'Frente amplia, pómulos y mandíbula más estrechos, mentón fino y agudo',
        recommendedShapes: ['Aviador', 'Mariposa', 'Redondo', 'Semi al aire'],
    },
    triangulo: {
        name: 'Triángulo',
        icon: '△',
        description: 'Mandíbula ancha, frente más estrecha, mentón amplio o fuerte',
        recommendedShapes: ['Cat Eye', 'Browline', 'Ovalado', 'Semi al aire'],
    },
    diamante: {
        name: 'Diamante',
        icon: '◇',
        description: 'Frente y mandíbula estrechas, pómulos muy marcados, mentón puntiagudo',
        recommendedShapes: ['Ovalado', 'Cat Eye', 'Aviador', 'Sin montura'],
    },
    corazon: {
        name: 'Corazón',
        icon: '♡',
        description: 'Frente ancha, pómulos altos, barbilla puntiaguda',
        recommendedShapes: ['Aviador', 'Mariposa', 'Redondo', 'Sin montura inferior'],
    },
};

// Mapeo de resultados IA → tipos de rostro
const AI_FACE_MAP: Record<string, string> = {
    oval: 'ovalado',
    round: 'redondo',
    square: 'cuadrado',
    heart: 'corazon',
    oblong: 'rectangulo',
};

// ═══════════════════════════════════════════════════════════════════════════
// COLORES RECOMENDADOS POR TONO DE PIEL (del PDF)
// ═══════════════════════════════════════════════════════════════════════════

const SKIN_TONE_COLORS: Record<string, Record<string, string[]>> = {
    light: {
        cool: ['Negro', 'Gris', 'Azul marino', 'Vino/Borgoña', 'Transparente cristal', 'Plata'],
        warm: ['Carey claro', 'Dorado', 'Verde oliva', 'Nude cálido', 'Marrón suave', 'Ámbar'],
        neutral: ['Transparente', 'Azul medio', 'Carey claro', 'Negro suave', 'Rosa polvo'],
    },
    medium: {
        cool: ['Negro brillante', 'Azul profundo', 'Rojo vino', 'Gris humo', 'Plata'],
        warm: ['Carey miel', 'Dorado', 'Verde militar', 'Marrón chocolate', 'Ámbar'],
        neutral: ['Carey oscuro', 'Azul marino', 'Transparente', 'Verde profundo', 'Borgoña'],
    },
    dark: {
        cool: ['Negro brillante', 'Gris grafito', 'Azul intenso', 'Vino oscuro', 'Transparente cristal', 'Plata'],
        warm: ['Dorado', 'Carey muy oscuro', 'Verde profundo', 'Marrón espresso', 'Rojo cálido'],
        neutral: ['Azul marino', 'Borgoña', 'Transparente', 'Carey oscuro equilibrado'],
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// PREGUNTAS DE PERSONALIDAD (5 preguntas con puntaje)
// ═══════════════════════════════════════════════════════════════════════════

type ScoreEntry = { profile: string; points: number };

interface QuizOption {
    value: string;
    label: string;
    tip: string;
    emoji: string;
    scores: ScoreEntry[];
}

interface QuizQuestion {
    id: string;
    title: string;
    emoji: string;
    options: QuizOption[];
}

const PERSONALITY_QUESTIONS: QuizQuestion[] = [
    {
        id: 'destino',
        title: 'Se arma plan en México… ¿a dónde jalas?',
        emoji: '🇲🇽',
        options: [
            { value: 'a', label: 'Los Cabos', tip: 'Hotel top, vista increíble y puro nivel', emoji: '🏖️', scores: [{ profile: 'whitexican', points: 2 }, { profile: 'patron', points: 1 }] },
            { value: 'b', label: 'Cancún', tip: 'Con el crew, antro y cero dormir', emoji: '🔥', scores: [{ profile: 'bellaco', points: 2 }, { profile: 'alucin', points: 1 }] },
            { value: 'c', label: 'Monterrey', tip: 'Carne asada, depa con vista y flow pesado', emoji: '🌮', scores: [{ profile: 'buchon', points: 2 }, { profile: 'bellaco', points: 1 }] },
            { value: 'd', label: 'Cuernavaca', tip: 'Con amigos, alberca y relax sin estrés', emoji: '🌴', scores: [{ profile: 'godin', points: 2 }, { profile: 'fresita', points: 1 }] },
            { value: 'e', label: 'CDMX', tip: 'Museos en la tarde y rooftop en la noche', emoji: '🏙️', scores: [{ profile: 'influencer', points: 2 }, { profile: 'whitexican', points: 1 }] },
        ],
    },
    {
        id: 'dinero',
        title: 'El dinero no crece en los árboles… la lana se hace con:',
        emoji: '💸',
        options: [
            { value: 'a', label: 'Haciendo bisne', tip: 'Comprando y vendiendo, siempre viendo la oportunidad', emoji: '💰', scores: [{ profile: 'buchon', points: 2 }, { profile: 'alucin', points: 1 }] },
            { value: 'b', label: 'Chamba fija', tip: 'Una buena chamba fija (uy esos aguinaldos…)', emoji: '🏢', scores: [{ profile: 'godin', points: 2 }, { profile: 'fresita', points: 1 }] },
            { value: 'c', label: 'Negocio propio', tip: 'Algo mío que crezca conmigo', emoji: '🚀', scores: [{ profile: 'bellaco', points: 2 }, { profile: 'patron', points: 1 }] },
            { value: 'd', label: 'Creando contenido', tip: 'Hasta monetizar (el varo está en las redes)', emoji: '📱', scores: [{ profile: 'influencer', points: 2 }, { profile: 'whitexican', points: 1 }] },
            { value: 'e', label: 'Invirtiendo', tip: 'Bien y moviendo contactos inteligentes', emoji: '📈', scores: [{ profile: 'whitexican', points: 2 }, { profile: 'fresita', points: 1 }] },
        ],
    },
    {
        id: 'bebida',
        title: 'Es viernes y hay plan… ¿qué te tomas?',
        emoji: '🍻',
        options: [
            { value: 'a', label: 'Champaña o botella exclusiva', tip: 'Solo lo mejor de lo mejor', emoji: '🍾', scores: [{ profile: 'alucin', points: 2 }, { profile: 'buchon', points: 1 }] },
            { value: 'b', label: 'Whisky o tequila fino', tip: 'Sin exagerar, buen gusto', emoji: '🥃', scores: [{ profile: 'patron', points: 2 }, { profile: 'whitexican', points: 1 }] },
            { value: 'c', label: 'Coctelería aesthetic', tip: 'Que se vea bien para la foto', emoji: '🍸', scores: [{ profile: 'fresita', points: 2 }, { profile: 'influencer', points: 1 }] },
            { value: 'd', label: 'Cerveza o ron clásico', tip: 'Lo seguro nunca falla', emoji: '🍺', scores: [{ profile: 'godin', points: 2 }, { profile: 'bellaco', points: 1 }] },
            { value: 'e', label: 'Shot para prender', tip: 'La noche apenas empieza', emoji: '🥂', scores: [{ profile: 'bellaco', points: 2 }, { profile: 'buchon', points: 1 }] },
        ],
    },
    {
        id: 'accesorios',
        title: 'Ya tienes tu outfit… eliges accesorios y estos deben de:',
        emoji: '😎',
        options: [
            { value: 'a', label: 'Representar quién soy', tip: 'Que hablen por mí', emoji: '🎭', scores: [{ profile: 'influencer', points: 2 }, { profile: 'fresita', points: 1 }] },
            { value: 'b', label: 'Tener marca, obvio', tip: 'Si no es de marca, ¿para qué?', emoji: '💎', scores: [{ profile: 'buchon', points: 2 }, { profile: 'alucin', points: 1 }] },
            { value: 'c', label: 'Ser funcionales', tip: 'Cumplir su propósito', emoji: '⚙️', scores: [{ profile: 'godin', points: 2 }, { profile: 'patron', points: 1 }] },
            { value: 'd', label: 'Ser exclusivos', tip: 'Aunque no griten marca', emoji: '✨', scores: [{ profile: 'whitexican', points: 2 }, { profile: 'patron', points: 1 }] },
            { value: 'e', label: 'Elevar mi presencia', tip: 'Sin decir nada', emoji: '👑', scores: [{ profile: 'alucin', points: 2 }, { profile: 'buchon', points: 1 }] },
        ],
    },
    {
        id: 'estilo',
        title: 'Si tu estilo hablara por ti, diría:',
        emoji: '🎤',
        options: [
            { value: 'a', label: 'Hay niveles', tip: 'Y yo estoy arriba', emoji: '🔥', scores: [{ profile: 'buchon', points: 2 }, { profile: 'bellaco', points: 1 }] },
            { value: 'b', label: 'Clase se tiene, no se presume', tip: 'Elegancia natural', emoji: '🎩', scores: [{ profile: 'patron', points: 2 }, { profile: 'whitexican', points: 1 }] },
            { value: 'c', label: 'Siempre en tendencia', tip: 'Lo que está in, lo tengo', emoji: '📸', scores: [{ profile: 'influencer', points: 2 }, { profile: 'fresita', points: 1 }] },
            { value: 'd', label: 'Primero resultados, luego apariencia', tip: 'Lo importante es cumplir', emoji: '💼', scores: [{ profile: 'godin', points: 2 }, { profile: 'patron', points: 1 }] },
            { value: 'e', label: 'Como yo no hay dos', tip: 'Único e irrepetible', emoji: '🌟', scores: [{ profile: 'alucin', points: 2 }, { profile: 'whitexican', points: 1 }] },
        ],
    },
];

const TOTAL_STEPS = 1 + PERSONALITY_QUESTIONS.length; // 6: rostro + 5 preguntas

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export default function QuizPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [faceShape, setFaceShape] = useState('');
    const [personalityAnswers, setPersonalityAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [skinToneResult, setSkinToneResult] = useState<AnalysisResult['skinTone'] | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

    // Calcular puntajes de personalidad
    const personalityScores = useMemo(() => {
        const scores: Record<string, number> = {};
        Object.keys(PERSONALITY_PROFILES).forEach(key => { scores[key] = 0; });

        PERSONALITY_QUESTIONS.forEach(question => {
            const answer = personalityAnswers[question.id];
            if (answer) {
                const option = question.options.find(o => o.value === answer);
                if (option) {
                    option.scores.forEach(({ profile, points }) => {
                        scores[profile] = (scores[profile] || 0) + points;
                    });
                }
            }
        });

        return scores;
    }, [personalityAnswers]);

    // Obtener los 2 perfiles más altos
    const getTopProfiles = () => {
        const sorted = Object.entries(personalityScores).sort(([, a], [, b]) => b - a);
        return {
            primary: sorted[0]?.[0] || 'buchon',
            secondary: sorted[1]?.[0] || 'bellaco',
        };
    };

    const handleFaceShapeSelect = (value: string) => {
        setFaceShape(value);
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
            setIsAnimating(false);
        }, 200);
    };

    const handlePersonalitySelect = (questionId: string, value: string) => {
        setPersonalityAnswers(prev => ({ ...prev, [questionId]: value }));
        setIsAnimating(true);
        setTimeout(() => {
            if (currentStep < TOTAL_STEPS - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                setShowResults(true);
            }
            setIsAnimating(false);
        }, 200);
    };

    const handleAnalysisComplete = (result: AnalysisResult) => {
        const mappedShape = AI_FACE_MAP[result.faceShape] || 'ovalado';
        setFaceShape(mappedShape);
        setSkinToneResult(result.skinTone);
        setShowCamera(false);
        setTimeout(() => {
            setCurrentStep(prev => prev + 1);
        }, 500);
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const isFaceStep = currentStep === 0;
    const currentPersonalityQuestion = !isFaceStep ? PERSONALITY_QUESTIONS[currentStep - 1] : null;

    // Compartir resultado en Instagram Stories vía Web Share API
    const handleShare = async () => {
        const { primary, secondary } = getTopProfiles();
        const primaryProfile = PERSONALITY_PROFILES[primary];
        const secondaryProfile = PERSONALITY_PROFILES[secondary];
        const shareText = `¡Soy ${primaryProfile.name} ${primaryProfile.emoji} con un toque de ${secondaryProfile.name} ${secondaryProfile.emoji}!\n\n${primaryProfile.description}\n\n¿Tú qué eres?\nmexilux.com/quiz`;

        if (!cardRef.current) {
            await navigator.clipboard.writeText(shareText);
            return;
        }

        try {
            const element = cardRef.current;
            const canvas = await html2canvas(element, {
                backgroundColor: '#1a1a2e',
                scale: 2,
                useCORS: true,
                logging: false,
                height: element.scrollHeight,
                width: element.scrollWidth,
                scrollY: -window.scrollY,
                scrollX: 0,
                windowHeight: document.documentElement.offsetHeight,
                allowTaint: true,
            });
            const blob: Blob | null = await new Promise((resolve) =>
                canvas.toBlob(resolve, 'image/png')
            );
            if (!blob) throw new Error('No se pudo generar la imagen');
            const file = new File([blob], 'mi-resultado-mexilux.png', { type: 'image/png' });

            const shareData: ShareData = {
                title: '¿Tú qué eres?',
                text: shareText,
                files: [file],
            };
            if (navigator.canShare?.(shareData) && navigator.share) {
                await navigator.share(shareData);
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'mi-resultado-mexilux.png';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error compartiendo:', error);
            await navigator.clipboard.writeText(shareText);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // PANTALLA DE CÁMARA (Escaneo Visual Mexilux)
    // ═══════════════════════════════════════════════════════════════════════════
    if (showCamera) {
        return (
            <main className="quiz-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <FaceAnalyzer
                    onComplete={handleAnalysisComplete}
                    onCancel={() => setShowCamera(false)}
                    onManualSelect={() => setShowCamera(false)}
                />
            </main>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PANTALLA DE RESULTADOS
    // ═══════════════════════════════════════════════════════════════════════════
    if (showResults) {
        const { primary, secondary } = getTopProfiles();
        const primaryProfile = PERSONALITY_PROFILES[primary];
        const secondaryProfile = PERSONALITY_PROFILES[secondary];
        const faceType = FACE_TYPES[faceShape] || FACE_TYPES.ovalado;
        const skinColors = skinToneResult
            ? SKIN_TONE_COLORS[skinToneResult.category]?.[skinToneResult.undertone] || []
            : [];

        return (
            <main className="quiz-results-wrapped" style={{ paddingTop: '1.5rem', minHeight: '100vh' }}>
                <div className="wrapped-background">
                    <div className="wrapped-gradient" />
                    <div className="wrapped-particles" />
                </div>

                <div className="wrapped-container" style={{ paddingBottom: '60px' }}>
                    {/* Card principal - captura para compartir */}
                    <div
                        className="wrapped-card"
                        ref={cardRef}
                        style={{
                            background: 'linear-gradient(180deg, #1a1a2e 0%, #0f172a 50%, #1e1b4b 100%)',
                            padding: '48px 32px',
                            borderRadius: '32px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 80px rgba(233, 69, 96, 0.15)',
                            maxWidth: '420px',
                            margin: '0 auto',
                            position: 'relative',
                        }}
                    >
                        {/* Logo en esquina */}
                        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                            <Image
                                src="/logo-mexilux.png"
                                alt="Mexilux"
                                width={48}
                                height={48}
                                style={{ objectFit: 'contain', opacity: 0.85 }}
                            />
                        </div>

                        {/* "Eres un mexicano(a):" */}
                        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                                Eres un mexicano(a):
                            </p>
                        </div>

                        {/* Perfil Primario */}
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <div style={{ fontSize: '72px', marginBottom: '12px', lineHeight: 1 }}>
                                {primaryProfile.emoji}
                            </div>
                            <h2 style={{
                                fontSize: '42px',
                                fontWeight: 800,
                                color: '#e94560',
                                margin: '0 0 16px 0',
                                lineHeight: 1.1,
                            }}>
                                {primaryProfile.name}
                            </h2>
                            <p style={{
                                color: 'rgba(255,255,255,0.85)',
                                lineHeight: 1.6,
                                margin: 0,
                                fontSize: '15px',
                            }}>
                                {primaryProfile.description}
                            </p>
                        </div>

                        {/* Estilo de lentes */}
                        <div style={{
                            fontStyle: 'italic',
                            color: 'rgba(255,255,255,0.9)',
                            padding: '16px 20px',
                            margin: '20px 0',
                            borderLeft: '3px solid #e94560',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '0 8px 8px 0',
                        }}>
                            <p style={{ margin: 0, fontSize: '16px' }}>{primaryProfile.lensStyle}</p>
                        </div>

                        {/* Perfil Secundario */}
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '28px',
                            padding: '16px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '16px',
                        }}>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Con un toque de:
                            </p>
                            <p style={{ fontSize: '22px', fontWeight: 700, color: 'white', margin: 0 }}>
                                {secondaryProfile.emoji} {secondaryProfile.name}
                            </p>
                        </div>

                        {/* Tipo de Rostro */}
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <h3 style={{
                                fontSize: '12px',
                                color: 'rgba(255,255,255,0.5)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '12px',
                            }}>
                                Tu tipo de rostro
                            </h3>
                            <div style={{
                                width: '80px',
                                height: '100px',
                                margin: '0 auto 12px',
                                background: 'rgba(233, 69, 96, 0.08)',
                                border: '2px solid rgba(233, 69, 96, 0.4)',
                                borderRadius:
                                    faceType.name === 'Ovalado' ? '50% 50% 45% 45%' :
                                    faceType.name === 'Redondo' ? '50%' :
                                    faceType.name === 'Cuadrado' ? '12%' :
                                    faceType.name === 'Rectángulo' ? '25% 25% 18% 18%' :
                                    faceType.name === 'Diamante' ? '50% 0 50% 0' :
                                    faceType.name === 'Corazón' ? '50% 50% 35% 35%' :
                                    faceType.name === 'Triángulo' ? '0 0 50% 50%' :
                                    '50% 50% 25% 25%', // Triángulo Invertido
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                color: '#e94560',
                            }}>
                                {faceType.icon}
                            </div>
                            <p style={{ fontSize: '20px', fontWeight: 700, color: 'white', margin: '0 0 4px 0' }}>
                                {faceType.name}
                            </p>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0, maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto' }}>
                                {faceType.description}
                            </p>
                        </div>

                        {/* Armazones Ideales */}
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <h3 style={{
                                fontSize: '12px',
                                color: 'rgba(255,255,255,0.5)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '12px',
                            }}>
                                Armazones ideales
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                {faceType.recommendedShapes.map((shape, idx) => (
                                    <span key={idx} style={{
                                        background: 'rgba(255,255,255,0.12)',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                    }}>
                                        {shape}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Colores recomendados (solo si se usó la cámara) */}
                        {skinColors.length > 0 && (
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{
                                    fontSize: '12px',
                                    color: 'rgba(255,255,255,0.5)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: '8px',
                                }}>
                                    Colores recomendados
                                </h3>
                                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '0 0 12px 0' }}>
                                    Piel {skinToneResult!.category === 'light' ? 'Clara' : skinToneResult!.category === 'medium' ? 'Media' : 'Oscura'} · Subtono {skinToneResult!.undertone === 'warm' ? 'Cálido' : skinToneResult!.undertone === 'cool' ? 'Frío' : 'Neutro'}
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                    {skinColors.slice(0, 5).map((color, idx) => (
                                        <span key={idx} style={{
                                            background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
                                            color: 'white',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            fontSize: '14px',
                                        }}>
                                            {color}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{
                        marginTop: '32px',
                        paddingTop: '24px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        textAlign: 'center',
                    }}>
                        <p style={{ color: '#e94560', fontWeight: 800, fontSize: '32px', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                            ¿Tú qué eres?
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
                            mexilux.com/quiz
                        </p>
                    </div>

                    {/* Acciones */}
                    <div className="wrapped-actions">
                        <button className="btn-wrapped-share" onClick={handleShare}>
                            <Share2 size={16} />
                            Compartir
                        </button>

                        <Link href="/catalogo" className="btn-wrapped-primary">
                            <Glasses className="inline-block" size={16} /> Ver armazones recomendados
                        </Link>

                        <button
                            className="btn-wrapped-secondary"
                            onClick={() => {
                                setShowResults(false);
                                setCurrentStep(0);
                                setFaceShape('');
                                setPersonalityAnswers({});
                                setSkinToneResult(null);
                            }}
                        >
                            Repetir quiz
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PANTALLA DEL QUIZ
    // ═══════════════════════════════════════════════════════════════════════════
    return (
        <main className="quiz-page">
            <div className="section-container">
                <header className="quiz-page-header">
                    <Link href="/" className="back-link">← Volver al inicio</Link>
                    <h1>¿Qué tipo de mexicano eres?</h1>
                    <p>Es importante que analicemos tu tipo de rostro y personalidad, para recomendarte los mejores armazones</p>
                </header>

                <div className="quiz-wizard">
                    {/* Progress */}
                    <div className="quiz-progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="progress-text">
                            {currentStep + 1} / {TOTAL_STEPS}
                        </span>
                    </div>

                    {/* Step: Tipo de Rostro */}
                    {isFaceStep && (
                        <section className={`quiz-step ${isAnimating ? 'animating-out' : ''}`}>
                            <h2>¿Cuál es tu tipo de rostro?</h2>

                            {/* Escaneo Visual Mexilux */}
                            <div className="quiz-ai-section" style={{ marginBottom: '24px', textAlign: 'center' }}>
                                <button
                                    className="btn-ai-analyze"
                                    onClick={() => setShowCamera(true)}
                                    style={{
                                        background: '#000000',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '16px 32px',
                                        borderRadius: '50px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                    }}
                                >
                                    <span>Escaneo Visual Mexilux</span>
                                </button>
                                <div className="quiz-ai-divider">
                                    <span>o selecciona manualmente</span>
                                </div>
                            </div>

                            <p className="step-description">Mírate al espejo y elige la opción que más se parezca</p>

                            <div className="quiz-options-grid">
                                {Object.entries(FACE_TYPES).map(([key, face]) => (
                                    <label
                                        key={key}
                                        className={`quiz-option-card ${faceShape === key ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="face-shape"
                                            value={key}
                                            checked={faceShape === key}
                                            onChange={() => handleFaceShapeSelect(key)}
                                        />
                                        <span className="option-emoji">{face.icon}</span>
                                        <span className="option-label">{face.name}</span>
                                        <span className="option-tip">{face.description}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Steps: Preguntas de Personalidad */}
                    {!isFaceStep && currentPersonalityQuestion && (
                        <section className={`quiz-step ${isAnimating ? 'animating-out' : ''}`}>
                            <h2>
                                <span style={{ marginRight: '8px' }}>{currentPersonalityQuestion.emoji}</span>
                                {currentPersonalityQuestion.title}
                            </h2>

                            <div className="quiz-options-grid" style={{ gridTemplateColumns: '1fr' }}>
                                {currentPersonalityQuestion.options.map((option) => (
                                    <label
                                        key={option.value}
                                        className={`quiz-option-card ${personalityAnswers[currentPersonalityQuestion.id] === option.value ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name={currentPersonalityQuestion.id}
                                            value={option.value}
                                            checked={personalityAnswers[currentPersonalityQuestion.id] === option.value}
                                            onChange={() => handlePersonalitySelect(currentPersonalityQuestion.id, option.value)}
                                        />
                                        <span className="option-emoji">{option.emoji}</span>
                                        <span className="option-label">{option.label}</span>
                                        <span className="option-tip">{option.tip}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Navegación: solo botón anterior (auto-avance al seleccionar) */}
                    <div className="quiz-navigation" style={{ justifyContent: 'flex-start' }}>
                        <button
                            className="btn btn-outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                        >
                            ← Anterior
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
