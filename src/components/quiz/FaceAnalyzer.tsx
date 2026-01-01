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

        // Sync canvas resolution to DISPLAY size to ensure 1:1 overlay match
        // This is CRITICAL for full screen accuracy
        const displayWidth = video.clientWidth;
        const displayHeight = video.clientHeight;

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
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
        // Since the video is mirrored with CSS transform: scaleX(-1), 
        // we need to flip our drawing coordinates if we want them to match the visual.
        // However, we are also mirroring the canvas itself with CSS.
        // So we draw "normally" (0 to width), and the CSS flips it all.
        const getPt = (idx: number) => ({ x: landmarks[idx].x * width, y: landmarks[idx].y * height });

        ctx.save();

        // 1. Draw Mesh Texture (Tech style)
        ctx.fillStyle = "rgba(0, 255, 157, 0.4)";
        // Reduced density for cleaner look
        for (let i = 0; i < landmarks.length; i += 7) {
            const pt = getPt(i);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.5, 0, 2 * Math.PI); // Slightly larger dots
            ctx.fill();
        }

        // 2. Draw Key Measurement Lines
        ctx.strokeStyle = "rgba(0, 255, 157, 0.6)"; // Brighter green for visibility
        ctx.lineWidth = 1.5;

        const leftCheek = getPt(234);
        const rightCheek = getPt(454);
        const topHead = getPt(10);
        const chin = getPt(152);
        const leftJaw = getPt(58);
        const rightJaw = getPt(288);
        const foreheadLeft = getPt(103);
        const foreheadRight = getPt(332);

        // Highlight active phase lines
        if (status === 'scanning') {
            ctx.shadowColor = "#00ff9d";
            ctx.shadowBlur = 10;
        }

        // Vertical Center
        ctx.beginPath();
        ctx.moveTo(topHead.x, topHead.y);
        ctx.lineTo(chin.x, chin.y);
        ctx.stroke();

        // Cheek Width
        ctx.beginPath();
        ctx.moveTo(leftCheek.x, leftCheek.y);
        ctx.lineTo(rightCheek.x, rightCheek.y);
        ctx.stroke();

        // Forehead
        ctx.beginPath();
        ctx.moveTo(foreheadLeft.x, foreheadLeft.y);
        ctx.lineTo(foreheadRight.x, foreheadRight.y);
        ctx.stroke();

        // Jawline connection
        ctx.beginPath();
        ctx.moveTo(leftJaw.x, leftJaw.y);
        ctx.lineTo(chin.x, chin.y);
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

        setFeedback("ESCANEO DE GEOMETRÍA ACTIVO...");
        await new Promise(r => setTimeout(r, 1500));

        setScanPhase(2);
        setFeedback("ANÁLISIS DE PROPORCIONES ÁUREAS...");
        await new Promise(r => setTimeout(r, 1500));

        setScanPhase(3);
        setFeedback("ESPECTROMETRÍA DE PIEL...");
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
            setFeedback("ERROR DE LECTURA. REINTENTAR.");
            setScanPhase(0);
        }
    };

    const calculateFaceShape = (landmarks: any[]): FaceShape => {
        // Improved 3D Calculation logic
        const getDist3D = (i1: number, i2: number) => {
            const p1 = landmarks[i1];
            const p2 = landmarks[i2];
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
        };

        const cheekWidth = getDist3D(454, 234);
        const faceHeight = getDist3D(10, 152);
        const jawline = getDist3D(58, 288);
        const forehead = getDist3D(103, 332);
        const midJaw = getDist3D(172, 397); // Mid-jaw measure

        const hwRatio = faceHeight / cheekWidth;
        const jcRatio = jawline / cheekWidth;
        const fcRatio = forehead / cheekWidth;
        const mjRatio = midJaw / cheekWidth;

        // Classification Logic
        if (hwRatio > 1.45) return 'oblong';
        if (jcRatio > 0.9 && hwRatio < 1.4 && mjRatio > 0.85) return 'square';
        if (fcRatio > 1.05 && jcRatio < 0.82 && (fcRatio - jcRatio) > 0.25) return 'heart';
        if (hwRatio < 1.35 && Math.abs(jcRatio - fcRatio) < 0.15) return 'round';

        return 'oval';
    };

    const calculateSkinTone = (landmarks: any[], video: HTMLVideoElement): { category: SkinTone, undertone: Undertone, rgb: [number, number, number] } => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return { category: 'medium', undertone: 'neutral', rgb: [128, 128, 128] };
        tempCtx.drawImage(video, 0, 0);

        // Advanced Sampling Points (Forehead, Cheeks, Chin, excludes eyes/shadows)
        const samplePoints = [
            234, 454, // Cheeks
            10,       // Forehead center
            152,      // Chin
            93, 323   // Cheek/Side
        ];

        let samples: number[][] = [];

        samplePoints.forEach(idx => {
            const p = landmarks[idx];
            const x = Math.floor(p.x * tempCanvas.width);
            const y = Math.floor(p.y * tempCanvas.height);

            // 10x10 Area Sample
            const data = tempCtx.getImageData(Math.max(0, x - 5), Math.max(0, y - 5), 10, 10).data;

            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < data.length; i += 4) {
                // Filter Outliers (Too dark/shadow or too bright/highlight)
                const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
                if (brightness > 30 && brightness < 240) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }
            }
            if (count > 0) {
                samples.push([r / count, g / count, b / count]);
            }
        });

        if (samples.length === 0) return { category: 'medium', undertone: 'neutral', rgb: [128, 128, 128] };

        // Median Filtering for Consistency
        samples.sort((a, b) => {
            const brightA = (a[0] + a[1] + a[2]) / 3;
            const brightB = (b[0] + b[1] + b[2]) / 3;
            return brightA - brightB;
        });

        const medianSample = samples[Math.floor(samples.length / 2)];
        const r = Math.round(medianSample[0]);
        const g = Math.round(medianSample[1]);
        const b = Math.round(medianSample[2]);

        // YIQ & Tone Logic
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        let category: SkinTone = 'medium';
        if (yiq > 170) category = 'light';
        else if (yiq < 110) category = 'dark';

        let undertone: Undertone = 'neutral';
        // Simplified ITA Logic for Undertone
        if (r > g && g > b && (r - b) > 15) {
            undertone = 'warm';
        } else if (b > r * 0.95 || (b - r) > 10) {
            undertone = 'cool';
        }

        return { category, undertone, rgb: [r, g, b] };
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            zIndex: 99999, // Ensure top layer
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>

            {/* Immersive Background Texture */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 157, 0.05) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            {/* Scanlines Effect */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 2px, 3px 100%',
                pointerEvents: 'none',
                zIndex: 5
            }} />

            {/* Video Container - Full Screen */}
            <div style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0
            }}>
                <video
                    ref={videoRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)' // Mirroring
                    }}
                    autoPlay
                    playsInline
                    muted
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)', // Mirror match
                        pointerEvents: 'none'
                    }}
                />
            </div>

            {/* Active Scanning Beam */}
            {(status === 'scanning' || status === 'analyzing') && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: '#00ff9d',
                    boxShadow: '0 0 20px 2px #00ff9d',
                    animation: 'scan 2s linear infinite',
                    zIndex: 10,
                    opacity: 0.8
                }} />
            )}

            {/* HUD Header */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
                zIndex: 20
            }}>
                <div>
                    <h1 style={{ color: '#00ff9d', fontSize: '14px', margin: 0, letterSpacing: '2px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                        ANALIZADOR BIOMÉTRICO
                    </h1>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontFamily: 'monospace' }}>GPU: ACTIVO</span>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontFamily: 'monospace' }}>
                            {status === 'loading' ? 'CARGANDO...' : 'SISTEMA: LISTO'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onCancel}
                    style={{
                        background: 'rgba(255, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 69, 69, 0.5)',
                        color: '#ff4545',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    CANCELAR
                </button>
            </div>

            {/* Central Focusing Target */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(80vw, 400px)',
                height: 'min(80vw, 500px)',
                border: faceDetected ? '2px solid rgba(0, 255, 157, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '30px',
                transition: 'all 0.3s ease',
                pointerEvents: 'none',
                zIndex: 10,
                boxShadow: faceDetected ? '0 0 30px rgba(0, 255, 157, 0.1)' : 'none'
            }}>
                {/* HUD Corners */}
                <div style={{ position: 'absolute', top: -1, left: -1, width: 20, height: 20, borderTop: '4px solid #00ff9d', borderLeft: '4px solid #00ff9d', borderRadius: '4px 0 0 0' }} />
                <div style={{ position: 'absolute', top: -1, right: -1, width: 20, height: 20, borderTop: '4px solid #00ff9d', borderRight: '4px solid #00ff9d', borderRadius: '0 4px 0 0' }} />
                <div style={{ position: 'absolute', bottom: -1, left: -1, width: 20, height: 20, borderBottom: '4px solid #00ff9d', borderLeft: '4px solid #00ff9d', borderRadius: '0 0 0 4px' }} />
                <div style={{ position: 'absolute', bottom: -1, right: -1, width: 20, height: 20, borderBottom: '4px solid #00ff9d', borderRight: '4px solid #00ff9d', borderRadius: '0 0 4px 0' }} />

                {/* Crosshair */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 20, height: 1, background: 'rgba(0, 255, 157, 0.5)', transform: 'translate(-50%, -50%)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 1, height: 20, background: 'rgba(0, 255, 157, 0.5)', transform: 'translate(-50%, -50%)' }} />
            </div>

            {/* Live Metrics Panel (Right) */}
            {faceDetected && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    zIndex: 20
                }}>
                    {[
                        { l: 'HEIGHT', v: metrics.height },
                        { l: 'WIDTH', v: metrics.width },
                        { l: 'RATIO', v: metrics.ratio }
                    ].map((m, i) => (
                        <div key={i} style={{
                            background: 'rgba(0, 20, 10, 0.8)',
                            borderLeft: '2px solid #00ff9d',
                            padding: '8px 12px',
                            fontFamily: 'monospace',
                            color: '#00ff9d',
                            fontSize: '12px',
                            backdropFilter: 'blur(4px)'
                        }}>
                            <div style={{ fontSize: '9px', opacity: 0.7 }}>{m.l}</div>
                            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{m.v}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Controls & Status Area */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '40px 20px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
            }}>
                <div style={{
                    color: faceDetected ? '#00ff9d' : 'white',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    textAlign: 'center',
                    textShadow: faceDetected ? '0 0 10px #00ff9d' : 'none',
                    background: 'rgba(0,0,0,0.5)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: `1px solid ${faceDetected ? 'rgba(0,255,157,0.3)' : 'rgba(255,255,255,0.1)'}`
                }}>
                    {status === 'loading' ? 'INICIALIZANDO...' :
                        status === 'scanning' ? `ESCANEO EN PROGRESO: FASE ${scanPhase}/3` :
                            status === 'analyzing' ? 'PROCESANDO RESULTADOS...' :
                                faceDetected ? 'ROSTRO DETECTADO - LISTO PARA ESCANEAR' : status === 'ready' ? 'BUSCANDO ROSTRO...' : feedback}
                </div>

                {(status === 'ready' || (status === 'loading' && faceDetected)) && faceDetected && (
                    <button
                        onClick={handleStartAnalysis}
                        style={{
                            background: '#00ff9d',
                            color: '#000',
                            border: 'none',
                            padding: '16px 48px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                            boxShadow: '0 0 20px rgba(0, 255, 157, 0.4)',
                            transition: 'transform 0.2s',
                            transform: 'scale(1)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        INICIAR ESCANEO UI
                    </button>
                )}
            </div>

            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
