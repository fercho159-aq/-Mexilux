'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import FaceAnalyzer, { AnalysisResult } from '@/components/quiz/FaceAnalyzer';

// Tipos de rostro y sus características
const FACE_TYPES: { [key: string]: { name: string; icon: string; description: string; recommendedShapes: string[]; analysis: { characteristics: string[]; bestFor: string; avoid: string }; colors: string[] } } = {
    oval: {
        name: 'Ovalado',
        icon: '○',
        description: 'Frente ligeramente más ancha que la mandíbula, pómulos definidos',
        recommendedShapes: ['Cualquier forma te queda', 'Aviador', 'Cuadrado', 'Cat Eye'],
        analysis: {
            characteristics: ['Proporción balanceada', 'Pómulos definidos', 'Barbilla suave'],
            bestFor: 'Tu rostro equilibrado te permite experimentar con prácticamente cualquier estilo de montura.',
            avoid: 'Evita monturas demasiado grandes que oculten tus facciones naturales.'
        },
        colors: ['Negro clásico', 'Carey', 'Dorado'],
    },
    round: {
        name: 'Redondo',
        icon: '●',
        description: 'Mejillas prominentes, frente y mandíbula de anchura similar',
        recommendedShapes: ['Rectangular', 'Cuadrado', 'Aviador', 'Cat Eye'],
        analysis: {
            characteristics: ['Mejillas prominentes', 'Rasgos suaves', 'Líneas curvas'],
            bestFor: 'Las monturas angulares crean contraste y alargan visualmente tu rostro.',
            avoid: 'Las monturas redondas pueden acentuar la circularidad de tu rostro.'
        },
        colors: ['Negro', 'Azul oscuro', 'Verde bosque'],
    },
    square: {
        name: 'Cuadrado',
        icon: '■',
        description: 'Mandíbula angular, frente ancha, rasgos definidos',
        recommendedShapes: ['Redondo', 'Ovalado', 'Cat Eye', 'Aviador curvo'],
        analysis: {
            characteristics: ['Mandíbula marcada', 'Frente amplia', 'Líneas fuertes'],
            bestFor: 'Las monturas redondeadas suavizan y equilibran tus rasgos angulares.',
            avoid: 'Monturas muy cuadradas pueden hacer tu rostro más rígido.'
        },
        colors: ['Plateado', 'Transparente', 'Carey claro'],
    },
    heart: {
        name: 'Corazón',
        icon: '▽',
        description: 'Frente ancha, pómulos altos, barbilla puntiaguda',
        recommendedShapes: ['Aviador', 'Mariposa', 'Redondo', 'Sin montura inferior'],
        analysis: {
            characteristics: ['Frente prominente', 'Pómulos altos', 'Barbilla definida'],
            bestFor: 'Monturas que equilibran la parte superior con la inferior de tu rostro.',
            avoid: 'Monturas muy anchas arriba pueden acentuar tu frente.'
        },
        colors: ['Dorado rosa', 'Burgundy', 'Nude'],
    },
    oblong: {
        name: 'Alargado',
        icon: '⬭',
        description: 'Rostro más largo que ancho, frente alta',
        recommendedShapes: ['Oversize', 'Cuadrado ancho', 'Aviador grande', 'Wayfarer'],
        analysis: {
            characteristics: ['Rostro elongado', 'Frente alta', 'Proporciones verticales'],
            bestFor: 'Las monturas anchas y con puente bajo crean proporción y balance horizontal.',
            avoid: 'Monturas pequeñas o estrechas acentúan la longitud de tu rostro.'
        },
        colors: ['Negro mate', 'Tortoise oscuro', 'Azul marino'],
    },
};

