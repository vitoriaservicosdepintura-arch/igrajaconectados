import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bell, X, Calendar, Clock, MapPin, Send, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

const WHATSAPP_NUMBER = '351965838589';
const WHATSAPP_NAME = 'Mayckon';

export function FloatingWidgets() {
  const { t, language } = useLanguage();
  const { events } = useData();
  const [showNotification, setShowNotification] = useState(false);
  const [showPresenceForm, setShowPresenceForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);

  // Mensagens do WhatsApp traduzidas
  const whatsappMessages = {
    pt: {
      greeting: `Olá ${WHATSAPP_NAME}! Gostaria de falar com alguém da Igreja Conectada.`,
      presence: (service: string, date: string, time: string, location: string, name: string, email: string, phone: string) => 
        `Olá ${WHATSAPP_NAME}! Gostaria de confirmar minha presença no ${service}.\n\n` +
        `📅 Data: ${date}\n` +
        `⏰ Horário: ${time}\n` +
        `📍 Local: ${location}\n\n` +
        `Meus dados:\n` +
        `Nome: ${name}\n` +
        `Email: ${email}\n` +
        `Telefone: ${phone}`
    },
    en: {
      greeting: `Hello ${WHATSAPP_NAME}! I would like to speak with someone from Connected Church.`,
      presence: (service: string, date: string, time: string, location: string, name: string, email: string, phone: string) => 
        `Hello ${WHATSAPP_NAME}! I would like to confirm my attendance at ${service}.\n\n` +
        `📅 Date: ${date}\n` +
        `⏰ Time: ${time}\n` +
        `📍 Location: ${location}\n\n` +
        `My details:\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}`
    },
    es: {
      greeting: `¡Hola ${WHATSAPP_NAME}! Me gustaría hablar con alguien de la Iglesia Conectada.`,
      presence: (service: string, date: string, time: string, location: string, name: string, email: string, phone: string) => 
        `¡Hola ${WHATSAPP_NAME}! Me gustaría confirmar mi asistencia en ${service}.\n\n` +
        `📅 Fecha: ${date}\n` +
        `⏰ Hora: ${time}\n` +
        `📍 Ubicación: ${location}\n\n` +
        `Mis datos:\n` +
        `Nombre: ${name}\n` +
        `Email: ${email}\n` +
        `Teléfono: ${phone}`
    }
  };

  // Formatos de data por idioma
  const dateLocales = {
    pt: 'pt-BR',
    en: 'en-US',
    es: 'es-ES'
  };

  // Get next scheduled event
  const nextEvent = events
    .filter(e => e.status === 'scheduled' && new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const nextService = nextEvent ? {
    title: nextEvent.title,
    date: new Date(nextEvent.date).toLocaleDateString(dateLocales[language], { weekday: 'long', day: 'numeric', month: 'short' }),
    time: nextEvent.time,
    location: nextEvent.location,
    pastorName: nextEvent.pastorName
  } : {
    title: language === 'pt' ? 'Culto de Domingo' : language === 'en' ? 'Sunday Service' : 'Culto del Domingo',
    date: `${t('events.sunday')}, 19 Jan`,
    time: '10:00',
    location: language === 'pt' ? 'Templo Principal' : language === 'en' ? 'Main Temple' : 'Templo Principal',
    pastorName: 'Pr. João Silva'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    
    // WhatsApp integration with translated message
    const message = encodeURIComponent(
      whatsappMessages[language].presence(
        nextService.title,
        nextService.date,
        nextService.time,
        nextService.location,
        formData.name,
        formData.email,
        formData.phone
      )
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    
    setSubmitted(true);
    setTimeout(() => {
      setShowPresenceForm(false);
      setShowNotification(false);
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '' });
      setConsent(false);
    }, 2000);
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(whatsappMessages[language].greeting);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <>
      {/* WhatsApp Button - Left */}
      <motion.button
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={openWhatsApp}
        className="fixed left-4 bottom-4 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative flex items-center">
          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute left-full ml-3 px-4 py-2 bg-white rounded-lg shadow-lg whitespace-nowrap"
          >
            <p className="text-sm font-medium text-gray-900">{t('widget.talkToUs')}</p>
            <p className="text-xs text-gray-500">{WHATSAPP_NAME}</p>
          </motion.div>
        </div>
      </motion.button>

      {/* Notification Bell - Right */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="fixed right-4 bottom-4 z-50"
      >
        <motion.button
          onClick={() => setShowNotification(!showNotification)}
          className="relative w-14 h-14 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Bell className="w-7 h-7 text-white" />
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
            1
          </span>
          {/* 3D Ring animation */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 border-2 border-orange-400 rounded-full"
          />
        </motion.button>

        {/* Notification Panel */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-full right-0 mb-4 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden"
              style={{ perspective: '1000px' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{t('widget.nextService')}</h3>
                  <button 
                    onClick={() => setShowNotification(false)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {!showPresenceForm ? (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="mb-4"
                    >
                      <h4 className="font-bold text-gray-900 text-lg mb-3">{nextService.title}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">{nextService.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">{nextService.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">{nextService.location}</span>
                        </div>
                        {nextService.pastorName && (
                          <div className="flex items-center gap-3 text-gray-600">
                            <span className="text-sm">🎤 {nextService.pastorName}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    <motion.button
                      onClick={() => setShowPresenceForm(true)}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold rounded-xl shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('widget.confirmPresence')}
                    </motion.button>
                  </>
                ) : submitted ? (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="font-bold text-gray-900">{t('widget.confirmed')}</p>
                    <p className="text-sm text-gray-500">{t('widget.seeYou')}</p>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-3"
                  >
                    <button
                      type="button"
                      onClick={() => setShowPresenceForm(false)}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      ← {t('common.back')}
                    </button>
                    
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('widget.yourName')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('widget.yourEmail')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t('widget.yourPhone')}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-orange-500 rounded"
                      />
                      <span className="text-xs text-gray-500">
                        {t('prayer.consent')}
                      </span>
                    </label>
                    
                    <button
                      type="submit"
                      disabled={!consent}
                      className="w-full py-2 bg-green-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {t('widget.chatWhatsApp')}
                    </button>
                  </motion.form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
