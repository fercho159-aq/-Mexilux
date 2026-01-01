'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

interface FaceAnalyzerProps {
    onComplete: (result: AnalysisResult) => void;
    onCancel: () => void;
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

export default function FaceAnalyzer({ onComplete, onCancel }: FaceAnalyzerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    }, []);

    // Switch modes effect
    useEffect(() => {
        if (status === 'ready') {
            if (mode === 'camera') {
                startCamera();
            } else {
                stopCamera();
                setFeedback("Sube una foto clara de tu rostro.");
                // Retain detection status until new image is loaded
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
            // Note: RunningMode VIDEO can handle detect(img) but sometimes creating a new detector in IMAGE mode is safer.
            // For now, we trust detect() handles it.
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

    const drawFaceOverlay = (ctx: CanvasRenderingContext2D, landmarks: any[], width: number, height: number) => {
        const getPt = (idx: number) => ({ x: landmarks[idx].x * width, y: landmarks[idx].y * height });

        ctx.save();
        ctx.fillStyle = "rgba(0, 255, 157, 0.6)";
        for (let i = 0; i < landmarks.length; i += 5) {
            const pt = getPt(i);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.restore();
    };

    const handleStartAnalysis = async () => {
        if (mode === 'image') return;

        setStatus('scanning');

        setFeedback("Escaneando geometría...");
        setScanPhase(1); await new Promise(r => setTimeout(r, 1000));
        setFeedback("Analizando proporciones...");
        setScanPhase(2); await new Promise(r => setTimeout(r, 1000));
        setFeedback("Finalizando análisis...");
        setScanPhase(3); await new Promise(r => setTimeout(r, 1000));

        if (videoRef.current && faceLandmarkerRef.current) {
            const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, performance.now());
            if (results.faceLandmarks.length > 0) {
                performCompleteAnalysis(results.faceLandmarks[0], videoRef.current);
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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', // Sleek dark gradient
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>

            {/* Title */}
            <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '1px',
                marginBottom: '40px',
                textAlign: 'center',
                textTransform: 'uppercase',
                background: 'linear-gradient(to right, #00ff9d, #00b8ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(0,255,157,0.3)'
            }}>
                Analizando tu Rostro
            </h2>

            {/* Circular Camera/Image Container */}
            <div style={{
                position: 'relative',
                width: '320px',
                height: '320px',
                borderRadius: '50%', // Circle shape
                border: '4px solid rgba(255,255,255,0.1)',
                boxShadow: faceDetected
                    ? '0 0 50px rgba(0,255,157,0.3), inset 0 0 20px rgba(0,255,157,0.2)'
                    : '0 0 30px rgba(0,0,0,0.5)',
                overflow: 'hidden', // Clips the video to circle
                transition: 'all 0.5s ease',
                background: '#000'
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
                        background: 'linear-gradient(to bottom, transparent, rgba(0,255,157,0.2), transparent)',
                        animation: 'scan-vertical 1.5s infinite linear'
                    }} />
                )}
            </div>

            {/* Status / Feedback */}
            <p style={{
                marginTop: '30px',
                fontSize: '16px',
                color: 'rgba(255,255,255,0.8)',
                minHeight: '24px',
                textAlign: 'center',
                fontWeight: 500
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
                maxWidth: '280px'
            }}>
                {mode === 'camera' ? (
                    <>
                        <button
                            onClick={handleStartAnalysis}
                            disabled={!faceDetected || status === 'scanning'}
                            style={{
                                padding: '16px',
                                background: faceDetected ? 'linear-gradient(90deg, #00ff9d, #00b8ff)' : '#333',
                                color: faceDetected ? '#000' : '#666',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: faceDetected ? 'pointer' : 'not-allowed',
                                transition: 'transform 0.2s',
                                transform: faceDetected ? 'scale(1)' : 'scale(0.98)',
                                boxShadow: faceDetected ? '0 10px 20px rgba(0,255,157,0.2)' : 'none'
                            }}
                        >
                            {status === 'scanning' ? 'Analizando...' : 'Iniciar Análisis'}
                        </button>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    padding: '12px 20px',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    borderRadius: '50px',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                Subir Foto
                            </button>
                            <button
                                onClick={onCancel}
                                style={{
                                    padding: '12px 20px',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,69,69,0.3)',
                                    color: '#ff6b6b',
                                    borderRadius: '50px',
                                    fontSize: '14px',
                                    cursor: 'pointer'
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
                                background: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '50px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer'
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
                                color: 'rgba(255,255,255,0.5)',
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
        </div>
    );
}