const QUIZ_STEPS = [
    {
        id: 'face-shape',
        title: '¿Cómo describes tu rostro?',
        subtitle: 'Mírate al espejo y elige la opción que más se parezca',
        options: Object.entries(FACE_TYPES).map(([key, face]) => ({
            value: key,
            label: face.name,
            emoji: face.icon,
            tip: face.description,
        })),
    },
    {
        id: 'style',
        title: '¿Cuál es tu vibe?',
        subtitle: 'Elige el estilo que más te representa',
        options: [
            { value: 'clasico', label: 'Clásico', emoji: '🎩', tip: 'Elegante, atemporal, sofisticado' },
            { value: 'moderno', label: 'Moderno', emoji: '⚡', tip: 'Tendencias, vanguardia, innovador' },
            { value: 'relajado', label: 'Relajado', emoji: '🌊', tip: 'Casual, cómodo, natural' },
            { value: 'atrevido', label: 'Atrevido', emoji: '🔥', tip: 'Llamativo, único, expresivo' },
            { value: 'minimalista', label: 'Minimalista', emoji: '⚪', tip: 'Simple, limpio, esencial' },
        ],
    },
    {
        id: 'activity',
        title: '¿Para qué los usarás más?',
        subtitle: 'Esto nos ayuda a recomendar el material ideal',
        options: [
            { value: 'trabajo', label: 'Trabajo', emoji: '💼', tip: 'Oficina, videollamadas' },
            { value: 'deportes', label: 'Deportes', emoji: '🏃', tip: 'Actividades físicas' },
            { value: 'diario', label: 'Uso diario', emoji: '☀️', tip: 'Todo el día, versátil' },
            { value: 'ocasiones', label: 'Ocasiones', emoji: '🎉', tip: 'Eventos, salidas' },
            { value: 'pantallas', label: 'Pantallas', emoji: '💻', tip: 'Computadora, celular' },
        ],
    },
];

export interface HomeQuizProps {
    isOpen: boolean;
    onClose: () => void;
    initialStep?: number;
    initialStyle?: string;
    embedded?: boolean;
}

