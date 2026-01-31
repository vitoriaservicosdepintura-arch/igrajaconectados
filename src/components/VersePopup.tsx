import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { bibleVerses } from '@/data/translations';

interface VersePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VersePopup({ isOpen, onClose }: VersePopupProps) {
  const { language, t } = useLanguage();
  const [verse, setVerse] = useState({ verse: '', reference: '' });

  useEffect(() => {
    if (isOpen) {
      const verses = bibleVerses[language];
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];
      setVerse(randomVerse);
    }
  }, [isOpen, language]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-6 shadow-lg shadow-amber-500/30"
              >
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-amber-300 text-lg font-semibold mb-6">
                {t('verse.title')}
              </h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white text-xl md:text-2xl font-serif leading-relaxed mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                "{verse.verse}"
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-amber-300 font-semibold"
              >
                — {verse.reference}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={onClose}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-full hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/30"
              >
                {t('verse.close')} 🙏
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
