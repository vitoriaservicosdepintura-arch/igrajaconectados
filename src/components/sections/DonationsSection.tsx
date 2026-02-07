import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, CreditCard, Smartphone, Building2, Check, Download, Target } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function DonationsSection() {
  const { t, language } = useLanguage();

  // Translated projects
  const projects = [
    { 
      id: '1', 
      name: language === 'en' ? 'New Temple Construction' : language === 'es' ? 'Construcción del Nuevo Templo' : 'Construção do Novo Templo', 
      goal: 100000, 
      raised: 67500, 
      currency: 'EUR' as const 
    },
    { 
      id: '2', 
      name: language === 'en' ? 'Missions in Africa' : language === 'es' ? 'Misiones en África' : 'Missões na África', 
      goal: 25000, 
      raised: 18750, 
      currency: 'EUR' as const 
    },
    { 
      id: '3', 
      name: language === 'en' ? 'Sunday School' : language === 'es' ? 'Escuela Dominical' : 'Escolinha Dominical', 
      goal: 5000, 
      raised: 4200, 
      currency: 'EUR' as const 
    },
  ];
  const [currency, setCurrency] = useState<'EUR' | 'BRL'>('EUR');
  const [method, setMethod] = useState<'MBWAY' | 'PIX' | 'TRANSFER'>('MBWAY');
  const [amount, setAmount] = useState('');
  const [selectedProject, setSelectedProject] = useState(projects[0].id);
  const [showSuccess, setShowSuccess] = useState(false);
  const [consent, setConsent] = useState(false);

  const presetAmounts = currency === 'EUR' ? [10, 25, 50, 100] : [50, 100, 250, 500];

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !consent) return;
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const formatCurrency = (value: number, curr: 'EUR' | 'BRL') => {
    return new Intl.NumberFormat(curr === 'EUR' ? 'pt-PT' : 'pt-BR', {
      style: 'currency',
      currency: curr,
    }).format(value);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-blue-50" id="donations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-4">
            {t('donations.title')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Contribute to the ' : language === 'es' ? 'Contribuye con la ' : 'Contribua com a '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">
              {language === 'en' ? 'Work' : language === 'es' ? 'Obra' : 'Obra'}
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('donations.subtitle')}
          </p>
        </motion.div>

        {/* Project Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            {t('donations.projectGoals')} {language === 'en' ? 'Current' : language === 'es' ? 'Actuales' : 'Atuais'}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const percentage = (project.raised / project.goal) * 100;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedProject(project.id)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all ${
                    selectedProject === project.id
                      ? 'bg-gradient-to-br from-orange-500 to-blue-600 text-white shadow-xl'
                      : 'bg-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <h4 className={`font-bold mb-2 ${selectedProject === project.id ? 'text-white' : 'text-gray-900'}`}>
                    {project.name}
                  </h4>
                  
                  {/* Progress Bar */}
                  <div className={`h-3 rounded-full overflow-hidden mb-3 ${
                    selectedProject === project.id ? 'bg-white/30' : 'bg-gray-200'
                  }`}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full ${
                        selectedProject === project.id
                          ? 'bg-white'
                          : 'bg-gradient-to-r from-orange-500 to-blue-600'
                      }`}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className={selectedProject === project.id ? 'text-white/80' : 'text-gray-500'}>
                      {t('donations.raised')}: {formatCurrency(project.raised, project.currency)}
                    </span>
                    <span className={`font-bold ${selectedProject === project.id ? 'text-white' : 'text-gray-900'}`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${selectedProject === project.id ? 'text-white/70' : 'text-gray-400'}`}>
                    Meta: {formatCurrency(project.goal, project.currency)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Donation Form */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl p-6 md:p-8"
          >
            <form onSubmit={handleDonate}>
              {/* Currency Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('donations.currency')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['EUR', 'BRL'] as const).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setCurrency(curr)}
                      className={`p-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        currency === curr
                          ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{curr === 'EUR' ? '🇪🇺' : '🇧🇷'}</span>
                      <span>{curr === 'EUR' ? 'Euro' : 'Real'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {language === 'en' ? 'Amount' : language === 'es' ? 'Monto' : 'Valor'}
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset.toString())}
                      className={`py-3 rounded-xl font-medium transition-all ${
                        amount === preset.toString()
                          ? 'bg-orange-100 text-orange-600 border-2 border-orange-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                    >
                      {currency === 'EUR' ? '€' : 'R$'}{preset}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t('donations.custom')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('donations.method')}</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'MBWAY' as const, label: t('donations.mbway'), icon: Smartphone },
                    { id: 'PIX' as const, label: t('donations.pix'), icon: CreditCard },
                    { id: 'TRANSFER' as const, label: t('donations.transfer'), icon: Building2 },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`p-4 rounded-xl font-medium transition-all flex flex-col items-center gap-2 ${
                        method === m.id
                          ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <m.icon className="w-6 h-6" />
                      <span className="text-xs">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* LGPD Consent */}
              <label className="flex items-start gap-3 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 text-orange-500 rounded"
                />
                <span className="text-sm text-gray-600">
                  {t('prayer.consent')}
                </span>
              </label>

              <motion.button
                type="submit"
                disabled={!amount || !consent}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className="w-5 h-5" />
                {t('donations.donateNow')}
              </motion.button>
            </form>
          </motion.div>

          {/* Info & Success */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 rounded-3xl p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">{t('donations.thankYou')}</h3>
                <p className="text-green-600 mb-4">
                  {t('donations.receiptSent')}
                </p>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors">
                  <Download className="w-4 h-4" />
                  {t('member.downloadReceipt')}
                </button>
              </motion.div>
            ) : (
              <>
                <div className="bg-white rounded-3xl shadow-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{t('donations.bankDetails')}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">IBAN:</span>
                      <span className="font-mono font-medium">PT50 0000 0000 0000 0000 0000 0</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">BIC/SWIFT:</span>
                      <span className="font-mono font-medium">CGDIPTPL</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">{language === 'en' ? 'Beneficiary' : language === 'es' ? 'Beneficiario' : 'Beneficiário'}:</span>
                      <span className="font-medium">{language === 'en' ? 'Connected Church' : language === 'es' ? 'Iglesia Conectada' : 'Igreja Conectada'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-blue-600 rounded-3xl p-6 text-white">
                  <h3 className="font-bold mb-3">{t('donations.pix')} Brasil</h3>
                  <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
                    <div className="w-32 h-32 mx-auto mb-3 bg-white rounded-xl flex items-center justify-center">
                      <div className="grid grid-cols-4 gap-1">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm opacity-80">pix@igrejaconectada.org</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
