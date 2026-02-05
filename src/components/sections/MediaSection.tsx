import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Headphones, Clock, Eye, Calendar, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';

const videos = [
  { id: '1', title: 'A Fé que Move Montanhas', speaker: 'Pr. João Silva', date: '2025-01-12', views: 1250, duration: '45:30', thumbnail: '🎬' },
  { id: '2', title: 'O Poder da Oração', speaker: 'Pra. Maria Silva', date: '2025-01-05', views: 980, duration: '38:15', thumbnail: '🎬' },
  { id: '3', title: 'Vivendo em Santidade', speaker: 'Ev. Pedro Santos', date: '2024-12-29', views: 1520, duration: '52:00', thumbnail: '🎬' },
  { id: '4', title: 'O Amor Incondicional', speaker: 'Pr. João Silva', date: '2024-12-22', views: 2100, duration: '41:45', thumbnail: '🎬' },
];

const podcasts = [
  { id: '1', title: 'Devocional Diário - Salmo 23', duration: '15:00', date: '2025-01-14', plays: 450 },
  { id: '2', title: 'Estudo Bíblico: Romanos 8', duration: '25:30', date: '2025-01-13', plays: 320 },
  { id: '3', title: 'Palavra de Encorajamento', duration: '10:15', date: '2025-01-12', plays: 580 },
  { id: '4', title: 'Momento de Reflexão', duration: '12:00', date: '2025-01-11', plays: 410 },
];

export function MediaSection() {
  const { t } = useLanguage();
  const { youtubeChannelUrl, liveStream } = useData();
  const [activeTab, setActiveTab] = useState<'videos' | 'podcasts'>('videos');

  const openYouTube = () => {
    window.open(youtubeChannelUrl, '_blank');
  };

  return (
    <section className="py-20 bg-gray-900" id="media">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium mb-4">
            {t('media')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Biblioteca de <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-400">Mídia</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Acesse nossos sermões, estudos bíblicos e podcasts a qualquer hora.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-800 rounded-2xl p-1.5">
            {[
              { id: 'videos' as const, label: 'Vídeos', icon: Play },
              { id: 'podcasts' as const, label: 'Podcasts', icon: Headphones },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'videos' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={openYouTube}
                className="group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-orange-500 to-blue-600 rounded-2xl overflow-hidden mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">{video.thumbnail}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
                    >
                      <Play className="w-8 h-8 text-gray-900 ml-1" />
                    </motion.div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white font-medium">
                    {video.duration}
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 mb-1">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2">{video.speaker}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {video.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(video.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {podcasts.map((podcast, index) => (
              <motion.div
                key={podcast.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                className="group bg-gray-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-750 transition-colors"
              >
                {/* Play Button */}
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                    {podcast.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {podcast.duration}
                    </span>
                    <span>{new Date(podcast.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                {/* Plays */}
                <div className="text-right">
                  <span className="text-sm text-gray-400">{podcast.plays} plays</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Live Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-blue-600 rounded-3xl p-8 md:p-12 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"
              />
              <motion.div
                animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-3 h-3 rounded-full ${liveStream?.isLive ? 'bg-red-500 animate-pulse' : 'bg-white/50'}`} />
                  <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
                    {liveStream?.isLive ? 'AO VIVO AGORA' : 'AO VIVO'}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {liveStream?.isLive ? liveStream.title : 'Culto de Domingo'}
                </h3>
                <p className="text-white/80">
                  {liveStream?.isLive 
                    ? 'Estamos ao vivo! Clique para assistir.'
                    : 'Todos os domingos às 10h no nosso canal do YouTube'}
                </p>
              </div>

              <motion.button
                onClick={openYouTube}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl shadow-lg"
              >
                {liveStream?.isLive ? (
                  <>
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    Assistir Ao Vivo
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-6 h-6" />
                    Ver Canal
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
