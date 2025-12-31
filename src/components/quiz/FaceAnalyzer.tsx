'use client';

import { useEffect, useRef, useState } from 'react';
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
    const [progress, setProgress] = useState(0);
    const [feedback, setFeedback] = useState("Iniciando cámara...");
    const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const initMediaPipe = async () => {
            try {
                setFeedback("Cargando modelo IA...");
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
                setFeedback("¡Listo! Encuadra tu rostro");
                startCamera();
            } catch (error) {
                console.error("Error loading MediaPipe:", error);
                setStatus('error');
                setFeedback("Error al cargar IA");
            }
        };

        if (typeof window !== 'undefined') {
            initMediaPipe();
        }

        return () => {
            stopCamera();
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.addEventListener('loadeddata', predictWebcam);
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            setFeedback("No se pudo acceder a la cámara");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    let lastVideoTime = -1;

    const predictWebcam = async () => {
        if (!faceLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const drawingUtils = new DrawingUtils(ctx!);

        if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;

            let results;
            try {
                results = faceLandmarkerRef.current.detectForVideo(video, performance.now());
            } catch (e) {
                console.error(e);
                // Continue loop even if detection fails frame
            }

            // Sync canvas size
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }

            ctx!.save();
            ctx!.clearRect(0, 0, canvas.width, canvas.height);

            // Mirror effect
            ctx!.scale(-1, 1);
            ctx!.translate(-canvas.width, 0);
            ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx!.restore();

            if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
                const landmarks = results.faceLandmarks[0];

                // Draw Oval
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#e94560", lineWidth: 2 });
                // Draw Eyes
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "rgba(255,255,255,0.5)", lineWidth: 1 });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "rgba(255,255,255,0.5)", lineWidth: 1 });

                // Check if analyzing. We use a data attribute or ref check to prevent re-entry could be safer, 
                // but checking status state inside the raF loop works because state updates trigger re-render 
                // BUT the closure of this function might satisfy stale state.
                // However, since we re-requestAnimationFrame, it's fine.
                // Actually, to be safe, let's trigger analysis via effect or direct call, not inside draw loop.
                // We will use a ref for 'isAnalyzing' to correspond with state without closure issues.
            }
        }

        // Keep loop running unless component unmounts
        animationRef.current = requestAnimationFrame(predictWebcam);
    };

    const handleStartAnalysis = async () => {
        if (!faceLandmarkerRef.current || !videoRef.current) return;

        setStatus('analyzing');
        setFeedback("Analizando geometría...");
        setProgress(10);

        // Perform analysis NOW on the current frame
        const video = videoRef.current;
        const now = performance.now();
        const results = faceLandmarkerRef.current.detectForVideo(video, now);

        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            await performAnalysisInfo(landmarks, video);
        } else {
            setFeedback("No se detectó rostro. Intenta de nuevo.");
            setStatus('ready');
            setProgress(0);
        }
    };

    const performAnalysisInfo = async (landmarks: any[], video: HTMLVideoElement) => {
        try {
            // Simulate steps
            setProgress(30);
            await new Promise(r => setTimeout(r, 400));

            const faceShape = calculateFaceShape(landmarks);
            setProgress(60);
            setFeedback("Calculando tono de piel...");
            await new Promise(r => setTimeout(r, 400));

            const skinTone = calculateSkinTone(landmarks, video);
            setProgress(90);
            await new Promise(r => setTimeout(r, 300));

            setProgress(100);
            onComplete({ faceShape, skinTone });

        } catch (e) {
            console.error(e);
            setStatus('error');
            setFeedback("Error calculando resultados");
        }
    };

    const calculateFaceShape = (landmarks: any[]): FaceShape => {
        const getDist3D = (i1: number, i2: number) => {
            const p1 = landmarks[i1];
            const p2 = landmarks[i2];
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
        };

        // Improved Ratios
        const cheekWidth = getDist3D(454, 234);
        const jawWidth = getDist3D(152, 10) * 0.9; // Just rough estimate of height vs width often used
        // Actually lets follow standard ratio
        const faceHeight = getDist3D(10, 152);
        const jawline = getDist3D(58, 288);
        const forehead = getDist3D(103, 332);

        const hwRatio = faceHeight / cheekWidth;
        const jcRatio = jawline / cheekWidth;

        // Debug
        // console.log({ hwRatio, jcRatio });

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

        // Landmarks for skin (Cheeks, forehead)
        // 4: Nose tip, 152: Chin, 234: Left cheek, 454: Right cheek, 10: Top
        // Let's sample distinct areas to avoid shadows or hair
        // Forehead (10), LeftCheek(234), RightCheek(454)
        const indices = [10, 234, 454];

        let r = 0, g = 0, b = 0, count = 0;

        indices.forEach(idx => {
            const p = landmarks[idx];
            const x = Math.floor(p.x * tempCanvas.width);
            const y = Math.floor(p.y * tempCanvas.height);

            // Get 5x5 avg
            const data = tempCtx.getImageData(Math.max(0, x - 2), Math.max(0, y - 2), 5, 5).data;
            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }
        });

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        let category: SkinTone = 'medium';
        if (yiq > 170) category = 'light';
        else if (yiq < 90) category = 'dark';

        let undertone: Undertone = 'neutral';
        // Simple heuristic
        if (r > b * 1.4) undertone = 'warm'; // More red/brown
        else if (b > r * 0.85) undertone = 'cool'; // More blueish/pale

        return { category, undertone, rgb: [r, g, b] };
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl bg-[#16213e] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row h-[80vh] md:h-auto">

                {/* Video Area */}
                <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden h-full min-h-[400px]">
                    {status === 'loading' && (
                        <div className="text-white flex flex-col items-center animate-pulse z-10">
                            <span className="text-4xl mb-4">📷</span>
                            <p className="text-lg">{feedback}</p>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 translate-x-0"
                        autoPlay
                        playsInline
                        muted
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Guidelines Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-50">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[380px] border-2 border-dashed border-white/30 rounded-[100px]" />
                    </div>

                    {/* Scanning Effect */}
                    {status === 'analyzing' && (
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#e94560] shadow-[0_0_15px_#e94560] animate-[scan_2s_linear_infinite]" />
                        </div>
                    )}
                </div>

                {/* Sidebar Controls */}
                <div className="w-full md:w-80 bg-[#1a1a2e] p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            Mexilux AI
                            <span className="text-[10px] bg-[#e94560] px-2 py-0.5 rounded-full uppercase tracking-wider">Beta</span>
                        </h3>
                        <p className="text-white/60 text-sm mb-6">
                            Nuestra inteligencia artificial analizará tu geometría facial para encontrar tus lentes perfectos.
                        </p>

                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Estado</p>
                                <p className="text-[#e2e8f0] font-medium flex items-center gap-2">
                                    {status === 'analyzing' ? (
                                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                                    ) : status === 'ready' ? (
                                        <span className="w-2 h-2 rounded-full bg-green-400" />
                                    ) : (
                                        <span className="w-2 h-2 rounded-full bg-gray-400" />
                                    )}
                                    {feedback}
                                </p>
                            </div>

                            {status === 'analyzing' && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-white/60">
                                        <span>Progreso</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#e94560] transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-6">
                        {status === 'ready' && (
                            <button
                                onClick={handleStartAnalysis}
                                className="w-full bg-gradient-to-r from-[#e94560] to-[#ff6b6b] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-[#e94560]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span>✨</span> Analizar Ahora
                            </button>
                        )}

                        <button
                            onClick={onCancel}
                            disabled={status === 'analyzing'}
                            className="w-full bg-white/5 hover:bg-white/10 text-white/80 py-3 rounded-xl font-medium transition-colors text-sm disabled:opacity-50"
                        >
                            Cancelar / Volver
                        </button>
                    </div>
                </div>
            </div>

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
