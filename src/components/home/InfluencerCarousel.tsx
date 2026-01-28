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

const PLACEHOLDER_VIDEOS: UGCVideo[] = [
  {
    id: '1',
    name: 'Jennifer',
    video_url: 'https://videos.pexels.com/video-files/5530915/5530915-uhd_1440_2560_25fps.mp4',
    thumbnail_url: 'https://images.pexels.com/videos/5530915/pexels-photo-5530915.jpeg?auto=compress&cs=tinysrgb&w=400',
    is_verified: true,
  },
  {
    id: '2',
    name: 'Carlos',
    video_url: 'https://videos.pexels.com/video-files/5530903/5530903-uhd_1440_2560_25fps.mp4',
    thumbnail_url: 'https://images.pexels.com/videos/5530903/pexels-photo-5530903.jpeg?auto=compress&cs=tinysrgb&w=400',
    is_verified: true,
  },
  {
    id: '3',
    name: 'María',
    video_url: 'https://videos.pexels.com/video-files/5530908/5530908-uhd_1440_2560_25fps.mp4',
    thumbnail_url: 'https://images.pexels.com/videos/5530908/pexels-photo-5530908.jpeg?auto=compress&cs=tinysrgb&w=400',
    is_verified: false,
  },
  {
    id: '4',
    name: 'Daniela',
    video_url: 'https://videos.pexels.com/video-files/5530915/5530915-uhd_1440_2560_25fps.mp4',
    thumbnail_url: 'https://images.pexels.com/videos/5530915/pexels-photo-5530915.jpeg?auto=compress&cs=tinysrgb&w=400',
    is_verified: true,
  },
  {
    id: '5',
    name: 'Roberto',
    video_url: 'https://videos.pexels.com/video-files/5530903/5530903-uhd_1440_2560_25fps.mp4',
    thumbnail_url: 'https://images.pexels.com/videos/5530903/pexels-photo-5530903.jpeg?auto=compress&cs=tinysrgb&w=400',
    is_verified: true,
  },
];

