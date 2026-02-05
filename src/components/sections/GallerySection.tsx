import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const images = [
  { id: '1', title: 'Culto de Celebração', category: 'Cultos', emoji: '🙏' },
  { id: '2', title: 'Batismo nas Águas', category: 'Batismos', emoji: '💧' },
  { id: '3', title: 'Conferência de Jovens', category: 'Eventos', emoji: '🎉' },
  { id: '4', title: 'Escolinha Dominical', category: 'Escolinha', emoji: '📚' },
  { id: '5', title: 'Louvor e Adoração', category: 'Cultos', emoji: '🎵' },
  { id: '6', title: 'Missões em Moçambique', category: 'Missões', emoji: '🌍' },
  { id: '7', title: 'Confraternização de Natal', category: 'Eventos', emoji: '🎄' },
  { id: '8', title: 'Reunião de Células', category: 'Células', emoji: '🏠' },
];

const categories = ['Todos', 'Cultos', 'Batismos', 'Eventos', 'Escolinha', 'Missões', 'Células'];

export function GallerySection() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages = activeCategory === 'Todos' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  const currentImageIndex = selectedImage ? images.findIndex(img => img.id === selectedImage) : -1;

  const navigateImage = (direction: 'prev' | 'next') => {
    if (currentImageIndex === -1) return;
    const newIndex = direction === 'prev' 
      ? (currentImageIndex - 1 + images.length) % images.length
      : (currentImageIndex + 1) % images.length;
    setSelectedImage(images[newIndex].id);
  };

  return (
    <section className="py-20 bg-white" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
            {t('gallery')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Nossa <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">Galeria</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Momentos especiais da nossa comunidade em imagens.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Image Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onClick={() => setSelectedImage(image.id)}
                className="group relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">{image.emoji}</span>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-white font-bold truncate">{image.title}</p>
                  <p className="text-white/70 text-sm">{image.category}</p>
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-4xl w-full aspect-video bg-gradient-to-br from-orange-500 to-blue-600 rounded-3xl flex items-center justify-center"
              >
                <div className="text-center text-white">
                  <span className="text-9xl">{images.find(img => img.id === selectedImage)?.emoji}</span>
                  <p className="text-2xl font-bold mt-4">{images.find(img => img.id === selectedImage)?.title}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
