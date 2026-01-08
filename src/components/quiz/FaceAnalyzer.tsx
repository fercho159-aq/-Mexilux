'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

interface FaceAnalyzerProps {
    onComplete: (result: AnalysisResult) => void;
    onCancel: () => void;
    onManualSelect?: () => void;
    embedded?: boolean;
}

export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'oblong';
export type SkinTone = 'light' | 'medium' | 'dark';
export type Undertone = 'warm' | 'cool' | 'neutral';

export interface AnalysisResult {
    faceShape: FaceShape;
    skinTone: {
        category: SkinTone;
        undertone: Undertone;
        rgb: [number, number, number];
    };
}

export default function FaceAnalyzer({ onComplete, onCancel, onManualSelect, embedded = false }: FaceAnalyzerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState<'initial' | 'analyzing'>('initial');
    const [status, setStatus] = useState<'loading' | 'ready' | 'scanning' | 'analyzing' | 'error'>('loading');
    const [mode, setMode] = useState<'camera' | 'image'>('camera');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [feedback, setFeedback] = useState("Iniciando sistema...");
    const [faceDetected, setFaceDetected] = useState(false);

    const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const requestRef = useRef<number | null>(null);
    const [scanPhase, setScanPhase] = useState(0);

    useEffect(() => {
        if (step !== 'analyzing') return;

        const initMediaPipe = async () => {
            try {
                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
                );

                faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU"
                    },
                    outputFaceBlendshapes: true,
                    runningMode: "VIDEO",
                    numFaces: 1
                });

                setStatus('ready');
                setFeedback("Cámara lista. Colócate en el centro.");
                setTimeout(() => {
                    if (mode === 'camera') startCamera();
                }, 500);
            } catch (error) {
                console.error("Error loading MediaPipe:", error);
                setStatus('error');
                setFeedback("Error al cargar modelos de IA.");
            }
        };

        if (typeof window !== 'undefined') {
            initMediaPipe();
        }

        return () => {
            stopCamera();
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [step]);

    // Switch modes effect
    useEffect(() => {
        if (status === 'ready') {
            if (mode === 'camera') {
                // Switch back to VIDEO mode for camera
                if (faceLandmarkerRef.current) {
                    faceLandmarkerRef.current.setOptions({ runningMode: "VIDEO" });
                }
                startCamera();
            } else {
                stopCamera();
                setFeedback("Sube una foto clara de tu rostro.");
            }
        }
    }, [mode, status]);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadeddata = () => detectFrame();
            }
        } catch (err) {
            console.error(err);
            setFeedback("No se pudo acceder a la cámara.");
        }
    };

    const detectFrame = async () => {
        if (mode !== 'camera' || !faceLandmarkerRef.current || !videoRef.current || !canvasRef.current) {
            requestRef.current = requestAnimationFrame(detectFrame);
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (video.paused || video.ended || video.readyState < 2) {
            requestRef.current = requestAnimationFrame(detectFrame);
            return;
        }

        // Use native video dimensions for accurate detection
        const vw = video.videoWidth;
        const vh = video.videoHeight;

        if (vw === 0 || vh === 0) {
            requestRef.current = requestAnimationFrame(detectFrame);
            return;
        }

        if (canvas.width !== vw || canvas.height !== vh) {
            canvas.width = vw;
            canvas.height = vh;
        }

        try {
            const now = performance.now();
            const results = faceLandmarkerRef.current.detectForVideo(video, now);

            ctx!.clearRect(0, 0, canvas.width, canvas.height);

            if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
                if (!faceDetected) setFaceDetected(true);
                drawFaceOverlay(ctx!, results.faceLandmarks[0], canvas.width, canvas.height);
            } else {
                if (faceDetected) setFaceDetected(false);
            }
        } catch (e) {
            console.error("Detection error:", e);
        }

        requestRef.current = requestAnimationFrame(detectFrame);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setSelectedImage(url);
        setMode('image');
        setFaceDetected(false);

        // Slightly delayed call to ensure state updates
        setTimeout(() => analyzeUploadedImage(), 100);
    };

    const analyzeUploadedImage = async () => {
        if (!imageRef.current || !faceLandmarkerRef.current || !canvasRef.current) return;

        const img = imageRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Wait for image to be fully loaded
        if (!img.complete) {
            await new Promise((resolve) => {
                img.onload = resolve;
            });
        }
        // Small buffer to ensure rendering
        await new Promise(r => setTimeout(r, 100));

        // Use natural dimensions for accurate detection
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        try {
            // CRITICAL: Switch to IMAGE mode for static image analysis
            await faceLandmarkerRef.current.setOptions({ runningMode: "IMAGE" });

            const results = await faceLandmarkerRef.current.detect(img);

            ctx!.clearRect(0, 0, canvas.width, canvas.height);

            if (results.faceLandmarks.length > 0) {
                setFaceDetected(true);
                drawFaceOverlay(ctx!, results.faceLandmarks[0], canvas.width, canvas.height);
                setFeedback("Rostro detectado. Analizando...");
                setTimeout(() => {
                    performCompleteAnalysis(results.faceLandmarks[0], img);
                }, 1500);
            } else {
                setFeedback("No se detectó ningún rostro. Intenta con otra foto.");
                setFaceDetected(false);
            }
        } catch (e) {
            console.error(e);
            setFeedback("Error procesando imagen. Intenta con otra.");
        }
    };

    const [autoStartTimer, setAutoStartTimer] = useState<NodeJS.Timeout | null>(null);

    // Auto-start analysis when face is detected
    useEffect(() => {
        if (faceDetected && status === 'ready' && mode === 'camera') {
            const timer = setTimeout(() => {
                handleStartAnalysis();
            }, 1500); // 1.5 seconds delay to ensure stability
            setAutoStartTimer(timer);
        } else {
            if (autoStartTimer) {
                clearTimeout(autoStartTimer);
                setAutoStartTimer(null);
            }
        }
        return () => {
            if (autoStartTimer) clearTimeout(autoStartTimer);
        }
    }, [faceDetected, status, mode]);

    const drawFaceOverlay = (ctx: CanvasRenderingContext2D, landmarks: any[], width: number, height: number) => {
        const getPt = (idx: number) => ({ x: landmarks[idx].x * width, y: landmarks[idx].y * height });

        ctx.save();
        ctx.fillStyle = "rgba(138, 102, 35, 0.6)"; // Golden-earth for elegant feel
        for (let i = 0; i < landmarks.length; i += 3) { // Draw fewer points for cleaner look
            const pt = getPt(i);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.5, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.restore();
    };

    const handleStartAnalysis = async () => {
        if (mode === 'image' && !faceLandmarkerRef.current) return;

        setStatus('scanning');

        setFeedback("Analizando...");
        setScanPhase(1); await new Promise(r => setTimeout(r, 600));
        setScanPhase(2); await new Promise(r => setTimeout(r, 600));
        setScanPhase(3); await new Promise(r => setTimeout(r, 600));

        if ((videoRef.current || imageRef.current) && faceLandmarkerRef.current) {
            const source = mode === 'camera' ? videoRef.current! : imageRef.current!;
            // For camera we re-detect to get latest frame, for image we use existing results if possible or re-detect
            // Simplify: just re-detect on current frame
            let results;
            if (mode === 'camera') {
                results = faceLandmarkerRef.current.detectForVideo(source as HTMLVideoElement, performance.now());
            } else {
                results = await faceLandmarkerRef.current.detect(source as HTMLImageElement);
            }

            if (results.faceLandmarks.length > 0) {
                performCompleteAnalysis(results.faceLandmarks[0], source);
            } else {
                setStatus('ready');
                setFeedback("Se perdió el rostro. Reintentar.");
            }
        }
    };

    const performCompleteAnalysis = (landmarks: any[], source: HTMLVideoElement | HTMLImageElement) => {
        const faceShape = calculateFaceShape(landmarks);
        const skinTone = calculateSkinTone(landmarks, source);
        onComplete({ faceShape, skinTone });
    };

    const calculateFaceShape = (landmarks: any[]): FaceShape => {
        const getDist3D = (i1: number, i2: number) => {
            const p1 = landmarks[i1];
            const p2 = landmarks[i2];
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
        };
        const cheekWidth = getDist3D(454, 234);
        const faceHeight = getDist3D(10, 152);
        const jawline = getDist3D(58, 288);
        const forehead = getDist3D(103, 332);
        const midJaw = getDist3D(172, 397);

        const hwRatio = faceHeight / cheekWidth;
        const jcRatio = jawline / cheekWidth;
        const fcRatio = forehead / cheekWidth;
        const mjRatio = midJaw / cheekWidth;

        if (hwRatio > 1.45) return 'oblong';
        if (jcRatio > 0.9 && hwRatio < 1.4 && mjRatio > 0.85) return 'square';
        if (fcRatio > 1.05 && jcRatio < 0.82 && (fcRatio - jcRatio) > 0.25) return 'heart';
        if (hwRatio < 1.35 && Math.abs(jcRatio - fcRatio) < 0.15) return 'round';
        return 'oval';
    };

    const calculateSkinTone = (landmarks: any[], source: HTMLVideoElement | HTMLImageElement): { category: SkinTone, undertone: Undertone, rgb: [number, number, number] } => {
        const canvas = document.createElement('canvas');
        const width = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
        const height = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return { category: 'medium', undertone: 'neutral', rgb: [128, 128, 128] };

        ctx.drawImage(source, 0, 0, width, height);

        const samplePoints = [234, 454, 10, 152, 93, 323];
        let samples: number[][] = [];

        samplePoints.forEach(idx => {
            const p = landmarks[idx];
            const x = Math.floor(p.x * width);
            const y = Math.floor(p.y * height);
            const data = ctx.getImageData(Math.max(0, x - 5), Math.max(0, y - 5), 10, 10).data;

            let r = 0, g = 0, b = 0, c = 0;
            for (let i = 0; i < data.length; i += 4) {
                const bri = (data[i] + data[i + 1] + data[i + 2]) / 3;
                if (bri > 30 && bri < 240) {
                    r += data[i]; g += data[i + 1]; b += data[i + 2]; c++;
                }
            }
            if (c > 0) samples.push([r / c, g / c, b / c]);
        });

        if (samples.length === 0) return { category: 'medium', undertone: 'neutral', rgb: [128, 128, 128] };
        samples.sort((a, b) => ((a[0] + a[1] + a[2]) / 3) - ((b[0] + b[1] + b[2]) / 3));
        const med = samples[Math.floor(samples.length / 2)];
        const r = Math.round(med[0]), g = Math.round(med[1]), b = Math.round(med[2]);

        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        let category: SkinTone = 'medium';
        if (yiq > 170) category = 'light';
        else if (yiq < 110) category = 'dark';

        let undertone: Undertone = 'neutral';
        if (r > g && g > b && (r - b) > 15) undertone = 'warm';
        else if (b > r * 0.95 || (b - r) > 10) undertone = 'cool';

        return { category, undertone, rgb: [r, g, b] };
    };

    return (
        <div style={embedded ? {
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '500px',
            background: 'linear-gradient(135deg, #EEEADE 0%, #e8e3d6 50%, #d9d1c2 100%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1D1E21',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            borderRadius: '20px',
            overflow: 'hidden',
            boxSizing: 'border-box',
            padding: '20px'
        } : {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #EEEADE 0%, #e8e3d6 50%, #d9d1c2 100%)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1D1E21',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            overflow: 'hidden'
        }}>
            {/* Decorative orbs - Sand/Earth tones */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-5%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(138, 102, 35, 0.3) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-15%',
                right: '-10%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(130, 108, 64, 0.25) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                top: '30%',
                right: '10%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(21, 33, 50, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(50px)',
                pointerEvents: 'none'
            }} />

            {step === 'initial' ? (
                /* Pantalla inicial con 3 opciones */
                <>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        marginBottom: '16px',
                        textAlign: 'center',
                        color: '#1D1E21',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        ¿Cómo quieres descubrir tu tipo de rostro?
                    </h2>
                    <p style={{
                        fontSize: '15px',
                        color: 'rgba(29, 30, 33, 0.7)',
                        textAlign: 'center',
                        marginBottom: '40px',
                        maxWidth: '300px',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        Conocer tu tipo de rostro nos ayuda a recomendarte los mejores armazones
                    </p>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        width: '100%',
                        maxWidth: '320px',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {/* Botón 1: Analizar mi rostro */}
                        <button
                            onClick={() => {
                                setMode('camera');
                                setStep('analyzing');
                            }}
                            style={{
                                padding: '18px 24px',
                                background: '#152132',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '16px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 8px 24px rgba(21, 33, 50, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                            </svg>
                            Analizar mi rostro
                        </button>

                        {/* Botón 2: Subir foto */}
                        <button
                            onClick={() => {
                                fileInputRef.current?.click();
                            }}
                            style={{
                                padding: '18px 24px',
                                background: 'rgba(255, 255, 255, 0.8)',
                                color: '#1D1E21',
                                border: '2px solid rgba(21, 33, 50, 0.15)',
                                borderRadius: '16px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                            </svg>
                            Subir foto
                        </button>

                        {/* Botón 3: Ya sé mi tipo de rostro */}
                        <button
                            onClick={() => {
                                if (onManualSelect) onManualSelect();
                            }}
                            style={{
                                padding: '18px 24px',
                                background: 'transparent',
                                color: 'rgba(29, 30, 33, 0.7)',
                                border: '1px dashed rgba(29, 30, 33, 0.3)',
                                borderRadius: '16px',
                                fontSize: '16px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 11l3 3L22 4" />
                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                            </svg>
                            Ya sé mi tipo de rostro
                        </button>

                        {/* Botón cancelar */}
                        <button
                            onClick={onCancel}
                            style={{
                                marginTop: '8px',
                                padding: '12px',
                                background: 'transparent',
                                color: 'rgba(29, 30, 33, 0.5)',
                                border: 'none',
                                fontSize: '14px',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Cancelar
                        </button>
                    </div>

                    {/* Hidden File Input for initial screen */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = URL.createObjectURL(file);
                            setSelectedImage(url);
                            setMode('image');
                            setStep('analyzing');
                        }}
                        style={{ display: 'none' }}
                    />
                </>
            ) : (
                /* Pantalla de análisis (cámara/imagen) */
                <>
                    {/* Title */}
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        marginBottom: '40px',
                        textAlign: 'center',
                        color: '#1D1E21',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        Analizando tu Rostro
                    </h2>

                    {/* Circular Camera/Image Container - Perfect Circle */}
                    <div style={{
                        position: 'relative',
                        width: 'min(80vw, 360px)',
                        height: 'min(80vw, 360px)',
                        minWidth: '280px',
                        minHeight: '280px',
                        borderRadius: '50%',
                        border: '4px solid rgba(0,0,0,0.1)',
                        boxShadow: faceDetected
                            ? '0 20px 60px rgba(138, 102, 35, 0.3), 0 0 0 4px rgba(138, 102, 35, 0.2)'
                            : '0 20px 60px rgba(0,0,0,0.15)',
                        overflow: 'hidden',
                        transition: 'all 0.5s ease',
                        background: '#fff',
                        zIndex: 1,
                        flexShrink: 0
                    }}>
                        {mode === 'camera' ? (
                            <video
                                ref={videoRef}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: 'scaleX(-1)'
                                }}
                                autoPlay
                                playsInline
                                muted
                            />
                        ) : (
                            <img
                                ref={imageRef}
                                src={selectedImage || ''}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        )}

                        <canvas
                            ref={canvasRef}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover', // Match video objectFit
                                transform: mode === 'camera' ? 'scaleX(-1)' : 'none',
                                pointerEvents: 'none'
                            }}
                        />

                        {/* Scan Overlay Effect inside circle */}
                        {status === 'scanning' && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(to bottom, transparent, rgba(138, 102, 35, 0.25), transparent)',
                                animation: 'scan-vertical 1.5s infinite linear'
                            }} />
                        )}
                    </div>

                    {/* Status / Feedback */}
                    <p style={{
                        marginTop: '30px',
                        fontSize: '16px',
                        color: 'rgba(29, 30, 33, 0.7)',
                        minHeight: '24px',
                        textAlign: 'center',
                        fontWeight: 500,
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {feedback}
                    </p>

                    {/* Controls */}
                    <div style={{
                        marginTop: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        width: '100%',
                        maxWidth: '280px',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {mode === 'camera' ? (
                            <>
                                {/* Status indicator when scanning */}
                                {status === 'scanning' && (
                                    <div style={{
                                        padding: '16px',
                                        background: '#152132',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '50px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                    }}>
                                        Analizando...
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={status === 'scanning'}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'rgba(0,0,0,0.05)',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            color: '#1D1E21',
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            cursor: status === 'scanning' ? 'not-allowed' : 'pointer',
                                            opacity: status === 'scanning' ? 0.5 : 1
                                        }}
                                    >
                                        Subir Foto
                                    </button>
                                    <button
                                        onClick={onCancel}
                                        disabled={status === 'scanning'}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'transparent',
                                            border: '1px solid rgba(220, 38, 38, 0.3)',
                                            color: '#dc2626',
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            cursor: status === 'scanning' ? 'not-allowed' : 'pointer',
                                            opacity: status === 'scanning' ? 0.5 : 1
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setMode('camera');
                                        setSelectedImage(null);
                                        setFaceDetected(false);
                                    }}
                                    style={{
                                        padding: '14px',
                                        background: '#152132',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '50px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                                    }}
                                >
                                    Usar Cámara
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        padding: '12px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'rgba(29, 30, 33, 0.6)',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Elegir otra foto
                                </button>
                            </>
                        )}

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <style jsx global>{`
                @keyframes scan-vertical {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
            `}</style>
                </>
            )}
        </div>
    );
}
