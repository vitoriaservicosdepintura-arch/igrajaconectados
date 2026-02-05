import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Lock, Globe, Users, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';

export function PrayerWallSection() {
  const { t } = useLanguage();
  const { prayerRequests, addPrayerRequest, incrementPrayingCount } = useData();
  const [newPrayer, setNewPrayer] = useState({ name: '', message: '', isPublic: true });
  const [prayedFor, setPrayedFor] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.name || !newPrayer.message || !consent) return;
    
    // Add prayer request - public ones are auto-approved, private go to admin
    addPrayerRequest({
      name: newPrayer.name,
      message: newPrayer.message,
      isPublic: newPrayer.isPublic,
      prayingCount: 1,
      createdAt: new Date().toISOString(),
    });
    
    setSubmitted(true);
    setTimeout(() => {
      setNewPrayer({ name: '', message: '', isPublic: true });
      setShowForm(false);
      setConsent(false);
      setSubmitted(false);
    }, 2000);
  };

  const handlePray = (id: string) => {
    if (prayedFor.includes(id)) return;
    incrementPrayingCount(id);
    setPrayedFor([...prayedFor, id]);
  };

  // Only show approved public prayers
  const publicPrayers = prayerRequests.filter(p => p.isPublic && p.status === 'approved');
  const totalPraying = publicPrayers.reduce((acc, p) => acc + p.prayingCount, 0);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-orange-50" id="prayer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
            {t('prayerWall')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Mural de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">Oração</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Compartilhe seus pedidos e ore pelos irmãos. Juntos, somos mais fortes!
          </p>
          
          {/* Stats */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Users className="w-6 h-6 text-orange-500" />
            </motion.div>
            <span className="text-2xl font-bold text-gray-900">{totalPraying}</span>
            <span className="text-gray-500">{t('praying')}</span>
          </div>
        </motion.div>

        {/* Add Prayer Button / Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.button
                key="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowForm(true)}
                className="w-full max-w-2xl mx-auto block px-8 py-6 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <Heart className="w-6 h-6" />
                  <span className="text-lg">{t('prayerRequest')}</span>
                </div>
              </motion.button>
            ) : submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pedido Enviado!</h3>
                <p className="text-gray-600">
                  {newPrayer.isPublic 
                    ? 'Seu pedido foi adicionado ao mural de oração.' 
                    : 'Seu pedido privado foi enviado para análise da liderança.'}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t('prayerRequest')}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('name')}</label>
                    <input
                      type="text"
                      value={newPrayer.name}
                      onChange={(e) => setNewPrayer({ ...newPrayer, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pedido de Oração</label>
                    <textarea
                      value={newPrayer.message}
                      onChange={(e) => setNewPrayer({ ...newPrayer, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="Compartilhe seu pedido..."
                      required
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={newPrayer.isPublic}
                        onChange={() => setNewPrayer({ ...newPrayer, isPublic: true })}
                        className="w-4 h-4 text-orange-500"
                      />
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{t('public')}</span>
                      <span className="text-xs text-gray-400">(Aparece no mural)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        checked={!newPrayer.isPublic}
                        onChange={() => setNewPrayer({ ...newPrayer, isPublic: false })}
                        className="w-4 h-4 text-orange-500"
                      />
                      <Lock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{t('private')}</span>
                      <span className="text-xs text-gray-400">(Só a liderança vê)</span>
                    </label>
                  </div>

                  {/* LGPD Consent */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 text-orange-500 rounded"
                    />
                    <span className="text-sm text-gray-600">
                      {t('privacyConsent')}. Seus dados serão tratados conforme a LGPD/RGPD.
                    </span>
                  </label>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!consent}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {t('submit')}
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Prayer Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicPrayers.map((prayer, index) => (
            <motion.div
              key={prayer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden group"
              style={{ perspective: '1000px' }}
            >
              {/* 3D effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {prayer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{prayer.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(prayer.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{prayer.message}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{prayer.prayingCount} {t('praying')}</span>
                  </div>
                  
                  <motion.button
                    onClick={() => handlePray(prayer.id)}
                    disabled={prayedFor.includes(prayer.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      prayedFor.includes(prayer.id)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    }`}
                    whileHover={{ scale: prayedFor.includes(prayer.id) ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className={`w-4 h-4 ${prayedFor.includes(prayer.id) ? 'fill-current' : ''}`} />
                    {prayedFor.includes(prayer.id) ? 'Orando' : t('prayForThis')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {publicPrayers.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum pedido de oração ainda. Seja o primeiro!</p>
          </div>
        )}
      </div>
    </section>
  );
}
