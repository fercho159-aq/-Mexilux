'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import FaceAnalyzer, { AnalysisResult } from '@/components/quiz/FaceAnalyzer';

// Tipos de rostro y sus características (Copiado de quiz/page.tsx)
const FACE_TYPES: { [key: string]: { name: string; icon: string; description: string; recommendedShapes: string[]; celebrity: { name: string; title: string; description: string; quote: string }; colors: string[] } } = {
    oval: {
        name: 'Ovalado',
        icon: '○',
        description: 'Frente ligeramente más ancha que la mandíbula, pómulos definidos',
        recommendedShapes: ['Cualquier forma te queda', 'Aviador', 'Cuadrado', 'Cat Eye'],
        celebrity: {
            name: 'Eugenio Derbez',
            title: 'El Versátil',
            description: 'Como Eugenio, tu rostro equilibrado te permite experimentar con cualquier estilo. Eres adaptable y carismático.',
            quote: '"La vida es como unas gafas... hay que saber ajustarlas"',
        },
        colors: ['Negro clásico', 'Carey', 'Dorado'],
    },
    round: {
        name: 'Redondo',
        icon: '●',
        description: 'Mejillas prominentes, frente y mandíbula de anchura similar',
        recommendedShapes: ['Rectangular', 'Cuadrado', 'Aviador', 'Cat Eye'],
        celebrity: {
            name: 'Yalitza Aparicio',
            title: 'La Carismática',
            description: 'Como Yalitza, transmites calidez y cercanía. Las monturas angulares realzan tu expresividad natural.',
            quote: '"La belleza está en la autenticidad"',
        },
        colors: ['Negro', 'Azul oscuro', 'Verde bosque'],
    },
    square: {
        name: 'Cuadrado',
        icon: '■',
        description: 'Mandíbula angular, frente ancha, rasgos definidos',
        recommendedShapes: ['Redondo', 'Ovalado', 'Cat Eye', 'Aviador curvo'],
        celebrity: {
            name: 'Diego Luna',
            title: 'El Decidido',
            description: 'Como Diego, tienes presencia fuerte y determinada. Las monturas redondeadas suavizan y equilibran tus rasgos.',
            quote: '"La fuerza está en saber elegir"',
        },
        colors: ['Plateado', 'Transparente', 'Carey claro'],
    },
    heart: {
        name: 'Corazón',
        icon: '▽',
        description: 'Frente ancha, pómulos altos, barbilla puntiaguda',
        recommendedShapes: ['Aviador', 'Mariposa', 'Redondo', 'Sin montura inferior'],
        celebrity: {
            name: 'Salma Hayek',
            title: 'La Apasionada',
            description: 'Como Salma, irradias energía y pasión. Las monturas que equilibran la parte superior de tu rostro te favorecen.',
            quote: '"El estilo es una forma de decir quién eres"',
        },
        colors: ['Dorado rosa', 'Burgundy', 'Nude'],
    },
    oblong: {
        name: 'Alargado',
        icon: '⬭',
        description: 'Rostro más largo que ancho, frente alta',
        recommendedShapes: ['Oversize', 'Cuadrado ancho', 'Aviador grande', 'Wayfarer'],
        celebrity: {
            name: 'Gael García Bernal',
            title: 'El Soñador',
            description: 'Como Gael, tienes un aire artístico y reflexivo. Las monturas anchas crean proporción y balance.',
            quote: '"Los sueños se ven mejor con buenos lentes"',
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
        const shareText = `🇲🇽 Descubrí que soy "${result.celebrity.title}" según mi tipo de rostro en Mexilux!\n\n${result.celebrity.quote}\n\n¿Cuál eres tú? 👓\nmexilux.com/quiz`;

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
            <div style={containerStyle}>
                <div style={{ position: 'relative', height: '100%', width: '100%', backgroundColor: '#000', borderRadius: embedded ? '20px' : '0' }}>
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
        const resultsContainerStyle: React.CSSProperties = embedded
            ? { width: '100%', height: '100%', position: 'relative', backgroundColor: 'transparent', borderRadius: '24px', overflowY: 'auto' }
            : { ...containerStyle, backgroundColor: '#1a1a2e' };

        return (
            <div style={resultsContainerStyle}>
                {!embedded && (
                    <button
                        onClick={onClose}
                        className="close-button-quiz"
                        style={{
                            position: 'fixed',
                            top: '20px',
                            right: '20px',
                            zIndex: 1000,
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            fontSize: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        ✕
                    </button>
                )}

                <div className="quiz-results-wrapped" style={embedded ? { padding: '0', width: '100%', height: '100%' } : { paddingTop: '80px', minHeight: '100vh', width: '100%' }}>
                    {/* Background effects */}
                    <div className="wrapped-background" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden', borderRadius: '24px' }}>
                        <div className="wrapped-gradient" />
                        <div className="wrapped-particles" />
                    </div>

                    <div className="wrapped-container" style={{ position: 'relative', zIndex: 1, paddingBottom: embedded ? '20px' : '60px', height: '100%', overflowY: 'auto' }}>
                        <div
                            className="wrapped-card"
                            ref={cardRef}
                            style={{
                                background: 'linear-gradient(180deg, #1a1a2e 0%, #0f172a 50%, #1e1b4b 100%)',
                                padding: embedded ? '24px 20px' : '48px 32px',
                                borderRadius: '32px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 80px rgba(233, 69, 96, 0.15)',
                                maxWidth: embedded ? '100%' : '420px',
                                margin: '0 auto',
                                maxHeight: embedded ? '600px' : 'none'
                            }}
                        >
                            <div className="wrapped-header" style={{ textAlign: 'center', marginBottom: '16px' }}>
                                <span className="wrapped-badge" style={{ marginBottom: '10px', fontSize: '10px' }}>MEXILUX 2024</span>
                                <div style={{
                                    width: embedded ? '80px' : '100px',
                                    height: embedded ? '80px' : '100px',
                                    margin: '10px auto',
                                    background: 'linear-gradient(135deg, rgba(233, 69, 96, 0.2), rgba(255, 107, 107, 0.1))',
                                    borderRadius: result.name === 'Ovalado' ? '50% 50% 45% 45%' :
                                        result.name === 'Redondo' ? '50%' :
                                            result.name === 'Cuadrado' ? '20%' :
                                                result.name === 'Corazón' ? '50% 50% 40% 40%' : '40% 40% 35% 35%',
                                    border: '3px solid #e94560',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 40px rgba(233, 69, 96, 0.3)'
                                }}>
                                    <span style={{ fontSize: embedded ? '30px' : '40px', color: '#e94560' }}>
                                        {result.name === 'Ovalado' ? '👤' :
                                            result.name === 'Redondo' ? '😊' :
                                                result.name === 'Cuadrado' ? '😎' :
                                                    result.name === 'Corazón' ? '💕' : '🌟'}
                                    </span>
                                </div>
                            </div>

                            <div className="wrapped-celebrity" style={{ textAlign: 'center', marginBottom: '16px' }}>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 4px 0' }}>Eres</p>
                                <h2 style={{ fontSize: embedded ? '24px' : '32px', fontWeight: 800, color: '#e94560', margin: '0 0 8px 0' }}>{result.celebrity.title}</h2>
                                <p style={{ fontSize: embedded ? '14px' : '16px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Como <strong style={{ color: 'white' }}>{result.celebrity.name}</strong></p>
                            </div>

                            <div className="wrapped-quote" style={{
                                fontStyle: 'italic',
                                color: 'rgba(255,255,255,0.9)',
                                padding: '12px 16px',
                                margin: '16px 0',
                                borderLeft: '3px solid #e94560',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '0 8px 8px 0',
                            }}>
                                <p style={{ margin: 0, fontSize: '14px' }}>{result.celebrity.quote}</p>
                            </div>

                            <div className="wrapped-recommendations" style={{ marginBottom: '16px', textAlign: 'center' }}>
                                <h3 style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Tus monturas</h3>
                                <div className="wrapped-shapes" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                                    {result.recommendedShapes.slice(0, 3).map((shape, idx) => (
                                        <span key={idx} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px' }}>{shape}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="wrapped-actions" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button className="btn-wrapped-share" onClick={handleShare} style={{ padding: '12px' }}>
                                Compartir
                            </button>
                            <Link href="/catalogo" className="btn-wrapped-primary" style={{ textAlign: 'center', padding: '12px' }}>
                                Ver monturas
                            </Link>
                            <button
                                className="btn-wrapped-secondary"
                                onClick={() => {
                                    if (embedded) {
                                        onClose(); // Reset parent state
                                    }
                                    setShowResults(false);
                                    setCurrentStep(0);
                                    setAnswers({});
                                }}
                                style={{ padding: '10px' }}
                            >
                                Volver al inicio
                            </button>
                        </div>
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

            <main className="quiz-content" style={contentStyle}>
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
