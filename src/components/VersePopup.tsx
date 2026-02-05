import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const verses = [
  { text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", ref: "João 3:16" },
  { text: "O Senhor é o meu pastor; nada me faltará.", ref: "Salmos 23:1" },
  { text: "Confie no Senhor de todo o seu coração e não se apoie na sua própria inteligência.", ref: "Provérbios 3:5" },
  { text: "Posso todas as coisas naquele que me fortalece.", ref: "Filipenses 4:13" },
  { text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.", ref: "Jeremias 29:11" },
  { text: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.", ref: "1 Coríntios 13:4" },
  { text: "Buscai primeiro o Reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas.", ref: "Mateus 6:33" },
  { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
  { text: "O Senhor é a minha luz e a minha salvação; a quem temerei?", ref: "Salmos 27:1" },
  { text: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.", ref: "Salmos 37:5" },
];

interface VersePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VersePopup({ isOpen, onClose }: VersePopupProps) {
  const [verse, setVerse] = useState(verses[0]);
  const [amenCount, setAmenCount] = useState(0);
  const [hasClickedAmen, setHasClickedAmen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];
      setVerse(randomVerse);
      setAmenCount(Math.floor(Math.random() * 500) + 100);
      setHasClickedAmen(false);
    }
  }, [isOpen]);

  const handleAmen = () => {
    if (!hasClickedAmen) {
      setAmenCount(prev => prev + 1);
      setHasClickedAmen(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, rotateX: -30, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotateX: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative w-full max-w-lg"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 3D Card Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-blue-600 rounded-3xl transform rotate-3 scale-[1.02] opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-orange-500 rounded-3xl transform -rotate-2 scale-[1.01] opacity-30" />
            
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header with 3D effect */}
              <div className="relative h-32 bg-gradient-to-br from-orange-500 via-orange-400 to-blue-600 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-8 w-24 h-24 bg-white/30 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 right-8 w-32 h-32 bg-blue-300/30 rounded-full blur-2xl" />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      rotateY: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative"
                  >
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
                      <BookOpen className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>
                </div>

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic text-center mb-4">
                    "{verse.text}"
                  </p>
                  <p className="text-center text-orange-600 font-semibold">
                    — {verse.ref}
                  </p>
                </motion.div>

                <div className="mt-8 flex flex-col items-center gap-4">
                  <motion.button
                    onClick={handleAmen}
                    disabled={hasClickedAmen}
                    className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
                      hasClickedAmen
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-gradient-to-r from-orange-500 to-blue-600 text-white hover:shadow-xl hover:shadow-orange-500/30'
                    }`}
                    whileHover={{ scale: hasClickedAmen ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-2">
                      <Heart className={`w-5 h-5 ${hasClickedAmen ? 'fill-current' : ''}`} />
                      {hasClickedAmen ? '✓ Amém!' : t('amen')}
                    </span>
                  </motion.button>

                  <motion.p
                    key={amenCount}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-sm text-gray-500 flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span><strong>{amenCount.toLocaleString()}</strong> pessoas disseram Amém</span>
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
