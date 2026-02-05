import { useState, useEffect, useCallback } from 'react';
import { translations, bibleVerses, quizQuestions } from './translations';

type Language = 'pt' | 'en' | 'es';
type Theme = 'white' | 'black' | 'orange' | 'blue';
type Section = 'home' | 'about' | 'events' | 'sundaySchool' | 'gallery' | 'donations' | 'members' | 'quiz' | 'contact' | 'admin';
type AdminTab = 'events' | 'sundaySchool' | 'gallery' | 'members';

interface Event {
  id: string;
  title: string;
  type: 'event' | 'worship';
  date: string;
  time: string;
  description: string;
  image: string;
  pastor: string;
  singers: string;
  isLive: boolean;
  youtubeUrl: string;
  comments: { name: string; text: string; rating: number }[];
}

interface SundaySchoolClass {
  id: string;
  title: string;
  teacher: string;
  ageGroup: string;
  time: string;
  description: string;
  image: string;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  date: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  image: string;
  joinDate: string;
}

interface QuizPlayer {
  name: string;
  email: string;
  score: number;
}

export function App() {
  const [language, setLanguage] = useState<Language>('pt');
  const [theme, setTheme] = useState<Theme>('white');
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('events');
  const [showNotification, setShowNotification] = useState(false);
  const [showVersePopup, setShowVersePopup] = useState(false);
  const [currentVerse, setCurrentVerse] = useState({ verse: '', reference: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLivePopup, setShowLivePopup] = useState(false);
  
  // Events state
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Culto de Domingo',
      type: 'worship',
      date: '2025-01-12',
      time: '10:00',
      description: 'Venha celebrar conosco neste domingo especial!',
      image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600',
      pastor: 'Pastor João Silva',
      singers: 'Ministério de Louvor Conectados',
      isLive: true,
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      comments: []
    },
    {
      id: '2',
      title: 'Conferência de Jovens',
      type: 'event',
      date: '2025-01-15',
      time: '19:30',
      description: 'Grande conferência para jovens com palestrantes especiais.',
      image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600',
      pastor: 'Pastor Carlos Santos',
      singers: 'Banda Jovem',
      isLive: false,
      youtubeUrl: '',
      comments: []
    }
  ]);

  // Sunday School state
  const [sundaySchoolClasses, setSundaySchoolClasses] = useState<SundaySchoolClass[]>([
    {
      id: '1',
      title: 'Turma dos Pequeninos',
      teacher: 'Irmã Maria',
      ageGroup: '3-5 anos',
      time: 'Domingos 10:00',
      description: 'Aulas lúdicas com histórias bíblicas e atividades.',
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400'
    },
    {
      id: '2',
      title: 'Turma Crescendo na Fé',
      teacher: 'Irmão Pedro',
      ageGroup: '6-10 anos',
      time: 'Domingos 10:00',
      description: 'Estudos bíblicos adaptados com dinâmicas.',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'
    }
  ]);

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    { id: '1', url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400', title: 'Culto Especial', date: '2025-01-01' },
    { id: '2', url: 'https://images.unsplash.com/photo-1507036066871-b7e8032b3dea?w=400', title: 'Batismo', date: '2025-01-05' },
    { id: '3', url: 'https://images.unsplash.com/photo-1519491050282-cf00c82424bf?w=400', title: 'Louvor', date: '2025-01-08' },
    { id: '4', url: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=400', title: 'Oração', date: '2025-01-10' },
    { id: '5', url: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400', title: 'Estudo Bíblico', date: '2025-01-12' },
    { id: '6', url: 'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?w=400', title: 'Comunhão', date: '2025-01-15' },
  ]);

  // Members state
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Pastor João Silva',
      email: 'pastor@igrejaconectada.com',
      phone: '+351 912 345 678',
      role: 'Pastor Principal',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      joinDate: '2020-01-01'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@igrejaconectada.com',
      phone: '+351 923 456 789',
      role: 'Líder de Louvor',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      joinDate: '2021-03-15'
    }
  ]);

  // Admin state
  const [adminLogin, setAdminLogin] = useState({ username: '', password: '' });
  const [newEvent, setNewEvent] = useState({
    title: '', type: 'worship' as 'event' | 'worship', date: '', time: '', description: '', image: '', pastor: '', singers: '', isLive: false, youtubeUrl: ''
  });
  const [newClass, setNewClass] = useState({
    title: '', teacher: '', ageGroup: '', time: '', description: '', image: ''
  });
  const [newGalleryImage, setNewGalleryImage] = useState({
    url: '', title: '', date: ''
  });
  const [newMember, setNewMember] = useState({
    name: '', email: '', phone: '', role: '', image: '', joinDate: ''
  });

  // Donation state
  const [donation, setDonation] = useState({
    name: '', email: '', phone: '', amount: '', currency: 'EUR', method: 'mbway'
  });
  const [showDonationThanks, setShowDonationThanks] = useState(false);

  // Quiz state
  const [quizPlayer, setQuizPlayer] = useState({ name: '', email: '' });
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [ranking, setRanking] = useState<QuizPlayer[]>([]);

  // Notification form state
  const [notificationForm, setNotificationForm] = useState({ name: '', phone: '', email: '' });

  // Comment form state
  const [commentForm, setCommentForm] = useState({ name: '', text: '', rating: 5 });

  const t = translations[language];
  const verses = bibleVerses[language];
  const questions = quizQuestions[language];

  // Show random verse popup
  const showRandomVerse = useCallback(() => {
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    setCurrentVerse(randomVerse);
    setShowVersePopup(true);
    setTimeout(() => setShowVersePopup(false), 8000);
  }, [verses]);

  useEffect(() => {
    const timer = setTimeout(showRandomVerse, 5000);
    const interval = setInterval(showRandomVerse, 60000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [showRandomVerse]);

  // Check if any event is live
  const liveEvent = events.find(e => e.isLive);

  // Theme colors
  const themeColors = {
    white: {
      bg: 'bg-gradient-to-br from-gray-50 to-white',
      card: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      nav: 'bg-white/90',
      accent: 'from-orange-500 to-blue-600',
      inputBg: 'bg-white'
    },
    black: {
      bg: 'bg-gradient-to-br from-gray-900 to-black',
      card: 'bg-gray-800',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-gray-700',
      nav: 'bg-gray-900/95',
      accent: 'from-orange-500 to-blue-500',
      inputBg: 'bg-gray-700'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
      card: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-orange-200',
      nav: 'bg-orange-500/95',
      accent: 'from-orange-600 to-red-500',
      inputBg: 'bg-white'
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      card: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-blue-200',
      nav: 'bg-blue-600/95',
      accent: 'from-blue-600 to-indigo-600',
      inputBg: 'bg-white'
    }
  };

  const colors = themeColors[theme];

  // Admin login handler
  const handleAdminLogin = () => {
    if (adminLogin.username === 'admin' && adminLogin.password === '123') {
      setIsAdmin(true);
    } else {
      alert('Login inválido!');
    }
  };

  // Add event handler
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, {
        ...newEvent,
        id: Date.now().toString(),
        comments: []
      }]);
      setNewEvent({ title: '', type: 'worship', date: '', time: '', description: '', image: '', pastor: '', singers: '', isLive: false, youtubeUrl: '' });
    }
  };

  // Delete event handler
  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  // Add Sunday School Class
  const handleAddClass = () => {
    if (newClass.title && newClass.teacher) {
      setSundaySchoolClasses([...sundaySchoolClasses, {
        ...newClass,
        id: Date.now().toString()
      }]);
      setNewClass({ title: '', teacher: '', ageGroup: '', time: '', description: '', image: '' });
    }
  };

  // Delete Sunday School Class
  const handleDeleteClass = (id: string) => {
    setSundaySchoolClasses(sundaySchoolClasses.filter(c => c.id !== id));
  };

  // Add Gallery Image
  const handleAddGalleryImage = () => {
    if (newGalleryImage.url && newGalleryImage.title) {
      setGalleryImages([...galleryImages, {
        ...newGalleryImage,
        id: Date.now().toString()
      }]);
      setNewGalleryImage({ url: '', title: '', date: '' });
    }
  };

  // Delete Gallery Image
  const handleDeleteGalleryImage = (id: string) => {
    setGalleryImages(galleryImages.filter(g => g.id !== id));
  };

  // Add Member
  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      setMembers([...members, {
        ...newMember,
        id: Date.now().toString()
      }]);
      setNewMember({ name: '', email: '', phone: '', role: '', image: '', joinDate: '' });
    }
  };

  // Delete Member
  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  // Donation handler
  const handleDonation = () => {
    if (donation.name && donation.email && donation.amount) {
      setShowDonationThanks(true);
      setTimeout(() => setShowDonationThanks(false), 5000);
      setDonation({ name: '', email: '', phone: '', amount: '', currency: 'EUR', method: 'mbway' });
    }
  };

  // Quiz handlers
  const handleQuizAnswer = (answerIndex: number) => {
    if (answerIndex === questions[currentQuestion].correct) {
      setQuizScore(quizScore + 10);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
      const newPlayer = { name: quizPlayer.name, email: quizPlayer.email, score: quizScore + (answerIndex === questions[currentQuestion].correct ? 10 : 0) };
      setRanking([...ranking, newPlayer].sort((a, b) => b.score - a.score).slice(0, 10));
    }
  };

  // Comment handler
  const handleAddComment = (eventId: string) => {
    if (commentForm.name && commentForm.text) {
      setEvents(events.map(e => 
        e.id === eventId 
          ? { ...e, comments: [...e.comments, { name: commentForm.name, text: commentForm.text, rating: commentForm.rating }] }
          : e
      ));
      setCommentForm({ name: '', text: '', rating: 5 });
    }
  };

  // WhatsApp confirmation
  const handleWhatsAppConfirm = () => {
    const message = encodeURIComponent(`Olá! Meu nome é ${notificationForm.name}. Gostaria de confirmar minha presença no próximo evento. Telefone: ${notificationForm.phone}, Email: ${notificationForm.email}`);
    window.open(`https://wa.me/351912345678?text=${message}`, '_blank');
    setShowNotification(false);
  };

  // Toggle Live status
  const toggleEventLive = (id: string) => {
    setEvents(events.map(e => 
      e.id === id ? { ...e, isLive: !e.isLive } : e
    ));
  };

  return (
    <div className={`min-h-screen ${colors.bg} ${colors.text} transition-all duration-500`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 ${colors.nav} backdrop-blur-lg shadow-lg z-50`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <span className={`text-xl font-bold bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
                Igreja Conectada
              </span>
            </div>

            {/* Live Indicator */}
            {liveEvent && (
              <button 
                onClick={() => setShowLivePopup(true)}
                className="hidden md:flex items-center space-x-2 bg-red-600 text-white px-4 py-1.5 rounded-full animate-pulse hover:bg-red-700 transition-colors"
              >
                <span className="w-3 h-3 bg-white rounded-full animate-ping absolute"></span>
                <span className="w-3 h-3 bg-white rounded-full relative"></span>
                <span className="font-bold text-sm">{t.live.title}</span>
              </button>
            )}

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { key: 'home', label: t.nav.home },
                { key: 'about', label: t.nav.about },
                { key: 'events', label: t.nav.events },
                { key: 'sundaySchool', label: t.nav.sundaySchool },
                { key: 'gallery', label: t.nav.gallery },
                { key: 'donations', label: t.nav.donations },
                { key: 'members', label: t.nav.members },
                { key: 'quiz', label: t.nav.quiz },
                { key: 'contact', label: t.nav.contact },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key as Section)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-blue-600 hover:text-white ${
                    activeSection === item.key ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {isAdmin ? (
                <>
                  <button
                    onClick={() => setActiveSection('admin')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-blue-600 hover:text-white ${
                      activeSection === 'admin' ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white' : ''
                    }`}
                  >
                    {t.nav.admin}
                  </button>
                  <button
                    onClick={() => setIsAdmin(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-100"
                  >
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setActiveSection('admin')}
                  className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
                >
                  {t.nav.admin}
                </button>
              )}
            </div>

            {/* Language & Theme Selectors */}
            <div className="flex items-center space-x-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="pt">🇵🇹 PT</option>
                <option value="en">🇬🇧 EN</option>
                <option value="es">🇪🇸 ES</option>
              </select>
              <div className="flex space-x-1">
                {(['white', 'black', 'orange', 'blue'] as Theme[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      theme === t ? 'ring-2 ring-offset-2 ring-orange-500' : ''
                    } ${
                      t === 'white' ? 'bg-white border-gray-300' :
                      t === 'black' ? 'bg-gray-900 border-gray-700' :
                      t === 'orange' ? 'bg-orange-500 border-orange-600' :
                      'bg-blue-600 border-blue-700'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden ${colors.card} border-t ${colors.border} shadow-lg`}>
            <div className="px-4 py-2 space-y-1">
              {[
                { key: 'home', label: t.nav.home },
                { key: 'about', label: t.nav.about },
                { key: 'events', label: t.nav.events },
                { key: 'sundaySchool', label: t.nav.sundaySchool },
                { key: 'gallery', label: t.nav.gallery },
                { key: 'donations', label: t.nav.donations },
                { key: 'members', label: t.nav.members },
                { key: 'quiz', label: t.nav.quiz },
                { key: 'contact', label: t.nav.contact },
                { key: 'admin', label: t.nav.admin },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => { setActiveSection(item.key as Section); setMobileMenuOpen(false); }}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSection === item.key ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-24 min-h-screen">
        {/* Home Section */}
        {activeSection === 'home' && (
          <div className="relative">
            {/* Hero */}
            <div className="relative h-[70vh] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-purple-600/80 to-blue-600/90">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200')] bg-cover bg-center mix-blend-overlay opacity-50"></div>
              </div>
              <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4">
                <div className="transform hover:scale-105 transition-transform duration-500">
                  <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center animate-bounce shadow-2xl" style={{ perspective: '1000px' }}>
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotateY(15deg) rotateX(10deg)' }}>
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.3)' }}>
                  {t.hero.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 drop-shadow-md max-w-2xl">
                  {t.hero.subtitle}
                </p>
                <button 
                  onClick={() => setActiveSection('events')}
                  className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-100 transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-2xl"
                  style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
                >
                  {t.hero.cta} →
                </button>
              </div>
              {/* 3D Decorative Elements */}
              <div className="absolute bottom-0 left-0 w-full">
                <svg viewBox="0 0 1200 120" className="fill-current" style={{ color: theme === 'black' ? '#111827' : theme === 'orange' ? '#fff7ed' : theme === 'blue' ? '#eff6ff' : '#f9fafb' }}>
                  <path d="M0,0 C150,90 350,0 500,50 C650,100 800,30 1000,70 C1100,90 1200,50 1200,50 L1200,120 L0,120 Z"></path>
                </svg>
              </div>
            </div>

            {/* Events Preview */}
            <div className="max-w-7xl mx-auto px-4 py-16">
              <h2 className={`text-4xl font-bold text-center mb-12 bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
                {t.events.title}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map(event => (
                  <div 
                    key={event.id} 
                    className={`${colors.card} rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 border ${colors.border}`}
                    style={{ perspective: '1000px' }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={event.image || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400'} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${event.type === 'worship' ? 'bg-purple-500' : 'bg-blue-500'} text-white`}>
                          {event.type === 'worship' ? (language === 'pt' ? 'Culto' : language === 'en' ? 'Worship' : 'Culto') : (language === 'pt' ? 'Evento' : language === 'en' ? 'Event' : 'Evento')}
                        </span>
                      </div>
                      {event.isLive && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse flex items-center space-x-1">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>LIVE</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className={`${colors.textSecondary} mb-2`}>
                        📅 {event.date} ⏰ {event.time}
                      </p>
                      {event.pastor && <p className={`${colors.textSecondary} text-sm`}>👨‍🏫 {event.pastor}</p>}
                      {event.singers && <p className={`${colors.textSecondary} text-sm mb-2`}>🎤 {event.singers}</p>}
                      <p className={`${colors.textSecondary} text-sm mb-4`}>{event.description}</p>
                      
                      {/* Comments Section */}
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold mb-2">{t.events.comments} ({event.comments.length})</h4>
                        <div className="max-h-32 overflow-y-auto space-y-2 mb-4">
                          {event.comments.map((comment, idx) => (
                            <div key={idx} className={`${theme === 'black' ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded-lg text-sm`}>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">{comment.name}</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                  ))}
                                </div>
                              </div>
                              <p className={colors.textSecondary}>{comment.text}</p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder={t.notification.name}
                            value={commentForm.name}
                            onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                            className={`w-full px-3 py-2 rounded-lg border ${colors.border} ${colors.inputBg} text-sm`}
                          />
                          <textarea
                            placeholder={t.events.addComment}
                            value={commentForm.text}
                            onChange={(e) => setCommentForm({...commentForm, text: e.target.value})}
                            className={`w-full px-3 py-2 rounded-lg border ${colors.border} ${colors.inputBg} text-sm`}
                            rows={2}
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">{t.events.rating}:</span>
                              {[1,2,3,4,5].map(star => (
                                <button
                                  key={star}
                                  onClick={() => setCommentForm({...commentForm, rating: star})}
                                  className={`text-xl ${star <= commentForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => handleAddComment(event.id)}
                              className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:opacity-90"
                            >
                              {t.events.addComment}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* About Section */}
        {activeSection === 'about' && (
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className={`${colors.card} rounded-3xl shadow-2xl overflow-hidden border ${colors.border}`} style={{ transform: 'perspective(1000px) rotateX(2deg)' }}>
              <div className="h-64 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center" style={{ transform: 'translateZ(50px)' }}>
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <h1 className={`text-4xl font-bold mb-8 text-center bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
                  {t.about.title}
                </h1>
                <p className={`${colors.textSecondary} text-lg mb-8 text-center max-w-3xl mx-auto leading-relaxed`}>
                  {t.about.description}
                </p>
                
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  {[
                    { title: t.about.mission, text: t.about.missionText, icon: '🎯' },
                    { title: t.about.vision, text: t.about.visionText, icon: '👁️' },
                    { title: t.about.values, text: t.about.valuesText, icon: '💎' }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`${theme === 'black' ? 'bg-gray-700' : 'bg-gradient-to-br from-orange-50 to-blue-50'} p-6 rounded-2xl transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl`}
                      style={{ transform: `perspective(1000px) rotateY(${(idx - 1) * 5}deg)` }}
                    >
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className={colors.textSecondary}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Section */}
        {activeSection === 'events' && (
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h1 className={`text-4xl font-bold text-center mb-12 bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
              {t.events.title}
            </h1>
            {events.length === 0 ? (
              <p className="text-center text-xl">{t.events.noEvents}</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {events.map(event => (
                  <div 
                    key={event.id} 
                    className={`${colors.card} rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500 border ${colors.border}`}
                    style={{ perspective: '1000px' }}
                  >
                    <div className="relative h-64">
                      <img 
                        src={event.image || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600'} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${event.type === 'worship' ? 'bg-purple-500' : 'bg-blue-500'} text-white`}>
                          {event.type === 'worship' ? (language === 'pt' ? '⛪ Culto' : language === 'en' ? '⛪ Worship' : '⛪ Culto') : (language === 'pt' ? '🎉 Evento' : language === 'en' ? '🎉 Event' : '🎉 Evento')}
                        </span>
                      </div>
                      {event.isLive && (
                        <button 
                          onClick={() => window.open(event.youtubeUrl, '_blank')}
                          className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold animate-pulse flex items-center space-x-2 hover:bg-red-700"
                        >
                          <span className="w-3 h-3 bg-white rounded-full"></span>
                          <span>{t.live.watchNow}</span>
                        </button>
                      )}
                    </div>
                    <div className="p-8">
                      <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                      <p className={`${colors.textSecondary} mb-2`}>
                        📅 {event.date} ⏰ {event.time}
                      </p>
                      {event.pastor && <p className={`${colors.textSecondary} mb-1`}>👨‍🏫 <strong>{language === 'pt' ? 'Pastor' : language === 'en' ? 'Pastor' : 'Pastor'}:</strong> {event.pastor}</p>}
                      {event.singers && <p className={`${colors.textSecondary} mb-2`}>🎤 <strong>{language === 'pt' ? 'Louvor' : language === 'en' ? 'Worship' : 'Alabanza'}:</strong> {event.singers}</p>}
                      <p className={colors.textSecondary}>{event.description}</p>
                      
                      <button 
                        onClick={() => { setShowNotification(true); }}
                        className="mt-6 w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                      >
                        {t.events.confirmPresence}
                      </button>

                      {/* Comments */}
                      <div className="mt-6 border-t pt-6">
                        <h4 className="font-bold mb-4">{t.events.comments}</h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {event.comments.map((comment, idx) => (
                            <div key={idx} className={`${theme === 'black' ? 'bg-gray-700' : 'bg-gray-100'} p-3 rounded-xl`}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold">{comment.name}</span>
                                <div className="flex text-yellow-400">
                                  {[...Array(comment.rating)].map((_, i) => <span key={i}>★</span>)}
                                </div>
                              </div>
                              <p className={`text-sm ${colors.textSecondary}`}>{comment.text}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 space-y-2">
                          <input
                            type="text"
                            placeholder={t.notification.name}
                            value={commentForm.name}
                            onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                            className={`w-full px-4 py-2 rounded-xl border ${colors.border} ${colors.inputBg}`}
                          />
                          <textarea
                            placeholder={t.events.addComment}
                            value={commentForm.text}
                            onChange={(e) => setCommentForm({...commentForm, text: e.target.value})}
                            className={`w-full px-4 py-2 rounded-xl border ${colors.border} ${colors.inputBg}`}
                            rows={2}
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-1">
                              {[1,2,3,4,5].map(star => (
                                <button
                                  key={star}
                                  onClick={() => setCommentForm({...commentForm, rating: star})}
                                  className={`text-2xl ${star <= commentForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => handleAddComment(event.id)}
                              className="bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600"
                            >
                              {t.events.addComment}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sunday School Section */}
        {activeSection === 'sundaySchool' && (
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className={`${colors.card} rounded-3xl shadow-2xl overflow-hidden border ${colors.border}`}>
              <div className="h-72 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-9xl animate-bounce" style={{ animationDuration: '2s' }}>👧👦</div>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <h1 className={`text-4xl font-bold text-center mb-8 bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
                  {t.sundaySchool.title}
                </h1>
                <p className={`${colors.textSecondary} text-lg mb-8 max-w-2xl mx-auto text-center`}>
                  {t.sundaySchool.description}
                </p>
                
                {/* Classes Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {sundaySchoolClasses.map(cls => (
                    <div key={cls.id} className={`${theme === 'black' ? 'bg-gray-700' : 'bg-gradient-to-br from-yellow-50 to-orange-50'} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2`}>
                      <img src={cls.image || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400'} alt={cls.title} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{cls.title}</h3>
                        <p className={`${colors.textSecondary} text-sm`}>👩‍🏫 {cls.teacher}</p>
                        <p className={`${colors.textSecondary} text-sm`}>👶 {cls.ageGroup}</p>
                        <p className={`${colors.textSecondary} text-sm`}>⏰ {cls.time}</p>
                        <p className={`${colors.textSecondary} text-sm mt-2`}>{cls.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Section */}
        {activeSection === 'gallery' && (
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h1 className={`text-4xl font-bold text-center mb-12 bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
              {t.gallery.title}
            </h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((img) => (
                <div 
                  key={img.id} 
                  className={`${colors.card} rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-500 border ${colors.border}`}
                  style={{ perspective: '1000px' }}
                >
                  <img 
                    src={img.url} 
                    alt={img.title}
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="p-4">
                    <h3 className="font-bold">{img.title}</h3>
                    <p className={`${colors.textSecondary} text-sm`}>📅 {img.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donations Section */}
        {activeSection === 'donations' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className={`${colors.card} rounded-3xl shadow-2xl overflow-hidden border ${colors.border}`} style={{ transform: 'perspective(1000px) rotateX(2deg)' }}>
              <div className="h-48 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center">
                <div className="text-8xl animate-pulse">💝</div>
              </div>
              <div className="p-8 md:p-12">
                <h1 className={`text-4xl font-bold text-center mb-4 bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
                  {t.donations.title}
                </h1>
                <p className={`${colors.textSecondary} text-center text-lg mb-8`}>
                  {t.donations.subtitle}
                </p>
                
                {showDonationThanks && (
                  <div className="bg-green-100 text-green-800 p-4 rounded-xl mb-6 text-center animate-pulse">
                    {t.donations.thanks}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder={t.donations.name}
                      value={donation.name}
                      onChange={(e) => setDonation({...donation, name: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg} focus:ring-2 focus:ring-orange-500 outline-none`}
                    />
                    <input
                      type="email"
                      placeholder={t.donations.email}
                      value={donation.email}
                      onChange={(e) => setDonation({...donation, email: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg} focus:ring-2 focus:ring-orange-500 outline-none`}
                    />
                    <input
                      type="tel"
                      placeholder={t.donations.phone}
                      value={donation.phone}
                      onChange={(e) => setDonation({...donation, phone: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg} focus:ring-2 focus:ring-orange-500 outline-none`}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder={t.donations.amount}
                        value={donation.amount}
                        onChange={(e) => setDonation({...donation, amount: e.target.value})}
                        className={`flex-1 px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg} focus:ring-2 focus:ring-orange-500 outline-none`}
                      />
                      <select
                        value={donation.currency}
                        onChange={(e) => setDonation({...donation, currency: e.target.value})}
                        className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg} focus:ring-2 focus:ring-orange-500 outline-none`}
                      >
                        <option value="EUR">€ EUR</option>
                        <option value="BRL">R$ BRL</option>
                      </select>
                    </div>
                    <select
                      value={donation.method}
                      onChange={(e) => setDonation({...donation, method: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg} focus:ring-2 focus:ring-orange-500 outline-none`}
                    >
                      <option value="mbway">📱 MBWAY</option>
                      <option value="transfer">🏦 {language === 'pt' ? 'Transferência Bancária' : language === 'en' ? 'Bank Transfer' : 'Transferencia Bancaria'}</option>
                      <option value="pix">🇧🇷 PIX</option>
                    </select>
                    
                    {donation.method === 'mbway' && (
                      <div className={`${theme === 'black' ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-xl`}>
                        <p className="font-semibold">MBWAY: +351 912 345 678</p>
                      </div>
                    )}
                    {donation.method === 'transfer' && (
                      <div className={`${theme === 'black' ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-xl text-sm`}>
                        <p><strong>IBAN:</strong> PT50 0000 0000 0000 0000 0000 0</p>
                        <p><strong>BIC:</strong> IGCPPTPL</p>
                      </div>
                    )}
                    {donation.method === 'pix' && (
                      <div className={`${theme === 'black' ? 'bg-gray-700' : 'bg-green-50'} p-4 rounded-xl`}>
                        <p><strong>Chave PIX:</strong> igrejaconectada@email.com</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleDonation}
                  className="mt-8 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  {t.donations.donate} 💝
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Members Section */}
        {activeSection === 'members' && (
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h1 className={`text-4xl font-bold text-center mb-12 bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
              {t.members.title}
            </h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map(member => (
                <div key={member.id} className={`${colors.card} rounded-2xl overflow-hidden shadow-xl border ${colors.border} transform hover:-translate-y-2 transition-all`}>
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-white/30 flex items-center justify-center text-5xl">👤</div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                    <p className="text-orange-500 font-semibold mb-2">{member.role}</p>
                    <p className={`${colors.textSecondary} text-sm`}>📧 {member.email}</p>
                    <p className={`${colors.textSecondary} text-sm`}>📱 {member.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {activeSection === 'quiz' && (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className={`${colors.card} rounded-3xl shadow-2xl p-8 md:p-12 border ${colors.border}`}>
              <h1 className={`text-4xl font-bold text-center mb-8 bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
                {t.quiz.title}
              </h1>

              {!quizStarted && !quizFinished && (
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
                    <span className="text-6xl">📖</span>
                  </div>
                  <p className={`${colors.textSecondary} mb-8`}>{t.quiz.registerToPlay}</p>
                  <div className="max-w-sm mx-auto space-y-4 mb-8">
                    <input
                      type="text"
                      placeholder={t.notification.name}
                      value={quizPlayer.name}
                      onChange={(e) => setQuizPlayer({...quizPlayer, name: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                    />
                    <input
                      type="email"
                      placeholder={t.notification.email}
                      value={quizPlayer.email}
                      onChange={(e) => setQuizPlayer({...quizPlayer, email: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                    />
                  </div>
                  <button
                    onClick={() => { if (quizPlayer.name && quizPlayer.email) setQuizStarted(true); }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-xl font-bold text-lg hover:opacity-90 transform hover:scale-105 transition-all"
                  >
                    {t.quiz.start} 🚀
                  </button>
                </div>
              )}

              {quizStarted && !quizFinished && (
                <div className="text-center">
                  <div className="mb-8">
                    <span className={`${colors.textSecondary}`}>
                      {currentQuestion + 1} / {questions.length}
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-8">{questions[currentQuestion].question}</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        className={`${theme === 'black' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} p-4 rounded-xl text-lg font-medium transition-all transform hover:scale-105 hover:shadow-lg`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <p className="mt-8 text-2xl font-bold">{t.quiz.score}: {quizScore}</p>
                </div>
              )}

              {quizFinished && (
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-8">
                    <span className="text-6xl">🏆</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{t.quiz.score}: {quizScore}</h2>
                  <button
                    onClick={() => { setQuizStarted(false); setQuizFinished(false); setCurrentQuestion(0); setQuizScore(0); }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90"
                  >
                    {t.quiz.start}
                  </button>
                </div>
              )}

              {/* Ranking */}
              {ranking.length > 0 && (
                <div className="mt-12 border-t pt-8">
                  <h3 className="text-2xl font-bold text-center mb-6">{t.quiz.ranking} 🏆</h3>
                  <div className="space-y-2">
                    {ranking.map((player, idx) => (
                      <div key={idx} className={`${theme === 'black' ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl flex items-center justify-between`}>
                        <div className="flex items-center space-x-4">
                          <span className={`text-2xl font-bold ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : ''}`}>
                            #{idx + 1}
                          </span>
                          <span className="font-semibold">{player.name}</span>
                        </div>
                        <span className="text-xl font-bold">{player.score} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h1 className={`text-4xl font-bold text-center mb-12 bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
              {t.contact.title}
            </h1>
            <div className="grid md:grid-cols-2 gap-8">
              <div className={`${colors.card} rounded-3xl shadow-2xl p-8 border ${colors.border}`}>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{t.contact.address}</h3>
                      <p className={colors.textSecondary}>Rua da Igreja, 123<br/>Lisboa, Portugal</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{t.contact.phone}</h3>
                      <p className={colors.textSecondary}>+351 912 345 678</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">✉️</span>
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{t.contact.email}</h3>
                      <p className={colors.textSecondary}>contato@igrejaconectada.com</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-bold mb-4">{t.contact.followUs}</h3>
                  <div className="flex space-x-4">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className={`${colors.card} rounded-3xl shadow-2xl p-8 border ${colors.border}`}>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder={t.donations.name}
                    className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg} focus:ring-2 focus:ring-orange-500 outline-none`}
                  />
                  <input
                    type="email"
                    placeholder={t.donations.email}
                    className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg} focus:ring-2 focus:ring-orange-500 outline-none`}
                  />
                  <textarea
                    rows={5}
                    placeholder={language === 'pt' ? 'Sua mensagem...' : language === 'en' ? 'Your message...' : 'Tu mensaje...'}
                    className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg} focus:ring-2 focus:ring-orange-500 outline-none resize-none`}
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all transform hover:scale-[1.02]"
                  >
                    {t.contact.sendMessage} ✉️
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Admin Section */}
        {activeSection === 'admin' && (
          <div className="max-w-6xl mx-auto px-4 py-16">
            {!isAdmin ? (
              <div className={`${colors.card} rounded-3xl shadow-2xl p-8 md:p-12 border ${colors.border}`}>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm4 10.723V19h-2v-1.277a1.993 1.993 0 01.567-3.677A2.001 2.001 0 0113 17.723z"/>
                    </svg>
                  </div>
                  <h1 className={`text-3xl font-bold bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
                    {t.admin.login}
                  </h1>
                </div>
                <div className="max-w-sm mx-auto space-y-4">
                  <input
                    type="text"
                    placeholder={t.admin.username}
                    value={adminLogin.username}
                    onChange={(e) => setAdminLogin({...adminLogin, username: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                  />
                  <input
                    type="password"
                    placeholder={t.admin.password}
                    value={adminLogin.password}
                    onChange={(e) => setAdminLogin({...adminLogin, password: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                  />
                  <button
                    onClick={handleAdminLogin}
                    className="w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:opacity-90"
                  >
                    {t.admin.enter}
                  </button>
                </div>
              </div>
            ) : (
              <div className={`${colors.card} rounded-3xl shadow-2xl p-8 border ${colors.border}`}>
                <h1 className={`text-3xl font-bold mb-8 text-center bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
                  {t.admin.title}
                </h1>

                {/* Admin Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                  {[
                    { key: 'events', label: t.nav.events, icon: '📅' },
                    { key: 'sundaySchool', label: t.nav.sundaySchool, icon: '👧' },
                    { key: 'gallery', label: t.nav.gallery, icon: '🖼️' },
                    { key: 'members', label: t.nav.members, icon: '👥' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setAdminTab(tab.key as AdminTab)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        adminTab === tab.key 
                          ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white' 
                          : `${theme === 'black' ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-200`
                      }`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                {/* Events Tab */}
                {adminTab === 'events' && (
                  <div>
                    <div className={`${theme === 'black' ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl p-6 mb-8`}>
                      <h2 className="text-xl font-bold mb-4">➕ {t.admin.addEvent}</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder={t.admin.eventTitle}
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <select
                          value={newEvent.type}
                          onChange={(e) => setNewEvent({...newEvent, type: e.target.value as 'event' | 'worship'})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        >
                          <option value="worship">{language === 'pt' ? '⛪ Culto' : language === 'en' ? '⛪ Worship' : '⛪ Culto'}</option>
                          <option value="event">{language === 'pt' ? '🎉 Evento' : language === 'en' ? '🎉 Event' : '🎉 Evento'}</option>
                        </select>
                        <input
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="text"
                          placeholder={language === 'pt' ? '👨‍🏫 Pastor' : language === 'en' ? '👨‍🏫 Pastor' : '👨‍🏫 Pastor'}
                          value={newEvent.pastor}
                          onChange={(e) => setNewEvent({...newEvent, pastor: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="text"
                          placeholder={language === 'pt' ? '🎤 Cantores/Louvor' : language === 'en' ? '🎤 Singers/Worship' : '🎤 Cantantes/Alabanza'}
                          value={newEvent.singers}
                          onChange={(e) => setNewEvent({...newEvent, singers: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <textarea
                          placeholder={t.admin.eventDescription}
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg} col-span-2`}
                          rows={2}
                        />
                        <input
                          type="text"
                          placeholder={`🖼️ ${t.admin.eventImage} (URL)`}
                          value={newEvent.image}
                          onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="text"
                          placeholder={t.admin.youtubeUrl}
                          value={newEvent.youtubeUrl}
                          onChange={(e) => setNewEvent({...newEvent, youtubeUrl: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <label className="flex items-center space-x-2 col-span-2">
                          <input
                            type="checkbox"
                            checked={newEvent.isLive}
                            onChange={(e) => setNewEvent({...newEvent, isLive: e.target.checked})}
                            className="w-5 h-5 rounded"
                          />
                          <span>🔴 {t.admin.isLive}</span>
                        </label>
                      </div>
                      <button
                        onClick={handleAddEvent}
                        className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90"
                      >
                        {t.admin.save}
                      </button>
                    </div>

                    {/* Events List */}
                    <div>
                      <h2 className="text-xl font-bold mb-4">📋 {t.admin.manageEvents}</h2>
                      <div className="space-y-4">
                        {events.map(event => (
                          <div key={event.id} className={`${theme === 'black' ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl flex items-center justify-between`}>
                            <div className="flex items-center space-x-4">
                              <img src={event.image || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=100'} alt="" className="w-16 h-16 rounded-lg object-cover"/>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold">{event.title}</h3>
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${event.type === 'worship' ? 'bg-purple-500' : 'bg-blue-500'} text-white`}>
                                    {event.type === 'worship' ? 'Culto' : 'Evento'}
                                  </span>
                                </div>
                                <p className={`text-sm ${colors.textSecondary}`}>{event.date} {event.time}</p>
                                {event.pastor && <p className={`text-xs ${colors.textSecondary}`}>👨‍🏫 {event.pastor}</p>}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleEventLive(event.id)}
                                className={`px-3 py-1 rounded-lg text-sm font-bold ${event.isLive ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                              >
                                {event.isLive ? '🔴 LIVE' : '⚪ Offline'}
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                              >
                                {t.admin.delete}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sunday School Tab */}
                {adminTab === 'sundaySchool' && (
                  <div>
                    <div className={`${theme === 'black' ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl p-6 mb-8`}>
                      <h2 className="text-xl font-bold mb-4">➕ {language === 'pt' ? 'Adicionar Turma' : language === 'en' ? 'Add Class' : 'Agregar Clase'}</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder={language === 'pt' ? 'Nome da Turma' : language === 'en' ? 'Class Name' : 'Nombre de la Clase'}
                          value={newClass.title}
                          onChange={(e) => setNewClass({...newClass, title: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="text"
                          placeholder={language === 'pt' ? 'Professor(a)' : language === 'en' ? 'Teacher' : 'Profesor(a)'}
                          value={newClass.teacher}
                          onChange={(e) => setNewClass({...newClass, teacher: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="text"
                          placeholder={language === 'pt' ? 'Faixa Etária (ex: 3-5 anos)' : language === 'en' ? 'Age Group (e.g.: 3-5 years)' : 'Grupo de Edad (ej: 3-5 años)'}
                          value={newClass.ageGroup}
                          onChange={(e) => setNewClass({...newClass, ageGroup: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="text"
                          placeholder={language === 'pt' ? 'Horário (ex: Domingos 10:00)' : language === 'en' ? 'Schedule (e.g.: Sundays 10:00)' : 'Horario (ej: Domingos 10:00)'}
                          value={newClass.time}
                          onChange={(e) => setNewClass({...newClass, time: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="text"
                          placeholder={`🖼️ ${language === 'pt' ? 'URL da Imagem' : language === 'en' ? 'Image URL' : 'URL de Imagen'}`}
                          value={newClass.image}
                          onChange={(e) => setNewClass({...newClass, image: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <textarea
                          placeholder={language === 'pt' ? 'Descrição' : language === 'en' ? 'Description' : 'Descripción'}
                          value={newClass.description}
                          onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                          rows={2}
                        />
                      </div>
                      <button
                        onClick={handleAddClass}
                        className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90"
                      >
                        {t.admin.save}
                      </button>
                    </div>

                    {/* Classes List */}
                    <div>
                      <h2 className="text-xl font-bold mb-4">📋 {language === 'pt' ? 'Turmas Cadastradas' : language === 'en' ? 'Registered Classes' : 'Clases Registradas'}</h2>
                      <div className="space-y-4">
                        {sundaySchoolClasses.map(cls => (
                          <div key={cls.id} className={`${theme === 'black' ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl flex items-center justify-between`}>
                            <div className="flex items-center space-x-4">
                              <img src={cls.image || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=100'} alt="" className="w-16 h-16 rounded-lg object-cover"/>
                              <div>
                                <h3 className="font-bold">{cls.title}</h3>
                                <p className={`text-sm ${colors.textSecondary}`}>👩‍🏫 {cls.teacher} | 👶 {cls.ageGroup}</p>
                                <p className={`text-xs ${colors.textSecondary}`}>⏰ {cls.time}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteClass(cls.id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                              {t.admin.delete}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Gallery Tab */}
                {adminTab === 'gallery' && (
                  <div>
                    <div className={`${theme === 'black' ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl p-6 mb-8`}>
                      <h2 className="text-xl font-bold mb-4">➕ {language === 'pt' ? 'Adicionar Foto' : language === 'en' ? 'Add Photo' : 'Agregar Foto'}</h2>
                      <div className="grid md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder={`🖼️ ${language === 'pt' ? 'URL da Imagem' : language === 'en' ? 'Image URL' : 'URL de Imagen'}`}
                          value={newGalleryImage.url}
                          onChange={(e) => setNewGalleryImage({...newGalleryImage, url: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="text"
                          placeholder={language === 'pt' ? 'Título' : language === 'en' ? 'Title' : 'Título'}
                          value={newGalleryImage.title}
                          onChange={(e) => setNewGalleryImage({...newGalleryImage, title: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="date"
                          value={newGalleryImage.date}
                          onChange={(e) => setNewGalleryImage({...newGalleryImage, date: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                      </div>
                      <button
                        onClick={handleAddGalleryImage}
                        className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90"
                      >
                        {t.admin.save}
                      </button>
                    </div>

                    {/* Gallery List */}
                    <div>
                      <h2 className="text-xl font-bold mb-4">📋 {language === 'pt' ? 'Fotos na Galeria' : language === 'en' ? 'Photos in Gallery' : 'Fotos en Galería'}</h2>
                      <div className="grid md:grid-cols-3 gap-4">
                        {galleryImages.map(img => (
                          <div key={img.id} className={`${theme === 'black' ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl overflow-hidden relative group`}>
                            <img src={img.url} alt={img.title} className="w-full h-32 object-cover"/>
                            <div className="p-3">
                              <p className="font-semibold text-sm">{img.title}</p>
                              <p className={`text-xs ${colors.textSecondary}`}>{img.date}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteGalleryImage(img.id)}
                              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Members Tab */}
                {adminTab === 'members' && (
                  <div>
                    <div className={`${theme === 'black' ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl p-6 mb-8`}>
                      <h2 className="text-xl font-bold mb-4">➕ {language === 'pt' ? 'Adicionar Membro' : language === 'en' ? 'Add Member' : 'Agregar Miembro'}</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder={language === 'pt' ? 'Nome Completo' : language === 'en' ? 'Full Name' : 'Nombre Completo'}
                          value={newMember.name}
                          onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={newMember.email}
                          onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="tel"
                          placeholder={language === 'pt' ? 'Telefone' : language === 'en' ? 'Phone' : 'Teléfono'}
                          value={newMember.phone}
                          onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="text"
                          placeholder={language === 'pt' ? 'Função/Cargo' : language === 'en' ? 'Role/Position' : 'Cargo/Posición'}
                          value={newMember.role}
                          onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="text"
                          placeholder={`🖼️ ${language === 'pt' ? 'URL da Foto' : language === 'en' ? 'Photo URL' : 'URL de Foto'}`}
                          value={newMember.image}
                          onChange={(e) => setNewMember({...newMember, image: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                        <input
                          type="date"
                          placeholder={language === 'pt' ? 'Data de Entrada' : language === 'en' ? 'Join Date' : 'Fecha de Ingreso'}
                          value={newMember.joinDate}
                          onChange={(e) => setNewMember({...newMember, joinDate: e.target.value})}
                          className={`px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
                        />
                      </div>
                      <button
                        onClick={handleAddMember}
                        className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90"
                      >
                        {t.admin.save}
                      </button>
                    </div>

                    {/* Members List */}
                    <div>
                      <h2 className="text-xl font-bold mb-4">📋 {language === 'pt' ? 'Membros Cadastrados' : language === 'en' ? 'Registered Members' : 'Miembros Registrados'}</h2>
                      <div className="space-y-4">
                        {members.map(member => (
                          <div key={member.id} className={`${theme === 'black' ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl flex items-center justify-between`}>
                            <div className="flex items-center space-x-4">
                              {member.image ? (
                                <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover"/>
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-2xl text-white">
                                  {member.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <h3 className="font-bold">{member.name}</h3>
                                <p className="text-orange-500 text-sm font-semibold">{member.role}</p>
                                <p className={`text-xs ${colors.textSecondary}`}>📧 {member.email} | 📱 {member.phone}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteMember(member.id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                              {t.admin.delete}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* WhatsApp Button - Left Side */}
      <a
        href="https://wa.me/351912345678"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 hover:scale-110 transition-all z-50"
        style={{ boxShadow: '0 4px 20px rgba(34, 197, 94, 0.5)' }}
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

      {/* Notification Button - Right Side */}
      <button
        onClick={() => setShowNotification(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50 animate-pulse"
        style={{ boxShadow: '0 4px 20px rgba(249, 115, 22, 0.5)' }}
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
        </svg>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">1</span>
      </button>

      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNotification(false)}>
          <div 
            className={`${colors.card} rounded-3xl shadow-2xl max-w-md w-full p-8 transform`}
            style={{ animation: 'scaleIn 0.3s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowNotification(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">×</button>
            <h3 className="text-2xl font-bold mb-4">{t.notification.title}</h3>
            {events[0] && (
              <div className="mb-6">
                <img src={events[0].image} alt="" className="w-full h-40 object-cover rounded-xl mb-4"/>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${events[0].type === 'worship' ? 'bg-purple-500' : 'bg-blue-500'} text-white`}>
                    {events[0].type === 'worship' ? 'Culto' : 'Evento'}
                  </span>
                </div>
                <h4 className="font-bold text-lg">{events[0].title}</h4>
                <p className={colors.textSecondary}>{events[0].date} - {events[0].time}</p>
                {events[0].pastor && <p className={`${colors.textSecondary} text-sm`}>👨‍🏫 {events[0].pastor}</p>}
                <p className={`${colors.textSecondary} text-sm mt-2`}>{events[0].description}</p>
              </div>
            )}
            <div className="space-y-3">
              <input
                type="text"
                placeholder={t.notification.name}
                value={notificationForm.name}
                onChange={(e) => setNotificationForm({...notificationForm, name: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
              />
              <input
                type="tel"
                placeholder={t.notification.phone}
                value={notificationForm.phone}
                onChange={(e) => setNotificationForm({...notificationForm, phone: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
              />
              <input
                type="email"
                placeholder={t.notification.email}
                value={notificationForm.email}
                onChange={(e) => setNotificationForm({...notificationForm, email: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border ${colors.border} ${colors.inputBg}`}
              />
              <button
                onClick={handleWhatsAppConfirm}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 flex items-center justify-center space-x-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                <span>{t.notification.confirm}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bible Verse Popup */}
      {showVersePopup && (
        <div 
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full mx-4"
          style={{ animation: 'slideDown 0.5s ease-out' }}
        >
          <div 
            className="bg-gradient-to-r from-orange-500 via-purple-500 to-blue-600 p-6 rounded-3xl shadow-2xl"
            style={{ 
              transform: 'perspective(1000px) rotateX(5deg)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📖✨</div>
              <p className="text-lg italic text-white mb-2 drop-shadow-lg">"{currentVerse.verse}"</p>
              <p className="text-white font-bold drop-shadow-lg">{currentVerse.reference}</p>
              <button 
                onClick={() => setShowVersePopup(false)}
                className="mt-4 text-white/80 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Streaming Popup */}
      {showLivePopup && liveEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowLivePopup(false)}>
          <div 
            className={`${colors.card} rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="bg-black aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 mx-auto bg-red-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-xl font-bold">{liveEvent.title}</p>
                  <p className="text-gray-400">{t.live.title}</p>
                </div>
              </div>
              <button onClick={() => setShowLivePopup(false)} className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70">×</button>
            </div>
            <div className="p-6">
              <a
                href={liveEvent.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-red-600 text-white text-center py-4 rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                {t.live.watchNow} 🎥
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
