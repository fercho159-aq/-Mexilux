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
import { useState } from 'react';

// Tipos de rostro y sus características
const FACE_TYPES = {
    oval: {
        name: 'Ovalado',
        emoji: '🥚',
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
        emoji: '🔴',
        description: 'Mejillas prominentes, frente y mandíbula de anchura similar',
        recommendedShapes: ['Rectangular', 'Cuadrado', 'Aviador', 'Cat Eye'],
        celebrity: {
            name: 'Yalitza Aparicio',
            title: 'El Carismático',
            description: 'Como Yalitza, transmites calidez y cercanía. Las monturas angulares realzan tu expresividad natural.',
            quote: '"La belleza está en la autenticidad"',
        },
        colors: ['Negro', 'Azul oscuro', 'Verde bosque'],
    },
    square: {
        name: 'Cuadrado',
        emoji: '⬛',
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
        emoji: '💜',
        description: 'Frente ancha, pómulos altos, barbilla puntiaguda',
        recommendedShapes: ['Aviador', 'Mariposa', 'Redondo', 'Sin montura inferior'],
        celebrity: {
            name: 'Salma Hayek',
            title: 'El Apasionado',
            description: 'Como Salma, irradias energía y pasión. Las monturas que equilibran la parte superior de tu rostro te favorecen.',
            quote: '"El estilo es una forma de decir quién eres"',
        },
        colors: ['Dorado rosa', 'Burgundy', 'Nude'],
    },
    oblong: {
        name: 'Alargado',
        emoji: '📏',
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
            emoji: face.emoji,
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

    const totalSteps = QUIZ_STEPS.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;
    const currentQuestion = QUIZ_STEPS[currentStep];

    const handleOptionSelect = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value,
        }));
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
        const shareText = `🇲🇽 Descubrí que soy "${result.celebrity.title}" según mi tipo de rostro en Mexilux!\n\n${result.celebrity.quote}\n\n¿Cuál eres tú? 👓`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Mi Resultado Mexilux',
                    text: shareText,
                    url: 'https://mexilux.com/quiz',
                });
            } catch {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText);
            alert('¡Copiado! Pégalo en tus redes sociales');
        }
    };

    const canProceed = answers[currentQuestion?.id];

    // ═══════════════════════════════════════════════════════════════════════════
    // PANTALLA DE RESULTADOS - Estilo Spotify Wrapped
    // ═══════════════════════════════════════════════════════════════════════════
    if (showResults) {
        const result = getFaceResult();

        return (
            <main className="quiz-results-wrapped">
                {/* Background animado */}
                <div className="wrapped-background">
                    <div className="wrapped-gradient" />
                    <div className="wrapped-particles" />
                </div>

                <div className="wrapped-container">
                    {/* Card principal estilo Wrapped */}
                    <div className="wrapped-card">
                        <div className="wrapped-header">
                            <span className="wrapped-badge">MEXILUX 2024</span>
                            <span className="wrapped-emoji">{result.emoji}</span>
                        </div>

                        <div className="wrapped-celebrity">
                            <h1 className="wrapped-title">Eres</h1>
                            <h2 className="wrapped-celebrity-title">{result.celebrity.title}</h2>
                            <p className="wrapped-celebrity-name">
                                Como <strong>{result.celebrity.name}</strong>
                            </p>
                        </div>

                        <div className="wrapped-quote">
                            <p>{result.celebrity.quote}</p>
                        </div>

                        <div className="wrapped-description">
                            <p>{result.celebrity.description}</p>
                        </div>

                        {/* Formas recomendadas */}
                        <div className="wrapped-recommendations">
                            <h3>Tus monturas ideales</h3>
                            <div className="wrapped-shapes">
                                {result.recommendedShapes.map((shape, idx) => (
                                    <span key={idx} className="wrapped-shape-tag">
                                        {shape}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Colores */}
                        <div className="wrapped-colors">
                            <h3>Colores que te favorecen</h3>
                            <div className="wrapped-color-list">
                                {result.colors.map((color, idx) => (
                                    <span key={idx} className="wrapped-color-tag">
                                        {color}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="wrapped-actions">
                        <button className="btn-wrapped-share" onClick={handleShare}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                <polyline points="16 6 12 2 8 6"/>
                                <line x1="12" y1="2" x2="12" y2="15"/>
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
