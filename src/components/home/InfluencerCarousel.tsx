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

// Videos placeholder con thumbnails para desarrollo
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
];

export default function InfluencerCarousel({ initialVideos }: InfluencerCarouselProps) {
  const [videos, setVideos] = useState<UGCVideo[]>(initialVideos || PLACEHOLDER_VIDEOS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

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

  const navigateCarousel = (direction: 'left' | 'right') => {
    if (isAnimating) return; // Prevent spam clicking

    // Pause current video
    const currentVideo = videoRefs.current.get(videos[activeIndex]?.id);
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }
    setIsPlaying(false);

    // Start animation
    setSlideDirection(direction);
    setIsAnimating(true);

    // Update index after a small delay for animation
    setTimeout(() => {
      if (direction === 'left') {
        setActiveIndex(prev => (prev === 0 ? videos.length - 1 : prev - 1));
      } else {
        setActiveIndex(prev => (prev === videos.length - 1 ? 0 : prev + 1));
      }

      // Reset animation state
      setTimeout(() => {
        setIsAnimating(false);
        setSlideDirection(null);
      }, 50);
    }, 300);
  };

  const handlePlayPause = () => {
    const video = videoRefs.current.get(videos[activeIndex]?.id);
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const setVideoRef = (id: string, el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(id, el);
    } else {
      videoRefs.current.delete(id);
    }
  };

  if (videos.length === 0) return null;

  // Calculate which videos to show (prev, current, next)
  const getPrevIndex = () => (activeIndex === 0 ? videos.length - 1 : activeIndex - 1);
  const getNextIndex = () => (activeIndex === videos.length - 1 ? 0 : activeIndex + 1);

  const visibleVideos = [
    { ...videos[getPrevIndex()], position: 'left' as const },
    { ...videos[activeIndex], position: 'center' as const },
    { ...videos[getNextIndex()], position: 'right' as const },
  ];

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
          {/* Left Navigation */}
          <button
            className="influencer-nav influencer-nav-left"
            onClick={() => navigateCarousel('left')}
            aria-label="Ver video anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Carousel Container */}
          <div className={`influencer-carousel ${isAnimating ? `sliding-${slideDirection}` : ''}`}>
            {visibleVideos.map((video) => (
              <div
                key={`${video.id}-${video.position}`}
                className={`influencer-card influencer-card-${video.position} ${isAnimating ? 'animating' : ''}`}
                onClick={() => video.position !== 'center' && navigateCarousel(video.position === 'left' ? 'left' : 'right')}
              >
                <div className="influencer-video-container">
                  {/* Video Element */}
                  <video
                    ref={(el) => {
                      if (video.position === 'center') {
                        setVideoRef(video.id, el);
                      }
                    }}
                    src={video.video_url}
                    poster={video.thumbnail_url}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="influencer-video"
                  />

                  {/* Gradient Overlay */}
                  <div className="influencer-overlay" />

                  {/* Play/Pause Button - Only on center */}
                  {video.position === 'center' && (
                    <button
                      className={`influencer-play-btn ${isPlaying ? 'playing' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause();
                      }}
                      aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                    >
                      {isPlaying ? (
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
            ))}
          </div>

          {/* Right Navigation */}
          <button
            className="influencer-nav influencer-nav-right"
            onClick={() => navigateCarousel('right')}
            aria-label="Ver siguiente video"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
                .influencer-section {
                    padding: 60px 0;
                    background: linear-gradient(180deg, #f8f9fa 0%, #fff 100%);
                    overflow: hidden;
                }

                .influencer-carousel-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 40px;
                    padding: 0 60px;
                }

                .influencer-carousel {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    perspective: 1000px;
                }

                .influencer-nav {
                    position: absolute;
                    z-index: 20;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: white;
                    border: none;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .influencer-nav:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
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
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }

                .influencer-card-left,
                .influencer-card-right {
                    opacity: 0.6;
                    filter: brightness(0.7);
                }

                .influencer-card-left {
                    transform: scale(0.85) translateX(20px);
                }

                .influencer-card-right {
                    transform: scale(0.85) translateX(-20px);
                }

                .influencer-card-center {
                    z-index: 10;
                    transform: scale(1);
                }

                /* Slide Animations */
                .influencer-carousel.sliding-left .influencer-card {
                    animation: slideLeft 0.3s ease-out forwards;
                }

                .influencer-carousel.sliding-right .influencer-card {
                    animation: slideRight 0.3s ease-out forwards;
                }

                @keyframes slideLeft {
                    0% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    50% {
                        transform: translateX(50px);
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideRight {
                    0% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    50% {
                        transform: translateX(-50px);
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .influencer-card.animating {
                    pointer-events: none;
                }

                .influencer-nav:active {
                    transform: scale(0.95);
                }

                .influencer-video-container {
                    position: relative;
                    width: 220px;
                    height: 390px;
                    border-radius: 24px;
                    overflow: hidden;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }

                .influencer-card-center .influencer-video-container {
                    width: 260px;
                    height: 460px;
                    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
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
                        rgba(0, 0, 0, 0.1) 0%,
                        transparent 30%,
                        transparent 50%,
                        rgba(0, 0, 0, 0.6) 100%
                    );
                    pointer-events: none;
                }

                .influencer-play-btn {
                    position: absolute;
                    bottom: 70px;
                    right: 16px;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.95);
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                }

                .influencer-play-btn:hover {
                    transform: scale(1.1);
                    background: white;
                }

                .influencer-play-btn svg {
                    width: 22px;
                    height: 22px;
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
                    bottom: 20px;
                    left: 16px;
                    right: 70px;
                }

                .influencer-name {
                    color: white;
                    font-size: 20px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
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

                @media (max-width: 768px) {
                    .influencer-section {
                        padding: 40px 0;
                    }

                    .influencer-carousel-wrapper {
                        padding: 0 50px;
                    }

                    .influencer-nav {
                        width: 40px;
                        height: 40px;
                    }

                    .influencer-nav svg {
                        width: 20px;
                        height: 20px;
                    }

                    .influencer-card-left,
                    .influencer-card-right {
                        display: none;
                    }

                    .influencer-video-container {
                        width: 240px;
                        height: 426px;
                    }

                    .influencer-card-center .influencer-video-container {
                        width: 240px;
                        height: 426px;
                    }
                }
            `}</style>
    </section>
  );
}
