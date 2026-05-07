'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import FaceAnalyzer, { AnalysisResult } from '@/components/quiz/FaceAnalyzer';
import { Share2 } from 'lucide-react';

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
// TIPOS DE ROSTRO (8 tipos)
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

// Mapeo IA → tipos
const AI_FACE_MAP: Record<string, string> = {
    oval: 'ovalado',
    round: 'redondo',
    square: 'cuadrado',
    heart: 'corazon',
    oblong: 'rectangulo',
};

// ═══════════════════════════════════════════════════════════════════════════
// COLORES POR TONO DE PIEL
// ═══════════════════════════════════════════════════════════════════════════

const SKIN_TONE_COLORS: Record<string, Record<string, { colors: string[]; hexes: string[] }>> = {
    light: {
        cool: { colors: ['Negro', 'Gris', 'Azul marino', 'Vino/Borgoña', 'Plata'], hexes: ['#1a1a1a', '#808080', '#1e3a5f', '#722F37', '#C0C0C0'] },
        warm: { colors: ['Carey claro', 'Dorado', 'Verde oliva', 'Nude cálido', 'Ámbar'], hexes: ['#CD853F', '#D4AF37', '#556B2F', '#E3C4A8', '#FFBF00'] },
        neutral: { colors: ['Transparente', 'Azul medio', 'Carey claro', 'Negro suave', 'Rosa polvo'], hexes: ['#e8e8e8', '#4682B4', '#CD853F', '#333333', '#E8B4B8'] },
    },
    medium: {
        cool: { colors: ['Negro brillante', 'Azul profundo', 'Rojo vino', 'Gris humo', 'Plata'], hexes: ['#0a0a0a', '#1a237e', '#722F37', '#696969', '#C0C0C0'] },
        warm: { colors: ['Carey miel', 'Dorado', 'Verde militar', 'Marrón chocolate', 'Ámbar'], hexes: ['#D2B48C', '#D4AF37', '#4B5320', '#7B3F00', '#FFBF00'] },
        neutral: { colors: ['Carey oscuro', 'Azul marino', 'Transparente', 'Verde profundo', 'Borgoña'], hexes: ['#5D4037', '#1e3a5f', '#e8e8e8', '#013220', '#722F37'] },
    },
    dark: {
        cool: { colors: ['Negro brillante', 'Gris grafito', 'Azul intenso', 'Vino oscuro', 'Plata'], hexes: ['#0a0a0a', '#383838', '#0D47A1', '#4A0E0E', '#C0C0C0'] },
        warm: { colors: ['Dorado', 'Carey oscuro', 'Verde profundo', 'Marrón espresso', 'Rojo cálido'], hexes: ['#D4AF37', '#5D4037', '#013220', '#3E2723', '#C62828'] },
        neutral: { colors: ['Azul marino', 'Borgoña', 'Transparente', 'Carey oscuro'], hexes: ['#1e3a5f', '#722F37', '#e8e8e8', '#5D4037'] },
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// PREGUNTAS DE PERSONALIDAD
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

// Total steps: face shape + 5 personality questions
const TOTAL_STEPS = 1 + PERSONALITY_QUESTIONS.length;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE
// ═══════════════════════════════════════════════════════════════════════════

export interface HomeQuizProps {
    isOpen: boolean;
    onClose: () => void;
    initialStep?: number;
    /** @deprecated No longer used - personality is determined by quiz questions */
    initialStyle?: string;
    embedded?: boolean;
    skipIntro?: boolean;
}

export default function HomeQuiz({ isOpen, onClose, initialStep = 0, embedded = false, skipIntro = false }: HomeQuizProps) {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [faceShape, setFaceShape] = useState('');
    const [personalityAnswers, setPersonalityAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [showManualOptions, setShowManualOptions] = useState(skipIntro);
    const [skinToneResult, setSkinToneResult] = useState<AnalysisResult['skinTone'] | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
    const isFaceStep = currentStep === 0;
    const currentPersonalityQuestion = !isFaceStep ? PERSONALITY_QUESTIONS[currentStep - 1] : null;

    if (!isOpen && !embedded) return null;

    // Compute personality scores
    const personalityScores = (() => {
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
    })();

    const getTopProfiles = () => {
        const sorted = Object.entries(personalityScores).sort(([, a], [, b]) => b - a);
        return {
            primary: sorted[0]?.[0] || 'buchon',
            secondary: sorted[1]?.[0] || 'bellaco',
        };
    };

    const handleFaceShapeSelect = (value: string) => {
        setFaceShape(value);
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentStep(prev => prev + 1);
            setIsAnimating(false);
        }, 200);
    };

    const handlePersonalitySelect = (questionId: string, value: string) => {
        setPersonalityAnswers(prev => ({ ...prev, [questionId]: value }));
        if (isAnimating) return;
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
        setUploadedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setTimeout(() => {
            setCurrentStep(prev => prev + 1);
        }, 500);
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            if (embedded) onClose();
            else onClose();
        }
    };

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
                backgroundColor: '#EEEADE',
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

    // --- STYLES ---
    const containerStyle: React.CSSProperties = embedded
        ? { width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: 'transparent' }
        : { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 9999, overflowY: 'auto' };

    const contentStyle: React.CSSProperties = embedded
        ? { width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }
        : { paddingTop: '80px', minHeight: '100vh', width: '100%', backgroundColor: '#fff' };

    // ═══════════════════════════════════════════════════════════════════════════
    // CAMERA MODE
    // ═══════════════════════════════════════════════════════════════════════════
    if (showCamera) {
        return (
            <div style={embedded ? {
                width: '100%', height: '100%', minHeight: '500px',
                position: 'relative', overflow: 'hidden', backgroundColor: 'transparent', borderRadius: '20px'
            } : containerStyle}>
                <div style={{
                    position: 'relative', height: '100%', minHeight: embedded ? '500px' : 'auto',
                    width: '100%', backgroundColor: '#f5f7fa', borderRadius: embedded ? '20px' : '0', overflow: 'hidden'
                }}>
                    <button
                        onClick={() => setShowCamera(false)}
                        style={{
                            position: 'absolute', top: '20px', right: '25px', zIndex: 100000,
                            background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%',
                            width: '40px', height: '40px', fontSize: '24px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        ✕
                    </button>
                    <FaceAnalyzer
                        onComplete={handleAnalysisComplete}
                        onCancel={() => { setShowCamera(false); setUploadedImage(null); }}
                        onManualSelect={() => { setShowCamera(false); setUploadedImage(null); }}
                        embedded={embedded}
                        initialImage={uploadedImage}
                    />
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // RESULTS MODE
    // ═══════════════════════════════════════════════════════════════════════════
    if (showResults) {
        const { primary, secondary } = getTopProfiles();
        const primaryProfile = PERSONALITY_PROFILES[primary];
        const secondaryProfile = PERSONALITY_PROFILES[secondary];
        const faceType = FACE_TYPES[faceShape] || FACE_TYPES.ovalado;
        const skinData = skinToneResult
            ? SKIN_TONE_COLORS[skinToneResult.category]?.[skinToneResult.undertone]
            : null;

        return (
            <div style={{
                position: embedded ? 'relative' : 'fixed',
                top: 0, left: 0,
                width: embedded ? '100%' : '100vw',
                height: embedded ? '100%' : '100vh',
                background: 'linear-gradient(135deg, #EEEADE 0%, #e8e3d6 50%, #d4c9b0 100%)',
                zIndex: embedded ? 1 : 9999,
                overflowY: 'auto',
                borderRadius: embedded ? '24px' : '0'
            }}>
                {/* Orbes decorativos */}
                <div style={{
                    position: 'absolute', top: '10%', left: '-5%', width: '300px', height: '300px',
                    background: 'radial-gradient(circle, rgba(138, 102, 35, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', bottom: '20%', right: '-5%', width: '250px', height: '250px',
                    background: 'radial-gradient(circle, rgba(21, 33, 50, 0.08) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none'
                }} />

                {!embedded && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'fixed', top: '20px', right: '20px', zIndex: 1000,
                            background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)',
                            color: '#1D1E21', border: 'none', borderRadius: '50%',
                            width: '44px', height: '44px', fontSize: '18px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                    >
                        ✕
                    </button>
                )}

                <div style={{
                    position: 'relative', zIndex: 1,
                    padding: embedded ? '24px 16px' : '100px 20px 60px',
                    maxWidth: '440px', margin: '0 auto',
                    minHeight: embedded ? 'auto' : '100vh',
                    display: 'flex', flexDirection: 'column'
                }}>
                    {/* Card principal */}
                    <div
                        ref={cardRef}
                        style={{
                            background: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '28px',
                            padding: embedded ? '28px 24px' : '40px 32px',
                            border: '1px solid rgba(255, 255, 255, 0.6)',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0,0,0,0.1)',
                            marginBottom: '24px',
                            position: 'relative'
                        }}
                    >
                        {/* Logo en esquina */}
                        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                            <Image
                                src="/logo-mexilux.png"
                                alt="Mexilux"
                                width={42}
                                height={42}
                                style={{ objectFit: 'contain', opacity: 0.9 }}
                            />
                        </div>

                        {/* "¿Tú qué eres?" al fondo */}
                        <div style={{ textAlign: 'center', marginBottom: '8px', marginTop: '8px' }}>
                            <p style={{
                                fontSize: '26px', fontWeight: 800, color: '#152132',
                                margin: 0, letterSpacing: '-0.02em', opacity: 0.85
                            }}>
                                ¿Tú qué eres?
                            </p>
                        </div>

                        {/* Emoji + Nombre del perfil */}
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <div style={{ fontSize: '64px', marginBottom: '8px', lineHeight: 1 }}>
                                {primaryProfile.emoji}
                            </div>
                            <h2 style={{
                                fontSize: embedded ? '28px' : '34px', fontWeight: '800',
                                color: '#152132', margin: '0 0 12px 0', letterSpacing: '-0.02em'
                            }}>
                                {primaryProfile.name}
                            </h2>
                            <p style={{
                                fontSize: '14px', color: '#6b5d4d', margin: 0,
                                lineHeight: '1.6', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto'
                            }}>
                                {primaryProfile.description}
                            </p>
                        </div>

                        {/* Estilo de lentes */}
                        <div style={{
                            padding: '14px 18px', margin: '16px 0',
                            borderLeft: '3px solid #8A6623',
                            background: 'rgba(138, 102, 35, 0.06)',
                            borderRadius: '0 12px 12px 0',
                            fontStyle: 'italic'
                        }}>
                            <p style={{ margin: 0, fontSize: '14px', color: '#3d3528' }}>{primaryProfile.lensStyle}</p>
                        </div>

                        {/* Perfil Secundario */}
                        <div style={{
                            textAlign: 'center', marginBottom: '24px', padding: '14px',
                            background: 'rgba(138, 102, 35, 0.06)', borderRadius: '16px'
                        }}>
                            <p style={{ fontSize: '11px', color: '#8A6623', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
                                Con un toque de:
                            </p>
                            <p style={{ fontSize: '18px', fontWeight: '700', color: '#152132', margin: 0 }}>
                                {secondaryProfile.emoji} {secondaryProfile.name}
                            </p>
                        </div>

                        {/* Tipo de Rostro */}
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <h3 style={{
                                fontSize: '11px', color: '#8A6623', textTransform: 'uppercase',
                                letterSpacing: '0.12em', marginBottom: '10px', fontWeight: '700'
                            }}>Tu tipo de rostro</h3>
                            <div style={{
                                width: '60px', height: '72px', margin: '0 auto 10px',
                                background: 'rgba(138, 102, 35, 0.08)',
                                border: '2px solid rgba(138, 102, 35, 0.3)',
                                borderRadius:
                                    faceType.name === 'Ovalado' ? '50% 50% 45% 45%' :
                                    faceType.name === 'Redondo' ? '50%' :
                                    faceType.name === 'Cuadrado' ? '12%' :
                                    faceType.name === 'Rectángulo' ? '25% 25% 18% 18%' :
                                    faceType.name === 'Diamante' ? '50% 0 50% 0' :
                                    faceType.name === 'Corazón' ? '50% 50% 35% 35%' :
                                    faceType.name === 'Triángulo' ? '0 0 50% 50%' :
                                    '50% 50% 25% 25%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '22px', color: '#8A6623'
                            }}>
                                {faceType.icon}
                            </div>
                            <p style={{ fontSize: '18px', fontWeight: '700', color: '#152132', margin: '0 0 4px 0' }}>
                                {faceType.name}
                            </p>
                            <p style={{ fontSize: '12px', color: '#7a6b5a', margin: 0, maxWidth: '280px', marginLeft: 'auto', marginRight: 'auto' }}>
                                {faceType.description}
                            </p>
                        </div>

                        {/* Tono de piel */}
                        {skinToneResult && (
                            <div style={{
                                background: 'rgba(138, 102, 35, 0.06)', borderRadius: '18px',
                                padding: '14px 16px', marginBottom: '16px',
                                display: 'flex', alignItems: 'center', gap: '14px'
                            }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '50%',
                                    backgroundColor: `rgb(${skinToneResult.rgb.join(',')})`,
                                    border: '3px solid rgba(255,255,255,0.9)',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)', flexShrink: 0
                                }} />
                                <div>
                                    <h3 style={{ fontSize: '11px', color: '#8A6623', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px 0', fontWeight: '700' }}>Tu Tono</h3>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#152132', margin: '0 0 2px 0' }}>
                                        {skinToneResult.category === 'light' ? 'Claro' : skinToneResult.category === 'medium' ? 'Medio' : 'Oscuro'}
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#7a6b5a', margin: 0 }}>
                                        Subtono {skinToneResult.undertone === 'warm' ? 'Cálido' : skinToneResult.undertone === 'cool' ? 'Frío' : 'Neutro'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Armazones ideales */}
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <h3 style={{
                                fontSize: '11px', color: '#8A6623', textTransform: 'uppercase',
                                letterSpacing: '0.12em', marginBottom: '12px', fontWeight: '700'
                            }}>Armazones Ideales</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                {faceType.recommendedShapes.slice(0, 4).map((shape, idx) => (
                                    <span key={idx} style={{
                                        background: 'linear-gradient(135deg, #152132 0%, #1c2d42 100%)',
                                        color: '#EEEADE', padding: '8px 16px', borderRadius: '24px',
                                        fontSize: '12px', fontWeight: '600',
                                        boxShadow: '0 4px 12px rgba(21, 33, 50, 0.15)'
                                    }}>{shape}</span>
                                ))}
                            </div>
                        </div>

                        {/* Colores recomendados */}
                        {skinData && (
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{
                                    fontSize: '11px', color: '#8A6623', textTransform: 'uppercase',
                                    letterSpacing: '0.12em', marginBottom: '14px', fontWeight: '700'
                                }}>Colores Recomendados</h3>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                                    {skinData.colors.slice(0, 3).map((color, idx) => (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '50%',
                                                backgroundColor: skinData.hexes[idx] || '#888',
                                                border: '3px solid rgba(255,255,255,0.9)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                            }} />
                                            <span style={{
                                                fontSize: '11px', color: '#5a5045', fontWeight: '500',
                                                maxWidth: '70px', textAlign: 'center', lineHeight: '1.3'
                                            }}>{color}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Acciones */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 4px' }}>
                        <Link
                            href="/catalogo"
                            style={{
                                display: 'block', textAlign: 'center', padding: '18px 24px',
                                background: 'linear-gradient(135deg, #8A6623 0%, #a67c2e 100%)',
                                color: '#fff', borderRadius: '16px', fontSize: '16px', fontWeight: '700',
                                textDecoration: 'none', boxShadow: '0 8px 24px rgba(138, 102, 35, 0.25)',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                        >
                            Ver Armazones Recomendados
                        </Link>

                        <button
                            onClick={handleShare}
                            style={{
                                padding: '16px 24px', background: 'rgba(255,255,255,0.8)',
                                backdropFilter: 'blur(10px)', color: '#152132',
                                border: '1px solid rgba(21, 33, 50, 0.1)', borderRadius: '16px',
                                fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
                            }}
                        >
                            <Share2 className="inline-block" size={16} /> Compartir
                        </button>

                        <button
                            onClick={() => {
                                if (embedded) onClose();
                                setShowResults(false);
                                setCurrentStep(0);
                                setFaceShape('');
                                setPersonalityAnswers({});
                                setSkinToneResult(null);
                            }}
                            style={{
                                padding: '14px', background: 'transparent', color: '#7a6b5a',
                                border: 'none', fontSize: '14px', cursor: 'pointer', fontWeight: '500'
                            }}
                        >
                            ← Hacer otro análisis
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // WIZARD / QUESTION MODE
    // ═══════════════════════════════════════════════════════════════════════════
    return (
        <div style={containerStyle} className="quiz-container">
            {!embedded && (
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '20px', right: '20px', zIndex: 100,
                        background: 'transparent', border: 'none', fontSize: '24px',
                        cursor: 'pointer', color: '#000'
                    }}
                >
                    ✕
                </button>
            )}

            <main className="quiz-wizard-content" style={contentStyle}>
                <div className="section-container" style={{
                    width: '100%', height: '100%', maxWidth: embedded ? '100%' : '800px',
                    margin: '0 auto', padding: embedded ? '0 8px' : '0 20px',
                    display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
                }}>
                    {!embedded && (
                        <header className="quiz-page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>¿Tú qué eres?</h1>
                            <p style={{ color: '#666' }}>Es importante que analicemos tu tipo de rostro y personalidad, para recomendarte los mejores armazones</p>
                        </header>
                    )}

                    <div className="quiz-wizard" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {/* Progress */}
                        <div className="quiz-progress" style={{ marginBottom: '24px', width: '100%' }}>
                            <div className="progress-bar" style={{ height: '4px', background: '#f0f0f0', borderRadius: '2px', overflow: 'hidden' }}>
                                <div className="progress-fill" style={{ width: `${progress}%`, height: '100%', background: '#8A6623', transition: 'width 0.3s ease' }} />
                            </div>
                            <span className="progress-text" style={{ fontSize: '12px', color: '#999', marginTop: '4px', display: 'block', textAlign: 'right' }}>
                                {currentStep + 1} / {TOTAL_STEPS}
                            </span>
                        </div>

                        {/* Step Content */}
                        <section className={`quiz-step ${isAnimating ? 'animating-out' : ''}`} style={{ flex: 1, overflowY: 'auto', width: '100%' }}>

                            {/* ── FACE SHAPE STEP (step 0) ── */}
                            {isFaceStep && (
                                <>
                                    <h2 style={{ fontSize: embedded ? '20px' : '24px', textAlign: 'center', marginBottom: '8px' }}>
                                        {!showManualOptions ? '¿Cómo quieres descubrir tu tipo de rostro?' : '¿Cuál es tu tipo de rostro?'}
                                    </h2>
                                    <p className="step-description" style={{ textAlign: 'center', color: '#666', marginBottom: '24px', fontSize: embedded ? '14px' : '16px' }}>
                                        {!showManualOptions ? 'Conocer tu tipo de rostro nos ayuda a recomendarte los mejores armazones' : 'Mírate al espejo y elige la opción que más se parezca'}
                                    </p>

                                    {!showManualOptions ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                                            <button
                                                onClick={() => setShowCamera(true)}
                                                style={{
                                                    padding: '18px 24px', background: '#152132', color: '#ffffff',
                                                    border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '600',
                                                    cursor: 'pointer', boxShadow: '0 8px 24px rgba(21, 33, 50, 0.25)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    gap: '12px', transition: 'transform 0.2s, box-shadow 0.2s'
                                                }}
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="3" />
                                                    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                                                </svg>
                                                Escaneo Visual Mexilux
                                            </button>

                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                style={{
                                                    padding: '18px 24px', background: 'rgba(255, 255, 255, 0.9)',
                                                    color: '#1D1E21', border: '2px solid rgba(21, 33, 50, 0.15)',
                                                    borderRadius: '16px', fontSize: '16px', fontWeight: '600',
                                                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    gap: '12px', transition: 'transform 0.2s, box-shadow 0.2s'
                                                }}
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <path d="M21 15l-5-5L5 21" />
                                                </svg>
                                                Subir foto
                                            </button>

                                            <button
                                                onClick={() => setShowManualOptions(true)}
                                                style={{
                                                    padding: '18px 24px', background: 'transparent',
                                                    color: 'rgba(29, 30, 33, 0.7)', border: '1px dashed rgba(29, 30, 33, 0.3)',
                                                    borderRadius: '16px', fontSize: '16px', fontWeight: '500',
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', gap: '12px', transition: 'all 0.2s'
                                                }}
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 11l3 3L22 4" />
                                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                                                </svg>
                                                Ya sé mi tipo de rostro
                                            </button>

                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const imageUrl = URL.createObjectURL(file);
                                                        setUploadedImage(imageUrl);
                                                        setShowCamera(true);
                                                    }
                                                }}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setShowManualOptions(false)}
                                                style={{
                                                    marginBottom: '16px', padding: '8px 16px', background: 'transparent',
                                                    border: 'none', color: '#666', fontSize: '14px', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '4px'
                                                }}
                                            >
                                                ← Volver a opciones
                                            </button>
                                            <div className="quiz-options-grid" style={{
                                                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                                                gap: '10px', width: '100%'
                                            }}>
                                                {Object.entries(FACE_TYPES).map(([key, face]) => (
                                                    <label
                                                        key={key}
                                                        className={`quiz-option-card ${faceShape === key ? 'selected' : ''}`}
                                                        style={{
                                                            display: 'flex', flexDirection: 'row', alignItems: 'center',
                                                            padding: '12px 10px', borderRadius: '12px', cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            backgroundColor: faceShape === key ? '#f5f3ee' : '#fff',
                                                            border: faceShape === key ? '2px solid #8A6623' : '1px solid #e5e5e5',
                                                            boxSizing: 'border-box', gap: '8px', minWidth: 0, overflow: 'hidden'
                                                        }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="face-shape"
                                                            value={key}
                                                            checked={faceShape === key}
                                                            onChange={() => handleFaceShapeSelect(key)}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <span style={{ fontSize: '22px', flexShrink: 0 }}>{face.icon}</span>
                                                        <span style={{ fontWeight: '600', fontSize: '12px', textAlign: 'left', lineHeight: '1.2' }}>{face.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}

                            {/* ── PERSONALITY QUESTIONS (steps 1-5) ── */}
                            {!isFaceStep && currentPersonalityQuestion && (
                                <>
                                    <h2 style={{ fontSize: embedded ? '18px' : '22px', textAlign: 'center', marginBottom: '8px' }}>
                                        <span style={{ marginRight: '8px' }}>{currentPersonalityQuestion.emoji}</span>
                                        {currentPersonalityQuestion.title}
                                    </h2>
                                    <p className="step-description" style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                                        Elige la opción que más te represente
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
                                        {currentPersonalityQuestion.options.map((option) => (
                                            <label
                                                key={option.value}
                                                className={`quiz-option-card ${personalityAnswers[currentPersonalityQuestion.id] === option.value ? 'selected' : ''}`}
                                                style={{
                                                    display: 'flex', flexDirection: 'row', alignItems: 'center',
                                                    padding: '14px 16px', borderRadius: '14px', cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    backgroundColor: personalityAnswers[currentPersonalityQuestion.id] === option.value ? '#f5f3ee' : '#fff',
                                                    border: personalityAnswers[currentPersonalityQuestion.id] === option.value ? '2px solid #8A6623' : '1px solid #e5e5e5',
                                                    gap: '12px'
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name={currentPersonalityQuestion.id}
                                                    value={option.value}
                                                    checked={personalityAnswers[currentPersonalityQuestion.id] === option.value}
                                                    onChange={() => handlePersonalitySelect(currentPersonalityQuestion.id, option.value)}
                                                    style={{ display: 'none' }}
                                                />
                                                <span style={{ fontSize: '24px', flexShrink: 0 }}>{option.emoji}</span>
                                                <div style={{ minWidth: 0 }}>
                                                    <span style={{ fontWeight: '600', fontSize: '14px', display: 'block', lineHeight: '1.3' }}>{option.label}</span>
                                                    <span style={{ fontSize: '12px', color: '#888', lineHeight: '1.3' }}>{option.tip}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </>
                            )}
                        </section>

                        {/* Navigation */}
                        <div className="quiz-navigation" style={{
                            display: 'flex', justifyContent: 'space-between', marginTop: '24px',
                            paddingTop: '16px', borderTop: '1px solid #f0f0f0', width: '100%'
                        }}>
                            {currentStep === 0 && !showManualOptions ? (
                                <button
                                    onClick={onClose}
                                    style={{
                                        padding: '8px 16px', border: '1px solid #ddd', borderRadius: '8px',
                                        background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#666'
                                    }}
                                >
                                    ← Cancelar
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (currentStep === 0 && showManualOptions) {
                                            setShowManualOptions(false);
                                        } else {
                                            handlePrevious();
                                        }
                                    }}
                                    style={{
                                        padding: '8px 16px', border: '1px solid #ddd', borderRadius: '8px',
                                        background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#666'
                                    }}
                                >
                                    ← {currentStep === 0 ? 'Volver' : 'Anterior'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
