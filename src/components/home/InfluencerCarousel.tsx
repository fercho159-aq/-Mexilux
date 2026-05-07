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

  const scrollToVideo = (index: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const cardWidth = 280; // card width (260) + gap (20)
      const containerCenter = container.clientWidth / 2;
      const cardCenter = cardWidth / 2;

      // Calculate position to center the card
      // We want: (index * cardWidth) + cardCenter = scrollLeft + containerCenter
      // scrollLeft = (index * cardWidth) - containerCenter + cardCenter

      // Note: card width in CSS is 260px, gap is 20px. 
      // Let's rely on scrollIntoView or simple calculation.
      // Simple offset calculation:
      const cardElement = container.children[0].children[index] as HTMLElement;
      if (cardElement) {
        const scrollLeft = cardElement.offsetLeft - (container.clientWidth - cardElement.clientWidth) / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
    setActiveIndex(index);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const center = container.scrollLeft + container.clientWidth / 2;
      const cardElements = container.querySelectorAll('.card-wrapper');

      let closestIndex = 0;
      let closestDistance = Infinity;

      cardElements.forEach((el, index) => {
        const box = (el as HTMLElement).getBoundingClientRect();
        // Since we are in a scroll container, we need to be careful with getBoundingClientRect relative to viewport
        // But we can just use the container's center relative to viewport.

        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        const elementCenter = box.left + box.width / 2;
        const distance = Math.abs(containerCenter - elementCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
        // Pause playing video if scrolled away? Optional.
        // if (playingId) {
        //    const video = videoRefs.current.get(playingId);
        //    video?.pause();
        //    setPlayingId(null);
        // }
      }
    }
  };

  const goToNext = () => {
    const nextIndex = Math.min(activeIndex + 1, videos.length - 1);
    scrollToVideo(nextIndex);
  };

  const goToPrev = () => {
    const prevIndex = Math.max(activeIndex - 1, 0);
    scrollToVideo(prevIndex);
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
          <div className="carousel-wrapper">
            {/* Left Arrow - visible on desktop */}
            <button
              className={`nav-arrow left ${activeIndex === 0 ? 'disabled' : ''}`}
              onClick={goToPrev}
              disabled={activeIndex === 0}
              aria-label="Anterior video"
            >
              ←
            </button>

            <div
              ref={containerRef}
              className="carousel-container"
              onScroll={handleScroll}
            >
              <div className="track">
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    className={`card-wrapper ${index === activeIndex ? 'active' : ''}`}
                    onClick={() => index !== activeIndex && scrollToVideo(index)}
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

            {/* Right Arrow */}
            <button
              className={`nav-arrow right ${activeIndex === videos.length - 1 ? 'disabled' : ''}`}
              onClick={goToNext}
              disabled={activeIndex === videos.length - 1}
              aria-label="Siguiente video"
            >
              →
            </button>
          </div>

          {/* Dots indicator */}
          <div className="dots-indicator">
            {videos.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => scrollToVideo(index)}
                aria-label={`Ir a video ${index + 1}`}
              />
            ))}
          </div>
        </ScrollAnimate>
      </div>

      <style jsx>{`
        .influencer-section {
          padding: 60px 0 40px;
          background: linear-gradient(180deg, #f8f9fa 0%, #fff 100%);
          overflow: hidden;
        }

        .carousel-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: 1000px;
            margin: 0 auto;
        }

        .carousel-container {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
          padding: 40px 20px;
        }
        
        .carousel-container::-webkit-scrollbar {
            display: none;
        }

        .track {
            display: flex;
            gap: 20px;
            padding: 0 35%; /* Centering padding */
            width: max-content;
        }

        .card-wrapper {
            width: 260px;
            height: 460px;
            scroll-snap-align: center;
            flex-shrink: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            transform: scale(0.92);
            opacity: 0.7;
            cursor: pointer;
        }
        
        .card-wrapper.active {
            transform: scale(1);
            opacity: 1;
            z-index: 2;
        }

        .influencer-video-container {
          width: 100%;
          height: 100%;
          border-radius: 28px;
          overflow: hidden;
          background: linear-gradient(135deg, #152132 0%, #1c2d42 100%);
          position: relative;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .influencer-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .influencer-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%);
          pointer-events: none;
        }

        .influencer-play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 5;
          opacity: 0; 
        }
        
        .card-wrapper.active .influencer-play-btn {
            opacity: 1;
            background: rgba(255, 255, 255, 0.9);
        }
        .card-wrapper.active .influencer-play-btn.playing {
            opacity: 0; /* Hide when playing to not obstruct view, or show minimal? */
        }
        .card-wrapper.active .influencer-video-container:hover .influencer-play-btn.playing {
            opacity: 1; /* Show on hover */
        }

        .influencer-play-btn:hover {
          transform: translate(-50%, -50%) scale(1.1);
          background: white;
        }

        .influencer-play-btn svg {
          width: 28px;
          height: 28px;
          color: #152132;
          margin-left: 4px;
        }
        .influencer-play-btn.playing svg {
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
          gap: 6px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .verified-badge {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1da1f2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .verified-badge svg {
          width: 10px;
          height: 10px;
          color: white;
        }

        .nav-arrow {
            background: #fff;
            border: 1px solid #eee;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            z-index: 10;
            transition: all 0.2s;
            color: #152132;
            font-size: 18px;
        }
        .nav-arrow:hover:not(:disabled) {
            background: #152132;
            color: #fff;
        }
        .nav-arrow.disabled {
            opacity: 0.3;
            cursor: not-allowed;
            pointer-events: none;
        }
        
        .dots-indicator {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;
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

        @media (max-width: 768px) {
            .track {
                padding: 0 50px; /* Less padding on mobile to show more of next card */
            }
            .nav-arrow {
                display: none;
            }
            .card-wrapper {
                width: 240px;
                height: 400px;
            }
        }
      `}</style>
    </section>
  );
}
