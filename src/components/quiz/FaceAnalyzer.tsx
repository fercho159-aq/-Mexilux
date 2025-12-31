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
    const [status, setStatus] = useState<'loading' | 'ready' | 'analyzing' | 'error'>('loading');
    const [feedback, setFeedback] = useState("Iniciando cámara...");
    const [faceDetected, setFaceDetected] = useState(false);
    const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const requestRef = useRef<number | null>(null);

    // Apple-style circular progress for analysis
    const [progress, setProgress] = useState(0);

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
                setFeedback("Cargando Motor Neural...");
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
                setFeedback("Posiciona tu rostro en el marco");
                startCamera();
            } catch (error) {
                console.error("Error loading MediaPipe:", error);
                setStatus('error');
                setFeedback("Error de inicialización");
            }
        };

        if (typeof window !== 'undefined') {
            initMediaPipe();
        }

        return cleanup;
    }, [cleanup]);

    const startCamera = async () => {
        try {
            // Request generic HD resolution
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Wait for data to be loaded to start processing
                videoRef.current.onloadeddata = () => {
                    detectFrame();
                };
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            setFeedback("Acceso a cámara denegado");
        }
    };

    const detectFrame = async () => {
        if (!faceLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (video.paused || video.ended) return;

        // Ensure canvas matches video display size exactly for correct overlay
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
        } catch (e) { /* ignore frame error */ }

        ctx!.clearRect(0, 0, canvas.width, canvas.height);

        // We only draw overlay if NOT analyzing to keep the "Scan" animation clean
        // Or we draw a subtle mesh
        if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
            if (!faceDetected) setFaceDetected(true);

            // Draw subtle points/mesh
            // Note: MediaPipe returns normalized coordinates (0-1).
            // We need to scale them to the canvas size.
            // Also, we mirror the video with CSS, so we should mirror drawing or just draw naturally 
            // and let CSS mirror the canvas too.
            // Best approach: Video and Canvas both have transform: scaleX(-1) in CSS.

            const landmarks = results.faceLandmarks[0];
            const drawingUtils = new DrawingUtils(ctx!);

            // Apple FaceID style: just dots or a very subtle mesh
            // Let's draw dots for a "Point Cloud" effect
            ctx!.fillStyle = "rgba(255, 255, 255, 0.4)";
            for (const point of landmarks) {
                const x = point.x * canvas.width;
                const y = point.y * canvas.height;
                ctx!.beginPath();
                ctx!.arc(x, y, 1, 0, 2 * Math.PI); // Tiny dots
                ctx!.fill();
            }
        } else {
            if (faceDetected) setFaceDetected(false);
        }

        requestRef.current = requestAnimationFrame(detectFrame);
    };

    const handleStartAnalysis = async () => {
        if (!videoRef.current || !faceLandmarkerRef.current) return;

        setStatus('analyzing');
        setFeedback("Escaneando...");

        // Simular escaneo de FaceID
        const steps = [0, 20, 45, 70, 85, 100];

        for (let i = 0; i < steps.length; i++) {
            setProgress(steps[i]);
            await new Promise(r => setTimeout(r, 200)); // Animation timing
        }

        // Perform actual analysis on current frame
        const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, performance.now());

        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            const faceShape = calculateFaceShape(landmarks);
            const skinTone = calculateSkinTone(landmarks, videoRef.current);
            onComplete({ faceShape, skinTone });
        } else {
            setStatus('ready');
            setFeedback("Rostro no detectado. Intenta de nuevo.");
            setProgress(0);
        }
    };

    // --- Logic helpers (same logic, just moved) ---
    const calculateFaceShape = (landmarks: any[]): FaceShape => {
        const getDist3D = (i1: number, i2: number) => {
            const p1 = landmarks[i1];
            const p2 = landmarks[i2];
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
        };
        const cheekWidth = getDist3D(454, 234);
        const faceHeight = getDist3D(10, 152);
        const jawline = getDist3D(58, 288);

        const hwRatio = faceHeight / cheekWidth;
        const jcRatio = jawline / cheekWidth;

        if (hwRatio > 1.55) return 'oblong';
        if (jcRatio > 0.92) return 'square';
        if (jcRatio < 0.75 && hwRatio < 1.45) return 'heart';
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

        const indices = [10, 234, 454];
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
        if (yiq > 170) category = 'light'; else if (yiq < 90) category = 'dark';
        let undertone: Undertone = 'neutral';
        if (r > b * 1.4) undertone = 'warm'; else if (b > r * 0.85) undertone = 'cool';
        return { category, undertone, rgb: [r, g, b] };
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">

            {/* Header / Title */}
            <div className="absolute top-8 left-0 right-0 text-center z-20">
                <h2 className="text-white text-lg font-medium tracking-wide">Face ID Analysis</h2>
                <p className="text-white/50 text-sm mt-1">{status === 'analyzing' ? 'Escaneando geometría...' : feedback}</p>
            </div>

            {/* Cancel Button */}
            <button
                onClick={onCancel}
                className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors bg-white/10 w-10 h-10 rounded-full flex items-center justify-center z-30 backdrop-blur-md"
            >
                ✕
            </button>

            {/* Main Camera Frame - Apple / Instagram Style */}
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-[40px] overflow-hidden bg-black shadow-2xl border border-white/10 ring-1 ring-white/5">

                {/* Camera Feed */}
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                    autoPlay
                    playsInline
                    muted
                />

                {/* Overlay Canvas (Point Cloud) */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 opacity-60"
                />

                {/* Analysis Scanning Animation */}
                {status === 'analyzing' && (
                    <div className="absolute inset-0 z-20">
                        {/* Scanning Bar */}
                        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff9d] to-transparent shadow-[0_0_20px_#00ff9d] animate-[scan_1.5s_ease-in-out_infinite]" />
                        {/* Face ID Grid Effect */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    </div>
                )}

                {/* Status Indicator inside Frame */}
                {status !== 'analyzing' && faceDetected && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                        <span className="text-[10px] text-white/90 font-medium tracking-wider uppercase">Rostro Detectado</span>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-12 flex items-center gap-8">
                {status === 'ready' && (
                    <button
                        onClick={handleStartAnalysis}
                        className="group relative flex items-center justify-center"
                    >
                        {/* Outer Ring */}
                        <div className="w-20 h-20 rounded-full border-[4px] border-white transition-all duration-300 group-hover:scale-110 group-active:scale-95"></div>
                        {/* Inner Circle */}
                        <div className="absolute w-[68px] h-[68px] rounded-full bg-white transition-all duration-300 group-hover:scale-90 group-active:scale-75"></div>
                    </button>
                )}

                {status === 'analyzing' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 relative">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" />
                                <circle
                                    cx="32" cy="32" r="28"
                                    stroke="#00ff9d"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray="175.9"
                                    strokeDashoffset={175.9 - (175.9 * progress) / 100}
                                    className="transition-all duration-200 ease-linear"
                                />
                            </svg>
                        </div>
                        <span className="text-white/60 text-xs mt-4 tracking-widest uppercase">Procesando</span>
                    </div>
                )}
            </div>

            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    15% { opacity: 1; }
                    85% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
