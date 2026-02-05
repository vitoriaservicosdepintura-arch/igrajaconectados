import { motion } from 'framer-motion';
import { Play, Calendar, Users, Heart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* 3D Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating 3D Shapes */}
        <motion.div
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 left-[10%] w-32 h-32 opacity-20"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl transform rotateY-45" />
        </motion.div>

        <motion.div
          animate={{
            rotateX: [360, 0],
            rotateY: [360, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-40 right-[15%] w-24 h-24 opacity-30"
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-400 rounded-full" />
        </motion.div>

        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-32 left-[20%] w-40 h-40 opacity-20"
        >
          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-blue-500 rounded-3xl transform rotate-45" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -50, 0],
            rotateZ: [0, 180, 360],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-[25%] w-20 h-20 opacity-25"
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl" />
        </motion.div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm">Ao vivo aos Domingos, 10h</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6"
            >
              <span className="block">Igreja</span>
              <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-blue-500 bg-clip-text text-transparent">
                Conectada
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {t('heroSubtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <motion.button
                onClick={() => onNavigate('events')}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                <span>{t('joinUs')}</span>
              </motion.button>

              <motion.button
                onClick={() => onNavigate('about')}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{t('aboutUs')}</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right: 3D Church Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto" style={{ perspective: '1000px' }}>
              {/* 3D Card Stack */}
              <motion.div
                animate={{ rotateY: [-5, 5, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Back card */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl transform translate-z-[-40px] rotate-6 opacity-40" />
                {/* Middle card */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl transform translate-z-[-20px] -rotate-3 opacity-60" />
                {/* Front card */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    {/* Church Icon */}
                    <div className="relative mb-6">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-32 h-32 bg-gradient-to-br from-orange-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl"
                      >
                        <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 2L12 6M12 6L18 10V22H6V10L12 6Z" />
                          <path d="M9 22V16H15V22" />
                          <path d="M12 10V14" />
                          <path d="M10 12H14" />
                        </svg>
                      </motion.div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo!</h3>
                    <p className="text-gray-500 text-center text-sm">Uma família que te acolhe com amor</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Users, label: 'Membros', value: '500+' },
            { icon: Calendar, label: 'Eventos/Ano', value: '120+' },
            { icon: Heart, label: 'Células', value: '25+' },
            { icon: Play, label: 'Lives', value: '200+' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-orange-400" />
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
