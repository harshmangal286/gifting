import { useState, useEffect, useRef } from 'react';
import './DestinationCarousel.css';

interface Destination {
  id: string;
  title: string;
  image: string;
  tags: string[];
}

const DESTINATIONS: Destination[] = [
  {
    id: 'img3',
    title: 'Mountain Paradise',
    image: '/img3.jpg',
    tags: ['Snow', 'Mountains', 'Adventure']
  },
  {
    id: 'img4',
    title: 'Tropical Haven',
    image: '/img4.jpg',
    tags: ['Beach', 'Tropical', 'Paradise']
  },
  {
    id: 'img5',
    title: 'Alpine Escape',
    image: '/img5.jpg',
    tags: ['Resort', 'Ski', 'Luxury']
  },
  {
    id: 'img6',
    title: 'Desert Oasis',
    image: '/img6.jpg',
    tags: ['Desert', 'Sunset', 'Serenity']
  },
  {
    id: 'img7',
    title: 'Forest Retreat',
    image: '/img7.jpg',
    tags: ['Nature', 'Forest', 'Peaceful']
  },
  {
    id: 'img8',
    title: 'Urban Bliss',
    image: '/img8.jpg',
    tags: ['City', 'Modern', 'Vibrant']
  },
  {
    id: 'img9',
    title: 'Coastal Dream',
    image: '/img9.jpg',
    tags: ['Ocean', 'Coast', 'Romantic']
  },
  {
    id: 'im10',
    title: 'Valley Wonder',
    image: '/im10.jpg',
    tags: ['Valley', 'Scenic', 'Breathtaking']
  }
];

export function DestinationCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DESTINATIONS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setActiveIndex((prev) =>
      prev === 0 ? DESTINATIONS.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setActiveIndex((prev) => (prev + 1) % DESTINATIONS.length);
  };

  const handleRedirect = () => {
    window.location.href = '/';
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.changedTouches[0].clientX;
    setIsAutoPlay(false);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndRef.current = e.changedTouches[0].clientX;
    const distance = touchStartRef.current - touchEndRef.current;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const getVisibleIndices = () => {
    return [
      (activeIndex - 1 + DESTINATIONS.length) % DESTINATIONS.length,
      activeIndex,
      (activeIndex + 1) % DESTINATIONS.length
    ];
  };

  const visibleIndices = getVisibleIndices();

  return (
    <div className="carousel-container">
      {/* Background blur effect */}
      <div className="blur-background">
        <div
          className="blur-image"
          style={{
            backgroundImage: `url(${DESTINATIONS[activeIndex].image})`
          }}
        />
      </div>

      {/* Main carousel */}
      <div className="carousel-main">
        <button
          className="carousel-arrow carousel-arrow-left"
          onClick={handlePrev}
          aria-label="Previous"
        >
          ←
        </button>

        <div
          className="carousel-viewport"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="carousel-track">
            {visibleIndices.map((index, position) => {
              const destination = DESTINATIONS[index];
              const isActive = index === activeIndex;

              return (
                <div
                  key={destination.id}
                  className={`carousel-card ${isActive ? 'active' : 'side'}`}
                  style={{
                    transform:
                      position === 0
                        ? 'translateX(-110%) scale(0.75) rotateY(25deg)'
                        : position === 1
                          ? 'translateX(0) scale(1) rotateY(0)'
                          : 'translateX(110%) scale(0.75) rotateY(-25deg)',
                    opacity: position === 1 ? 1 : 0.4
                  }}
                >
                  <div className="card-image-wrapper">
                    <img
                      src={destination.image}
                      alt={destination.title}
                      className="card-image"
                    />
                    <div className="card-overlay" />
                  </div>

                  <div className="card-content">
                    <h2 className="card-title">{destination.title}</h2>
                    <div className="card-tags">
                      {destination.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="carousel-arrow carousel-arrow-right"
          onClick={handleNext}
          aria-label="Next"
        >
          →
        </button>
      </div>

      {/* Dots indicator */}
      <div className="carousel-dots">
        {DESTINATIONS.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => {
              setActiveIndex(index);
              setIsAutoPlay(false);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play toggle */}
      <button
        className="autoplay-toggle"
        onClick={() => setIsAutoPlay(!isAutoPlay)}
        title={isAutoPlay ? 'Pause' : 'Play'}
      >
        {isAutoPlay ? '⏸' : '▶'}
      </button>

      {/* Redirect button */}
      <button
        className="redirect-button"
        onClick={handleRedirect}
        title="Go back home"
      >
        ✕
      </button>
    </div>
  );
}
