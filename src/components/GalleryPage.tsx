import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';

const galleryItems = [
  {
    id: 1,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=600&fit=crop',
    title: 'Culto de Adoração',
    category: 'Cultos'
  },
  {
    id: 2,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&h=600&fit=crop',
    title: 'Batismo nas Águas',
    category: 'Batismos'
  },
  {
    id: 3,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&h=600&fit=crop',
    title: 'Escola Bíblica',
    category: 'Estudos'
  },
  {
    id: 4,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&h=600&fit=crop',
    title: 'Louvor e Adoração',
    category: 'Cultos'
  },
  {
    id: 5,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
    title: 'Encontro de Famílias',
    category: 'Eventos'
  },
  {
    id: 6,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop',
    title: 'Ação Social',
    category: 'Social'
  },
  {
    id: 7,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&h=600&fit=crop',
    title: 'Estudo da Palavra',
    category: 'Estudos'
  },
  {
    id: 8,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1492176273113-2d51f47b23b0?w=800&h=600&fit=crop',
    title: 'Celebração de Natal',
    category: 'Eventos'
  },
  {
    id: 9,
    type: 'video',
    src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
    title: 'Conferência Anual',
    category: 'Eventos',
    videoUrl: '#'
  }
];

const categories = ['Todos', 'Cultos', 'Batismos', 'Estudos', 'Eventos', 'Social'];

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedImage, setSelectedImage] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = selectedCategory === 'Todos'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-950 to-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">Galeria de Fotos</h1>
          <p className="text-amber-200/70 max-w-2xl mx-auto text-lg">
            Momentos especiais da nossa comunidade capturados em imagens.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-900/40 text-amber-200 hover:bg-amber-800/60'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-amber-900/30">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="text-amber-300 text-sm">{item.category}</p>
                    </div>
                    {item.type === 'video' && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-amber-500 p-4 rounded-full">
                          <Play className="w-8 h-8 text-white" fill="white" />
                        </div>
                      </div>
                    )}
                  </div>
                  {item.type === 'video' && (
                    <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full flex items-center gap-2">
                      <Play className="w-4 h-4 text-white" fill="white" />
                      <span className="text-white text-sm">Vídeo</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '150+', label: 'Fotos' },
            { value: '25+', label: 'Vídeos' },
            { value: '50+', label: 'Eventos' },
            { value: '5+', label: 'Anos de História' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-400">{stat.value}</div>
              <div className="text-amber-200/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full rounded-xl"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-white">{selectedImage.title}</h3>
                <p className="text-amber-400">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
