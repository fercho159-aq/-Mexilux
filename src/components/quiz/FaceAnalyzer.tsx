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
    const [progress, setProgress] = useState(0); // Para simular análisis
    const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

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
                startCamera();
            } catch (error) {
                console.error("Error loading MediaPipe:", error);
                setStatus('error');
            }
        };

        initMediaPipe();

        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: "user" }
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.addEventListener('loadeddata', predictWebcam);
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    let lastVideoTime = -1;
    let renderLoopId: number;

    const predictWebcam = async () => {
        if (!faceLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const drawingUtils = new DrawingUtils(ctx!);

        if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;

            const results = faceLandmarkerRef.current.detectForVideo(video, performance.now());

            // Limpiar y dibujar video
            ctx!.clearRect(0, 0, canvas.width, canvas.height);
            // ctx!.drawImage(video, 0, 0, canvas.width, canvas.height); // Opcional si queremos ver el video crudo

            if (results.faceLandmarks) {
                for (const landmarks of results.faceLandmarks) {
                    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
                    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#FF3030" });
                    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: "#FF3030" });
                    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#30FF30" });
                    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: "#30FF30" });
                    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#E0E0E0" });

                    // Si estamos en modo análisis activo...
                    if (status === 'analyzing') {
                        analyzeFace(landmarks, video, ctx!);
                        return; // Detener loop
                    }
                }
            }
        }

        if (status !== 'analyzing') {
            renderLoopId = requestAnimationFrame(predictWebcam);
        }
    };

    const startAnalysis = () => {
        setStatus('analyzing');
    };

    const analyzeFace = (landmarks: any[], video: HTMLVideoElement, ctx: CanvasRenderingContext2D) => {
        // Detener loop
        cancelAnimationFrame(renderLoopId);

        // 1. Calcular Forma de Rostro
        const faceShape = calculateFaceShape(landmarks, video.width, video.height);

        // 2. Calcular Tono de Piel
        // Usamos landmarks de las mejillas para samplear color
        // Mejilla izquierda approx indices: 234, 93, 132 (MediaPipe mesh)
        // Mejilla derecha approx indices: 454, 323, 361
        const skinTone = calculateSkinTone(landmarks, video, ctx);

        // Simular un poco de delay para UX "procesando"
        let p = 0;
        const interval = setInterval(() => {
            p += 10;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                onComplete({ faceShape, skinTone });
            }
        }, 100);
    };

    const calculateFaceShape = (landmarks: any[], width: number, height: number): FaceShape => {
        // Simplificación de ratios
        // Ancho frente: 103 - 332
        // Ancho pómulos: 234 - 454
        // Ancho mandíbula: 58 - 288 (approx, usar puntos de gonion)
        // Largo rostro: 10 - 152

        // Convertir coordenadas normalizadas a pixeles
        const getP = (idx: number) => landmarks[idx];
        const dist = (i1: number, i2: number) => {
            const p1 = getP(i1);
            const p2 = getP(i2);
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        };

        const foreheadWidth = dist(103, 332);
        const cheekWidth = dist(234, 454);
        const jawWidth = dist(58, 288); // Puntos aproximados mandíbula
        const faceHeight = dist(10, 152);

        // Ratios
        const heightToWidth = faceHeight / cheekWidth;
        const jawToCheek = jawWidth / cheekWidth;
        const foreheadToCheek = foreheadWidth / cheekWidth;

        // Lógica heurística básica
        if (heightToWidth > 1.45) return 'oblong';
        if (jawToCheek > 0.9) return 'square'; // Mandíbula ancha casi como pómulos
        if (jawToCheek < 0.75 && foreheadToCheek > 1.1) return 'heart'; // Frente ancha, barbilla fina
        if (Math.abs(faceHeight - cheekWidth) < 0.15 && jawToCheek < 0.9) return 'round'; // Redondo vs Cuadrado (mandíbula más suave)

        // Default oval si es proporcionado
        return 'oval';
    };

    const calculateSkinTone = (landmarks: any[], video: HTMLVideoElement, ctx: CanvasRenderingContext2D): { category: SkinTone, undertone: Undertone, rgb: [number, number, number] } => {
        // Dibujamos el video actual en un canvas temporal oculto para leer pixeles sin las lineas de landmarks
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return { category: 'medium', undertone: 'neutral', rgb: [128, 128, 128] };

        tempCtx.drawImage(video, 0, 0);

        // Muestrear puntos de mejillas
        const samplePoints = [
            landmarks[234], // Mejilla
            landmarks[454], // Mejilla opuesta
            landmarks[152], // Barbilla (a veces sombra) - mejor frente
            landmarks[10]   // Frente
        ];

        let r = 0, g = 0, b = 0, count = 0;

        samplePoints.forEach(p => {
            const x = Math.floor(p.x * video.videoWidth);
            const y = Math.floor(p.y * video.videoHeight);

            // Tomar un area de 5x5 pixeles
            const imageData = tempCtx.getImageData(x - 2, y - 2, 5, 5);
            const data = imageData.data;

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

        // Clasificar
        // YIQ brightness
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        let category: SkinTone = 'medium';
        if (brightness > 200) category = 'light';
        else if (brightness < 100) category = 'dark';
        else category = 'medium';

        // Undertone (muy simplificado)
        // Warm: R y G altos, B bajo
        // Cool: B más alto relativo a G
        let undertone: Undertone = 'neutral';
        if (r > b * 1.5) undertone = 'warm';
        else if (b > r * 0.9) undertone = 'cool';

        return { category, undertone, rgb: [r, g, b] };
    };

    return (
        <div className="face-analyzer-container">
            <h3>📸 Análisis Facial IA</h3>

            {status === 'error' ? (
                <div className="error-message">
                    <p>No pudimos acceder a la cámara. Por favor verifica los permisos.</p>
                    <button onClick={onCancel} className="btn-secondary">Volver al modo manual</button>
                </div>
            ) : (
                <div className="camera-wrapper">
                    <div className="video-container" style={{ position: 'relative', width: 640, maxWidth: '100%', borderRadius: 16, overflow: 'hidden' }}>
                        <video
                            ref={videoRef}
                            style={{ width: '100%', display: 'none' }} // Usamos canvas para display
                            autoPlay
                            playsInline
                        />
                        <canvas
                            ref={canvasRef}
                            style={{ width: '100%' }}
                            width={640}
                            height={480}
                        />

                        {status === 'analyzing' && (
                            <div className="scanning-overlay">
                                <div className="scanner-line" />
                                <div className="analyzing-text">
                                    Analizando geometría... {progress}%
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="controls" style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
                        {status === 'ready' && (
                            <button onClick={startAnalysis} className="btn-primary-capture">
                                📸 Analizar mi rostro
                            </button>
                        )}
                        <button onClick={onCancel} className="btn-text">
                            Cancelar / Manual
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .face-analyzer-container {
                    text-align: center;
                    background: #1a1a2e;
                    padding: 24px;
                    border-radius: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .btn-primary-capture {
                    background: #e94560;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 50px;
                    font-weight: bold;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .btn-primary-capture:hover {
                    transform: scale(1.05);
                    background: #ff5e78;
                }
                .btn-text {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 50px;
                    cursor: pointer;
                }
                .scanning-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }
                .scanner-line {
                    width: 100%;
                    height: 2px;
                    background: #00ff00;
                    position: absolute;
                    top: 0;
                    animation: scan 2s infinite linear;
                    box-shadow: 0 0 10px #00ff00;
                }
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .analyzing-text {
                    color: #fff;
                    font-weight: bold;
                    background: rgba(0,0,0,0.7);
                    padding: 8px 16px;
                    border-radius: 8px;
                    z-index: 2;
                }
            `}</style>
        </div>
    );
}
