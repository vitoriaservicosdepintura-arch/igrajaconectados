import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, Heart, BookOpen, Bell,
  MessageCircle, Youtube, Instagram, Facebook,
  Globe, Menu, X, MapPin, Clock, ChevronRight,
  Play, Phone, Mail, ChevronDown, Star, Mic,
  Music, Share2, CreditCard, Building2, Smartphone,
  Gift, Check, Send
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useChurchData } from '@/contexts/ChurchDataContext';
import { Bible3D } from './Bible3D';
import { ServiceReminder, ServiceAlertButton } from './ServiceReminder';
import type { Language, EventoCulto } from '@/types';

// Using EventoCulto type for ServiceReminder

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

// Event type for landing page - using context data

export function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  const { language, setLanguage, t } = useLanguage();
  const { 
    eventos: eventosContext, 
    fotos: fotosContext, 
    videos: videosContext, 
    doacoes: doacoesContext,
    addPresenca,
    addDoacao 
  } = useChurchData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmForm, setConfirmForm] = useState({ nome: '', telefone: '', eventId: '' });
  const [confirmSent, setConfirmSent] = useState(false);
  const [sendingNotifications, setSendingNotifications] = useState(false);
  
  // Donation Modal States
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationForm, setDonationForm] = useState({
    nome: '',
    whatsapp: '+351 ',
    email: '',
    tipo: 'oferta' as 'dizimo' | 'oferta',
    valor: '',
    metodo: '' as '' | 'mbway' | 'iban' | 'pix',
    mensagem: ''
  });
  const [donationStep, setDonationStep] = useState<'form' | 'processing' | 'success'>('form');
  const [notificationsSent, setNotificationsSent] = useState({
    whatsapp: false,
    sms: false,
    email: false
  });
  
  // Service Reminder States
  const [showServiceReminder, setShowServiceReminder] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  // Church info
  const churchInfo = {
    name: 'Igreja Cristã Nova Vida',
    slogan: 'Transformando vidas através do amor de Cristo',
    address: 'Rua da Esperança, 123 - Lisboa, Portugal',
    phone: '+351 912 345 678',
    email: 'contato@igrejanovavida.pt',
    instagram: '@igrejanovavida',
    youtube: 'Igreja Nova Vida',
    facebook: 'Igreja Nova Vida Lisboa'
  };

  // Use events from context (created by admin)
  const eventos = eventosContext.map(e => ({
    id: String(e.id),
    igreja_id: String(e.igreja_id),
    titulo: e.titulo,
    descricao: e.descricao,
    data: e.data + 'T' + (e.horario || '10:00'),
    tipo: e.tipo,
    imagem: e.imagem || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800',
    local: e.local || 'Templo Principal',
    pregador: e.pregador || '',
    cantores: e.cantores || ''
  }));

  // Convert events for ServiceReminder
  const eventosParaReminder: EventoCulto[] = eventosContext.map(e => ({
    id: e.id,
    igreja_id: e.igreja_id,
    titulo: e.titulo,
    descricao: e.descricao || '',
    data: new Date(e.data + 'T' + (e.horario || '10:00')),
    tipo: e.tipo,
    imagem: e.imagem,
    local: e.local,
    pregador: e.pregador,
    cantores: e.cantores
  }));

  // Get next event for the alert button
  const now = new Date();
  const upcomingEvents = eventosParaReminder.filter(e => new Date(e.data) > now).sort((a, b) => 
    new Date(a.data).getTime() - new Date(b.data).getTime()
  );
  const nextEvent = upcomingEvents[0] || null;

  // Use photos from context (created by admin)
  const galeriaFotos = fotosContext.map(f => ({
    id: String(f.id),
    url: f.url,
    titulo: f.titulo
  }));

  // Use videos from context (created by admin)
  const videos = videosContext.map(v => ({
    id: String(v.id),
    thumbnail: v.thumbnail,
    titulo: v.titulo,
    duracao: '30:00'
  }));

  // Ministries
  const ministerios = [
    { nome: 'Louvor', icon: Music, cor: 'from-purple-500 to-pink-500' },
    { nome: 'Jovens', icon: Users, cor: 'from-blue-500 to-cyan-500' },
    { nome: 'Crianças', icon: BookOpen, cor: 'from-yellow-500 to-orange-500' },
    { nome: 'Família', icon: Heart, cor: 'from-red-500 to-rose-500' },
  ];

  // Scroll handler for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'eventos', 'sobre', 'galeria', 'contato'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format date helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    const isHoje = date.toDateString() === hoje.toDateString();
    const isAmanha = date.toDateString() === amanha.toDateString();
    
    if (isHoje) return { label: 'HOJE', urgent: true };
    if (isAmanha) return { label: 'AMANHÃ', urgent: false };
    
    return { 
      label: date.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' }),
      urgent: false 
    };
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  };

  // Handle confirm presence
  const handleConfirmPresence = (eventId: string) => {
    setConfirmForm({ nome: '', telefone: '+351 ', eventId });
    setShowConfirmModal(true);
    setConfirmSent(false);
  };

  const handleSubmitConfirm = () => {
    if (confirmForm.nome.length < 3 || confirmForm.telefone.length < 13) return;
    
    setSendingNotifications(true);
    
    // Save presence to context
    addPresenca({
      evento_id: parseInt(confirmForm.eventId),
      nome: confirmForm.nome,
      whatsapp: confirmForm.telefone,
      data_confirmacao: new Date().toISOString()
    });
    
    setTimeout(() => {
      setSendingNotifications(false);
      setConfirmSent(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">✝</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-bold text-lg">{churchInfo.name}</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {[
                { id: 'home', label: 'Início' },
                { id: 'eventos', label: 'Eventos' },
                { id: 'sobre', label: 'Sobre' },
                { id: 'galeria', label: 'Galeria' },
                { id: 'contato', label: 'Contato' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.id ? 'text-indigo-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>{languages.find(l => l.code === language)?.flag}</span>
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        language === lang.code ? 'text-indigo-400' : 'text-gray-300'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={onLogin} className="text-gray-300 hover:text-white transition-colors text-sm">
                {t('nav.login')}
              </button>
              <button
                onClick={onRegister}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm rounded-lg hover:from-indigo-400 hover:to-purple-500 transition-all"
              >
                Área Admin
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-800 border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {[
                  { id: 'home', label: 'Início' },
                  { id: 'eventos', label: 'Eventos' },
                  { id: 'sobre', label: 'Sobre' },
                  { id: 'galeria', label: 'Galeria' },
                  { id: 'contato', label: 'Contato' },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 ${activeSection === item.id ? 'text-indigo-400' : 'text-gray-300'}`}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`px-3 py-1 rounded ${language === lang.code ? 'bg-indigo-600 text-white' : 'text-gray-300'}`}
                    >
                      {lang.flag}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={onLogin} className="flex-1 py-2 text-center text-gray-300 border border-gray-600 rounded-lg text-sm">
                    Entrar
                  </button>
                  <button onClick={onRegister} className="flex-1 py-2 text-center bg-indigo-600 text-white rounded-lg text-sm">
                    Área Admin
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 px-4 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-sm mb-6"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Culto ao vivo aos Domingos às 10h
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {churchInfo.name}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl text-indigo-300 font-light mb-6"
              >
                {churchInfo.slogan}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Seja bem-vindo à nossa comunidade! Aqui você encontra amor, esperança e a palavra de Deus 
                que transforma vidas. Junte-se a nós nos nossos cultos e eventos.
              </motion.p>

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8"
              >
                <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-4 py-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm">Lisboa, Portugal</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-4 py-2 rounded-lg">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm">Dom. 10h | Qua. 19h30</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <a
                  href="#eventos"
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-400 hover:to-rose-500 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Ver Próximos Cultos
                </a>
                <a
                  href="#galeria"
                  className="px-6 py-3 border border-indigo-400/50 text-indigo-300 font-semibold rounded-xl hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Assistir Cultos
                </a>
              </motion.div>

              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex gap-4 justify-center lg:justify-start mt-8"
              >
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-all">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition-all">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </motion.div>
            </motion.div>

            {/* Right - Bible 3D */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="order-first lg:order-last"
            >
              <Bible3D />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="hidden lg:flex justify-center mt-8"
          >
            <a href="#eventos" className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <span className="text-sm">Ver mais</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="eventos" className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              📅 Próximos Cultos e Eventos
            </h2>
            <p className="text-gray-400 text-lg">Confira nossa agenda e venha participar!</p>
            {eventos.length > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full text-green-400 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                {eventos.length} evento{eventos.length !== 1 ? 's' : ''} programado{eventos.length !== 1 ? 's' : ''}
              </div>
            )}
          </motion.div>

          {/* Empty State - No Events */}
          {eventos.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center py-16 bg-white/5 rounded-2xl border border-white/10"
            >
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Em breve novos eventos</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Nossa agenda está sendo preparada com muito carinho. 
                Volte em breve para conferir nossos próximos cultos e eventos!
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <a 
                  href="#contato" 
                  className="px-6 py-3 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/30 transition-all"
                >
                  Entre em Contato
                </a>
              </div>
            </motion.div>
          )}

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {eventos.map((evento, index) => {
              const dateInfo = formatDate(evento.data);
              return (
                <motion.div
                  key={evento.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group bg-white/5 backdrop-blur-sm border rounded-2xl overflow-hidden hover:bg-white/10 transition-all ${
                    dateInfo.urgent ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/10'
                  }`}
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={evento.imagem}
                      alt={evento.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {dateInfo.urgent && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                          🔴 HOJE!
                        </span>
                      )}
                      {dateInfo.label === 'AMANHÃ' && (
                        <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                          AMANHÃ
                        </span>
                      )}
                      <span className={`px-3 py-1 text-white text-xs font-bold rounded-full ${
                        evento.tipo === 'culto' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}>
                        {evento.tipo === 'culto' ? '⛪ Culto' : '🎉 Evento'}
                      </span>
                    </div>

                    {/* Title on image */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">{evento.titulo}</h3>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-5">
                    {/* Date, Time, Location */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <Calendar className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                        <span className="text-white text-xs font-medium">{dateInfo.label}</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <Clock className="w-4 h-4 text-green-400 mx-auto mb-1" />
                        <span className="text-white text-xs font-medium">{formatTime(evento.data)}</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <MapPin className="w-4 h-4 text-red-400 mx-auto mb-1" />
                        <span className="text-white text-xs font-medium truncate block">{evento.local}</span>
                      </div>
                    </div>

                    {/* Preacher and Singers */}
                    <div className="space-y-2 mb-4">
                      {evento.pregador && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                            <Mic className="w-3 h-3 text-amber-400" />
                          </div>
                          <span className="text-gray-400">Pregador:</span>
                          <span className="text-white font-medium">{evento.pregador}</span>
                        </div>
                      )}
                      {evento.cantores && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <Music className="w-3 h-3 text-purple-400" />
                          </div>
                          <span className="text-gray-400">Louvor:</span>
                          <span className="text-white font-medium">{evento.cantores}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{evento.descricao}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmPresence(evento.id)}
                        className="flex-1 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-medium rounded-lg hover:from-red-400 hover:to-rose-500 transition-all flex items-center justify-center gap-2"
                      >
                        <Heart className="w-4 h-4" />
                        Confirmar Presença
                      </button>
                      <button className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-all">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                🏛️ Sobre Nossa Igreja
              </h2>
              <p className="text-gray-400 mb-6">
                A Igreja Cristã Nova Vida é uma comunidade de fé dedicada a transformar vidas através do amor de Cristo. 
                Fundada em 2005, temos sido um farol de esperança em Lisboa, acolhendo pessoas de todas as idades e origens.
              </p>
              <p className="text-gray-400 mb-8">
                Nossa missão é proclamar o evangelho, edificar vidas através da Palavra de Deus e servir nossa comunidade 
                com amor e compaixão. Acreditamos que cada pessoa é especial para Deus e tem um propósito único.
              </p>

              {/* Ministries */}
              <div className="grid grid-cols-2 gap-4">
                {ministerios.map((ministerio, index) => (
                  <motion.div
                    key={ministerio.nome}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 flex items-center gap-3 hover:bg-white/10 transition-all"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${ministerio.cor} rounded-lg flex items-center justify-center`}>
                      <ministerio.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium">{ministerio.nome}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600"
                  alt="Igreja"
                  className="rounded-2xl w-full h-48 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600"
                  alt="Louvor"
                  className="rounded-2xl w-full h-32 object-cover"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600"
                  alt="Oração"
                  className="rounded-2xl w-full h-32 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600"
                  alt="Família"
                  className="rounded-2xl w-full h-48 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              📸 Galeria de Fotos
            </h2>
            <p className="text-gray-400 text-lg">Momentos especiais da nossa comunidade</p>
            {(galeriaFotos.length > 0 || videos.length > 0) && (
              <div className="mt-4 inline-flex items-center gap-4 text-sm">
                {galeriaFotos.length > 0 && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                    📷 {galeriaFotos.length} foto{galeriaFotos.length !== 1 ? 's' : ''}
                  </span>
                )}
                {videos.length > 0 && (
                  <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full">
                    🎬 {videos.length} vídeo{videos.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}
          </motion.div>

          {/* Empty State - No Photos */}
          {galeriaFotos.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 mb-12"
            >
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Galeria em construção</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Em breve compartilharemos fotos dos nossos cultos, eventos e momentos especiais da nossa comunidade.
              </p>
            </motion.div>
          )}

          {/* Photos Grid */}
          {galeriaFotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {galeriaFotos.map((foto, index) => (
                <motion.div
                  key={foto.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={foto.url}
                    alt={foto.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white font-medium">{foto.titulo}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Videos Section */}
          {videos.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h3 className="text-2xl font-bold text-white mb-4">🎬 Vídeos Recentes</h3>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.titulo}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/30 transition-all">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                      <h4 className="text-white font-medium">{video.titulo}</h4>
                      <span className="text-gray-300 text-sm">{video.duracao}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-3xl p-8 md:p-12 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              💛 Contribua com Nossa Missão
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Sua oferta ajuda a manter nossos ministérios, projetos sociais e a levar a palavra de Deus a mais pessoas.
              Cada contribuição faz a diferença!
            </p>
            <button
              onClick={() => {
                setShowDonationModal(true);
                setDonationStep('form');
                setDonationForm({
                  nome: '',
                  whatsapp: '+351 ',
                  email: '',
                  tipo: 'oferta',
                  valor: '',
                  metodo: '',
                  mensagem: ''
                });
              }}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg flex items-center gap-2 mx-auto"
            >
              <Heart className="w-5 h-5" />
              Fazer uma Doação
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Mural de Gratidão - Doações Públicas */}
          {doacoesContext.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  🙏 Mural de Gratidão
                </h3>
                <p className="text-gray-400">Agradecemos a todos que contribuem com nossa missão</p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full text-green-400 text-sm">
                  <Heart className="w-4 h-4 animate-pulse" />
                  {doacoesContext.length} doaç{doacoesContext.length !== 1 ? 'ões' : 'ão'} recebida{doacoesContext.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Grid de Doações */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doacoesContext.slice().reverse().slice(0, 9).map((doacao, index) => {
                  const primeiroNome = doacao.nome_doador?.split(' ')[0] || 'Anônimo';
                  const dataDoacao = new Date(doacao.data);
                  const dataFormatada = dataDoacao.toLocaleDateString('pt-PT', { 
                    day: 'numeric', 
                    month: 'short',
                    year: 'numeric'
                  });
                  
                  return (
                    <motion.div
                      key={doacao.id || index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative bg-gradient-to-br ${
                        doacao.tipo === 'dizimo' 
                          ? 'from-blue-500/20 to-indigo-500/20 border-blue-500/30' 
                          : 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
                      } border rounded-2xl p-5 overflow-hidden group hover:scale-[1.02] transition-transform`}
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
                      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
                      
                      {/* Header with Avatar and Name */}
                      <div className="flex items-start gap-3 mb-4 relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white ${
                          doacao.tipo === 'dizimo' 
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                            : 'bg-gradient-to-br from-purple-500 to-pink-600'
                        }`}>
                          {primeiroNome.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg">{primeiroNome}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{dataFormatada}</span>
                            <span className={`px-2 py-0.5 rounded-full ${
                              doacao.tipo === 'dizimo' 
                                ? 'bg-blue-500/30 text-blue-300' 
                                : 'bg-purple-500/30 text-purple-300'
                            }`}>
                              {doacao.tipo === 'dizimo' ? '📖 Dízimo' : '💜 Oferta'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Valor */}
                      <div className="mb-4 relative z-10">
                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                          €{doacao.valor.toFixed(2)}
                        </span>
                      </div>

                      {/* Mensagem do Doador */}
                      {doacao.mensagem && (
                        <div className="mb-4 relative z-10">
                          <p className="text-gray-300 text-sm italic">
                            "{doacao.mensagem}"
                          </p>
                        </div>
                      )}

                      {/* Mensagem de Agradecimento */}
                      <div className={`p-3 rounded-lg ${
                        doacao.tipo === 'dizimo' 
                          ? 'bg-blue-500/10' 
                          : 'bg-purple-500/10'
                      } relative z-10`}>
                        <p className="text-gray-300 text-sm">
                          <span className="text-amber-400">✨</span> Obrigado, <span className="text-white font-medium">{primeiroNome}</span>! 
                          Sua generosidade abençoa vidas e fortalece nossa missão. 
                          Que Deus multiplique suas bênçãos! 🙏
                        </p>
                      </div>

                      {/* Badge de método */}
                      <div className="mt-3 flex items-center justify-between relative z-10">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          doacao.metodo === 'mbway' ? 'bg-red-500/20 text-red-300' :
                          doacao.metodo === 'pix' ? 'bg-green-500/20 text-green-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {doacao.metodo === 'mbway' ? '📱 MB WAY' : 
                           doacao.metodo === 'pix' ? '💚 PIX' : 
                           '🏦 IBAN'}
                        </span>
                        <span className="text-green-400 text-xs flex items-center gap-1">
                          <Check className="w-3 h-3" /> Confirmado
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Ver mais doações */}
              {doacoesContext.length > 9 && (
                <div className="text-center mt-8">
                  <p className="text-gray-400 text-sm">
                    E mais {doacoesContext.length - 9} doaç{doacoesContext.length - 9 !== 1 ? 'ões' : 'ão'} de irmãos generosos 💛
                  </p>
                </div>
              )}

              {/* Total arrecadado */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 text-center p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl"
              >
                <p className="text-gray-400 text-sm mb-2">Total de bênçãos recebidas este mês</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  €{doacoesContext.reduce((acc, d) => acc + d.valor, 0).toFixed(2)}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  "Cada um contribua segundo propôs no seu coração" - 2 Coríntios 9:7
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              📍 Encontre-nos
            </h2>
            <p className="text-gray-400 text-lg">Venha nos visitar ou entre em contato</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl overflow-hidden h-80 md:h-full min-h-[300px]"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3113.2384829544254!2d-9.1373!3d38.7167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQzJzAwLjEiTiA5wrAwOCcxNC4zIlc!5e0!3m2!1spt-PT!2spt!4v1620000000000!5m2!1spt-PT!2spt"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">📞 Informações de Contato</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Endereço</span>
                      <p className="text-white">{churchInfo.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Telefone / WhatsApp</span>
                      <p className="text-white">{churchInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">E-mail</span>
                      <p className="text-white">{churchInfo.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">⏰ Horários dos Cultos</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Domingo</span>
                    <span className="text-white font-medium">10h00 e 18h00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Quarta-feira</span>
                    <span className="text-white font-medium">19h30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Sexta-feira (Jovens)</span>
                    <span className="text-white font-medium">20h00</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">🌐 Redes Sociais</h3>
                <div className="flex gap-3">
                  <a href="#" className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center gap-2 text-white hover:opacity-90 transition-all">
                    <Instagram className="w-5 h-5" />
                    <span className="text-sm">Instagram</span>
                  </a>
                  <a href="#" className="flex-1 py-3 bg-red-600 rounded-xl flex items-center justify-center gap-2 text-white hover:opacity-90 transition-all">
                    <Youtube className="w-5 h-5" />
                    <span className="text-sm">YouTube</span>
                  </a>
                  <a href="#" className="flex-1 py-3 bg-blue-600 rounded-xl flex items-center justify-center gap-2 text-white hover:opacity-90 transition-all">
                    <Facebook className="w-5 h-5" />
                    <span className="text-sm">Facebook</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✝</span>
              </div>
              <span className="text-white font-bold">{churchInfo.name}</span>
            </div>
            <p className="text-gray-500 text-sm text-center">
              © 2024 {churchInfo.name}. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Termos</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/351912345678"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-400 transition-all"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </motion.a>

      {/* Floating Service Alert Button (Right side) */}
      <ServiceAlertButton
        onClick={() => setShowServiceReminder(true)}
        hasUpcoming={upcomingEvents.length > 0}
        nextEvent={nextEvent}
        onOpenAgenda={() => {
          const eventosSection = document.getElementById('eventos');
          if (eventosSection) {
            eventosSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Service Reminder Modal */}
      <ServiceReminder
        events={eventosParaReminder}
        isOpen={showServiceReminder}
        onClose={() => setShowServiceReminder(false)}
        onViewAll={() => {
          setShowServiceReminder(false);
          const eventosSection = document.getElementById('eventos');
          if (eventosSection) {
            eventosSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenAgenda={() => {
          setShowServiceReminder(false);
          const eventosSection = document.getElementById('eventos');
          if (eventosSection) {
            eventosSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Confirm Presence Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden"
            >
              {!confirmSent ? (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Confirmar Presença</h3>
                    <p className="text-white/80 text-sm mt-1">
                      {eventos.find(e => e.id === confirmForm.eventId)?.titulo}
                    </p>
                  </div>

                  {/* Form */}
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        <Users className="w-4 h-4 inline mr-2" />
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={confirmForm.nome}
                        onChange={(e) => setConfirmForm({ ...confirmForm, nome: e.target.value })}
                        placeholder="Seu nome completo"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        WhatsApp / Telemóvel *
                        <span className="ml-2 text-xs text-gray-500">🇵🇹 +351</span>
                      </label>
                      <input
                        type="tel"
                        value={confirmForm.telefone}
                        onChange={(e) => setConfirmForm({ ...confirmForm, telefone: e.target.value })}
                        placeholder="+351 912 345 678"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setShowConfirmModal(false)}
                        className="flex-1 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSubmitConfirm}
                        disabled={confirmForm.nome.length < 3 || confirmForm.telefone.length < 13 || sendingNotifications}
                        className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-400 hover:to-rose-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {sendingNotifications ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Heart className="w-4 h-4" />
                            Confirmar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Success State */
                <div className="p-8 text-center">
                  <div className="relative mb-6">
                    {/* Confetti */}
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 0, x: 0 }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          y: [-20, -60],
                          x: [0, (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 30)]
                        }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${
                          ['bg-red-400', 'bg-green-400', 'bg-yellow-400', 'bg-blue-400', 'bg-purple-400'][i % 5]
                        }`}
                      />
                    ))}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.3 }}
                      className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto"
                    >
                      <Star className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">Presença Confirmada! 🎉</h3>
                  <p className="text-gray-400 mb-6">
                    Olá <span className="text-white font-medium">{confirmForm.nome.split(' ')[0]}</span>! 
                    Obrigado por confirmar sua presença.
                  </p>

                  {/* Notification Preview */}
                  <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 mb-6 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium text-sm">Mensagem enviada via WhatsApp</span>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-sm">
                      <p className="text-gray-300">
                        🙏 <span className="font-bold text-white">{churchInfo.name}</span>
                      </p>
                      <p className="text-gray-300 mt-2">
                        Olá {confirmForm.nome.split(' ')[0]}! 👋
                      </p>
                      <p className="text-gray-300 mt-2">
                        Obrigado por confirmar presença no evento: <span className="text-white font-medium">{eventos.find(e => e.id === confirmForm.eventId)?.titulo}</span>
                      </p>
                      <p className="text-gray-300 mt-2">
                        Te esperamos com muito carinho! 🙌✨
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs text-gray-500 justify-center mb-6">
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 text-green-400" /> WhatsApp ✓</span>
                    <span className="flex items-center gap-1"><Bell className="w-3 h-3 text-purple-400" /> SMS ✓</span>
                  </div>

                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-400 hover:to-emerald-500 transition-all"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Donation Modal */}
      <AnimatePresence>
        {showDonationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowDonationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl w-full max-w-lg overflow-hidden my-4 max-h-[90vh] overflow-y-auto"
            >
              {donationStep === 'form' && (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Fazer uma Doação</h3>
                    <p className="text-white/80 text-sm mt-1">Contribua com nossa missão</p>
                  </div>

                  {/* Form */}
                  <div className="p-6 space-y-4">
                    {/* Nome e WhatsApp */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          <Users className="w-4 h-4 inline mr-2" />
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={donationForm.nome}
                          onChange={(e) => setDonationForm({ ...donationForm, nome: e.target.value })}
                          placeholder="Seu nome"
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          WhatsApp * <span className="text-xs text-gray-500">🇵🇹 +351</span>
                        </label>
                        <input
                          type="tel"
                          value={donationForm.whatsapp}
                          onChange={(e) => setDonationForm({ ...donationForm, whatsapp: e.target.value })}
                          placeholder="+351 912 345 678"
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        E-mail (opcional)
                      </label>
                      <input
                        type="email"
                        value={donationForm.email}
                        onChange={(e) => setDonationForm({ ...donationForm, email: e.target.value })}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Tipo de Contribuição */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Tipo de Contribuição</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setDonationForm({ ...donationForm, tipo: 'dizimo' })}
                          className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                            donationForm.tipo === 'dizimo'
                              ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                              : 'border-slate-600 text-gray-400 hover:border-slate-500'
                          }`}
                        >
                          <BookOpen className="w-5 h-5" />
                          <span className="font-medium">Dízimo</span>
                        </button>
                        <button
                          onClick={() => setDonationForm({ ...donationForm, tipo: 'oferta' })}
                          className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                            donationForm.tipo === 'oferta'
                              ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                              : 'border-slate-600 text-gray-400 hover:border-slate-500'
                          }`}
                        >
                          <Heart className="w-5 h-5" />
                          <span className="font-medium">Oferta</span>
                        </button>
                      </div>
                    </div>

                    {/* Valor */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        💛 Valor - O que seu coração falar
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-bold">€</span>
                        <input
                          type="number"
                          value={donationForm.valor}
                          onChange={(e) => setDonationForm({ ...donationForm, valor: e.target.value })}
                          placeholder="0,00"
                          className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-xl placeholder-gray-400 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      {/* Quick Values */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {[10, 25, 50, 100, 200].map((val) => (
                          <button
                            key={val}
                            onClick={() => setDonationForm({ ...donationForm, valor: String(val) })}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              donationForm.valor === String(val)
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                          >
                            €{val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Método de Pagamento */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Método de Pagamento</label>
                      <div className="grid grid-cols-3 gap-3">
                        {/* MB WAY */}
                        <button
                          onClick={() => setDonationForm({ ...donationForm, metodo: 'mbway' })}
                          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                            donationForm.metodo === 'mbway'
                              ? 'border-red-500 bg-red-500/20'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white text-xs font-medium">MB WAY</span>
                          <span className="text-gray-500 text-xs">🇵🇹</span>
                        </button>

                        {/* IBAN */}
                        <button
                          onClick={() => setDonationForm({ ...donationForm, metodo: 'iban' })}
                          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                            donationForm.metodo === 'iban'
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white text-xs font-medium">IBAN</span>
                          <span className="text-gray-500 text-xs">🇵🇹</span>
                        </button>

                        {/* PIX */}
                        <button
                          onClick={() => setDonationForm({ ...donationForm, metodo: 'pix' })}
                          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                            donationForm.metodo === 'pix'
                              ? 'border-green-500 bg-green-500/20'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white text-xs font-medium">PIX</span>
                          <span className="text-gray-500 text-xs">🇧🇷</span>
                        </button>
                      </div>

                      {/* Payment Details */}
                      {donationForm.metodo && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 p-4 bg-slate-700/50 rounded-lg"
                        >
                          {donationForm.metodo === 'mbway' && (
                            <div className="text-center">
                              <p className="text-gray-300 text-sm">Envie para o número:</p>
                              <p className="text-white font-bold text-lg mt-1">+351 912 345 678</p>
                              <p className="text-gray-500 text-xs mt-2">Receberá um pedido de pagamento no seu telemóvel</p>
                            </div>
                          )}
                          {donationForm.metodo === 'iban' && (
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">IBAN:</span>
                                <span className="text-white font-mono text-sm">PT50 0000 0000 0000 0000 0000 0</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">BIC/SWIFT:</span>
                                <span className="text-white font-mono text-sm">CGDIPTPL</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Titular:</span>
                                <span className="text-white text-sm">Igreja Cristã Nova Vida</span>
                              </div>
                            </div>
                          )}
                          {donationForm.metodo === 'pix' && (
                            <div className="text-center">
                              <p className="text-gray-300 text-sm">Chave PIX:</p>
                              <p className="text-white font-mono text-sm mt-1 bg-slate-600 p-2 rounded">igreja@novavida.com.br</p>
                              <button className="text-green-400 text-xs mt-2 hover:underline">📋 Copiar chave</button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Mensagem */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        <MessageCircle className="w-4 h-4 inline mr-2" />
                        Mensagem (opcional)
                      </label>
                      <textarea
                        value={donationForm.mensagem}
                        onChange={(e) => setDonationForm({ ...donationForm, mensagem: e.target.value })}
                        placeholder="Deixe uma mensagem de gratidão..."
                        rows={2}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setShowDonationModal(false)}
                        className="flex-1 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          if (donationForm.nome.length >= 3 && donationForm.whatsapp.length >= 13 && parseFloat(donationForm.valor) > 0 && donationForm.metodo) {
                            setDonationStep('processing');
                            setNotificationsSent({ whatsapp: false, sms: false, email: false });
                            
                            // Save donation to context/database
                            addDoacao({
                              igreja_id: 1,
                              membro_id: 0,
                              valor: parseFloat(donationForm.valor),
                              tipo: donationForm.tipo,
                              data: new Date().toISOString(),
                              metodo: donationForm.metodo as 'mbway' | 'iban' | 'pix',
                              nome_doador: donationForm.nome,
                              whatsapp_doador: donationForm.whatsapp,
                              email_doador: donationForm.email,
                              mensagem: donationForm.mensagem,
                              status: 'confirmado'
                            });
                            
                            // Simulate sending notifications
                            setTimeout(() => setNotificationsSent(prev => ({ ...prev, whatsapp: true })), 1000);
                            setTimeout(() => setNotificationsSent(prev => ({ ...prev, sms: true })), 1800);
                            setTimeout(() => {
                              setNotificationsSent(prev => ({ ...prev, email: true }));
                              setTimeout(() => setDonationStep('success'), 500);
                            }, 2500);
                          }
                        }}
                        disabled={donationForm.nome.length < 3 || donationForm.whatsapp.length < 13 || !parseFloat(donationForm.valor) || !donationForm.metodo}
                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Confirmar Doação
                      </button>
                    </div>

                    {/* Security Note */}
                    <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-1">
                      🔒 Pagamento seguro • Receberá confirmação via WhatsApp
                    </p>
                  </div>
                </>
              )}

              {donationStep === 'processing' && (
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-bold text-white">Processando Doação...</h3>
                    <p className="text-gray-400 text-sm mt-1">Enviando notificações de agradecimento</p>
                  </div>

                  <div className="space-y-4">
                    {/* WhatsApp */}
                    <div className={`flex items-center gap-4 p-4 rounded-lg ${notificationsSent.whatsapp ? 'bg-green-500/20' : 'bg-slate-700'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notificationsSent.whatsapp ? 'bg-green-500' : 'bg-slate-600'}`}>
                        {notificationsSent.whatsapp ? <Check className="w-5 h-5 text-white" /> : <MessageCircle className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div className="flex-1">
                        <span className="text-white font-medium">WhatsApp</span>
                        <p className="text-gray-400 text-sm">{donationForm.whatsapp}</p>
                      </div>
                      {notificationsSent.whatsapp && <span className="text-green-400 text-sm">✓ Enviado</span>}
                    </div>

                    {/* SMS */}
                    <div className={`flex items-center gap-4 p-4 rounded-lg ${notificationsSent.sms ? 'bg-purple-500/20' : 'bg-slate-700'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notificationsSent.sms ? 'bg-purple-500' : 'bg-slate-600'}`}>
                        {notificationsSent.sms ? <Check className="w-5 h-5 text-white" /> : <Smartphone className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div className="flex-1">
                        <span className="text-white font-medium">SMS</span>
                        <p className="text-gray-400 text-sm">{donationForm.whatsapp}</p>
                      </div>
                      {notificationsSent.sms && <span className="text-purple-400 text-sm">✓ Enviado</span>}
                    </div>

                    {/* Email */}
                    <div className={`flex items-center gap-4 p-4 rounded-lg ${notificationsSent.email ? 'bg-blue-500/20' : 'bg-slate-700'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notificationsSent.email ? 'bg-blue-500' : 'bg-slate-600'}`}>
                        {notificationsSent.email ? <Check className="w-5 h-5 text-white" /> : <Mail className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div className="flex-1">
                        <span className="text-white font-medium">E-mail</span>
                        <p className="text-gray-400 text-sm">{donationForm.email || 'Não informado'}</p>
                      </div>
                      {notificationsSent.email && <span className="text-blue-400 text-sm">✓ Enviado</span>}
                    </div>
                  </div>
                </div>
              )}

              {donationStep === 'success' && (
                <div className="p-8 text-center">
                  {/* Confetti */}
                  <div className="relative mb-6">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 0, x: 0 }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          y: [-20, -80],
                          x: [0, (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 40)]
                        }}
                        transition={{ duration: 2, delay: i * 0.1 }}
                        className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full ${
                          ['bg-amber-400', 'bg-green-400', 'bg-orange-400', 'bg-yellow-400', 'bg-red-400'][i % 5]
                        }`}
                      />
                    ))}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.3 }}
                      className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto"
                    >
                      <Check className="w-12 h-12 text-white" />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-2">Obrigado! 🙏</h3>
                    <p className="text-gray-400 mb-2">
                      {donationForm.nome.split(' ')[0]}, sua {donationForm.tipo === 'dizimo' ? 'dízimo' : 'oferta'} foi recebida!
                    </p>
                    <p className="text-3xl font-bold text-green-400 mb-6">€{donationForm.valor}</p>
                  </motion.div>

                  {/* WhatsApp Preview */}
                  <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 mb-6 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium text-sm">Mensagem enviada via WhatsApp</span>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-sm">
                      <p className="text-gray-300">
                        🙏 <span className="font-bold text-white">{churchInfo.name}</span>
                      </p>
                      <p className="text-gray-300 mt-2">
                        Olá <span className="font-bold text-white">{donationForm.nome.split(' ')[0]}</span>! 👋
                      </p>
                      <p className="text-gray-300 mt-2">
                        Recebemos sua {donationForm.tipo === 'dizimo' ? 'dízimo' : 'oferta'} de <span className="font-bold text-green-400">€{donationForm.valor}</span>!
                      </p>
                      <p className="text-gray-300 mt-2">
                        Agradecemos de coração sua generosidade. Que Deus multiplique suas bênçãos! 🙌✨
                      </p>
                      <p className="text-gray-500 text-xs mt-3 italic">
                        "Cada um dê conforme determinou em seu coração..." - 2 Coríntios 9:7
                      </p>
                    </div>
                  </div>

                  {/* Notifications Summary */}
                  <div className="flex justify-center gap-4 mb-6 text-xs">
                    <span className="flex items-center gap-1 text-green-400">
                      <MessageCircle className="w-4 h-4" /> WhatsApp ✓
                    </span>
                    <span className="flex items-center gap-1 text-purple-400">
                      <Smartphone className="w-4 h-4" /> SMS ✓
                    </span>
                    <span className="flex items-center gap-1 text-blue-400">
                      <Mail className="w-4 h-4" /> E-mail ✓
                    </span>
                  </div>

                  <button
                    onClick={() => setShowDonationModal(false)}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-400 hover:to-emerald-500 transition-all"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
