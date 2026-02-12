import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users, Star, Award } from 'lucide-react';

const leaders = [
  {
    name: 'Pastor João Silva',
    role: 'Pastor Presidente',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    description: 'Há 20 anos dedicado ao ministério pastoral.'
  },
  {
    name: 'Pastora Maria Silva',
    role: 'Co-Pastora',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
    description: 'Líder do ministério de mulheres e crianças.'
  },
  {
    name: 'Diácono Pedro Santos',
    role: 'Diácono',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    description: 'Coordenador de ações sociais e evangelismo.'
  },
  {
    name: 'Diaconisa Ana Oliveira',
    role: 'Diaconisa',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    description: 'Responsável pelo louvor e adoração.'
  }
];

const values = [
  { icon: Heart, title: 'Amor', description: 'Amar a Deus sobre todas as coisas e ao próximo como a nós mesmos.' },
  { icon: Star, title: 'Fé', description: 'Crer na Palavra de Deus e em suas promessas.' },
  { icon: Users, title: 'Comunhão', description: 'Viver em unidade e harmonia com nossos irmãos.' },
  { icon: Award, title: 'Excelência', description: 'Fazer tudo para a glória de Deus com dedicação.' }
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-950 to-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">Quem Somos</h1>
          <p className="text-amber-200/70 max-w-2xl mx-auto text-lg">
            Conheça nossa história, missão e os valores que nos guiam na jornada da fé.
          </p>
        </motion.div>

        {/* History */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-3xl p-8 md:p-12 border border-amber-700/30">
            <h2 className="text-3xl font-bold text-amber-100 mb-6">Nossa História</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-amber-200/80">
                <p>
                  A Igreja Luz do Mundo foi fundada em 1990 por um pequeno grupo de fiéis que se reuniam 
                  em uma casa no centro da cidade. Com fé e dedicação, nossa comunidade cresceu e hoje 
                  somos uma família de mais de 500 membros.
                </p>
                <p>
                  Nossa missão sempre foi levar a luz do Evangelho a todas as pessoas, através do amor, 
                  da pregação da Palavra e do serviço à comunidade. Ao longo dos anos, desenvolvemos 
                  diversos ministérios e projetos sociais.
                </p>
                <p>
                  Hoje, continuamos firmes no propósito de transformar vidas através do poder de Deus, 
                  mantendo os valores que nos trouxeram até aqui.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=400&fit=crop"
                  alt="Igreja"
                  className="rounded-2xl shadow-2xl w-full h-64 md:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-amber-800/40 to-amber-900/40 rounded-2xl p-8 border border-amber-700/30"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-amber-600/30 p-3 rounded-xl">
                  <Target className="w-8 h-8 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-amber-100">Missão</h2>
              </div>
              <p className="text-amber-200/80 leading-relaxed">
                Proclamar o Evangelho de Jesus Cristo, formando discípulos maduros na fé, 
                servindo à comunidade com amor e transformando vidas através do poder de Deus.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-amber-800/40 to-amber-900/40 rounded-2xl p-8 border border-amber-700/30"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-amber-600/30 p-3 rounded-xl">
                  <Eye className="w-8 h-8 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-amber-100">Visão</h2>
              </div>
              <p className="text-amber-200/80 leading-relaxed">
                Ser uma igreja relevante e acolhedora, que reflete o amor de Cristo em todas as suas ações, 
                alcançando pessoas de todas as gerações e culturas.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-amber-100 text-center mb-12">Nossos Valores</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-amber-900/30 to-transparent rounded-xl p-6 border border-amber-700/20 text-center hover:border-amber-500/40 transition-all"
              >
                <div className="bg-amber-600/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-amber-100 mb-2">{value.title}</h3>
                <p className="text-sm text-amber-200/70">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Leadership */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-amber-100 text-center mb-12">Nossa Liderança</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-2xl p-6 border border-amber-700/30 hover:border-amber-500/50 transition-all text-center">
                  <div className="relative mb-4">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-amber-600/50 group-hover:border-amber-500 transition-all"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-amber-100">{leader.name}</h3>
                  <p className="text-amber-400 text-sm font-medium mb-2">{leader.role}</p>
                  <p className="text-amber-200/60 text-sm">{leader.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
