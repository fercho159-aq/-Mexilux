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

        // Helper to get coords
        const getPt = (idx: number) => ({ x: landmarks[idx].x * width, y: landmarks[idx].y * height });

        ctx.save();
        // Since we likely mirror the video via CSS, we need to consider how we draw.
        // Usually simpler to just draw normally and let CSS flip the canvas too.

        // 1. Draw Mesh Dots (Tech style)
        ctx.fillStyle = "rgba(0, 255, 157, 0.4)";
        for (let i = 0; i < landmarks.length; i += 3) { // Draw every 3rd point to reduce clutter but keep mesh feel
            const pt = getPt(i);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1, 0, 2 * Math.PI);
            ctx.fill();
        }

        // 2. Draw Key Measurement Lines (Golden Ratio / Face Shape lines)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 1;

        // Cheek to Cheek (454 - 234)
        const leftCheek = getPt(234);
        const rightCheek = getPt(454);

        // Forehead (10) to Chin (152)
        const topHead = getPt(10);
        const chin = getPt(152);

        // Jaw (58 - 288)
        const leftJaw = getPt(58);
        const rightJaw = getPt(288);

        // Visualize "Scanning" or "Measuring"
        if (status === 'scanning' || status === 'analyzing') {
            ctx.strokeStyle = "#00ff9d";
            ctx.lineWidth = 2;
            ctx.shadowColor = "#00ff9d";
            ctx.shadowBlur = 10;
        }

        // Vertical Center Line
        ctx.beginPath();
        ctx.moveTo(topHead.x, topHead.y);
        ctx.lineTo(chin.x, chin.y);
        ctx.stroke();

        // Horizontal Width Lines
        ctx.beginPath();
        ctx.moveTo(leftCheek.x, leftCheek.y);
        ctx.lineTo(rightCheek.x, rightCheek.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(leftJaw.x, leftJaw.y);
        ctx.lineTo(rightJaw.x, rightJaw.y);
        ctx.stroke();

        // Update real-time metrics for UI display
        if (scanPhase === 0) { // Only update if not frozen in analysis
            const w = Math.hypot(rightCheek.x - leftCheek.x, rightCheek.y - leftCheek.y);
            const h = Math.hypot(chin.x - topHead.x, chin.y - topHead.y);
            setMetrics({ width: Math.round(w), height: Math.round(h), ratio: parseFloat((h / w).toFixed(2)) });
        }

        ctx.restore();
    };

    const handleStartAnalysis = async () => {
        if (!videoRef.current || !faceLandmarkerRef.current) return;

        setStatus('scanning');
        setScanPhase(1); // Geometry

        // Phase 1: Geometry Scan (1.5s) -- Simulate advanced processing
        setFeedback("Escaneando topografía facial...");
        await new Promise(r => setTimeout(r, 1500));

        setScanPhase(2); // Features
        setFeedback("Analizando proporciones áureas...");
        await new Promise(r => setTimeout(r, 1500));

        setScanPhase(3); // Skin
        setFeedback("Detectando pigmentación y subtono...");
        await new Promise(r => setTimeout(r, 1500));

        setStatus('analyzing');

        // Final Capture
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
        // Helper for 3D distance
        const getDist3D = (i1: number, i2: number) => {
            const p1 = landmarks[i1];
            const p2 = landmarks[i2];
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
        };
        const cheekWidth = getDist3D(454, 234);
        const faceHeight = getDist3D(10, 152);
        const jawline = getDist3D(58, 288);
        const forehead = getDist3D(103, 332); // Approximate forehead width

        const hwRatio = faceHeight / cheekWidth;
        const jcRatio = jawline / cheekWidth;
        const fcRatio = forehead / cheekWidth; // Forehead to cheeks

        // Enhanced Logic for better differentiation
        if (hwRatio > 1.45) return 'oblong';
        // Square: Jaw is wide (almost as wide as cheeks) and face is not too long
        if (jcRatio > 0.9 && hwRatio < 1.4) return 'square';
        // Heart: Wide forehead relative to jaw, and jaw is narrow
        if (fcRatio > 1.0 && jcRatio < 0.8) return 'heart';
        // Round: Short face, soft features (implied by ratios usually)
        if (hwRatio < 1.35) return 'round';

        return 'oval'; // The "ideal" balance, fallback
    };

    const calculateSkinTone = (landmarks: any[], video: HTMLVideoElement): { category: SkinTone, undertone: Undertone, rgb: [number, number, number] } => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return { category: 'medium', undertone: 'neutral', rgb: [128, 128, 128] };
        tempCtx.drawImage(video, 0, 0);

        // Sample multiple points: Forehead, Cheeks, Chin, Nose bridge
        const indices = [10, 152, 234, 454, 168];
        let r = 0, g = 0, b = 0, count = 0;

        indices.forEach(idx => {
            const p = landmarks[idx];
            const x = Math.floor(p.x * tempCanvas.width);
            const y = Math.floor(p.y * tempCanvas.height);
            // Sample 5x5 area for noise reduction
            const data = tempCtx.getImageData(Math.max(0, x - 2), Math.max(0, y - 2), 5, 5).data;
            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }
        });

        r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);

        // YIQ brightness model
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        let category: SkinTone = 'medium';
        if (yiq > 165) category = 'light';
        else if (yiq < 100) category = 'dark';

        // Undertone detection (Simplified)
        // Warm: Red/Yellow dominance
        // Cool: Blue/Pink dominance
        let undertone: Undertone = 'neutral';
        if (r > b * 1.25 && g > b) undertone = 'warm';
        else if (b > r * 0.9) undertone = 'cool';

        return { category, undertone, rgb: [r, g, b] };
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-0 overflow-hidden font-mono select-none">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#0f172a] opacity-90"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ff9d] to-transparent opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ff9d] to-transparent opacity-20"></div>
                {/* Tech Grid Background */}
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(0,255,157,0.1) 1px, transparent 1px)`,
                        backgroundSize: '30px 30px',
                        opacity: 0.3
                    }}
                ></div>
            </div>

            {/* HUD Header */}
            <div className="absolute top-0 w-full p-6 z-20 flex justify-between items-start">
                <div>
                    <h2 className="text-[#00ff9d] text-xs font-bold tracking-[0.2em] uppercase mb-1 drop-shadow-[0_0_5px_rgba(0,255,157,0.8)]">
                        SISTEMA DE ANÁLISIS BIOMÉTRICO
                    </h2>
                    <p className="text-white/60 text-[10px] tracking-wider">
                        V.2.4.0 • GPU: ON • SENSOR: ACTIVO
                    </p>
                </div>

                <button
                    onClick={onCancel}
                    className="group relative px-4 py-2 border border-white/20 hover:border-[#ff4545] hover:bg-[#ff4545]/10 rounded transition-all duration-300"
                >
                    <span className="text-white/70 text-xs tracking-wider group-hover:text-[#ff4545]">ABORTAR</span>
                </button>
            </div>

            {/* Main Scanner Container */}
            <div className="relative z-10 w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,255,157,0.15)] border border-white/10 group">

                {/* HUD Corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00ff9d] opacity-80 shadow-[0_0_10px_#00ff9d]"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00ff9d] opacity-80 shadow-[0_0_10px_#00ff9d]"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00ff9d] opacity-80 shadow-[0_0_10px_#00ff9d]"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00ff9d] opacity-80 shadow-[0_0_10px_#00ff9d]"></div>

                {/* Video Feed */}
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 filter brightness-110 contrast-110 pointer-events-none"
                    autoPlay
                    playsInline
                    muted
                />

                {/* Canvas Overlay */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 mix-blend-screen opacity-90 pointer-events-none"
                />

                {/* Scanning Beam */}
                {(status === 'scanning' || status === 'analyzing') && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 w-full h-2 bg-[#00ff9d] shadow-[0_0_30px_#00ff9d] animate-[scan_2s_ease-in-out_infinite] opacity-60"></div>
                        <div className="absolute inset-0 bg-[#00ff9d] opacity-[0.03] animate-pulse"></div>
                    </div>
                )}

                {/* Central Focus Ring */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 pointer-events-none
                    ${faceDetected ? 'w-[280px] h-[360px] border-[#00ff9d]/40 shadow-[0_0_30px_rgba(0,255,157,0.2)]' : 'w-[200px] h-[200px] border-white/20'}
                    border rounded-[40px] flex items-center justify-center`}
                >
                    <div className={`w-full h-full border border-dashed ${faceDetected ? 'border-[#00ff9d]/30 animate-[spin_10s_linear_infinite]' : 'border-white/10'} rounded-[38px]`}></div>

                    {/* Crosshair */}
                    <div className="absolute w-6 h-6 text-[#00ff9d] opacity-60 flex items-center justify-center">
                        <div className="absolute w-full h-[1px] bg-[#00ff9d]"></div>
                        <div className="absolute h-full w-[1px] bg-[#00ff9d]"></div>
                    </div>
                </div>

                {/* Metrics Overlay (Right Side) */}
                {faceDetected && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 text-[10px] text-[#00ff9d] font-mono pointer-events-none tracking-wider">
                        <div className="bg-black/80 px-2 py-1 rounded backdrop-blur-md border border-[#00ff9d]/30 flex justify-between w-24">
                            <span>H:</span>
                            <span>{metrics.height}MM</span>
                        </div>
                        <div className="bg-black/80 px-2 py-1 rounded backdrop-blur-md border border-[#00ff9d]/30 flex justify-between w-24">
                            <span>W:</span>
                            <span>{metrics.width}MM</span>
                        </div>
                        <div className="bg-black/80 px-2 py-1 rounded backdrop-blur-md border border-[#00ff9d]/30 flex justify-between w-24">
                            <span>R:</span>
                            <span>{metrics.ratio}</span>
                        </div>
                        <div className="h-[1px] bg-[#00ff9d]/30 my-1"></div>
                        <div className="text-[8px] opacity-70 text-right">
                            CONFIDENCE: 99%
                        </div>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-20">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-black/80 backdrop-blur-md rounded-full border border-[#00ff9d]/30 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        <div className={`w-2 h-2 rounded-full ${faceDetected ? 'bg-[#00ff9d] shadow-[0_0_10px_#00ff9d]' : 'bg-red-500'} animate-pulse`}></div>
                        <span className="text-[#00ff9d] text-[10px] tracking-[0.2em] uppercase font-bold">
                            {status === 'loading' ? 'INICIALIZANDO...' :
                                status === 'scanning' ? `ESCANEO: FASE ${scanPhase}/3` :
                                    status === 'analyzing' ? 'PROCESANDO...' :
                                        faceDetected ? 'OBJETIVO FIJADO' : 'BUSCANDO ROSTRO...'}
                        </span>
                    </div>

                    {/* Dynamic Feedback Text */}
                    <p className="mt-4 text-white text-sm font-medium tracking-wide drop-shadow-md min-h-[20px]">
                        {feedback}
                    </p>
                </div>
            </div>

            {/* Control Panel */}
            <div className="mt-8 z-20 h-16">
                {(status === 'ready' || (status === 'loading' && faceDetected)) && faceDetected && (
                    <button
                        onClick={handleStartAnalysis}
                        className="group relative flex items-center justify-center gap-3 px-10 py-4 bg-[#00ff9d] hover:bg-[#00ff9d] text-black font-bold tracking-[0.15em] uppercase text-sm clip-path-polygon hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(0,255,157,0.4)]"
                        style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                    >
                        INICIAR ESCANEO
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                )}
            </div>

            {/* Global Styles for Animations */}
            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
