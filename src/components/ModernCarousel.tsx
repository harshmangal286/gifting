import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Destination {
  id: string;
  src: string;
  title: string;
  category: string;
  description: string;
}

// Dynamically load destinations from public folder
const DESTINATIONS: Destination[] = [
  { id: '1', src: '/img3.jpg', title: 'Rosa Khutor', category: 'Snow', description: 'Alpine luxury resort' },
  { id: '2', src: '/img4.jpg', title: 'Tropical Paradise', category: 'Beach', description: 'Island getaway' },
  { id: '3', src: '/img5.jpg', title: 'Dombay', category: 'Resort', description: 'Mountain escape' },
  { id: '4', src: '/img6.jpg', title: 'Magic Desert', category: 'Adventure', description: 'Golden dunes' },
  { id: '5', src: '/img7.jpg', title: 'Forest Sanctuary', category: 'Nature', description: 'Woodland retreat' },
  { id: '6', src: '/img8.jpg', title: 'City Dreams', category: 'Urban', description: 'Metropolitan vibes' },
  { id: '7', src: '/img9.jpg', title: 'Coastal Romance', category: 'Beach', description: 'Seaside elegance' },
  { id: '8', src: '/im10.jpg', title: 'Valley Wonder', category: 'Nature', description: 'Scenic beauty' },
];

const CATEGORIES = ['All', 'Snow', 'Resort', 'Beach', 'Adventure', 'Nature', 'Urban'];

export function ModernCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter destinations by category
  const filteredDestinations = activeCategory === 'All'
    ? DESTINATIONS
    : DESTINATIONS.filter(d => d.category === activeCategory);

  const validIndex = activeIndex % (filteredDestinations.length || 1);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlay || filteredDestinations.length === 0) return;

    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % filteredDestinations.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlay, filteredDestinations.length]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setActiveIndex(prev =>
      prev === 0 ? filteredDestinations.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setActiveIndex(prev => (prev + 1) % filteredDestinations.length);
  };

  const getVisibleDestinations = () => {
    if (filteredDestinations.length === 0) return [];
    return [
      filteredDestinations[(validIndex - 1 + filteredDestinations.length) % filteredDestinations.length],
      filteredDestinations[validIndex],
      filteredDestinations[(validIndex + 1) % filteredDestinations.length],
    ];
  };

  const visibleDestinations = getVisibleDestinations();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Carousel Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">

        {/* Main Carousel */}
        <div ref={carouselRef} className="relative w-full max-w-7xl h-96 md:h-[500px] perspective">

          {/* Cards Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              {visibleDestinations.map((dest, position) => {
                const isCenter = position === 1;

                return (
                  <motion.div
                    key={dest.id}
                    className="absolute"
                    initial={{
                      x: position === 0 ? -500 : position === 2 ? 500 : 0,
                      y: position === 0 || position === 2 ? 80 : 0,
                      scale: position === 0 || position === 2 ? 0.7 : 1,
                      opacity: isCenter ? 1 : 0.5,
                      rotateY: position === 0 ? 25 : position === 2 ? -25 : 0,
                    }}
                    animate={{
                      x: position === 0 ? -300 : position === 2 ? 300 : 0,
                      y: position === 0 || position === 2 ? 60 : 0,
                      scale: position === 0 || position === 2 ? 0.75 : 1,
                      opacity: isCenter ? 1 : 0.45,
                      rotateY: position === 0 ? 20 : position === 2 ? -20 : 0,
                      z: isCenter ? 10 : 0,
                    }}
                    exit={{
                      x: position === 0 ? -500 : position === 2 ? 500 : 0,
                      opacity: 0
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{
                      perspective: "1000px",
                      transformStyle: "preserve-3d" as const,
                    }}
                  >
                    <motion.div
                      className={`relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer ${ isCenter ? 'w-72 md:w-96 h-80 md:h-96' : 'w-56 md:w-72 h-64 md:h-80'}`}
                      whileHover={isCenter ? {
                        y: -10,
                        boxShadow: "0 40px 80px rgba(0,0,0,0.6)"
                      } : {}}
                      onClick={() => {
                        if (!isCenter) {
                          if (position === 0) handlePrev();
                          if (position === 2) handleNext();
                        }
                      }}
                    >
                      {/* Card Image */}
                      <motion.img
                        src={dest.src}
                        alt={dest.title}
                        className="w-full h-full object-cover"
                        whileHover={isCenter ? { scale: 1.05 } : {}}
                        transition={{ duration: 0.6 }}
                      />

                      {/* Blur Effect for Side Cards */}
                      {!isCenter && (
                        <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Card Content */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isCenter ? 1 : 0.7 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <h2 className={`font-bold mb-1 ${ isCenter ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                          {dest.title}
                        </h2>
                        {isCenter && (
                          <>
                            <p className="text-gray-200 text-sm mb-2">{dest.description}</p>
                            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                              {dest.category}
                            </span>
                          </>
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <motion.button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ←
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            →
          </motion.button>
        </div>

        {/* Category Filter */}
        <motion.div
          className="mt-12 flex gap-2 flex-wrap justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {CATEGORIES.map((category) => (
            <motion.button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setActiveIndex(0);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                activeCategory === category
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Pagination Dots */}
        <motion.div
          className="mt-8 flex gap-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredDestinations.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setIsAutoPlay(false);
              }}
              className={`rounded-full transition-all duration-300 ${
                index === validIndex
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </motion.div>

        {/* Bottom Controls */}
        <motion.div
          className="absolute bottom-8 right-8 flex gap-4 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* AutoPlay Toggle */}
          <motion.button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAutoPlay ? '⏸' : '▶'}
          </motion.button>

          {/* Close/Redirect Button */}
          <motion.button
            onClick={() => window.location.href = '/'}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
          >
            ✕
          </motion.button>
        </motion.div>

        {/* Info Display */}
        <motion.div
          className="absolute top-8 left-8 z-20 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm font-light opacity-75">
            {validIndex + 1} / {filteredDestinations.length || 1}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
