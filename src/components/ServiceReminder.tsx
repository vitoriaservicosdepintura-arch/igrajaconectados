import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Bell, Clock, Calendar, ChevronRight, AlertCircle, MapPin, Mic, Music, 
  Users, Eye, ArrowLeft, Share2, Heart, MessageCircle, Phone,
  ChevronDown, Star, BookOpen, User, Send, Check, Mail, Smartphone, Loader2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { EventoCulto } from '@/types';

interface ServiceReminderProps {
  events: EventoCulto[];
  isOpen: boolean;
  onClose: () => void;
  onViewAll: () => void;
  onOpenAgenda?: () => void;
}

const translations = {
  pt: {
    title: 'Lembrete de Cultos',
    subtitle: 'Próximos cultos e eventos',
    today: 'Hoje',
    tomorrow: 'Amanhã',
    inDays: 'em {days} dias',
    thisWeek: '📅 Esta Semana',
    upcomingEvents: '🔮 Próximos Eventos',
    noEvents: 'Nenhum evento programado',
    viewAll: 'Ver Agenda Completa',
    reminder: 'Não esqueça!',
    service: 'Culto',
    event: 'Evento',
    startsIn: 'Começa em',
    hours: 'horas',
    minutes: 'minutos',
    preacher: 'Pregador',
    worship: 'Louvor',
    location: 'Local',
    seeDetails: 'Detalhes',
    allEvents: 'Todos os Eventos',
    sendReminder: 'Lembrete',
    eventDetails: 'Detalhes do Evento',
    backToList: 'Voltar',
    share: 'Compartilhar',
    interested: 'Tenho Interesse',
    contact: 'Contato',
    description: 'Descrição',
    dateTime: 'Data e Hora',
    aboutEvent: 'Sobre o Evento',
    whoWillMinister: 'Quem vai ministrar',
    schedule: 'Programação',
    moreInfo: 'Mais Informações',
    confirmPresence: 'Confirmar Presença',
    days: 'dias',
    seconds: 'segundos',
    liveCountdown: 'Contagem Regressiva',
    eventNotFound: 'Evento não encontrado',
    yourName: 'Seu Nome Completo',
    yourPhone: 'WhatsApp / Telemóvel',
    confirmData: 'Confirme seus dados',
    sendingNotification: 'Enviando notificações...',
    notificationSent: 'Notificações enviadas!',
    thankYouMessage: 'Obrigado por confirmar sua presença!',
    youWillReceive: 'Você receberá lembretes em:',
    presenceConfirmed: 'Presença Confirmada!',
    sendConfirmation: 'Confirmar Presença',
    phonePrefix: '+351',
  },
  en: {
    title: 'Service Reminder',
    subtitle: 'Upcoming services and events',
    today: 'Today',
    tomorrow: 'Tomorrow',
    inDays: 'in {days} days',
    thisWeek: '📅 This Week',
    upcomingEvents: '🔮 Upcoming Events',
    noEvents: 'No events scheduled',
    viewAll: 'View Full Schedule',
    reminder: "Don't forget!",
    service: 'Service',
    event: 'Event',
    startsIn: 'Starts in',
    hours: 'hours',
    minutes: 'minutes',
    preacher: 'Preacher',
    worship: 'Worship',
    location: 'Location',
    seeDetails: 'Details',
    allEvents: 'All Events',
    sendReminder: 'Reminder',
    eventDetails: 'Event Details',
    backToList: 'Back',
    share: 'Share',
    interested: 'I\'m Interested',
    contact: 'Contact',
    description: 'Description',
    dateTime: 'Date and Time',
    aboutEvent: 'About the Event',
    whoWillMinister: 'Who will minister',
    schedule: 'Schedule',
    moreInfo: 'More Information',
    confirmPresence: 'Confirm Presence',
    days: 'days',
    seconds: 'seconds',
    liveCountdown: 'Countdown',
    eventNotFound: 'Event not found',
    yourName: 'Your Full Name',
    yourPhone: 'WhatsApp / Phone',
    confirmData: 'Confirm your details',
    sendingNotification: 'Sending notifications...',
    notificationSent: 'Notifications sent!',
    thankYouMessage: 'Thank you for confirming your presence!',
    youWillReceive: 'You will receive reminders via:',
    presenceConfirmed: 'Presence Confirmed!',
    sendConfirmation: 'Confirm Presence',
    phonePrefix: '+351',
  },
  es: {
    title: 'Recordatorio de Cultos',
    subtitle: 'Próximos cultos y eventos',
    today: 'Hoy',
    tomorrow: 'Mañana',
    inDays: 'en {days} días',
    thisWeek: '📅 Esta Semana',
    upcomingEvents: '🔮 Próximos Eventos',
    noEvents: 'No hay eventos programados',
    viewAll: 'Ver Agenda Completa',
    reminder: '¡No olvides!',
    service: 'Culto',
    event: 'Evento',
    startsIn: 'Comienza en',
    hours: 'horas',
    minutes: 'minutes',
    preacher: 'Predicador',
    worship: 'Alabanza',
    location: 'Lugar',
    seeDetails: 'Detalles',
    allEvents: 'Todos los Eventos',
    sendReminder: 'Recordatorio',
    eventDetails: 'Detalles del Evento',
    backToList: 'Volver',
    share: 'Compartir',
    interested: 'Tengo Interés',
    contact: 'Contacto',
    description: 'Descripción',
    dateTime: 'Fecha y Hora',
    aboutEvent: 'Sobre el Evento',
    whoWillMinister: 'Quién va a ministrar',
    schedule: 'Programación',
    moreInfo: 'Más Información',
    confirmPresence: 'Confirmar Presencia',
    days: 'días',
    seconds: 'segundos',
    liveCountdown: 'Cuenta Regresiva',
    eventNotFound: 'Evento no encontrado',
    yourName: 'Tu Nombre Completo',
    yourPhone: 'WhatsApp / Teléfono',
    confirmData: 'Confirma tus datos',
    sendingNotification: 'Enviando notificaciones...',
    notificationSent: '¡Notificaciones enviadas!',
    thankYouMessage: '¡Gracias por confirmar tu presencia!',
    youWillReceive: 'Recibirás recordatorios en:',
    presenceConfirmed: '¡Presencia Confirmada!',
    sendConfirmation: 'Confirmar Presencia',
    phonePrefix: '+351',
  },
};