export default function HomeQuiz({ isOpen, onClose, initialStep = 0, initialStyle, embedded = false }: HomeQuizProps) {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [answers, setAnswers] = useState<Record<string, string>>(initialStyle ? { style: initialStyle } : {});
    const [showResults, setShowResults] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [skinToneResult, setSkinToneResult] = useState<AnalysisResult['skinTone'] | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const totalSteps = QUIZ_STEPS.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;
    const currentQuestion = QUIZ_STEPS[currentStep];

    if (!isOpen && !embedded) return null;

    const handleOptionSelect = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value,
        }));

        if (isAnimating) return;

        handleNext();
    };

    const handleAnalysisComplete = (result: AnalysisResult) => {
        setAnswers(prev => ({
            ...prev,
            'face-shape': result.faceShape
        }));
        setSkinToneResult(result.skinTone);
        setShowCamera(false);
        setTimeout(() => {
            if (currentStep < totalSteps - 1) {
                setCurrentStep(prev => prev + 1);
            }
        }, 500);
    };

    const handleNext = () => {
        setIsAnimating(true);
        setTimeout(() => {
            if (currentStep < totalSteps - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                setShowResults(true);
            }
            setIsAnimating(false);
        }, 300);
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            if (embedded) {
                onClose(); // Reset parent state
            } else {
                onClose();
            }
        }
    };

    const getFaceResult = () => {
        const faceKey = answers['face-shape'] as keyof typeof FACE_TYPES;
        return FACE_TYPES[faceKey] || FACE_TYPES.oval;
    };

    const handleShare = async () => {
        const result = getFaceResult();
        const shareText = `👓 Descubrí que tengo rostro "${result.name}" en Mexilux!\n\n✨ Mis monturas ideales: ${result.recommendedShapes.slice(0, 2).join(', ')}\n\n¿Cuál es tu tipo de rostro? 🇲🇽\nmexilux.com/quiz`;

        if (cardRef.current) {
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

                const imageData = canvas.toDataURL('image/png');

                if (navigator.share) {
                    try {
                        const response = await fetch(imageData);
                        const blob = await response.blob();
                        const file = new File([blob], 'mi-resultado-mexilux.png', { type: 'image/png' });

                        await navigator.share({
                            title: 'Mi Resultado Mexilux',
                            text: shareText,
                            files: [file],
                        });
                        return;
                    } catch {
                        // continue
                    }
                }

                const link = document.createElement('a');
                link.download = 'mi-resultado-mexilux.png';
                link.href = imageData;
                link.click();
                alert('¡Imagen descargada! 📱 Compártela en tus historias');
                return;
            } catch (error) {
                console.error('Error generating image:', error);
            }
        }

        navigator.clipboard.writeText(shareText);
        alert('¡Texto copiado! Pégalo en tus redes sociales');
    };

    const canProceed = answers[currentQuestion?.id];

    // --- RENDER HELPERS ---

    // Base styles (modal vs embedded)
    const containerStyle: React.CSSProperties = embedded
        ? { width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: 'transparent' }
        : {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#fff',
            zIndex: 9999,
            overflowY: 'auto'
        };

    const contentStyle: React.CSSProperties = embedded
        ? { width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }
        : { paddingTop: '80px', minHeight: '100vh', width: '100%', backgroundColor: '#fff' };

    // --- CAMERA MODE ---
    if (showCamera) {
        return (
            <div style={embedded ? {
                width: '100%',
                height: '100%',
                minHeight: '500px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'transparent',
                borderRadius: '20px'
            } : containerStyle}>
                <div style={{
                    position: 'relative',
                    height: '100%',
                    minHeight: embedded ? '500px' : 'auto',
                    width: '100%',
                    backgroundColor: '#f5f7fa',
                    borderRadius: embedded ? '20px' : '0',
                    overflow: 'hidden'
                }}>
                    <button
                        onClick={() => setShowCamera(false)}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '25px',
                            zIndex: 100000,
                            background: 'rgba(255,255,255,0.8)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            fontSize: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        ✕
                    </button>
                    <FaceAnalyzer
                        onComplete={handleAnalysisComplete}
                        onCancel={() => setShowCamera(false)}
                        embedded={embedded}
                    />
                </div>
            </div>
        );
    }

    // --- RESULTS MODE ---
    if (showResults) {
        const result = getFaceResult();

        return (
            <div style={{
                position: embedded ? 'relative' : 'fixed',
                top: 0,
                left: 0,
                width: embedded ? '100%' : '100vw',
                height: embedded ? '100%' : '100vh',
                background: 'linear-gradient(135deg, #EEEADE 0%, #e8e3d6 50%, #d4c9b0 100%)',
                zIndex: embedded ? 1 : 9999,
                overflowY: 'auto',
                borderRadius: embedded ? '24px' : '0'
            }}>
                {/* Orbes decorativos sutiles */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '-5%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(138, 102, 35, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '-5%',
                    width: '250px',
                    height: '250px',
                    background: 'radial-gradient(circle, rgba(21, 33, 50, 0.08) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                }} />

                {/* Botón cerrar */}
                {!embedded && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: '20px',
                            right: '20px',
                            zIndex: 1000,
                            background: 'rgba(255,255,255,0.8)',
                            backdropFilter: 'blur(10px)',
                            color: '#1D1E21',
                            border: 'none',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            fontSize: '18px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                    >
                        ✕
                    </button>
                )}

                {/* Contenido principal */}
                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: embedded ? '24px 16px' : '100px 20px 60px',
                    maxWidth: '440px',
                    margin: '0 auto',
                    minHeight: embedded ? 'auto' : '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Tarjeta principal con glassmorphism */}
                    <div
                        ref={cardRef}
                        style={{
                            background: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '28px',
                            padding: embedded ? '28px 24px' : '40px 32px',
                            border: '1px solid rgba(255, 255, 255, 0.6)',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0,0,0,0.1)',
                            marginBottom: '24px'
                        }}
                    >
                        {/* Badge */}
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '8px 20px',
                                background: 'linear-gradient(135deg, #152132 0%, #1c2d42 100%)',
                                color: '#EEEADE',
                                borderRadius: '30px',
                                fontSize: '11px',
                                fontWeight: '700',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase'
                            }}>Tu Análisis Facial</span>
                        </div>

                        {/* Icono del tipo de rostro */}
                        <div style={{
                            width: '90px',
                            height: '90px',
                            margin: '0 auto 20px',
                            background: 'linear-gradient(135deg, rgba(138, 102, 35, 0.12) 0%, rgba(130, 108, 64, 0.06) 100%)',
                            borderRadius: result.name === 'Ovalado' ? '48% 48% 42% 42%' :
                                result.name === 'Redondo' ? '50%' :
                                    result.name === 'Cuadrado' ? '18%' :
                                        result.name === 'Corazón' ? '48% 48% 38% 38%' : '38% 38% 32% 32%',
                            border: '2.5px solid #8A6623',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 32px rgba(138, 102, 35, 0.12)'
                        }}>
                            <span style={{ fontSize: '36px' }}>
                                {result.name === 'Ovalado' ? '👤' :
                                    result.name === 'Redondo' ? '😊' :
                                        result.name === 'Cuadrado' ? '😎' :
                                            result.name === 'Corazón' ? '💕' : '✨'}
                            </span>
                        </div>

                        {/* Título del resultado */}
                        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                            <p style={{ fontSize: '13px', color: '#826C40', margin: '0 0 6px 0', fontWeight: '500' }}>Tu tipo de rostro</p>
                            <h2 style={{
                                fontSize: '32px',
                                fontWeight: '800',
                                color: '#152132',
                                margin: '0 0 10px 0',
                                letterSpacing: '-0.02em'
                            }}>
                                {result.name}
                            </h2>
                            <p style={{ fontSize: '14px', color: '#6b5d4d', margin: 0, lineHeight: '1.5', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto' }}>
                                {result.description}
                            </p>
                        </div>

                        {/* Sección de características */}
                        <div style={{
                            background: 'rgba(138, 102, 35, 0.06)',
                            borderRadius: '18px',
                            padding: '20px',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{
                                fontSize: '11px',
                                color: '#8A6623',
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                marginBottom: '14px',
                                fontWeight: '700'
                            }}>Tus Características</h3>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                                {result.analysis.characteristics.map((char, idx) => (
                                    <span key={idx} style={{
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        color: '#3d3425',
                                        padding: '8px 14px',
                                        borderRadius: '24px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        border: '1px solid rgba(138, 102, 35, 0.15)'
                                    }}>{char}</span>
                                ))}
                            </div>

                            <div style={{
                                background: 'rgba(255,255,255,0.6)',
                                borderRadius: '12px',
                                padding: '14px',
                                marginBottom: '10px'
                            }}>
                                <p style={{ fontSize: '13px', color: '#2d2820', margin: 0, lineHeight: '1.6' }}>
                                    <span style={{ color: '#8A6623', fontWeight: '600' }}>✓ </span>
                                    {result.analysis.bestFor}
                                </p>
                            </div>

                            <p style={{ fontSize: '12px', color: '#7a6b5a', margin: 0, lineHeight: '1.5', fontStyle: 'italic' }}>
                                💡 {result.analysis.avoid}
                            </p>
                        </div>

                        {/* Tono de piel */}
                        {skinToneResult && (
                            <div style={{
                                background: 'rgba(138, 102, 35, 0.06)',
                                borderRadius: '18px',
                                padding: '18px 20px',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                            }}>
                                <div style={{
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '50%',
                                    backgroundColor: `rgb(${skinToneResult.rgb.join(',')})`,
                                    border: '3px solid rgba(255,255,255,0.9)',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                    flexShrink: 0
                                }} />
                                <div>
                                    <h3 style={{ fontSize: '11px', color: '#8A6623', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px 0', fontWeight: '700' }}>Tu Tono</h3>
                                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#152132', margin: '0 0 2px 0' }}>
                                        {skinToneResult.category === 'light' ? 'Claro' : skinToneResult.category === 'medium' ? 'Medio' : 'Oscuro'}
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#7a6b5a', margin: 0 }}>
                                        Subtono {skinToneResult.undertone === 'warm' ? 'Cálido' : skinToneResult.undertone === 'cool' ? 'Frío' : 'Neutro'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Monturas recomendadas */}
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <h3 style={{
                                fontSize: '11px',
                                color: '#8A6623',
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                marginBottom: '14px',
                                fontWeight: '700'
                            }}>Monturas Ideales</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                                {result.recommendedShapes.slice(0, 4).map((shape, idx) => (
                                    <span key={idx} style={{
                                        background: 'linear-gradient(135deg, #152132 0%, #1c2d42 100%)',
                                        color: '#EEEADE',
                                        padding: '10px 18px',
                                        borderRadius: '24px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        boxShadow: '0 4px 12px rgba(21, 33, 50, 0.15)'
                                    }}>{shape}</span>
                                ))}
                            </div>
                        </div>

                        {/* Colores */}
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{
                                fontSize: '11px',
                                color: '#8A6623',
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                marginBottom: '12px',
                                fontWeight: '700'
                            }}>Colores Recomendados</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                {result.colors.map((color, idx) => (
                                    <span key={idx} style={{
                                        background: 'rgba(255,255,255,0.7)',
                                        color: '#4a3f32',
                                        padding: '8px 14px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        border: '1px solid rgba(138, 102, 35, 0.2)'
                                    }}>{color}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción - fuera de la tarjeta */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 4px' }}>
                        <Link
                            href="/catalogo"
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                padding: '18px 24px',
                                background: 'linear-gradient(135deg, #8A6623 0%, #a67c2e 100%)',
                                color: '#fff',
                                borderRadius: '16px',
                                fontSize: '16px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                boxShadow: '0 8px 24px rgba(138, 102, 35, 0.25)',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                        >
                            Ver Monturas Recomendadas
                        </Link>

                        <button
                            onClick={handleShare}
                            style={{
                                padding: '16px 24px',
                                background: 'rgba(255,255,255,0.8)',
                                backdropFilter: 'blur(10px)',
                                color: '#152132',
                                border: '1px solid rgba(21, 33, 50, 0.1)',
                                borderRadius: '16px',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
                            }}
                        >
                            📤 Compartir Resultado
                        </button>

                        <button
                            onClick={() => {
                                if (embedded) onClose();
                                setShowResults(false);
                                setCurrentStep(0);
                                setAnswers({});
                                setSkinToneResult(null);
                            }}
                            style={{
                                padding: '14px',
                                background: 'transparent',
                                color: '#7a6b5a',
                                border: 'none',
                                fontSize: '14px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            ← Hacer otro análisis
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- WIZARD / QUESTION MODE ---
    return (
        <div style={containerStyle} className="quiz-container">
            {!embedded && (
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        zIndex: 100,
                        background: 'transparent',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#000'
                    }}
                >
                    ✕
                </button>
            )}

            <main className="quiz-wizard-content" style={contentStyle}>
                <div className="section-container" style={{ width: '100%', height: '100%', maxWidth: embedded ? '100%' : '800px', margin: '0 auto', padding: embedded ? '0 16px' : '0 20px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>

                    {!embedded && (
                        <header className="quiz-page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>🇲🇽 ¿Qué tipo de mexicano eres?</h1>
                            <p style={{ color: '#666' }}>Descubre tu estilo y qué lentes te quedan mejor</p>
                        </header>
                    )}

                    <div className="quiz-wizard" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {/* Progress Bar */}
                        <div className="quiz-progress" style={{ marginBottom: '24px', width: '100%' }}>
                            <div className="progress-bar" style={{ height: '4px', background: '#f0f0f0', borderRadius: '2px', overflow: 'hidden' }}>
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progress}%`, height: '100%', background: '#0071e3', transition: 'width 0.3s ease' }}
                                />
                            </div>
                            <span className="progress-text" style={{ fontSize: '12px', color: '#999', marginTop: '4px', display: 'block', textAlign: 'right' }}>
                                {currentStep + 1} / {totalSteps}
                            </span>
                        </div>

                        {/* Step Content */}
                        <section className={`quiz-step ${isAnimating ? 'animating-out' : ''}`} style={{ flex: 1, overflowY: 'auto', width: '100%' }}>
                            <h2 style={{ fontSize: embedded ? '20px' : '24px', textAlign: 'center', marginBottom: '8px' }}>{currentQuestion.title}</h2>
                            <p className="step-description" style={{ textAlign: 'center', color: '#666', marginBottom: '24px', fontSize: embedded ? '14px' : '16px' }}>{currentQuestion.subtitle}</p>

                            {/* Camera Option (Only for step 0) */}
                            {currentStep === 0 && (
                                <div className="quiz-ai-section" style={{ marginBottom: '24px', textAlign: 'center', width: '100%' }}>
                                    <button
                                        className="btn-ai-analyze"
                                        onClick={() => setShowCamera(true)}
                                        style={{
                                            background: '#000',
                                            color: '#fff',
                                            border: 'none',
                                            padding: embedded ? '12px 24px' : '16px 32px',
                                            borderRadius: '50px',
                                            fontSize: embedded ? '14px' : '16px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                                            marginBottom: '16px',
                                            width: embedded ? '100%' : 'auto',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <span>Analizar mi rostro con IA</span>
                                    </button>
                                    <div className="quiz-ai-divider" style={{ borderTop: '1px solid #eee', position: 'relative', margin: '16px 0', width: '100%' }}>
                                        <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '0 10px', color: '#999', fontSize: '12px' }}>
                                            o selecciona manualmente
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Options Grid - Single column on mobile for full width */}
                            <div className="quiz-options-grid" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                width: '100%'
                            }}>
                                {currentQuestion.options.map((option) => (
                                    <label
                                        key={option.value}
                                        className={`quiz-option-card ${answers[currentQuestion.id] === option.value ? 'selected' : ''}`}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: '14px 16px',
                                            borderRadius: '12px',
                                            border: answers[currentQuestion.id] === option.value ? '2px solid #0071e3' : '1px solid #eee',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            backgroundColor: answers[currentQuestion.id] === option.value ? '#f5f9ff' : '#fff',
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            gap: '12px'
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name={currentQuestion.id}
                                            value={option.value}
                                            checked={answers[currentQuestion.id] === option.value}
                                            onChange={() => handleOptionSelect(option.value)}
                                            style={{ display: 'none' }}
                                        />
                                        <span className="option-emoji" style={{ fontSize: '24px', flexShrink: 0 }}>{option.emoji}</span>
                                        <span className="option-label" style={{ fontWeight: '600', fontSize: '15px', textAlign: 'left' }}>{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Navigation */}
                        <div className="quiz-navigation" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f0f0f0', width: '100%' }}>
                            <button
                                className="btn btn-outline"
                                onClick={handlePrevious}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    color: '#666'
                                }}
                            >
                                ← {currentStep === 0 ? 'Cancelar' : 'Anterior'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
