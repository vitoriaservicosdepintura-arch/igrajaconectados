import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { verses } from '../data/verses';
import { Sparkles } from 'lucide-react';

export function AnimatedBible() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => (prev + 1) % verses.length);
        setIsFlipping(false);
      }, 600);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const currentVerse = verses[currentPage];

  return (
    <div className="relative w-full flex items-center justify-center py-8">
      {/* Glow effect behind the bible */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-amber-400/60 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Bible Container */}
      <div className="relative" style={{ perspective: '1500px' }}>
        {/* Bible Book */}
        <div className="relative w-[340px] sm:w-[500px] md:w-[600px] h-[240px] sm:h-[320px] md:h-[380px]">
          
          {/* Book Spine */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-4 sm:w-6 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 z-20 rounded-sm shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-600/30 via-transparent to-amber-600/30"></div>
            {/* Gold lines on spine */}
            <div className="absolute top-4 left-1 right-1 h-0.5 bg-amber-500/60"></div>
            <div className="absolute bottom-4 left-1 right-1 h-0.5 bg-amber-500/60"></div>
          </div>

          {/* Left Page (Static) */}
          <motion.div 
            className="absolute left-0 top-0 w-[calc(50%-8px)] sm:w-[calc(50%-12px)] h-full bg-gradient-to-l from-amber-50 via-amber-100 to-amber-50 rounded-l-lg shadow-xl overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: 'inset -10px 0 30px rgba(0,0,0,0.1), -5px 5px 20px rgba(0,0,0,0.3)',
            }}
          >
            {/* Page texture */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            }}></div>
            
            {/* Page lines */}
            <div className="absolute inset-4 sm:inset-6 flex flex-col justify-center">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-3 sm:h-4 bg-amber-200/40 rounded mb-2 sm:mb-3" style={{ width: `${70 + Math.random() * 25}%` }}></div>
              ))}
            </div>

            {/* Corner decoration */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/40 rounded-tl-lg"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/40 rounded-bl-lg"></div>
          </motion.div>

          {/* Right Page with Content */}
          <motion.div 
            className="absolute right-0 top-0 w-[calc(50%-8px)] sm:w-[calc(50%-12px)] h-full bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 rounded-r-lg shadow-xl overflow-hidden z-10"
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: 'inset 10px 0 30px rgba(0,0,0,0.1), 5px 5px 20px rgba(0,0,0,0.3)',
            }}
          >
            {/* Page texture */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            }}></div>

            {/* Verse Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-4 sm:inset-6 md:inset-8 flex flex-col justify-center items-center text-center"
              >
                {/* Decorative cross */}
                <div className="text-amber-600/30 mb-2 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 2v7H4v4h7v9h2v-9h7v-4h-7V2z"/>
                  </svg>
                </div>

                {/* Opening quote */}
                <span className="text-3xl sm:text-4xl md:text-5xl text-amber-700/40 font-serif leading-none">"</span>
                
                {/* Verse text */}
                <p className="text-amber-900 font-serif text-sm sm:text-base md:text-lg leading-relaxed px-2 italic">
                  {currentVerse.text}
                </p>
                
                {/* Closing quote */}
                <span className="text-3xl sm:text-4xl md:text-5xl text-amber-700/40 font-serif leading-none">"</span>
                
                {/* Reference */}
                <p className="mt-2 sm:mt-4 text-amber-700 font-bold text-xs sm:text-sm md:text-base tracking-wider">
                  — {currentVerse.reference}
                </p>

                {/* Decorative line */}
                <div className="mt-2 sm:mt-4 w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              </motion.div>
            </AnimatePresence>

            {/* Corner decoration */}
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/40 rounded-tr-lg"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/40 rounded-br-lg"></div>
          </motion.div>

          {/* Flipping Page Animation */}
          <AnimatePresence>
            {isFlipping && (
              <motion.div
                className="absolute right-0 top-0 w-[calc(50%-8px)] sm:w-[calc(50%-12px)] h-full bg-gradient-to-r from-amber-100 to-amber-50 rounded-r-lg shadow-2xl z-30"
                initial={{ 
                  rotateY: 0,
                  originX: 0,
                }}
                animate={{ 
                  rotateY: -180,
                }}
                exit={{ 
                  rotateY: -180,
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeInOut" 
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'left center',
                  boxShadow: '0 0 30px rgba(0,0,0,0.3)',
                }}
              >
                {/* Front of flipping page */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-amber-50 to-amber-100 rounded-r-lg"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="absolute inset-6 flex flex-col">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-3 sm:h-4 bg-amber-200/40 rounded mb-2 sm:mb-3" style={{ width: `${60 + Math.random() * 35}%` }}></div>
                    ))}
                  </div>
                </div>
                
                {/* Back of flipping page */}
                <div 
                  className="absolute inset-0 bg-gradient-to-l from-amber-50 to-amber-100 rounded-l-lg"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="absolute inset-6 flex flex-col">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-3 sm:h-4 bg-amber-200/40 rounded mb-2 sm:mb-3" style={{ width: `${60 + Math.random() * 35}%` }}></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Book Cover Edges */}
          <div className="absolute -left-1 top-0 bottom-0 w-2 bg-gradient-to-r from-amber-800 to-amber-700 rounded-l-lg shadow-lg"></div>
          <div className="absolute -right-1 top-0 bottom-0 w-2 bg-gradient-to-l from-amber-800 to-amber-700 rounded-r-lg shadow-lg"></div>

          {/* Page Stack Effect (Left) */}
          <div className="absolute left-1 top-1 bottom-1 w-[calc(50%-12px)] sm:w-[calc(50%-16px)]">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 bg-amber-50 rounded-l-sm"
                style={{
                  transform: `translateX(${-i * 1}px)`,
                  boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.05)',
                  zIndex: -i,
                }}
              ></div>
            ))}
          </div>

          {/* Page Stack Effect (Right) */}
          <div className="absolute right-1 top-1 bottom-1 w-[calc(50%-12px)] sm:w-[calc(50%-16px)]">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 bg-amber-50 rounded-r-sm"
                style={{
                  transform: `translateX(${i * 1}px)`,
                  boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.05)',
                  zIndex: -i,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Bible Title Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 px-6 py-2 rounded-full shadow-lg border border-amber-500/50"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span className="text-amber-100 font-bold text-sm tracking-wider">BÍBLIA SAGRADA</span>
          <Sparkles className="w-4 h-4 text-amber-200" />
        </motion.div>
      </div>

      {/* Page indicator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 mt-8">
        {verses.slice(0, 6).map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentPage % 6 === index 
                ? 'bg-amber-400 w-6' 
                : 'bg-amber-600/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
