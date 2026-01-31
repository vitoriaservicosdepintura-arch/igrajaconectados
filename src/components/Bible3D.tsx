import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { bibleVerses } from '@/data/translations';

export function Bible3D() {
  const { language } = useLanguage();
  const [currentVerse, setCurrentVerse] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const verses = bibleVerses[language];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentVerse((prev) => (prev + 1) % verses.length);
        setIsFlipping(false);
      }, 600);
    }, 5000);

    return () => clearInterval(interval);
  }, [verses.length]);

  return (
    <div className="relative w-full max-w-2xl mx-auto perspective-1000">
      {/* Bible Container */}
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-200/30 via-yellow-100/40 to-amber-200/30 blur-3xl rounded-full transform scale-150" />
        
        {/* Bible Book */}
        <motion.div
          className="relative bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 rounded-lg shadow-2xl p-2"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isFlipping ? -15 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Book Spine */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-amber-950 to-amber-800 rounded-l-lg" />
          
          {/* Golden Cross on Cover */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-amber-300/30">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 2v8H3v2h8v10h2V12h8v-2h-8V2z" />
            </svg>
          </div>
          
          {/* Open Pages */}
          <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-md p-6 md:p-10 min-h-[300px] md:min-h-[400px] flex items-center justify-center">
            {/* Page Lines Decoration */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="h-px bg-amber-900 my-4" />
              ))}
            </div>
            
            {/* Center Binding */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-200 via-amber-300 to-amber-200 transform -translate-x-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-100/50 via-transparent to-amber-100/50 transform -translate-x-1/2" />
            
            {/* Verse Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVerse}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-center px-4"
              >
                <motion.p
                  className="text-amber-900 text-lg md:text-xl lg:text-2xl font-serif leading-relaxed mb-6"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  "{verses[currentVerse].verse}"
                </motion.p>
                <motion.p
                  className="text-amber-700 font-semibold text-base md:text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  — {verses[currentVerse].reference}
                </motion.p>
              </motion.div>
            </AnimatePresence>
            
            {/* Page Turn Effect */}
            <AnimatePresence>
              {isFlipping && (
                <motion.div
                  className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-amber-100 to-amber-50 origin-left rounded-r-md"
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: -180 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                />
              )}
            </AnimatePresence>
            
            {/* Page Curl Effect */}
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-br from-transparent via-amber-200/30 to-amber-300/50 rounded-tl-full" />
          </div>
          
          {/* Book Shadow */}
          <div className="absolute -bottom-4 left-4 right-4 h-4 bg-gradient-to-b from-black/20 to-transparent blur-sm rounded-full" />
        </motion.div>
        
        {/* Decorative Light Rays */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-yellow-200/60 to-transparent" />
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 -rotate-12 w-1 h-16 bg-gradient-to-b from-yellow-200/40 to-transparent" />
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 rotate-12 w-1 h-16 bg-gradient-to-b from-yellow-200/40 to-transparent" />
      </div>
      
      {/* Verse Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {verses.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentVerse(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentVerse
                ? 'bg-amber-500 w-6'
                : 'bg-amber-300 hover:bg-amber-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
