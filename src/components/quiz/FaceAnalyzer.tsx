'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

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
    const [status, setStatus] = useState<'loading' | 'ready' | 'scanning' | 'analyzing' | 'error'>('loading');
    const [feedback, setFeedback] = useState("Iniciando sistema de visión...");
    const [faceDetected, setFaceDetected] = useState(false);
    const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const requestRef = useRef<number | null>(null);
    const [scanPhase, setScanPhase] = useState(0); // 0: Idle, 1: Geometry, 2: Features, 3: Skin
    const [metrics, setMetrics] = useState({ width: 0, height: 0, ratio: 0 });

    const cleanup = useCallback(() => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    useEffect(() => {
        const initMediaPipe = async () => {
            try {
                setFeedback("Cargando Modelos Neuronales...");
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
                setFeedback("Alinea tu rostro en el marco central");
                startCamera();
            } catch (error) {
                console.error("Error loading MediaPipe:", error);
                setStatus('error');
                setFeedback("Error: No se pudo cargar el motor de IA");
            }
        };

        if (typeof window !== 'undefined') {
            initMediaPipe();
        }

        return cleanup;
    }, [cleanup]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadeddata = () => {
                    detectFrame();
                };
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            setFeedback("Permiso de cámara denegado");
        }
    };

    const detectFrame = async () => {
        if (!faceLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (video.paused || video.ended) return;

        // Sync canvas size
        if (canvas.width !== video.clientWidth || canvas.height !== video.clientHeight) {
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight;
        }

        const now = performance.now();
        let results;
        try {
            results = faceLandmarkerRef.current.detectForVideo(video, now);
        } catch (e) { /* ignore */ }

        ctx!.clearRect(0, 0, canvas.width, canvas.height);

        if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
            if (!faceDetected) setFaceDetected(true);
            const landmarks = results.faceLandmarks[0];
            drawFaceOverlay(ctx!, landmarks, canvas.width, canvas.height);
        } else {
            if (faceDetected) setFaceDetected(false);
        }

        requestRef.current = requestAnimationFrame(detectFrame);
    };

    const drawFaceOverlay = (ctx: CanvasRenderingContext2D, landmarks: any[], width: number, height: number) => {
        const getPt = (idx: number) => ({ x: landmarks[idx].x * width, y: landmarks[idx].y * height });

        ctx.save();

        // 1. Draw Mesh Dots (Tech style)
        ctx.fillStyle = "rgba(0, 255, 157, 0.4)";
        for (let i = 0; i < landmarks.length; i += 3) {
            const pt = getPt(i);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1, 0, 2 * Math.PI);
            ctx.fill();
        }

        // 2. Draw Key Measurement Lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 1;

        const leftCheek = getPt(234);
        const rightCheek = getPt(454);
        const topHead = getPt(10);
        const chin = getPt(152);
        const leftJaw = getPt(58);
        const rightJaw = getPt(288);

        if (status === 'scanning' || status === 'analyzing') {
            ctx.strokeStyle = "#00ff9d";
            ctx.lineWidth = 2;
            ctx.shadowColor = "#00ff9d";
            ctx.shadowBlur = 10;
        }

        ctx.beginPath();
        ctx.moveTo(topHead.x, topHead.y);
        ctx.lineTo(chin.x, chin.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(leftCheek.x, leftCheek.y);
        ctx.lineTo(rightCheek.x, rightCheek.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(leftJaw.x, leftJaw.y);
        ctx.lineTo(rightJaw.x, rightJaw.y);
        ctx.stroke();

        if (scanPhase === 0) {
            const w = Math.hypot(rightCheek.x - leftCheek.x, rightCheek.y - leftCheek.y);
            const h = Math.hypot(chin.x - topHead.x, chin.y - topHead.y);
            setMetrics({ width: Math.round(w), height: Math.round(h), ratio: parseFloat((h / w).toFixed(2)) });
        }

        ctx.restore();
    };

    const handleStartAnalysis = async () => {
        if (!videoRef.current || !faceLandmarkerRef.current) return;

        setStatus('scanning');
        setScanPhase(1);

        setFeedback("Escaneando topografía facial...");
        await new Promise(r => setTimeout(r, 1500));

        setScanPhase(2);
        setFeedback("Analizando proporciones áureas...");
        await new Promise(r => setTimeout(r, 1500));

        setScanPhase(3);
        setFeedback("Detectando pigmentación y subtono...");
        await new Promise(r => setTimeout(r, 1500));

        setStatus('analyzing');

        const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, performance.now());

        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            const faceShape = calculateFaceShape(landmarks);
            const skinTone = calculateSkinTone(landmarks, videoRef.current);
            onComplete({ faceShape, skinTone });
        } else {
            setStatus('ready');
            setFeedback("No se pudo capturar. Intenta de nuevo.");
            setScanPhase(0);
        }
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

        const hwRatio = faceHeight / cheekWidth;
        const jcRatio = jawline / cheekWidth;
        const fcRatio = forehead / cheekWidth;

        if (hwRatio > 1.45) return 'oblong';
        if (jcRatio > 0.9 && hwRatio < 1.4) return 'square';
        if (fcRatio > 1.0 && jcRatio < 0.8) return 'heart';
        if (hwRatio < 1.35) return 'round';

        return 'oval';
    };

    const calculateSkinTone = (landmarks: any[], video: HTMLVideoElement): { category: SkinTone, undertone: Undertone, rgb: [number, number, number] } => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return { category: 'medium', undertone: 'neutral', rgb: [128, 128, 128] };
        tempCtx.drawImage(video, 0, 0);

        const indices = [10, 152, 234, 454, 168];
        let r = 0, g = 0, b = 0, count = 0;

        indices.forEach(idx => {
            const p = landmarks[idx];
            const x = Math.floor(p.x * tempCanvas.width);
            const y = Math.floor(p.y * tempCanvas.height);
            const data = tempCtx.getImageData(Math.max(0, x - 2), Math.max(0, y - 2), 5, 5).data;
            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }
        });

        r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);

        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        let category: SkinTone = 'medium';
        if (yiq > 165) category = 'light';
        else if (yiq < 100) category = 'dark';

        let undertone: Undertone = 'neutral';
        if (r > b * 1.25 && g > b) undertone = 'warm';
        else if (b > r * 0.9) undertone = 'cool';

        return { category, undertone, rgb: [r, g, b] };
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000000',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            color: '#00ff9d',
            overflow: 'hidden'
        }}>

            {/* Background Effects */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(circle, rgba(0,255,157,0.1) 1px, transparent 1px)`,
                backgroundSize: '30px 30px',
                opacity: 0.3,
                pointerEvents: 'none'
            }} />

            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #00ff9d, transparent)',
                opacity: 0.2
            }} />

            {/* HUD Header */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                zIndex: 20
            }}>
                <div>
                    <h2 style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        margin: '0 0 4px 0',
                        textShadow: '0 0 10px rgba(0,255,157,0.5)'
                    }}>
                        SISTEMA DE ANÁLISIS BIOMÉTRICO
                    </h2>
                    <p style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '10px',
                        letterSpacing: '0.1em',
                        margin: 0
                    }}>
                        V.2.4.0 • GPU: ON • SENSOR: ACTIVO
                    </p>
                </div>

                <button
                    onClick={onCancel}
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'rgba(255,255,255,0.7)',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    ABORTAR
                </button>
            </div>

            {/* Main Scanner Container */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '3/4',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 0 50px rgba(0,255,157,0.1)',
                border: '1px solid rgba(255,255,255,0.1)',
                zIndex: 10
            }}>

                {/* HUD Corners */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', width: '32px', height: '32px', borderTop: '2px solid #00ff9d', borderLeft: '2px solid #00ff9d', opacity: 0.8 }} />
                <div style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderTop: '2px solid #00ff9d', borderRight: '2px solid #00ff9d', opacity: 0.8 }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '32px', height: '32px', borderBottom: '2px solid #00ff9d', borderLeft: '2px solid #00ff9d', opacity: 0.8 }} />
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '32px', height: '32px', borderBottom: '2px solid #00ff9d', borderRight: '2px solid #00ff9d', opacity: 0.8 }} />

                {/* Video Feed */}
                <video
                    ref={videoRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)', // Mirror effect
                        filter: 'brightness(1.1) contrast(1.1)'
                    }}
                    autoPlay
                    playsInline
                    muted
                />

                {/* Canvas Overlay */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)',
                        pointerEvents: 'none'
                    }}
                />

                {/* Scanning Beam Animation */}
                {(status === 'scanning' || status === 'analyzing') && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        overflow: 'hidden'
                    }}>
                        <div className="scan-beam" style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '2px',
                            background: '#00ff9d',
                            boxShadow: '0 0 20px #00ff9d',
                            animation: 'scan 2s ease-in-out infinite'
                        }} />
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: '#00ff9d',
                            opacity: 0.05
                        }} />
                    </div>
                )}

                {/* Central Focus Ring */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: faceDetected ? '280px' : '200px',
                    height: faceDetected ? '360px' : '200px',
                    border: faceDetected ? '1px solid rgba(0,255,157,0.4)' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '40px',
                    transition: 'all 0.5s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: faceDetected ? '0 0 30px rgba(0,255,157,0.1)' : 'none'
                }}>
                    {/* Rotating Dashed Ring */}
                    <div className={faceDetected ? "spinning-ring" : ""} style={{
                        width: '100%',
                        height: '100%',
                        border: '1px dashed rgba(255,255,255,0.2)',
                        borderRadius: '38px',
                        animation: faceDetected ? 'spin 10s linear infinite' : 'none'
                    }} />

                    {/* Crosshair */}
                    <div style={{ position: 'absolute', width: '20px', height: '20px', opacity: 0.5 }}>
                        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: '#00ff9d' }} />
                        <div style={{ position: 'absolute', left: '50%', top: 0, width: '1px', height: '100%', background: '#00ff9d' }} />
                    </div>
                </div>

                {/* Metrics Overlay (Right Side) */}
                {faceDetected && (
                    <div style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        fontSize: '10px',
                        color: '#00ff9d',
                        fontFamily: 'monospace'
                    }}>
                        {[
                            { label: 'H', val: `${metrics.height}MM` },
                            { label: 'W', val: `${metrics.width}MM` },
                            { label: 'R', val: metrics.ratio }
                        ].map((m, i) => (
                            <div key={i} style={{
                                background: 'rgba(0,0,0,0.8)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid rgba(0,255,157,0.3)',
                                minWidth: '80px',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <span>{m.label}:</span>
                                <span>{m.val}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Status Badge */}
                <div style={{
                    position: 'absolute',
                    bottom: '32px',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    zIndex: 20
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 20px',
                        background: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '999px',
                        border: '1px solid rgba(0,255,157,0.3)',
                        boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: faceDetected ? '#00ff9d' : '#ff3b30',
                            boxShadow: faceDetected ? '0 0 10px #00ff9d' : 'none'
                        }} />
                        <span style={{
                            color: '#00ff9d',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase'
                        }}>
                            {status === 'loading' ? 'INICIALIZANDO...' :
                                status === 'scanning' ? `ESCANEO: FASE ${scanPhase}/3` :
                                    status === 'analyzing' ? 'PROCESANDO...' :
                                        faceDetected ? 'OBJETIVO FIJADO' : 'BUSCANDO ROSTRO...'}
                        </span>
                    </div>

                    <p style={{
                        marginTop: '16px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        {feedback}
                    </p>
                </div>
            </div>

            {/* Control Panel / Button */}
            <div style={{ marginTop: '32px', height: '60px', zIndex: 20 }}>
                {(status === 'ready' || (status === 'loading' && faceDetected)) && faceDetected && (
                    <button
                        onClick={handleStartAnalysis}
                        style={{
                            background: '#00ff9d',
                            color: 'black',
                            border: 'none',
                            padding: '16px 40px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)',
                            boxShadow: '0 0 30px rgba(0,255,157,0.4)',
                            transition: 'transform 0.2s'
                        }}
                    >
                        INICIAR ESCANEO
                        <span>→</span>
                    </button>
                )}
            </div>

            {/* Animations */}
            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spinning-ring {
                    animation: spin 10s linear infinite;
                }
            `}</style>
        </div>
    );
}