export function ServiceReminder({ events, isOpen, onClose, onViewAll, onOpenAgenda }: ServiceReminderProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [timeUntilNext, setTimeUntilNext] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [selectedEvent, setSelectedEvent] = useState<EventoCulto | null>(null);
  const [showInterestConfirm, setShowInterestConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({ nome: '', telefone: '' });
  const [sendingNotifications, setSendingNotifications] = useState(false);
  const [notificationsSent, setNotificationsSent] = useState({ whatsapp: false, sms: false, email: false });
  const [confirmationComplete, setConfirmationComplete] = useState(false);

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  // Get next upcoming event
  const now = new Date();
  const upcomingEvents = sortedEvents.filter(e => new Date(e.data) > now);
  const nextEvent = upcomingEvents[0];

  // Separate events into this week and future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const thisWeekEvents = upcomingEvents.filter(e => {
    const eventDate = new Date(e.data);
    return eventDate < endOfWeek;
  });

  const futureEvents = upcomingEvents.filter(e => {
    const eventDate = new Date(e.data);
    return eventDate >= endOfWeek;
  });

  useEffect(() => {
    if (!nextEvent && !selectedEvent) return;
    const targetEvent = selectedEvent || nextEvent;
    if (!targetEvent) return;

    const updateTimer = () => {
      const eventDate = new Date(targetEvent.data);
      const diff = eventDate.getTime() - new Date().getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeUntilNext({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [nextEvent, selectedEvent]);

  const getRelativeDay = (date: Date) => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const eventDay = new Date(date);
    eventDay.setHours(0, 0, 0, 0);
    
    const diffDays = Math.round((eventDay.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t.today;
    if (diffDays === 1) return t.tomorrow;
    if (diffDays > 1 && diffDays <= 7) return t.inDays.replace('{days}', diffDays.toString());
    return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isToday = (date: Date) => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const eventDay = new Date(date);
    eventDay.setHours(0, 0, 0, 0);
    return eventDay.getTime() === todayDate.getTime();
  };

  const isTomorrow = (date: Date) => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const eventDay = new Date(date);
    eventDay.setHours(0, 0, 0, 0);
    const diffDays = Math.round((eventDay.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };

  // Event Detail Page Component
  const EventDetailPage = ({ event }: { event: EventoCulto }) => {
    const eventDate = new Date(event.data);
    const eventIsToday = isToday(eventDate);
    const eventIsTomorrow = isTomorrow(eventDate);

    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="h-full flex flex-col"
      >
        {/* Detail Header */}
        <div className="relative flex-shrink-0">
          {/* Event Image */}
          {event.imagem ? (
            <div className="relative h-48 sm:h-64 md:h-72 overflow-hidden">
              <img src={event.imagem} alt={event.titulo} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
              
              {/* Back Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-full hover:bg-black/70 transition-colors z-10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">{t.backToList}</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Badges */}
              <div className="absolute top-16 left-4 flex flex-wrap gap-2">
                {eventIsToday && (
                  <motion.span 
                    animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg shadow-red-500/50"
                  >
                    🔴 HOJE!
                  </motion.span>
                )}
                {eventIsTomorrow && (
                  <span className="px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-full shadow-lg shadow-amber-500/50">
                    ⏰ AMANHÃ
                  </span>
                )}
                <span className={`px-4 py-2 text-white text-sm font-bold rounded-full shadow-lg ${
                  event.tipo === 'culto' 
                    ? 'bg-blue-500 shadow-blue-500/50' 
                    : 'bg-purple-500 shadow-purple-500/50'
                }`}>
                  {event.tipo === 'culto' ? `⛪ ${t.service}` : `🎉 ${t.event}`}
                </span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg leading-tight">
                  {event.titulo}
                </h2>
              </div>
            </div>
          ) : (
            <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-rose-600 p-6 sm:p-8">
              {/* Back Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">{t.backToList}</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pt-12">
                <div className="flex flex-wrap gap-2 mb-3">
                  {eventIsToday && (
                    <motion.span 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="px-3 py-1 bg-white/20 text-white text-sm font-bold rounded-full"
                    >
                      🔴 HOJE!
                    </motion.span>
                  )}
                  {eventIsTomorrow && (
                    <span className="px-3 py-1 bg-amber-500/80 text-white text-sm font-bold rounded-full">
                      ⏰ AMANHÃ
                    </span>
                  )}
                  <span className={`px-3 py-1 text-white text-sm font-medium rounded-full ${
                    event.tipo === 'culto' ? 'bg-blue-500/80' : 'bg-purple-500/80'
                  }`}>
                    {event.tipo === 'culto' ? t.service : t.event}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{event.titulo}</h2>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* Live Countdown */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-r from-red-500/20 to-rose-500/20 border-2 border-red-500/50 rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 bg-red-500 rounded-full"
                />
                <span className="text-red-400 font-semibold">{t.liveCountdown}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 text-center">
                  <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-red-400">{timeUntilNext.days}</span>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">{t.days}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 text-center">
                  <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-red-400">{timeUntilNext.hours}</span>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">{t.hours}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 text-center">
                  <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-red-400">{timeUntilNext.minutes}</span>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">{t.minutes}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 text-center">
                  <motion.span 
                    key={timeUntilNext.seconds}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-2xl sm:text-4xl md:text-5xl font-bold text-red-400"
                  >
                    {timeUntilNext.seconds}
                  </motion.span>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">{t.seconds}</p>
                </div>
              </div>
            </motion.div>

            {/* Date, Time & Location */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10"
            >
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-400" />
                {t.dateTime}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Data</p>
                    <p className="text-white font-bold">{getRelativeDay(eventDate)}</p>
                    <p className="text-gray-400 text-xs capitalize">{formatFullDate(eventDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Horário</p>
                    <p className="text-white font-bold text-xl">{formatTime(eventDate)}</p>
                  </div>
                </div>
                {event.local && (
                  <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">{t.location}</p>
                      <p className="text-white font-bold">{event.local}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Who Will Minister */}
            {(event.pregador || event.cantores) && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-2xl p-4 sm:p-6 border border-amber-500/20"
              >
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  {t.whoWillMinister}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.pregador && (
                    <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Mic className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-amber-400 text-sm font-medium flex items-center gap-1">
                          🎤 {t.preacher}
                        </p>
                        <p className="text-white font-bold text-lg">{event.pregador}</p>
                        <p className="text-gray-400 text-xs">Pregador da Palavra</p>
                      </div>
                    </div>
                  )}
                  {event.cantores && (
                    <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <Music className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-purple-400 text-sm font-medium flex items-center gap-1">
                          🎵 {t.worship}
                        </p>
                        <p className="text-white font-bold text-lg">{event.cantores}</p>
                        <p className="text-gray-400 text-xs">Ministério de Louvor</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Description */}
            {event.descricao && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10"
              >
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-red-400" />
                  {t.aboutEvent}
                </h3>
                <p className="text-gray-300 leading-relaxed text-base whitespace-pre-wrap">
                  {event.descricao}
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              <button
                onClick={() => setShowInterestConfirm(true)}
                className="flex flex-col items-center gap-2 bg-gradient-to-br from-red-500 to-rose-600 text-white p-4 rounded-xl hover:from-red-400 hover:to-rose-500 transition-all shadow-lg shadow-red-500/30"
              >
                <Heart className="w-6 h-6" />
                <span className="text-xs font-medium">{t.interested}</span>
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: event.titulo,
                      text: `${event.titulo} - ${formatFullDate(eventDate)} às ${formatTime(eventDate)}`,
                      url: window.location.href
                    });
                  }
                }}
                className="flex flex-col items-center gap-2 bg-slate-700 text-white p-4 rounded-xl hover:bg-slate-600 transition-all"
              >
                <Share2 className="w-6 h-6" />
                <span className="text-xs font-medium">{t.share}</span>
              </button>
              <button
                onClick={() => window.open('https://wa.me/351999999999', '_blank')}
                className="flex flex-col items-center gap-2 bg-green-600 text-white p-4 rounded-xl hover:bg-green-500 transition-all"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs font-medium">WhatsApp</span>
              </button>
              <button
                onClick={() => window.open('tel:+351999999999', '_blank')}
                className="flex flex-col items-center gap-2 bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-500 transition-all"
              >
                <Phone className="w-6 h-6" />
                <span className="text-xs font-medium">{t.contact}</span>
              </button>
            </motion.div>

            {/* Interest Confirmation Form with Name and Phone */}
            <AnimatePresence>
              {showInterestConfirm && !confirmationComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-red-500 rounded-2xl p-6 shadow-2xl"
                >
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30"
                    >
                      <Heart className="w-8 h-8 text-white" />
                    </motion.div>
                    <h4 className="text-white font-bold text-xl mb-2">{t.confirmData}</h4>
                    <p className="text-gray-400 text-sm">Preencha seus dados para confirmar presença</p>
                  </div>

                  <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        {t.yourName} *
                      </label>
                      <input
                        type="text"
                        value={confirmData.nome}
                        onChange={(e) => setConfirmData({ ...confirmData, nome: e.target.value })}
                        placeholder="Ex: João Silva"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      />
                    </div>

                    {/* Phone Field with Portugal Prefix */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        <Smartphone className="w-4 h-4 inline mr-2" />
                        {t.yourPhone} * 🇵🇹
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 py-3 bg-slate-600 border border-r-0 border-slate-600 rounded-l-xl text-gray-300 text-sm font-medium">
                          🇵🇹 +351
                        </span>
                        <input
                          type="tel"
                          value={confirmData.telefone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setConfirmData({ ...confirmData, telefone: value });
                          }}
                          placeholder="912 345 678"
                          className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-r-xl text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                        />
                      </div>
                      <p className="text-gray-500 text-xs mt-1">🇧🇷 Brasil: +55 | 🇵🇹 Portugal: +351</p>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={() => {
                        if (confirmData.nome.length >= 3 && confirmData.telefone.length >= 9) {
                          setSendingNotifications(true);
                          
                          // Simulate sending notifications
                          setTimeout(() => {
                            setNotificationsSent({ ...notificationsSent, whatsapp: true });
                          }, 1000);
                          
                          setTimeout(() => {
                            setNotificationsSent(prev => ({ ...prev, sms: true }));
                          }, 2000);
                          
                          setTimeout(() => {
                            setNotificationsSent(prev => ({ ...prev, email: true }));
                          }, 3000);
                          
                          setTimeout(() => {
                            setSendingNotifications(false);
                            setConfirmationComplete(true);
                          }, 3500);
                        }
                      }}
                      disabled={confirmData.nome.length < 3 || confirmData.telefone.length < 9 || sendingNotifications}
                      className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                        confirmData.nome.length >= 3 && confirmData.telefone.length >= 9 && !sendingNotifications
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-lg shadow-red-500/30'
                          : 'bg-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {sendingNotifications ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t.sendingNotification}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {t.sendConfirmation}
                        </>
                      )}
                    </button>

                    {/* Notification Status */}
                    {sendingNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3 mt-4"
                      >
                        <p className="text-gray-400 text-sm text-center mb-3">{t.youWillReceive}</p>
                        
                        {/* WhatsApp */}
                        <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                          notificationsSent.whatsapp ? 'bg-green-500/20 border border-green-500/50' : 'bg-slate-700/30'
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            notificationsSent.whatsapp ? 'bg-green-500' : 'bg-gray-600'
                          }`}>
                            {notificationsSent.whatsapp ? (
                              <Check className="w-5 h-5 text-white" />
                            ) : (
                              <Loader2 className="w-5 h-5 text-white animate-spin" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">WhatsApp</p>
                            <p className="text-gray-400 text-xs">+351 {confirmData.telefone}</p>
                          </div>
                          {notificationsSent.whatsapp && (
                            <span className="text-green-400 text-xs">✓ Enviado</span>
                          )}
                        </div>

                        {/* SMS */}
                        <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                          notificationsSent.sms ? 'bg-purple-500/20 border border-purple-500/50' : 'bg-slate-700/30'
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            notificationsSent.sms ? 'bg-purple-500' : 'bg-gray-600'
                          }`}>
                            {notificationsSent.sms ? (
                              <Check className="w-5 h-5 text-white" />
                            ) : (
                              <Loader2 className="w-5 h-5 text-white animate-spin" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">SMS</p>
                            <p className="text-gray-400 text-xs">+351 {confirmData.telefone}</p>
                          </div>
                          {notificationsSent.sms && (
                            <span className="text-purple-400 text-xs">✓ Enviado</span>
                          )}
                        </div>

                        {/* Email */}
                        <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                          notificationsSent.email ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-slate-700/30'
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            notificationsSent.email ? 'bg-blue-500' : 'bg-gray-600'
                          }`}>
                            {notificationsSent.email ? (
                              <Check className="w-5 h-5 text-white" />
                            ) : (
                              <Loader2 className="w-5 h-5 text-white animate-spin" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">E-mail</p>
                            <p className="text-gray-400 text-xs">Notificação enviada</p>
                          </div>
                          {notificationsSent.email && (
                            <span className="text-blue-400 text-xs">✓ Enviado</span>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Cancel Button */}
                    {!sendingNotifications && (
                      <button
                        onClick={() => {
                          setShowInterestConfirm(false);
                          setConfirmData({ nome: '', telefone: '' });
                        }}
                        className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Confirmation Complete - Thank You Message */}
              {confirmationComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500 rounded-2xl p-6 text-center"
                >
                  {/* Confetti Animation */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ 
                          y: -20, 
                          x: Math.random() * 300 - 150,
                          opacity: 1,
                          rotate: 0
                        }}
                        animate={{ 
                          y: 400,
                          opacity: 0,
                          rotate: Math.random() * 360
                        }}
                        transition={{ 
                          duration: 2 + Math.random() * 2,
                          delay: Math.random() * 0.5
                        }}
                        className={`absolute w-3 h-3 rounded-full ${
                          ['bg-green-400', 'bg-emerald-400', 'bg-yellow-400', 'bg-white'][Math.floor(Math.random() * 4)]
                        }`}
                        style={{ left: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>

                  <h4 className="text-white font-bold text-2xl mb-2">{t.presenceConfirmed} 🎉</h4>
                  <p className="text-gray-300 mb-4">Olá <span className="text-green-400 font-bold">{confirmData.nome.split(' ')[0]}</span>!</p>
                  <p className="text-gray-300 mb-6">{t.thankYouMessage}</p>

                  {/* WhatsApp Preview Message */}
                  <div className="bg-slate-800 rounded-xl p-4 mb-6 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium text-sm">WhatsApp</span>
                      <span className="text-green-400 text-xs ml-auto">✓✓ Enviado</span>
                    </div>
                    <div className="bg-green-600/20 rounded-lg p-3 border-l-4 border-green-500">
                      <p className="text-white text-sm">
                        🙏 <strong>Igreja Cristã</strong>
                      </p>
                      <p className="text-gray-300 text-sm mt-2">
                        Olá <strong>{confirmData.nome.split(' ')[0]}</strong>! 👋
                      </p>
                      <p className="text-gray-300 text-sm mt-2">
                        Obrigado por confirmar presença no evento: <strong>{event.titulo}</strong>! 
                      </p>
                      <p className="text-gray-300 text-sm mt-2">
                        📅 {formatFullDate(new Date(event.data))} às {formatTime(new Date(event.data))}
                      </p>
                      <p className="text-gray-300 text-sm mt-2">
                        Te esperamos com muito carinho! 🙌✨
                      </p>
                      <p className="text-gray-400 text-xs mt-3 text-right">
                        {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} ✓✓
                      </p>
                    </div>
                  </div>

                  {/* Notification Summary */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-green-500/20 rounded-lg p-3 text-center">
                      <MessageCircle className="w-6 h-6 text-green-400 mx-auto mb-1" />
                      <p className="text-white text-xs font-medium">WhatsApp</p>
                      <p className="text-green-400 text-xs">✓ Enviado</p>
                    </div>
                    <div className="bg-purple-500/20 rounded-lg p-3 text-center">
                      <Smartphone className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                      <p className="text-white text-xs font-medium">SMS</p>
                      <p className="text-purple-400 text-xs">✓ Enviado</p>
                    </div>
                    <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                      <Mail className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                      <p className="text-white text-xs font-medium">E-mail</p>
                      <p className="text-blue-400 text-xs">✓ Enviado</p>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">
                    📱 +351 {confirmData.telefone}
                  </p>

                  <button
                    onClick={() => {
                      setShowInterestConfirm(false);
                      setConfirmationComplete(false);
                      setConfirmData({ nome: '', telefone: '' });
                      setNotificationsSent({ whatsapp: false, sms: false, email: false });
                    }}
                    className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-400 transition-colors"
                  >
                    Fechar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 p-4 bg-slate-800/90 backdrop-blur-sm border-t border-white/10">
          <button
            onClick={() => setShowInterestConfirm(true)}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:from-red-400 hover:to-rose-500 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 text-lg"
          >
            <Heart className="w-5 h-5" />
            {t.confirmPresence}
          </button>
        </div>
      </motion.div>
    );
  };

  // Event Card Component with Details button
  const EventCard = ({ event, index }: { event: EventoCulto; index: number }) => {
    const eventDate = new Date(event.data);
    const eventIsToday = isToday(eventDate);
    const eventIsTomorrow = isTomorrow(eventDate);

    return (
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 + index * 0.05 }}
        className={`rounded-2xl overflow-hidden transition-all duration-300 ${
          eventIsToday 
            ? 'bg-gradient-to-br from-red-500/30 to-rose-600/20 border-2 border-red-500 shadow-lg shadow-red-500/20' 
            : eventIsTomorrow
              ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-2 border-amber-500/50'
              : 'bg-white/5 border border-white/10 hover:border-red-500/30'
        }`}
      >
        {/* Event Image */}
        {event.imagem && (
          <div className="relative h-28 sm:h-36 overflow-hidden">
            <img src={event.imagem} alt={event.titulo} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            
            {/* Badges on image */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {eventIsToday && (
                <motion.span 
                  animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold shadow-lg"
                >
                  🔴 HOJE!
                </motion.span>
              )}
              {eventIsTomorrow && !eventIsToday && (
                <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full font-bold shadow-lg">
                  ⏰ AMANHÃ
                </span>
              )}
              <span className={`px-2 py-1 text-white text-xs rounded-full font-medium ${
                event.tipo === 'culto' ? 'bg-blue-500/80' : 'bg-purple-500/80'
              }`}>
                {event.tipo === 'culto' ? t.service : t.event}
              </span>
            </div>

            {/* Title overlay on image */}
            <div className="absolute bottom-2 left-2 right-2">
              <h4 className="text-white font-bold text-sm sm:text-base leading-tight drop-shadow-lg line-clamp-2">{event.titulo}</h4>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Title (if no image) */}
          {!event.imagem && (
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex flex-wrap gap-1 mb-1">
                  {eventIsToday && (
                    <motion.span 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold"
                    >
                      🔴 HOJE!
                    </motion.span>
                  )}
                  {eventIsTomorrow && !eventIsToday && (
                    <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-bold">
                      ⏰ AMANHÃ
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-white text-xs rounded-full ${
                    event.tipo === 'culto' ? 'bg-blue-500/80' : 'bg-purple-500/80'
                  }`}>
                    {event.tipo === 'culto' ? t.service : t.event}
                  </span>
                </div>
                <h4 className="text-white font-bold text-sm sm:text-base">{event.titulo}</h4>
              </div>
            </div>
          )}

          {/* Date, Time, Location - Compact */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-2 text-xs">
            <div className="flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1.5">
              <Calendar className="w-3 h-3 text-red-400 flex-shrink-0" />
              <span className="text-white font-medium truncate">{getRelativeDay(eventDate)}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1.5">
              <Clock className="w-3 h-3 text-red-400 flex-shrink-0" />
              <span className="text-white font-medium">{formatTime(eventDate)}</span>
            </div>
            {event.local && (
              <div className="flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1.5">
                <MapPin className="w-3 h-3 text-red-400 flex-shrink-0" />
                <span className="text-white font-medium truncate">{event.local}</span>
              </div>
            )}
          </div>

          {/* Preacher & Worship - Compact */}
          {(event.pregador || event.cantores) && (
            <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-lg p-2 border border-amber-500/20 mb-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {event.pregador && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mic className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-amber-400 text-xs">{t.preacher}</p>
                      <p className="text-white font-semibold text-xs truncate">{event.pregador}</p>
                    </div>
                  </div>
                )}
                {event.cantores && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Music className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-purple-400 text-xs">{t.worship}</p>
                      <p className="text-white font-semibold text-xs truncate">{event.cantores}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons - Reminder & Details */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedEvent(event)}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 px-3 rounded-lg hover:from-red-400 hover:to-rose-500 transition-all text-sm font-medium shadow-lg shadow-red-500/20"
            >
              <Eye className="w-4 h-4" />
              {t.seeDetails}
            </button>
            <button
              onClick={() => window.open(`https://wa.me/351999999999?text=Olá! Gostaria de saber mais sobre o evento: ${event.titulo}`, '_blank')}
              className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-500 transition-all text-sm font-medium"
            >
              <Bell className="w-4 h-4" />
              {t.sendReminder}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute inset-0 sm:inset-4 md:inset-6 lg:inset-10 bg-gradient-to-br from-slate-800 to-slate-900 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              {selectedEvent ? (
                <EventDetailPage key="detail" event={selectedEvent} />
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col"
                >
                  {/* Header - RED THEME */}
                  <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-rose-600 p-4 sm:p-6 overflow-hidden flex-shrink-0">
                    {/* Animated Background */}
                    <div className="absolute inset-0">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-xl"
                      />
                      <motion.div
                        animate={{ 
                          scale: [1.2, 1, 1.2],
                          opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"
                      />
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 bg-white/10 rounded-full p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring' }}
                          className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                        >
                          <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white">{t.title}</h3>
                          <p className="text-white/70 text-sm sm:text-base">{t.subtitle}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-3 mt-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                          <p className="text-white text-lg font-bold">{upcomingEvents.length}</p>
                          <p className="text-white/70 text-xs">{t.allEvents}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                          <p className="text-white text-lg font-bold">{thisWeekEvents.length}</p>
                          <p className="text-white/70 text-xs">{t.thisWeek}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {/* Next Event Highlight with Countdown */}
                    {nextEvent && (
                      <div className="mb-6">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="relative bg-gradient-to-r from-red-500/30 to-rose-500/20 border-2 border-red-500 rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:border-red-400 transition-colors"
                          onClick={() => setSelectedEvent(nextEvent)}
                        >
                          {/* Pulsing Alert */}
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute top-3 right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center z-10"
                          >
                            <Bell className="w-4 h-4 text-white" />
                          </motion.div>

                          {/* Event Image */}
                          {nextEvent.imagem && (
                            <div className="relative h-32 sm:h-40 overflow-hidden">
                              <img src={nextEvent.imagem} alt={nextEvent.titulo} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                              
                              {/* Title on image */}
                              <div className="absolute bottom-3 left-4 right-12">
                                <div className="flex items-center gap-2 mb-1">
                                  <motion.span 
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="text-red-400 text-sm font-semibold"
                                  >
                                    🔴 {t.reminder}
                                  </motion.span>
                                </div>
                                <h4 className="text-white font-bold text-lg sm:text-xl drop-shadow-lg">{nextEvent.titulo}</h4>
                              </div>
                            </div>
                          )}

                          {/* Content */}
                          <div className="p-4">
                            {!nextEvent.imagem && (
                              <>
                                <div className="flex items-center gap-2 mb-2">
                                  <motion.span 
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="text-red-400 text-sm font-semibold"
                                  >
                                    🔴 {t.reminder}
                                  </motion.span>
                                </div>
                                <h4 className="text-white font-bold text-xl mb-3">{nextEvent.titulo}</h4>
                              </>
                            )}
                            
                            {/* Date, Time, Location Grid */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              <div className="bg-white/10 rounded-lg px-2 sm:px-3 py-2 text-center">
                                <Calendar className="w-4 h-4 text-red-400 mx-auto mb-1" />
                                <p className="text-white font-medium text-xs sm:text-sm">{getRelativeDay(new Date(nextEvent.data))}</p>
                              </div>
                              <div className="bg-white/10 rounded-lg px-2 sm:px-3 py-2 text-center">
                                <Clock className="w-4 h-4 text-red-400 mx-auto mb-1" />
                                <p className="text-white font-medium text-xs sm:text-sm">{formatTime(new Date(nextEvent.data))}</p>
                              </div>
                              {nextEvent.local && (
                                <div className="bg-white/10 rounded-lg px-2 sm:px-3 py-2 text-center">
                                  <MapPin className="w-4 h-4 text-red-400 mx-auto mb-1" />
                                  <p className="text-white font-medium text-xs sm:text-sm truncate">{nextEvent.local}</p>
                                </div>
                              )}
                            </div>

                            {/* Preacher & Worship */}
                            {(nextEvent.pregador || nextEvent.cantores) && (
                              <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-xl p-3 border border-amber-500/20 mb-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {nextEvent.pregador && (
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                                        <Mic className="w-5 h-5 text-white" />
                                      </div>
                                      <div>
                                        <p className="text-amber-400 text-xs font-medium">{t.preacher}</p>
                                        <p className="text-white font-bold">{nextEvent.pregador}</p>
                                      </div>
                                    </div>
                                  )}
                                  {nextEvent.cantores && (
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <Music className="w-5 h-5 text-white" />
                                      </div>
                                      <div>
                                        <p className="text-purple-400 text-xs font-medium">{t.worship}</p>
                                        <p className="text-white font-bold">{nextEvent.cantores}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Countdown */}
                            {timeUntilNext.days < 7 && (
                              <div className="bg-red-500/20 rounded-xl p-3 sm:p-4 border border-red-500/30">
                                <p className="text-gray-300 text-xs sm:text-sm mb-2 flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-red-400" />
                                  {t.startsIn}
                                </p>
                                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                  <div className="text-center">
                                    <span className="text-xl sm:text-3xl font-bold text-red-400">{timeUntilNext.days}</span>
                                    <p className="text-gray-400 text-xs">{t.days}</p>
                                  </div>
                                  <div className="text-center">
                                    <span className="text-xl sm:text-3xl font-bold text-red-400">{timeUntilNext.hours}</span>
                                    <p className="text-gray-400 text-xs">{t.hours}</p>
                                  </div>
                                  <div className="text-center">
                                    <span className="text-xl sm:text-3xl font-bold text-red-400">{timeUntilNext.minutes}</span>
                                    <p className="text-gray-400 text-xs">{t.minutes}</p>
                                  </div>
                                  <div className="text-center">
                                    <motion.span 
                                      key={timeUntilNext.seconds}
                                      initial={{ scale: 1.2 }}
                                      animate={{ scale: 1 }}
                                      className="text-xl sm:text-3xl font-bold text-red-400"
                                    >
                                      {timeUntilNext.seconds}
                                    </motion.span>
                                    <p className="text-gray-400 text-xs">{t.seconds}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Click to view details */}
                            <div className="mt-4 flex items-center justify-center gap-2 text-red-400">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm font-medium">Clique para ver detalhes completos</span>
                              <ChevronDown className="w-4 h-4 animate-bounce" />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {/* This Week Section */}
                    {thisWeekEvents.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Calendar className="w-5 h-5 text-red-400" />
                          <h4 className="text-white font-bold text-lg">{t.thisWeek}</h4>
                          <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                            {thisWeekEvents.length} eventos
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {thisWeekEvents.map((event, index) => (
                            <EventCard key={event.id} event={event} index={index} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upcoming Events Section (after this week) */}
                    {futureEvents.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Users className="w-5 h-5 text-purple-400" />
                          <h4 className="text-white font-bold text-lg">{t.upcomingEvents}</h4>
                          <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full">
                            {futureEvents.length} eventos
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {futureEvents.map((event, index) => (
                            <EventCard key={event.id} event={event} index={index} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Events */}
                    {upcomingEvents.length === 0 && (
                      <div className="text-center py-12 text-gray-400">
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">{t.noEvents}</p>
                      </div>
                    )}
                  </div>

                  {/* Footer - Opens Agenda Completa */}
                  <div className="p-4 bg-slate-800/50 border-t border-white/10 flex-shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenAgenda) {
                          onOpenAgenda();
                        } else {
                          onViewAll();
                        }
                      }}
                      className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-400 hover:to-rose-500 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
                    >
                      📅 {t.viewAll}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Floating Alert Button Component with Quick Confirm Presence - RED THEME
export function ServiceAlertButton({ 
  onClick, 
  hasUpcoming, 
  nextEvent,
  onOpenAgenda
}: { 
  onClick: () => void; 
  hasUpcoming: boolean;
  nextEvent?: EventoCulto | null;
  onOpenAgenda?: () => void;
}) {
  const { language } = useLanguage();
  const [showQuickConfirm, setShowQuickConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({ nome: '', telefone: '' });
  const [sending, setSending] = useState(false);
  const [notificationsSent, setNotificationsSent] = useState({ whatsapp: false, sms: false, email: false });
  const [complete, setComplete] = useState(false);

  const t = {
    pt: {
      confirmPresence: 'Confirmar Presença',
      yourName: 'Seu Nome Completo',
      yourPhone: 'WhatsApp / Telemóvel',
      confirm: 'Confirmar Presença',
      sending: 'Enviando...',
      close: 'Fechar',
      cancel: 'Cancelar',
      presenceConfirmed: 'Presença Confirmada!',
      thankYou: 'Obrigado por confirmar!',
      notificationsSent: 'Notificações enviadas:',
      whatsapp: 'WhatsApp',
      sms: 'SMS',
      email: 'E-mail',
      sent: 'Enviado',
      nextEvent: 'Próximo Evento',
      noEvents: 'Sem eventos próximos',
      viewEvents: 'Ver Eventos',
    },
    en: {
      confirmPresence: 'Confirm Presence',
      yourName: 'Your Full Name',
      yourPhone: 'WhatsApp / Phone',
      confirm: 'Confirm Presence',
      sending: 'Sending...',
      close: 'Close',
      cancel: 'Cancel',
      presenceConfirmed: 'Presence Confirmed!',
      thankYou: 'Thank you for confirming!',
      notificationsSent: 'Notifications sent:',
      whatsapp: 'WhatsApp',
      sms: 'SMS',
      email: 'E-mail',
      sent: 'Sent',
      nextEvent: 'Next Event',
      noEvents: 'No upcoming events',
      viewEvents: 'View Events',
    },
    es: {
      confirmPresence: 'Confirmar Presencia',
      yourName: 'Tu Nombre Completo',
      yourPhone: 'WhatsApp / Teléfono',
      confirm: 'Confirmar Presencia',
      sending: 'Enviando...',
      close: 'Cerrar',
      cancel: 'Cancelar',
      presenceConfirmed: '¡Presencia Confirmada!',
      thankYou: '¡Gracias por confirmar!',
      notificationsSent: 'Notificaciones enviadas:',
      whatsapp: 'WhatsApp',
      sms: 'SMS',
      email: 'E-mail',
      sent: 'Enviado',
      nextEvent: 'Próximo Evento',
      noEvents: 'Sin eventos próximos',
      viewEvents: 'Ver Eventos',
    },
  }[language];

  const handleConfirm = () => {
    if (confirmData.nome.length < 3 || confirmData.telefone.length < 9) return;
    
    setSending(true);
    
    // Simulate sending notifications
    setTimeout(() => {
      setNotificationsSent(prev => ({ ...prev, whatsapp: true }));
    }, 800);
    
    setTimeout(() => {
      setNotificationsSent(prev => ({ ...prev, sms: true }));
    }, 1500);
    
    setTimeout(() => {
      setNotificationsSent(prev => ({ ...prev, email: true }));
    }, 2200);
    
    setTimeout(() => {
      setSending(false);
      setComplete(true);
    }, 2500);
  };

  const handleClose = () => {
    setShowQuickConfirm(false);
    setConfirmData({ nome: '', telefone: '' });
    setSending(false);
    setNotificationsSent({ whatsapp: false, sms: false, email: false });
    setComplete(false);
  };

  const formatEventDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(
      language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US',
      { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
    );
  };

  return (
    <>
      {/* Main Floating Button */}
      <motion.button
        onClick={() => hasUpcoming && nextEvent ? setShowQuickConfirm(true) : onClick()}
        onContextMenu={(e) => { e.preventDefault(); onClick(); }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-full shadow-lg shadow-red-500/40 flex items-center justify-center group"
      >
        {hasUpcoming && (
          <>
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-red-500 rounded-full"
            />
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-red-500 flex items-center justify-center"
            >
              <span className="text-xs text-red-500 font-bold">!</span>
            </motion.span>
          </>
        )}
        
        <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:animate-pulse" />
      </motion.button>

      {/* Quick Confirm Modal */}
      <AnimatePresence>
        {showQuickConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full sm:max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {!complete ? (
                <>
                  {/* Header */}
                  <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-rose-600 p-4 sm:p-6">
                    <button
                      onClick={handleClose}
                      className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                      >
                        <Heart className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{t.confirmPresence}</h3>
                        <p className="text-white/70 text-sm">Preencha seus dados</p>
                      </div>
                    </div>
                  </div>

                  {/* Event Info */}
                  {nextEvent && (
                    <div className="px-4 sm:px-6 pt-4">
                      <div className="bg-gradient-to-r from-red-500/20 to-rose-500/10 border border-red-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          <span className="text-red-400 text-xs font-semibold">{t.nextEvent}</span>
                        </div>
                        <h4 className="text-white font-bold text-lg mb-2">{nextEvent.titulo}</h4>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="flex items-center gap-1 text-gray-300">
                            <Calendar className="w-4 h-4 text-red-400" />
                            {formatEventDate(nextEvent.data)}
                          </span>
                          {nextEvent.local && (
                            <span className="flex items-center gap-1 text-gray-300">
                              <MapPin className="w-4 h-4 text-red-400" />
                              {nextEvent.local}
                            </span>
                          )}
                        </div>
                        {nextEvent.pregador && (
                          <div className="flex items-center gap-2 mt-3 text-sm">
                            <Mic className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-400">{nextEvent.pregador}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <div className="p-4 sm:p-6 space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        {t.yourName} *
                      </label>
                      <input
                        type="text"
                        value={confirmData.nome}
                        onChange={(e) => setConfirmData({ ...confirmData, nome: e.target.value })}
                        placeholder="Ex: João Silva"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      />
                    </div>

                    {/* Phone with Portugal Prefix */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        <Smartphone className="w-4 h-4 inline mr-2" />
                        {t.yourPhone} * 🇵🇹
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 py-3 bg-slate-600 border border-r-0 border-slate-600 rounded-l-xl text-gray-300 text-sm font-medium">
                          🇵🇹 +351
                        </span>
                        <input
                          type="tel"
                          value={confirmData.telefone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setConfirmData({ ...confirmData, telefone: value });
                          }}
                          placeholder="912 345 678"
                          className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-r-xl text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                        />
                      </div>
                      <p className="text-gray-500 text-xs mt-1">🇧🇷 Brasil: +55 | 🇵🇹 Portugal: +351</p>
                    </div>

                    {/* Sending Status */}
                    {sending && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        {/* WhatsApp */}
                        <div className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                          notificationsSent.whatsapp ? 'bg-green-500/20' : 'bg-slate-700/30'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            notificationsSent.whatsapp ? 'bg-green-500' : 'bg-gray-600'
                          }`}>
                            {notificationsSent.whatsapp ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <Loader2 className="w-4 h-4 text-white animate-spin" />
                            )}
                          </div>
                          <span className="text-white text-sm flex-1">WhatsApp</span>
                          {notificationsSent.whatsapp && (
                            <span className="text-green-400 text-xs">✓ {t.sent}</span>
                          )}
                        </div>

                        {/* SMS */}
                        <div className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                          notificationsSent.sms ? 'bg-purple-500/20' : 'bg-slate-700/30'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            notificationsSent.sms ? 'bg-purple-500' : 'bg-gray-600'
                          }`}>
                            {notificationsSent.sms ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <Loader2 className="w-4 h-4 text-white animate-spin" />
                            )}
                          </div>
                          <span className="text-white text-sm flex-1">SMS</span>
                          {notificationsSent.sms && (
                            <span className="text-purple-400 text-xs">✓ {t.sent}</span>
                          )}
                        </div>

                        {/* Email */}
                        <div className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                          notificationsSent.email ? 'bg-blue-500/20' : 'bg-slate-700/30'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            notificationsSent.email ? 'bg-blue-500' : 'bg-gray-600'
                          }`}>
                            {notificationsSent.email ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <Loader2 className="w-4 h-4 text-white animate-spin" />
                            )}
                          </div>
                          <span className="text-white text-sm flex-1">E-mail</span>
                          {notificationsSent.email && (
                            <span className="text-blue-400 text-xs">✓ {t.sent}</span>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleClose}
                        className="flex-1 py-3 bg-slate-600 text-white font-medium rounded-xl hover:bg-slate-500 transition-all"
                      >
                        {t.cancel}
                      </button>
                      <button
                        onClick={handleConfirm}
                        disabled={confirmData.nome.length < 3 || confirmData.telefone.length < 9 || sending}
                        className={`flex-1 py-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                          confirmData.nome.length >= 3 && confirmData.telefone.length >= 9 && !sending
                            ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500 shadow-lg shadow-red-500/30'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {sending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t.sending}
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            {t.confirm}
                          </>
                        )}
                      </button>
                    </div>

                    {/* View All Events Link - Opens Agenda Completa */}
                    <button
                      onClick={() => { handleClose(); onOpenAgenda ? onOpenAgenda() : onClick(); }}
                      className="w-full py-2 text-red-400 hover:text-red-300 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      📅 {t.viewEvents}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                /* Success State */
                <div className="p-6 text-center">
                  {/* Confetti */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ 
                          y: -20, 
                          x: Math.random() * 400 - 200,
                          opacity: 1,
                          rotate: 0
                        }}
                        animate={{ 
                          y: 500,
                          opacity: 0,
                          rotate: Math.random() * 360
                        }}
                        transition={{ 
                          duration: 2 + Math.random() * 2,
                          delay: Math.random() * 0.5
                        }}
                        className={`absolute w-3 h-3 rounded-full ${
                          ['bg-green-400', 'bg-emerald-400', 'bg-yellow-400', 'bg-red-400', 'bg-white'][Math.floor(Math.random() * 5)]
                        }`}
                        style={{ left: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>

                  <h4 className="text-white font-bold text-2xl mb-2">{t.presenceConfirmed} 🎉</h4>
                  <p className="text-gray-300 mb-2">
                    Olá <span className="text-green-400 font-bold">{confirmData.nome.split(' ')[0]}</span>!
                  </p>
                  <p className="text-gray-400 mb-6">{t.thankYou}</p>

                  {/* WhatsApp Preview */}
                  {nextEvent && (
                    <div className="bg-slate-800 rounded-xl p-4 mb-6 text-left">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium text-sm">WhatsApp</span>
                        <span className="text-green-400 text-xs ml-auto">✓✓</span>
                      </div>
                      <div className="bg-green-600/20 rounded-lg p-3 border-l-4 border-green-500">
                        <p className="text-white text-sm">🙏 <strong>Igreja Cristã</strong></p>
                        <p className="text-gray-300 text-sm mt-2">
                          Olá <strong>{confirmData.nome.split(' ')[0]}</strong>! 👋
                        </p>
                        <p className="text-gray-300 text-sm mt-1">
                          Obrigado por confirmar presença no evento: <strong>{nextEvent.titulo}</strong>!
                        </p>
                        <p className="text-gray-300 text-sm mt-1">
                          📅 {formatEventDate(nextEvent.data)}
                        </p>
                        <p className="text-gray-300 text-sm mt-1">
                          Te esperamos! 🙌✨
                        </p>
                        <p className="text-gray-400 text-xs mt-2 text-right">
                          {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} ✓✓
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Notifications Summary */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-green-500/20 rounded-lg p-3 text-center">
                      <MessageCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                      <p className="text-white text-xs">{t.whatsapp}</p>
                      <p className="text-green-400 text-xs">✓</p>
                    </div>
                    <div className="bg-purple-500/20 rounded-lg p-3 text-center">
                      <Smartphone className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                      <p className="text-white text-xs">{t.sms}</p>
                      <p className="text-purple-400 text-xs">✓</p>
                    </div>
                    <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                      <Mail className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-white text-xs">{t.email}</p>
                      <p className="text-blue-400 text-xs">✓</p>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">📱 +351 {confirmData.telefone}</p>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all"
                  >
                    {t.close}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
