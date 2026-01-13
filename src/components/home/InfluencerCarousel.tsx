'use client';

import { useState, useRef, useEffect } from 'react';
import { ScrollAnimate } from '@/components/ui/ScrollAnimate';

interface UGCVideo {
    id: string;
    name: string;
    video_url: string;
    thumbnail_url?: string;
    is_verified: boolean;
}

interface InfluencerCarouselProps {
    initialVideos?: UGCVideo[];
}

// Videos placeholder para desarrollo
const PLACEHOLDER_VIDEOS: UGCVideo[] = [
    {
        id: '1',
        name: 'Jennifer',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4',
        thumbnail_url: undefined,
        is_verified: true,
    },
    {
        id: '2',
        name: 'Carlos',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-under-multicolored-lights-1237-large.mp4',
        thumbnail_url: undefined,
        is_verified: true,
    },
    {
        id: '3',
        name: 'María',
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-modeling-looking-at-the-camera-39881-large.mp4',
        thumbnail_url: undefined,
        is_verified: false,
    },
];

export default function InfluencerCarousel({ initialVideos }: InfluencerCarouselProps) {
    const [videos, setVideos] = useState<UGCVideo[]>(initialVideos || PLACEHOLDER_VIDEOS);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

    // Fetch videos from API if not provided
    useEffect(() => {
        if (!initialVideos) {
            fetch('/api/ugc-videos')
                .then(res => res.json())
                .then(data => {
                    if (data.videos && data.videos.length > 0) {
                        setVideos(data.videos);
                    }
                })
                .catch(console.error);
        }
    }, [initialVideos]);

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = 300;
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleVideoToggle = (videoId: string) => {
        const video = videoRefs.current.get(videoId);
        if (!video) return;

        if (activeVideo === videoId) {
            video.pause();
            setActiveVideo(null);
        } else {
            // Pause any currently playing video
            if (activeVideo) {
                const currentlyPlaying = videoRefs.current.get(activeVideo);
                currentlyPlaying?.pause();
            }
            video.play();
            setActiveVideo(videoId);
        }
    };

    const setVideoRef = (id: string, el: HTMLVideoElement | null) => {
        if (el) {
            videoRefs.current.set(id, el);
        } else {
            videoRefs.current.delete(id);
        }
    };

    if (videos.length === 0) {
        return null;
    }

    return (
        <section className="influencer-section" aria-labelledby="influencer-title">
            <div className="section-container">
                <ScrollAnimate animation="fade-up">
                    <div className="section-header">
                        <h2 id="influencer-title" className="section-title">
                            Descubre cómo luce
                        </h2>
                        <p className="section-description">
                            Nuestros clientes comparten su estilo
                        </p>
                    </div>
                </ScrollAnimate>

                <div className="influencer-carousel-wrapper">
                    {/* Navigation Arrows */}
                    <button
                        className="influencer-nav influencer-nav-left"
                        onClick={() => scrollCarousel('left')}
                        aria-label="Ver videos anteriores"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    <div className="influencer-carousel" ref={carouselRef}>
                        {videos.map((video, index) => (
                            <ScrollAnimate key={video.id} animation="fade-up" delay={index * 100}>
                                <div className="influencer-card">
                                    <div className="influencer-video-container">
                                        <video
                                            ref={(el) => setVideoRef(video.id, el)}
                                            src={video.video_url}
                                            poster={video.thumbnail_url}
                                            loop
                                            muted
                                            playsInline
                                            preload="metadata"
                                            className="influencer-video"
                                            onClick={() => handleVideoToggle(video.id)}
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="influencer-overlay" />

                                        {/* Play/Pause button */}
                                        <button
                                            className={`influencer-play-btn ${activeVideo === video.id ? 'playing' : ''}`}
                                            onClick={() => handleVideoToggle(video.id)}
                                            aria-label={activeVideo === video.id ? 'Pausar' : 'Reproducir'}
                                        >
                                            {activeVideo === video.id ? (
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            )}
                                        </button>

                                        {/* Name Badge */}
                                        <div className="influencer-info">
                                            <span className="influencer-name">
                                                {video.name}
                                                {video.is_verified && (
                                                    <span className="verified-badge" aria-label="Verificado">
                                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </ScrollAnimate>
                        ))}
                    </div>

                    <button
                        className="influencer-nav influencer-nav-right"
                        onClick={() => scrollCarousel('right')}
                        aria-label="Ver más videos"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Styles */}
            <style jsx>{`
        .influencer-section {
          padding: 60px 0;
          background: linear-gradient(180deg, #fff 0%, #f8f9fa 100%);
        }

        .influencer-carousel-wrapper {
          position: relative;
          margin-top: 32px;
        }

        .influencer-carousel {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          padding: 8px 48px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .influencer-carousel::-webkit-scrollbar {
          display: none;
        }

        .influencer-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .influencer-nav:hover {
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .influencer-nav svg {
          width: 24px;
          height: 24px;
          color: #152132;
        }

        .influencer-nav-left {
          left: 0;
        }

        .influencer-nav-right {
          right: 0;
        }

        .influencer-card {
          scroll-snap-align: start;
          flex-shrink: 0;
        }

        .influencer-video-container {
          position: relative;
          width: 200px;
          height: 356px;
          border-radius: 20px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .influencer-video-container:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .influencer-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .influencer-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.7) 100%
          );
          pointer-events: none;
        }

        .influencer-play-btn {
          position: absolute;
          bottom: 60px;
          right: 16px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .influencer-play-btn:hover {
          transform: scale(1.1);
        }

        .influencer-play-btn svg {
          width: 18px;
          height: 18px;
          color: #152132;
        }

        .influencer-play-btn.playing {
          background: #152132;
        }

        .influencer-play-btn.playing svg {
          color: white;
        }

        .influencer-info {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 56px;
        }

        .influencer-name {
          color: white;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .verified-badge {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1da1f2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .verified-badge svg {
          width: 12px;
          height: 12px;
          color: white;
        }

        @media (max-width: 768px) {
          .influencer-section {
            padding: 40px 0;
          }

          .influencer-nav {
            display: none;
          }

          .influencer-carousel {
            padding: 8px 16px;
          }

          .influencer-video-container {
            width: 160px;
            height: 284px;
          }
        }
      `}</style>
        </section>
    );
}
