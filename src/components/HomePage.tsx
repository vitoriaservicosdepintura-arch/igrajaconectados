import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedBible } from './AnimatedBible';
import { Sparkles, Heart, BookOpen, Users, ChevronRight, Clock, MapPin, Calendar, Sun, Moon, Cross } from 'lucide-react';

export function HomePage() {
  const [greeting, setGreeting] = useState('');
  
  // Get greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Bom dia');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Welcome & 3D Bible */}
      <section className="relative bg-gradient-to-b from-slate-900 via-amber-950 to-slate-900 pt-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-600/5 rounded-full blur-3xl"></div>
          
          {/* Floating crosses */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-amber-500/10"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Cross className="w-12 h-12" />
            </motion.div>
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Welcome Message - Mensagem de Boas-vindas */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            {/* Time-based Greeting */}
            <motion.div 
              className="inline-flex items-center gap-3 bg-amber-900/40 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-amber-700/30"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {new Date().getHours() >= 6 && new Date().getHours() < 18 ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-amber-400" />
              )}
              <span className="text-amber-200 font-medium">{greeting}, que Deus abençoe seu dia!</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 drop-shadow-lg">
                Bem-vindo à
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400">
                Igreja Luz do Mundo
              </span>
            </h1>
            
            <motion.p 
              className="text-lg md:text-xl text-amber-100/90 max-w-3xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Seja bem-vindo à nossa comunidade de fé. Aqui você encontrará amor, 
              acolhimento e a Palavra de Deus para transformar sua vida.
            </motion.p>

            {/* Animated Bible - Below welcome text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mb-8"
            >
              <AnimatedBible />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="bg-gradient-to-b from-amber-950 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: 'Próximo Culto',
                value: 'Domingo, 10:00',
                description: 'Culto de Celebração',
                color: 'from-blue-600/30 to-blue-800/30',
                iconColor: 'text-blue-400'
              },
              {
                icon: MapPin,
                title: 'Localização',
                value: 'Rua da Paz, 123',
                description: 'Centro - São Paulo, SP',
                color: 'from-green-600/30 to-green-800/30',
                iconColor: 'text-green-400'
              },
              {
                icon: Calendar,
                title: 'Evento Especial',
                value: 'Conferência de Jovens',
                description: '10 de Fevereiro',
                color: 'from-purple-600/30 to-purple-800/30',
                iconColor: 'text-purple-400'
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 border border-white/10 cursor-pointer group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-black/20 ${card.iconColor}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60 text-sm">{card.title}</p>
                    <h3 className="text-lg font-bold text-white mb-1">{card.value}</h3>
                    <p className="text-white/70 text-sm">{card.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Nossa Missão */}
      <section className="bg-gradient-to-b from-slate-900 to-amber-950 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-amber-100 mb-4">
              Nossa Missão
            </h2>
            <p className="text-amber-200/70 max-w-2xl mx-auto">
              Somos guiados por princípios que refletem o amor de Cristo em tudo que fazemos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Palavra de Deus',
                description: 'Ensinamos e pregamos a Palavra de Deus com fidelidade e amor, transformando vidas através do conhecimento bíblico.',
                gradient: 'from-blue-600/20 to-blue-800/20',
                iconBg: 'bg-blue-600/30',
                iconColor: 'text-blue-400'
              },
              {
                icon: Heart,
                title: 'Amor ao Próximo',
                description: 'Praticamos o amor cristão através de obras e serviço à comunidade, ajudando os necessitados.',
                gradient: 'from-red-600/20 to-red-800/20',
                iconBg: 'bg-red-600/30',
                iconColor: 'text-red-400'
              },
              {
                icon: Users,
                title: 'Comunhão',
                description: 'Cultivamos a comunhão fraterna entre irmãos em Cristo, fortalecendo os laços da família de Deus.',
                gradient: 'from-green-600/20 to-green-800/20',
                iconBg: 'bg-green-600/30',
                iconColor: 'text-green-400'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all group cursor-pointer`}
              >
                <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

            {/* Call to Action */}
      <section className="bg-gradient-to-b from-amber-950 to-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-amber-800/40 via-amber-700/40 to-amber-800/40 rounded-3xl p-10 md:p-12 border border-amber-600/30 overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="w-14 h-14 text-amber-400 mx-auto mb-6" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-amber-100 mb-4">
                Junte-se a Nós
              </h2>
              <p className="text-amber-200/80 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
                Venha fazer parte da nossa família. Nossos cultos acontecem todos os 
                <span className="text-amber-400 font-semibold"> domingos às 10h</span> e 
                <span className="text-amber-400 font-semibold"> quartas às 19h30</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(245, 158, 11, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Conhecer Mais
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-transparent border-2 border-amber-500 text-amber-300 font-bold rounded-full hover:bg-amber-500/10 transition-all flex items-center justify-center gap-2"
                >
                  Fale Conosco
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials/Stats Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Membros' },
              { value: '30+', label: 'Anos de História' },
              { value: '15+', label: 'Ministérios' },
              { value: '1000+', label: 'Vidas Transformadas' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">{stat.value}</div>
                <div className="text-amber-200/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
