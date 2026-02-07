import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, MessageCircle, Send, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';

const categories = ['Todos', 'Cultos', 'Batismos', 'Eventos', 'Escolinha', 'Missões', 'Células'];

const emojiMap: Record<string, string> = {
  'Cultos': '🙏',
  'Batismos': '💧',
  'Eventos': '🎉',
  'Escolinha': '📚',
  'Missões': '🌍',
  'Células': '🏠',
};

export function GallerySection() {
  const { t, language } = useLanguage();
  const { galleryPhotos, addComment, getCommentsByTarget } = useData();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentTargetId, setCommentTargetId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [consent, setConsent] = useState(false);

  const filteredImages = activeCategory === 'Todos' 
    ? galleryPhotos 
    : galleryPhotos.filter(img => img.category === activeCategory);

  const currentImageIndex = selectedImage ? galleryPhotos.findIndex(img => img.id === selectedImage) : -1;

  const navigateImage = (direction: 'prev' | 'next') => {
    if (currentImageIndex === -1) return;
    const newIndex = direction === 'prev' 
      ? (currentImageIndex - 1 + galleryPhotos.length) % galleryPhotos.length
      : (currentImageIndex + 1) % galleryPhotos.length;
    setSelectedImage(galleryPhotos[newIndex].id);
  };

  const getEmoji = (category: string) => emojiMap[category] || '📷';

  const handleOpenComment = (photoId: string) => {
    setCommentTargetId(photoId);
    setShowCommentModal(true);
  };

  const handleSubmitComment = () => {
    if (!userName.trim() || !commentText.trim() || !consent || !commentTargetId) return;
    
    addComment({
      memberId: 'public-' + Date.now(),
      memberName: userName,
      text: commentText,
      targetType: 'gallery',
      targetId: commentTargetId,
    });
    
    setUserName('');
    setCommentText('');
    setConsent(false);
    setShowCommentModal(false);
    setCommentTargetId(null);
  };

  const getCommentsForPhoto = (photoId: string) => {
    return getCommentsByTarget('gallery', photoId);
  };

  // Translation helpers
  const placeholderName = language === 'en' ? 'Your name' : language === 'es' ? 'Tu nombre' : 'Seu nome';
  const placeholderComment = language === 'en' ? 'Write a comment...' : language === 'es' ? 'Escribe un comentario...' : 'Escreva um comentário...';
  const consentText = language === 'en' ? 'I agree with data processing (GDPR)' : language === 'es' ? 'Acepto el tratamiento de datos (RGPD)' : 'Concordo com o tratamento de dados (LGPD)';
  const sendText = language === 'en' ? 'Send' : language === 'es' ? 'Enviar' : 'Enviar';
  const commentsText = language === 'en' ? 'Comments' : language === 'es' ? 'Comentarios' : 'Comentários';
  const addCommentText = language === 'en' ? 'Add Comment' : language === 'es' ? 'Agregar Comentario' : 'Adicionar Comentário';
  const noCommentsText = language === 'en' ? 'No comments yet. Be the first!' : language === 'es' ? '¡Aún no hay comentarios. Sé el primero!' : 'Nenhum comentário ainda. Seja o primeiro!';

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
                className="group relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
              >
                <div onClick={() => setSelectedImage(image.id)} className="w-full h-full">
                  {image.url ? (
                    <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">{getEmoji(image.category)}</span>
                    </div>
                  )}
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 pointer-events-none">
                  <p className="text-white font-bold truncate">{image.title}</p>
                  <p className="text-white/70 text-sm">{image.category}</p>
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>

                {/* Comment Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenComment(image.id); }}
                  className="absolute bottom-3 right-3 flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  {getCommentsForPhoto(image.id).length > 0 && (
                    <span>{getCommentsForPhoto(image.id).length}</span>
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma foto encontrada nesta categoria.</p>
          </div>
        )}

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
                className="max-w-4xl w-full aspect-video bg-gradient-to-br from-orange-500 to-blue-600 rounded-3xl flex items-center justify-center overflow-hidden"
              >
                {galleryPhotos.find(img => img.id === selectedImage)?.url ? (
                  <img 
                    src={galleryPhotos.find(img => img.id === selectedImage)?.url} 
                    alt={galleryPhotos.find(img => img.id === selectedImage)?.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-white">
                    <span className="text-9xl">{getEmoji(galleryPhotos.find(img => img.id === selectedImage)?.category || '')}</span>
                    <p className="text-2xl font-bold mt-4">{galleryPhotos.find(img => img.id === selectedImage)?.title}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comment Modal */}
        <AnimatePresence>
          {showCommentModal && commentTargetId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
              onClick={() => { setShowCommentModal(false); setCommentTargetId(null); }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-orange-500" />
                    {commentsText}
                  </h3>
                  <button 
                    onClick={() => { setShowCommentModal(false); setCommentTargetId(null); }} 
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Existing Comments */}
                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                  {getCommentsForPhoto(commentTargetId).length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">{noCommentsText}</p>
                  ) : (
                    getCommentsForPhoto(commentTargetId).map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {comment.memberName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{comment.memberName}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm ml-10">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Form */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {addCommentText}
                  </h4>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder={placeholderName}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-3"
                  />
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={placeholderComment}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none mb-3"
                    rows={3}
                  />
                  <label className="flex items-start gap-2 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-orange-500 rounded"
                    />
                    <span className="text-xs text-gray-500">{consentText}</span>
                  </label>
                  <button
                    onClick={handleSubmitComment}
                    disabled={!userName.trim() || !commentText.trim() || !consent}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {sendText}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
