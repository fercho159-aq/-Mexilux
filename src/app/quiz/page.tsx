/**
 * ═══════════════════════════════════════════════════════════════════════════
 * QUIZ DE ESTILO MEXILUX - Estilo Spotify Wrapped 🇲🇽
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * - Categorización por tipo de rostro
 * - Resultados personalizados con armazones
 * - Comparación con celebridades mexicanas
 * - Diseño tipo Spotify Wrapped para compartir
 */

'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import FaceAnalyzer, { AnalysisResult } from '@/components/quiz/FaceAnalyzer';

// Tipos de rostro y sus características
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

export default function QuizPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [skinToneResult, setSkinToneResult] = useState<AnalysisResult['skinTone'] | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const totalSteps = QUIZ_STEPS.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;
    const currentQuestion = QUIZ_STEPS[currentStep];

    const handleOptionSelect = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value,
        }));
    };

    const handleAnalysisComplete = (result: AnalysisResult) => {
        // Guardar forma de rostro
        setAnswers(prev => ({
            ...prev,
            'face-shape': result.faceShape
        }));

        // Guardar tono de piel
        setSkinToneResult(result.skinTone);

        // Cerrar cámara y avanzar
        setShowCamera(false);
        // Pequeño delay para transición suave
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
        }
    };

    const getFaceResult = () => {
        const faceKey = answers['face-shape'] as keyof typeof FACE_TYPES;
        return FACE_TYPES[faceKey] || FACE_TYPES.oval;
    };


    const handleShare = async () => {
        const result = getFaceResult();
        const shareText = `🇲🇽 Descubrí que soy "${result.celebrity.title}" según mi tipo de rostro en Mexilux!\n\n${result.celebrity.quote}\n\n¿Cuál eres tú? 👓\nmexilux.com/quiz`;

        // Capturar la tarjeta con html2canvas
        if (cardRef.current) {
            try {
                // Important: Get the full scroll height of the element
                const element = cardRef.current;
                const elementRect = element.getBoundingClientRect();

                const canvas = await html2canvas(element, {
                    backgroundColor: '#1a1a2e',
                    scale: 2, // High quality
                    useCORS: true,
                    logging: false,
                    // Capture full element height
                    height: element.scrollHeight,
                    width: element.scrollWidth,
                    // Ensure we capture even if element is off-screen
                    scrollY: -window.scrollY,
                    scrollX: 0,
                    windowHeight: document.documentElement.offsetHeight,
                    // Don't clip to viewport
                    allowTaint: true,
                });

                const imageData = canvas.toDataURL('image/png');

                // Intentar compartir con Web Share API
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
                        // Fall through to download
                    }
                }

                // Descargar imagen
                const link = document.createElement('a');
                link.download = 'mi-resultado-mexilux.png';
                link.href = imageData;
                link.click();
                alert('¡Imagen descargada! 📱 Compártela en tus historias de Instagram, WhatsApp o TikTok');
                return;
            } catch (error) {
                console.error('Error generating image:', error);
            }
        }

        // Fallback: copy text
        navigator.clipboard.writeText(shareText);
        alert('¡Texto copiado! Pégalo en tus redes sociales');
    };

    const canProceed = answers[currentQuestion?.id];

    // ═══════════════════════════════════════════════════════════════════════════
    // PANTALLA DE CÁMARA
    // ═══════════════════════════════════════════════════════════════════════════
    if (showCamera) {
        return (
            <main className="quiz-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <FaceAnalyzer
                    onComplete={handleAnalysisComplete}
                    onCancel={() => setShowCamera(false)}
                />
            </main>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PANTALLA DE RESULTADOS - Estilo Spotify Wrapped
    // ═══════════════════════════════════════════════════════════════════════════
    if (showResults) {
        const result = getFaceResult();

        return (
            <main className="quiz-results-wrapped" style={{ paddingTop: '100px', minHeight: '100vh' }}>
                {/* Background animado */}
                <div className="wrapped-background">
                    <div className="wrapped-gradient" />
                    <div className="wrapped-particles" />
                </div>

                <div className="wrapped-container" style={{ paddingBottom: '60px' }}>
                    {/* Card principal estilo Wrapped - ref para captura */}
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
                        }}
                    >
                        <div className="wrapped-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <span
                                className="wrapped-badge"
                                style={{
                                    background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    letterSpacing: '0.2em',
                                    padding: '8px 20px',
                                    borderRadius: '20px',
                                    display: 'inline-block',
                                    marginBottom: '20px',
                                }}
                            >
                                MEXILUX 2024
                            </span>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                margin: '20px auto',
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
                                <span style={{ fontSize: '40px', color: '#e94560' }}>
                                    {result.name === 'Ovalado' ? '👤' :
                                        result.name === 'Redondo' ? '😊' :
                                            result.name === 'Cuadrado' ? '😎' :
                                                result.name === 'Corazón' ? '💕' : '🌟'}
                                </span>
                            </div>
                        </div>

                        <div className="wrapped-celebrity" style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', margin: '0 0 8px 0' }}>
                                Eres
                            </p>
                            <h2
                                style={{
                                    fontSize: '42px',
                                    fontWeight: 800,
                                    color: '#e94560',
                                    margin: '0 0 12px 0',
                                }}
                            >
                                {result.celebrity.title}
                            </h2>
                            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                                Como <strong style={{ color: 'white' }}>{result.celebrity.name}</strong>
                            </p>
                        </div>

                        <div
                            className="wrapped-quote"
                            style={{
                                fontStyle: 'italic',
                                color: 'rgba(255,255,255,0.9)',
                                padding: '16px 20px',
                                margin: '20px 0',
                                borderLeft: '3px solid #e94560',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '0 8px 8px 0',
                            }}
                        >
                            <p style={{ margin: 0, fontSize: '16px' }}>{result.celebrity.quote}</p>
                        </div>

                        <div className="wrapped-description" style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0, fontSize: '15px' }}>
                                {result.celebrity.description}
                            </p>
                        </div>

                        {/* Formas recomendadas */}
                        <div className="wrapped-recommendations" style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <h3 style={{
                                fontSize: '12px',
                                color: 'rgba(255,255,255,0.6)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '12px',
                            }}>
                                Tus monturas ideales
                            </h3>
                            <div className="wrapped-shapes" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                {result.recommendedShapes.map((shape, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            background: 'rgba(255,255,255,0.15)',
                                            color: 'white',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            fontSize: '14px',
                                        }}
                                    >
                                        {shape}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Colores */}
                        <div className="wrapped-colors" style={{ textAlign: 'center' }}>
                            <h3 style={{
                                fontSize: '12px',
                                color: 'rgba(255,255,255,0.6)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '12px',
                            }}>
                                Colores que te favorecen
                            </h3>
                            <div className="wrapped-color-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                {result.colors.map((color, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
                                            color: 'white',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            fontSize: '14px',
                                        }}
                                    >
                                        {color}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recomendación por Tono de Piel (Nuevo) */}
                    {skinToneResult && (
                        <div className="wrapped-skintone" style={{ marginTop: '24px', textAlign: 'center' }}>
                            <h3 style={{
                                fontSize: '12px',
                                color: 'rgba(255,255,255,0.6)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '12px',
                            }}>
                                Tu Análisis de Color
                            </h3>
                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '16px',
                                borderRadius: '16px',
                                display: 'inline-block'
                            }}>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                                    Detectamos un tono <strong>{skinToneResult.category === 'light' ? 'Claro' : skinToneResult.category === 'medium' ? 'Medio' : 'Oscuro'}</strong> con subtono <strong>{skinToneResult.undertone === 'warm' ? 'Cálido' : skinToneResult.undertone === 'cool' ? 'Frío' : 'Neutro'}</strong>
                                </p>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                                    {skinToneResult.undertone === 'warm' ? (
                                        <>
                                            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#FFD700', border: '2px solid rgba(255,255,255,0.2)' }} title="Dorado" />
                                            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#8B4513', border: '2px solid rgba(255,255,255,0.2)' }} title="Café" />
                                            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#556B2F', border: '2px solid rgba(255,255,255,0.2)' }} title="Verde Oliva" />
                                        </>
                                    ) : skinToneResult.undertone === 'cool' ? (
                                        <>
                                            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#C0C0C0', border: '2px solid rgba(255,255,255,0.2)' }} title="Plateado" />
                                            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#000000', border: '2px solid rgba(255,255,255,0.2)' }} title="Negro" />
                                            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#000080', border: '2px solid rgba(255,255,255,0.2)' }} title="Azul Marino" />
                                        </>
                                    ) : (
                                        <>
                                            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#000000', border: '2px solid rgba(255,255,255,0.2)' }} title="Negro" />
                                            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#FFD700', border: '2px solid rgba(255,255,255,0.2)' }} title="Dorado" />
                                            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#C0C0C0', border: '2px solid rgba(255,255,255,0.2)' }} title="Plateado" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer para compartir */}
                    <div style={{
                        marginTop: '32px',
                        paddingTop: '24px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        textAlign: 'center',
                    }}>
                        <p style={{ color: '#e94560', fontWeight: 600, fontSize: '18px', margin: '0 0 8px 0' }}>
                            ¿Cuál eres tú? 👓
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
                            mexilux.com/quiz
                        </p>
                    </div>


                    {/* Acciones */}
                    <div className="wrapped-actions">
                        <button className="btn-wrapped-share" onClick={handleShare}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                            </svg>
                            Compartir mi resultado
                        </button>

                        <Link href="/catalogo" className="btn-wrapped-primary">
                            👓 Ver monturas recomendadas
                        </Link>

                        <button
                            className="btn-wrapped-secondary"
                            onClick={() => {
                                setShowResults(false);
                                setCurrentStep(0);
                                setAnswers({});
                            }}
                        >
                            Repetir quiz
                        </button>
                    </div>

                    {/* Stats estilo Wrapped */}
                    <div className="wrapped-stats">
                        <div className="wrapped-stat">
                            <span className="stat-number">156+</span>
                            <span className="stat-label">Monturas para ti</span>
                        </div>
                        <div className="wrapped-stat">
                            <span className="stat-number">4</span>
                            <span className="stat-label">Formas ideales</span>
                        </div>
                        <div className="wrapped-stat">
                            <span className="stat-number">∞</span>
                            <span className="stat-label">Estilo</span>
                        </div>
                    </div>
                </div>
            </main >
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
                    <h1>🇲🇽 ¿Qué tipo de mexicano eres?</h1>
                    <p>Descubre tu estilo y qué lentes te quedan mejor</p>
                </header>

                <div className="quiz-wizard">
                    {/* Progress */}
                    <div className="quiz-progress">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="progress-text">
                            {currentStep + 1} / {totalSteps}
                        </span>
                    </div>

                    {/* Current Step */}
                    <section className={`quiz-step ${isAnimating ? 'animating-out' : ''}`}>
                        <h2>{currentQuestion.title}</h2>

                        {/* Botón de análisis IA solo en paso 1 */}
                        {currentStep === 0 && (
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
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                >
                                    <span>Analizar mi rostro con IA</span>
                                </button>

                                <div className="quiz-ai-divider">
                                    <span>o selecciona manualmente</span>
                                </div>
                            </div>
                        )}

                        <p className="step-description">{currentQuestion.subtitle}</p>

                        <div className="quiz-options-grid">
                            {currentQuestion.options.map((option) => (
                                <label
                                    key={option.value}
                                    className={`quiz-option-card ${answers[currentQuestion.id] === option.value ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name={currentQuestion.id}
                                        value={option.value}
                                        checked={answers[currentQuestion.id] === option.value}
                                        onChange={() => handleOptionSelect(option.value)}
                                    />
                                    <span className="option-emoji">{option.emoji}</span>
                                    <span className="option-label">{option.label}</span>
                                    <span className="option-tip">{option.tip}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Navigation */}
                    <div className="quiz-navigation">
                        <button
                            className="btn btn-outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                        >
                            ← Anterior
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleNext}
                            disabled={!canProceed}
                        >
                            {currentStep === totalSteps - 1 ? '¡Ver mi resultado! 🎉' : 'Siguiente →'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
