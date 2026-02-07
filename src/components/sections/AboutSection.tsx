import { motion } from 'framer-motion';
import { FiHeart, FiUsers, FiBook, FiGlobe, FiTarget, FiAward } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';

export function AboutSection() {
  const { t, language } = useLanguage();

  const values = [
    { 
      icon: FiHeart, 
      title: language === 'en' ? 'Love' : language === 'es' ? 'Amor' : 'Amor', 
      description: language === 'en' ? 'We love God and neighbor as ourselves' : language === 'es' ? 'Amamos a Dios y al prójimo como a nosotros mismos' : 'Amamos a Deus e ao próximo como a nós mesmos'
    },
    { 
      icon: FiUsers, 
      title: language === 'en' ? 'Community' : language === 'es' ? 'Comunidad' : 'Comunidade', 
      description: language === 'en' ? 'We are a family united by faith' : language === 'es' ? 'Somos una familia unida por la fe' : 'Somos uma família unida pela fé'
    },
    { 
      icon: FiBook, 
      title: language === 'en' ? 'Word' : language === 'es' ? 'Palabra' : 'Palavra', 
      description: language === 'en' ? 'The Bible is our guide and foundation' : language === 'es' ? 'La Biblia es nuestra guía y fundamento' : 'A Bíblia é nosso guia e fundamento'
    },
    { 
      icon: FiGlobe, 
      title: language === 'en' ? 'Missions' : language === 'es' ? 'Misiones' : 'Missões', 
      description: language === 'en' ? 'We bring the gospel to all nations' : language === 'es' ? 'Llevamos el evangelio a todas las naciones' : 'Levamos o evangelho a todas as nações'
    },
    { 
      icon: FiTarget, 
      title: language === 'en' ? 'Purpose' : language === 'es' ? 'Propósito' : 'Propósito', 
      description: language === 'en' ? 'Every member has a special calling' : language === 'es' ? 'Cada miembro tiene un llamado especial' : 'Cada membro tem um chamado especial'
    },
    { 
      icon: FiAward, 
      title: language === 'en' ? 'Excellence' : language === 'es' ? 'Excelencia' : 'Excelência', 
      description: language === 'en' ? 'We serve God with our best' : language === 'es' ? 'Servimos a Dios con lo mejor de nosotros' : 'Servimos a Deus com o nosso melhor'
    },
  ];

  const team = [
    { name: 'Pr. João Silva', role: t('about.pastor'), image: '👨‍💼' },
    { name: 'Pra. Maria Silva', role: language === 'en' ? 'Pastor' : language === 'es' ? 'Pastora' : 'Pastora', image: '👩‍💼' },
    { name: 'Ev. Pedro Santos', role: language === 'en' ? 'Evangelist' : language === 'es' ? 'Evangelista' : 'Evangelista', image: '👨‍🏫' },
    { name: 'Dc. Ana Costa', role: language === 'en' ? 'Deaconess' : language === 'es' ? 'Diaconisa' : 'Diaconisa', image: '👩‍🏫' },
  ];

  const churchName = language === 'en' ? 'Connected Church' : language === 'es' ? 'Iglesia Conectada' : 'Igreja Conectada';

  return (
    <section className="py-20 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-4">
            {t('about.title')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Meet the ' : language === 'es' ? 'Conoce la ' : 'Conheça a '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">{churchName}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </motion.div>

        {/* Story Section with 3D effect */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
            style={{ perspective: '1000px' }}
          >
            <motion.div
              whileHover={{ rotateY: 5, rotateX: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-400 via-orange-500 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-8xl mb-4"
                  >
                    ⛪
                  </motion.div>
                  <p className="text-2xl font-bold">
                    {language === 'en' ? 'Since 2010' : language === 'es' ? 'Desde 2010' : 'Desde 2010'}
                  </p>
                  <p className="opacity-80">
                    {language === 'en' ? 'Transforming Lives' : language === 'es' ? 'Transformando Vidas' : 'Transformando Vidas'}
                  </p>
                </div>
              </div>
              {/* 3D shadow layers */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-orange-200 rounded-3xl -z-10 opacity-50" />
              <div className="absolute -bottom-8 -right-8 w-full h-full bg-blue-200 rounded-3xl -z-20 opacity-30" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {t('about.history')}
            </h3>
            <div className="space-y-4 text-gray-600">
              <p>{t('about.historyText')}</p>
              <p>{t('about.historyText2')}</p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <p className="text-2xl font-bold text-orange-600">14+</p>
                <p className="text-sm text-gray-500">{t('hero.yearsMinistry')}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">500+</p>
                <p className="text-sm text-gray-500">{t('hero.members')}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">25+</p>
                <p className="text-sm text-gray-500">{t('hero.cells')}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            {t('about.values')}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group p-6 bg-gray-50 rounded-2xl hover:bg-gradient-to-br hover:from-orange-500 hover:to-blue-600 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <value.icon className="w-7 h-7 text-orange-500" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors">
                  {value.title}
                </h4>
                <p className="text-gray-600 group-hover:text-white/80 transition-colors">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            {t('about.leadership')}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center"
                style={{ perspective: '1000px' }}
              >
                <motion.div
                  whileHover={{ rotateY: 10 }}
                  className="relative mb-4 mx-auto w-32 h-32"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-blue-600 rounded-2xl transform rotate-6" />
                  <div className="relative w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center text-5xl shadow-xl">
                    {member.image}
                  </div>
                </motion.div>
                <h4 className="font-bold text-gray-900">{member.name}</h4>
                <p className="text-sm text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