export default function InfluencerCarousel({ initialVideos }: InfluencerCarouselProps) {
  const [videos, setVideos] = useState<UGCVideo[]>(initialVideos || PLACEHOLDER_VIDEOS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handlePlayPause = (videoId: string) => {
    const video = videoRefs.current.get(videoId);
    if (!video) return;

    if (playingId === videoId) {
      video.pause();
      setPlayingId(null);
    } else {
      if (playingId) {
        const currentVideo = videoRefs.current.get(playingId);
        currentVideo?.pause();
      }
      video.play();
      setPlayingId(videoId);
    }
  };

  const setVideoRef = (id: string, el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(id, el);
    } else {
      videoRefs.current.delete(id);
    }
  };

  const goToNext = () => {
    if (playingId) {
      const video = videoRefs.current.get(playingId);
      video?.pause();
      setPlayingId(null);
    }
    setActiveIndex((prev) => (prev + 1) % videos.length);
  };

  const goToPrev = () => {
    if (playingId) {
      const video = videoRefs.current.get(playingId);
      video?.pause();
      setPlayingId(null);
    }
    setActiveIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  // Touch/Mouse handlers for swipe
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 80;
    if (dragOffset > threshold) {
      goToPrev();
    } else if (dragOffset < -threshold) {
      goToNext();
    }
    setDragOffset(0);
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff % videos.length) + videos.length) % videos.length;
    const position = normalizedDiff > videos.length / 2 ? normalizedDiff - videos.length : normalizedDiff;

    const baseOffset = 15;
    const baseScale = 0.92;
    const baseRotate = 3;

    let translateX = position * baseOffset;
    let translateY = Math.abs(position) * 8;
    let scale = Math.pow(baseScale, Math.abs(position));
    let rotate = position * baseRotate;
    let zIndex = 10 - Math.abs(position);
    let opacity = Math.abs(position) <= 2 ? 1 - Math.abs(position) * 0.25 : 0;

    // Apply drag offset to front card
    if (position === 0 && isDragging) {
      translateX += dragOffset * 0.5;
      rotate += dragOffset * 0.05;
    }

    return {
      position: 'absolute',
      transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
      zIndex,
      opacity,
      transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: position === 0 ? 'auto' : 'none',
    };
  };

  if (videos.length === 0) return null;

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

        <ScrollAnimate animation="fade-up">
          <div
            ref={containerRef}
            className="carousel-container"
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            <div className="cards-stack">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className="card-wrapper"
                  style={getCardStyle(index)}
                >
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
                    />
                    <div className="influencer-overlay" />

                    {index === activeIndex && (
                      <button
                        className={`influencer-play-btn ${playingId === video.id ? 'playing' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPause(video.id);
                        }}
                        aria-label={playingId === video.id ? 'Pausar' : 'Reproducir'}
                      >
                        {playingId === video.id ? (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                    )}

                    <div className="influencer-info">
                      <span className="influencer-name">
                        {video.name}
                        {video.is_verified && (
                          <span className="verified-badge">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Dots indicator */}
          <div className="dots-indicator">
            {videos.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Ir a video ${index + 1}`}
              />
            ))}
          </div>
        </ScrollAnimate>

        <p className="swipe-hint">← Desliza para cambiar →</p>
      </div>

      <style jsx>{`
        .influencer-section {
          padding: 60px 0 40px;
          background: linear-gradient(180deg, #f8f9fa 0%, #fff 100%);
          overflow: hidden;
        }

        .carousel-container {
          position: relative;
          height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
          user-select: none;
          touch-action: pan-y pinch-zoom;
        }

        .carousel-container:active {
          cursor: grabbing;
        }

        .cards-stack {
          position: relative;
          width: 260px;
          height: 460px;
        }

        .card-wrapper {
          width: 100%;
          height: 100%;
        }

        .influencer-video-container {
          width: 100%;
          height: 100%;
          border-radius: 28px;
          overflow: hidden;
          background: linear-gradient(135deg, #152132 0%, #1c2d42 100%);
          box-shadow:
            0 25px 50px rgba(21, 33, 50, 0.4),
            0 10px 20px rgba(0, 0, 0, 0.2);
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
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0) 50%,
            rgba(0, 0, 0, 0.7) 100%
          );
          pointer-events: none;
          border-radius: 28px;
        }

        .influencer-play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          z-index: 5;
        }

        .influencer-play-btn:hover {
          transform: translate(-50%, -50%) scale(1.1);
          background: white;
        }

        .influencer-play-btn:active {
          transform: translate(-50%, -50%) scale(0.95);
        }

        .influencer-play-btn svg {
          width: 28px;
          height: 28px;
          color: #152132;
          margin-left: 4px;
        }

        .influencer-play-btn.playing {
          background: #152132;
        }

        .influencer-play-btn.playing svg {
          color: white;
          margin-left: 0;
        }

        .influencer-info {
          position: absolute;
          bottom: 24px;
          left: 20px;
          right: 20px;
          z-index: 5;
        }

        .influencer-name {
          color: white;
          font-size: 20px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
        }

        .verified-badge {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #1da1f2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .verified-badge svg {
          width: 14px;
          height: 14px;
          color: white;
        }

        .dots-indicator {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ddd;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .dot.active {
          background: #152132;
          width: 24px;
          border-radius: 4px;
        }

        .dot:hover:not(.active) {
          background: #bbb;
        }

        .swipe-hint {
          text-align: center;
          font-size: 13px;
          color: #999;
          margin-top: 16px;
        }

        @media (min-width: 768px) {
          .carousel-container {
            height: 520px;
          }

          .cards-stack {
            width: 280px;
            height: 500px;
          }

          .swipe-hint {
            display: none;
          }
        }

        @media (max-width: 767px) {
          .influencer-section {
            padding: 40px 0 30px;
          }

          .carousel-container {
            height: 420px;
          }

          .cards-stack {
            width: 220px;
            height: 390px;
          }

          .influencer-video-container {
            border-radius: 24px;
          }

          .influencer-overlay {
            border-radius: 24px;
          }

          .influencer-play-btn {
            width: 56px;
            height: 56px;
          }

          .influencer-play-btn svg {
            width: 24px;
            height: 24px;
          }

          .influencer-name {
            font-size: 18px;
          }
        }
      `}</style>
    </section>
  );
}
