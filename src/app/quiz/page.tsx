/**
 * ═══════════════════════════════════════════════════════════════════════════
 * QUIZ DE ESTILO (SITEMAP 1.3)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Quiz rápido para recomendar monturas basadas en:
 * - Tipo de rostro
 * - Estilo de vida
 * - Preferencias estéticas
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';

const QUIZ_STEPS = [
    {
        id: 'face-shape',
        title: '¿Cuál es la forma de tu rostro?',
        description: 'Esto nos ayuda a recomendarte monturas que complementen tus facciones',
        options: [
            { value: 'oval', label: 'Ovalado', emoji: '🥚', tip: 'Frente ligeramente más ancha que la mandíbula' },
            { value: 'round', label: 'Redondo', emoji: '🔴', tip: 'Mejillas suaves, frente y mandíbula similares' },
            { value: 'square', label: 'Cuadrado', emoji: '⬛', tip: 'Mandíbula angular y frente ancha' },
            { value: 'heart', label: 'Corazón', emoji: '💜', tip: 'Frente ancha y barbilla puntiaguda' },
            { value: 'oblong', label: 'Alargado', emoji: '📏', tip: 'Rostro más largo que ancho' },
        ],
    },
    {
        id: 'lifestyle',
        title: '¿Cuál describe mejor tu estilo de vida?',
        description: 'Elegiremos monturas que se adapten a tu día a día',
        options: [
            { value: 'professional', label: 'Profesional', emoji: '👔', tip: 'Oficina, reuniones, presentaciones' },
            { value: 'active', label: 'Activo/Deportivo', emoji: '⚽', tip: 'Ejercicio, actividades al aire libre' },
            { value: 'creative', label: 'Creativo', emoji: '🎨', tip: 'Arte, diseño, ambiente casual' },
            { value: 'casual', label: 'Casual', emoji: '🌴', tip: 'Relajado, día a día, versátil' },
            { value: 'trendy', label: 'Trendy', emoji: '✨', tip: 'Moda, tendencias, expresión personal' },
        ],
    },
    {
        id: 'color-preference',
        title: '¿Qué colores prefieres?',
        description: 'El color de la montura complementará tu tono de piel y cabello',
        options: [
            { value: 'classic', label: 'Clásicos', emoji: '⚫', tip: 'Negro, café, tortoise' },
            { value: 'metal', label: 'Metálicos', emoji: '🥈', tip: 'Dorado, plateado, oro rosa' },
            { value: 'bold', label: 'Atrevidos', emoji: '🔴', tip: 'Rojo, azul, verde' },
            { value: 'transparent', label: 'Transparentes', emoji: '💎', tip: 'Cristal, translúcidos' },
            { value: 'neutral', label: 'Neutros', emoji: '🤎', tip: 'Beige, nude, grises' },
        ],
    },
];

// Resultados basados en combinaciones
const RECOMMENDATIONS: Record<string, { title: string; description: string; shapes: string[] }> = {
    'default': {
        title: 'Monturas Versátiles',
        description: 'Basado en tus preferencias, te recomendamos monturas que combinan estilo y comodidad.',
        shapes: ['rectangular', 'aviador', 'cat-eye'],
    },
    'oval-professional-classic': {
        title: 'Elegancia Clásica',
        description: 'Tu rostro ovalado es muy versátil. Para un look profesional, las monturas rectangulares en negro o carey son perfectas.',
        shapes: ['rectangular', 'cuadrado'],
    },
    'round-active-bold': {
        title: 'Deportivo con Personalidad',
        description: 'Para equilibrar tu rostro redondo y tu estilo activo, te van monturas angulares en colores vibrantes.',
        shapes: ['rectangular', 'aviador', 'cuadrado'],
    },
    'square-creative-transparent': {
        title: 'Creativo y Moderno',
        description: 'Suaviza tus rasgos angulares con monturas redondas o cat-eye en tonos transparentes.',
        shapes: ['redondo', 'cat-eye', 'ovalado'],
    },
};

export default function QuizPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);

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
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Mostrar resultados
            setShowResults(true);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const getRecommendation = () => {
        const key = `${answers['face-shape']}-${answers['lifestyle']}-${answers['color-preference']}`;
        return RECOMMENDATIONS[key] || RECOMMENDATIONS['default'];
    };

    const canProceed = answers[currentQuestion?.id];

    if (showResults) {
        const recommendation = getRecommendation();

        return (
            <main className="quiz-page">
                <div className="section-container">
                    <header className="quiz-page-header">
                        <Link href="/" className="back-link">← Volver al inicio</Link>
                        <h1>¡Tus resultados están listos!</h1>
                    </header>

                    <div className="quiz-results">
                        <div className="results-card">
                            <div className="results-icon">🎉</div>
                            <h2>{recommendation.title}</h2>
                            <p className="results-description">{recommendation.description}</p>

                            <div className="recommended-shapes">
                                <h3>Formas recomendadas para ti:</h3>
                                <div className="shapes-list">
                                    {recommendation.shapes.map((shape, idx) => (
                                        <span key={idx} className="shape-tag">
                                            {shape.charAt(0).toUpperCase() + shape.slice(1)}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="results-summary">
                                <h4>Tu perfil:</h4>
                                <ul>
                                    <li><strong>Rostro:</strong> {answers['face-shape']}</li>
                                    <li><strong>Estilo:</strong> {answers['lifestyle']}</li>
                                    <li><strong>Colores:</strong> {answers['color-preference']}</li>
                                </ul>
                            </div>

                            <div className="results-actions">
                                <Link
                                    href={`/catalogo?forma=${recommendation.shapes[0]}`}
                                    className="btn btn-primary"
                                >
                                    Ver monturas recomendadas →
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowResults(false);
                                        setCurrentStep(0);
                                        setAnswers({});
                                    }}
                                    className="btn btn-outline"
                                >
                                    Repetir quiz
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="quiz-page">
            <div className="section-container">
                <header className="quiz-page-header">
                    <Link href="/" className="back-link">← Volver al inicio</Link>
                    <h1>Encuentra tu estilo perfecto</h1>
                    <p>Responde 3 preguntas y te recomendaremos las monturas ideales para ti</p>
                </header>

                <div className="quiz-wizard">
                    {/* Progress */}
                    <div className="quiz-progress">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <span className="progress-text">
                            Pregunta {currentStep + 1} de {totalSteps}
                        </span>
                    </div>

                    {/* Current Step */}
                    <section className="quiz-step active">
                        <h2>{currentQuestion.title}</h2>
                        <p className="step-description">{currentQuestion.description}</p>

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
                            {currentStep === totalSteps - 1 ? 'Ver resultados →' : 'Siguiente →'}
                        </button>
                    </div>
                </div>

                {/* Help section */}
                <section className="quiz-help">
                    <h3>¿No conoces la forma de tu rostro?</h3>
                    <p>
                        Toma una foto de frente mirando directamente a la cámara y compara con las
                        siluetas. También puedes visitarnos y te ayudamos a identificarlo.
                    </p>
                    <div className="help-actions">
                        <Link href="/citas" className="btn btn-outline btn-sm">
                            Agendar asesoría gratuita
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
