import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, BookOpen, Image, MessageSquare, Bell, Heart, Calendar,
  LogOut, Menu, X, User, Phone, Send, Check, ChevronRight,
  Clock, MapPin, Mic, Music, Play, Star, Trophy, Award,
  Gift, Camera, Video, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useChurchData } from '@/contexts/ChurchDataContext';

interface MemberPortalProps {
  onLogout: () => void;
}

// Event type for member portal
interface EventoMembro {
  id: string;
  igreja_id: string;
  titulo: string;
  descricao: string;
  data: Date;
  tipo: 'culto' | 'evento';
  pregador?: string;
  cantores?: string;
  imagem?: string;
  local?: string;
}

export function MemberPortal({ onLogout }: MemberPortalProps) {
  const { user } = useAuth();
  const { 
    eventos: eventosContext, 
    fotos: fotosContext, 
    videos: videosContext,
    quizQuestions: quizQuestionsContext,
    ranking: rankingContext,
    addPresenca,
    addMensagemPastor
  } = useChurchData();
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Convert context events to EventoMembro format
  const events: EventoMembro[] = eventosContext.map(e => ({
    id: String(e.id),
    igreja_id: String(e.igreja_id),
    titulo: e.titulo,
    descricao: e.descricao || '',
    data: new Date(e.data + 'T' + (e.horario || '10:00')),
    tipo: e.tipo,
    pregador: e.pregador || '',
    cantores: e.cantores || '',
    imagem: e.imagem || '',
    local: e.local || ''
  }));

  // Convert context photos
  const demoPhotos = fotosContext.map(f => ({
    id: String(f.id),
    url: f.url,
    title: f.titulo,
    date: f.data
  }));

  // Convert context videos (used in gallery section)
  const _contextVideos = videosContext.map(v => ({
    id: String(v.id),
    url: v.url,
    thumbnail: v.thumbnail,
    title: v.titulo
  }));
  void _contextVideos; // Mark as intentionally unused for now

  // Quiz questions from context or default questions
  const defaultQuestions = [
    { id: '1', pergunta: 'Quem construiu a arca?', opcoes: ['Moisés', 'Noé', 'Abraão', 'Davi'], resposta_correta: 1, imagem: '', dificuldade: 'facil', pontos: 30 },
    { id: '2', pergunta: 'Quantos discípulos Jesus tinha?', opcoes: ['10', '11', '12', '13'], resposta_correta: 2, imagem: '', dificuldade: 'facil', pontos: 30 },
    { id: '3', pergunta: 'Quem matou Golias?', opcoes: ['Saul', 'Davi', 'Salomão', 'Samuel'], resposta_correta: 1, imagem: '', dificuldade: 'facil', pontos: 30 },
    { id: '4', pergunta: 'Qual era a profissão de Jesus?', opcoes: ['Pescador', 'Carpinteiro', 'Pastor', 'Escriba'], resposta_correta: 1, imagem: '', dificuldade: 'medio', pontos: 50 },
    { id: '5', pergunta: 'Quantos dias Jesus ficou no deserto?', opcoes: ['30', '40', '50', '60'], resposta_correta: 1, imagem: '', dificuldade: 'medio', pontos: 50 }
  ];
  
  const quizQuestions = quizQuestionsContext.length > 0 
    ? quizQuestionsContext.map(q => ({
        id: String(q.id),
        pergunta: q.pergunta,
        opcoes: q.opcoes,
        resposta_correta: q.resposta_correta,
        imagem: q.imagem || '',
        dificuldade: q.dificuldade || 'facil',
        pontos: 30
      }))
    : defaultQuestions;

  // Ranking from context
  const rankingData = rankingContext.map(r => ({
    id: String(r.id),
    nome: r.nome,
    pontos: r.pontuacao,
    acertos: r.acertos,
    avatar: r.nome.charAt(0).toUpperCase()
  }));

  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Presence states
  const [showPresenceModal, setShowPresenceModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventoMembro | null>(null);
  const [presenceForm, setPresenceForm] = useState({ nome: user?.nome || '', whatsapp: '+351 ' });
  const [presenceConfirmed, setPresenceConfirmed] = useState(false);
  const [sendingNotifications, setSendingNotifications] = useState(false);

  // Message states
  const [messageForm, setMessageForm] = useState({ assunto: '', mensagem: '' });
  const [messageSent, setMessageSent] = useState(false);

  // Donation states
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationForm, setDonationForm] = useState({
    nome: user?.nome || '',
    whatsapp: '+351 ',
    email: '',
    valor: '',
    tipo: 'oferta' as 'dizimo' | 'oferta',
    metodo: 'mbway'
  });
  const [donationCompleted, setDonationCompleted] = useState(false);

  // Event detail states
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [eventDetail, setEventDetail] = useState<EventoMembro | null>(null);

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'events', label: 'Eventos e Cultos', icon: Calendar },
    { id: 'quiz', label: 'Quiz Bíblico', icon: BookOpen },
    { id: 'gallery', label: 'Galeria de Fotos', icon: Image },
    { id: 'donations', label: 'Doações', icon: Heart },
    { id: 'messages', label: 'Mensagem ao Pastor', icon: MessageSquare },
    { id: 'alerts', label: 'Alertas', icon: Bell }
  ];

  const formatEventDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffTime = d.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { label: 'HOJE!', isToday: true, isTomorrow: false };
    if (diffDays === 1) return { label: 'Amanhã', isToday: false, isTomorrow: true };
    return { label: `Em ${diffDays} dias`, isToday: false, isTomorrow: false };
  };

  const handlePresenceSubmit = async () => {
    if (!presenceForm.nome || presenceForm.whatsapp.length < 12 || !selectedEvent) return;
    
    setSendingNotifications(true);
    
    // Save presence to context
    addPresenca({
      igreja_id: selectedEvent.igreja_id,
      evento_id: selectedEvent.id,
      nome: presenceForm.nome,
      whatsapp: presenceForm.whatsapp,
      data: new Date().toISOString()
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSendingNotifications(false);
    setPresenceConfirmed(true);
    
    setTimeout(() => {
      setShowPresenceModal(false);
      setPresenceConfirmed(false);
      setPresenceForm({ nome: user?.nome || '', whatsapp: '+351 ' });
    }, 4000);
  };

  const handleMessageSubmit = async () => {
    if (!messageForm.assunto || !messageForm.mensagem) return;
    
    // Save message to context
    addMensagemPastor({
      igreja_id: 'public',
      nome: user?.nome || 'Anônimo',
      whatsapp: '',
      assunto: messageForm.assunto,
      mensagem: messageForm.mensagem,
      data: new Date().toISOString(),
      lida: false
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessageSent(true);
    
    setTimeout(() => {
      setMessageSent(false);
      setMessageForm({ assunto: '', mensagem: '' });
    }, 3000);
  };

  const handleDonationSubmit = async () => {
    if (!donationForm.nome || donationForm.whatsapp.length < 12 || !donationForm.valor) return;
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDonationCompleted(true);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === quizQuestions[currentQuestion].resposta_correta;
    
    if (isCorrect) {
      setScore(prev => prev + quizQuestions[currentQuestion].pontos);
      setCorrectAnswers(prev => prev + 1);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizFinished(false);
  };

  // Home Section
  const HomeSection = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Olá, {user?.nome?.split(' ')[0]}! 👋
          </h1>
          <p className="text-white/90">Bem-vindo(a) à área de membros da Igreja Cristã Nova Vida</p>
          <p className="text-white/70 text-sm mt-2">✨ "O Senhor é o meu pastor, nada me faltará" - Salmos 23:1</p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: 'Próximo Culto', color: 'from-red-500 to-rose-600', action: () => setActiveSection('events') },
          { icon: BookOpen, label: 'Quiz Bíblico', color: 'from-amber-500 to-orange-600', action: () => setActiveSection('quiz') },
          { icon: Heart, label: 'Fazer Doação', color: 'from-green-500 to-emerald-600', action: () => setShowDonationModal(true) },
          { icon: MessageSquare, label: 'Falar com Pastor', color: 'from-blue-500 to-indigo-600', action: () => setActiveSection('messages') }
        ].map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={item.action}
            className={`bg-gradient-to-br ${item.color} p-4 rounded-xl text-white flex flex-col items-center gap-2 hover:scale-105 transition-transform shadow-lg`}
          >
            <item.icon className="w-8 h-8" />
            <span className="text-sm font-medium text-center">{item.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Next Event */}
      {events.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-200"
        >
          <div className="bg-gradient-to-r from-red-500 to-rose-600 px-4 py-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-white animate-pulse" />
            <span className="text-white font-semibold">Próximo Evento</span>
          </div>
          <div className="p-4">
            <div className="flex gap-4">
              {events[0].imagem && (
                <img src={events[0].imagem} alt="" className="w-24 h-24 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium animate-pulse">
                    {formatEventDate(events[0].data).label}
                  </span>
                  <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">
                    {events[0].tipo === 'culto' ? 'Culto' : 'Evento'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800">{events[0].titulo}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(events[0].data).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
                  <MapPin className="w-4 h-4 ml-2" />
                  <span>{events[0].local}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedEvent(events[0]);
                    setShowPresenceModal(true);
                  }}
                  className="mt-3 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                >
                  Confirmar Presença
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Photos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-500" />
            Fotos Recentes
          </h2>
          <button
            onClick={() => setActiveSection('gallery')}
            className="text-purple-600 text-sm font-medium flex items-center gap-1 hover:underline"
          >
            Ver todas <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {demoPhotos.slice(0, 3).map((photo) => (
            <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden group">
              <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-white text-xs font-medium">{photo.title}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  // Events Section
  const EventsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-7 h-7 text-red-500" />
          Eventos e Cultos
        </h1>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => {
          const dateInfo = formatEventDate(event.data);
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${
                dateInfo.isToday ? 'border-red-500' : dateInfo.isTomorrow ? 'border-amber-500' : 'border-gray-200'
              }`}
            >
              {event.imagem && (
                <div className="relative h-40">
                  <img src={event.imagem} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {dateInfo.isToday && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                        🔴 HOJE!
                      </span>
                    )}
                    {dateInfo.isTomorrow && (
                      <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        Amanhã
                      </span>
                    )}
                    <span className={`text-white text-xs px-2 py-1 rounded-full ${
                      event.tipo === 'culto' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      {event.tipo === 'culto' ? 'Culto' : 'Evento'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg">{event.titulo}</h3>
                  </div>
                </div>
              )}
              
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <Calendar className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">
                      {new Date(event.data).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <Clock className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">
                      {new Date(event.data).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <MapPin className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                    <span className="text-xs text-gray-600 truncate block">{event.local}</span>
                  </div>
                </div>

                {(event.pregador || event.cantores) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    {event.pregador && (
                      <div className="flex items-center gap-2 mb-2">
                        <Mic className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-gray-700"><strong>Pregador:</strong> {event.pregador}</span>
                      </div>
                    )}
                    {event.cantores && (
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700"><strong>Louvor:</strong> {event.cantores}</span>
                      </div>
                    )}
                  </div>
                )}

                {event.descricao && (
                  <p className="text-gray-600 text-sm mb-4">{event.descricao}</p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEventDetail(event);
                      setShowEventDetail(true);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Detalhes
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowPresenceModal(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Confirmar Presença
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // Quiz Section
  const QuizSection = () => (
    <div className="space-y-6">
      {!quizStarted && !quizFinished ? (
        // Welcome Screen
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
              >
                {['⭐', '✨', '📖', '🙏', '❤️'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
          
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              📖
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Quiz Bíblico</h1>
            <p className="text-white/90 mb-6">Teste seus conhecimentos sobre a Bíblia!</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <Star className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm font-medium">{quizQuestions.length} Perguntas</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <Trophy className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm font-medium">Ganhe Pontos</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <Award className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm font-medium">Ranking</span>
              </div>
            </div>

            <button
              onClick={() => setQuizStarted(true)}
              className="bg-white text-orange-600 px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
            >
              Começar Quiz! 🎮
            </button>
          </div>
        </motion.div>
      ) : quizFinished ? (
        // Result Screen
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1 }}
            className="text-6xl mb-4"
          >
            🏆
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Finalizado!</h2>
          
          <div className="grid grid-cols-3 gap-4 my-6">
            <div className="bg-green-100 rounded-xl p-4">
              <span className="text-3xl font-bold text-green-600">{score}</span>
              <p className="text-sm text-green-700">Pontos</p>
            </div>
            <div className="bg-blue-100 rounded-xl p-4">
              <span className="text-3xl font-bold text-blue-600">{correctAnswers}</span>
              <p className="text-sm text-blue-700">Acertos</p>
            </div>
            <div className="bg-red-100 rounded-xl p-4">
              <span className="text-3xl font-bold text-red-600">{quizQuestions.length - correctAnswers}</span>
              <p className="text-sm text-red-700">Erros</p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            {correctAnswers >= 4 ? '🌟 Excelente! Você é um expert na Bíblia!' :
             correctAnswers >= 3 ? '👏 Muito bom! Continue estudando!' :
             '📖 Continue aprendendo, você vai melhorar!'}
          </p>

          <button
            onClick={resetQuiz}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Jogar Novamente
          </button>
        </motion.div>
      ) : (
        // Quiz Question
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="bg-gray-200 h-2">
            <motion.div
              className="bg-gradient-to-r from-amber-500 to-orange-600 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                Pergunta {currentQuestion + 1}/{quizQuestions.length}
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {score} pontos
              </span>
            </div>

            {quizQuestions[currentQuestion].imagem && (
              <img
                src={quizQuestions[currentQuestion].imagem}
                alt=""
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
            )}

            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {quizQuestions[currentQuestion].pergunta}
            </h3>

            <div className="space-y-3">
              {quizQuestions[currentQuestion].opcoes.map((opcao, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === quizQuestions[currentQuestion].resposta_correta;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                    whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                    onClick={() => handleQuizAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                      showCorrect ? 'border-green-500 bg-green-50' :
                      showWrong ? 'border-red-500 bg-red-50' :
                      isSelected ? 'border-amber-500 bg-amber-50' :
                      'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      showCorrect ? 'bg-green-500 text-white' :
                      showWrong ? 'bg-red-500 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {showCorrect ? '✓' : showWrong ? '✗' : String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium">{opcao}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Ranking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-4"
      >
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-500" />
          Ranking dos Jogadores
        </h3>
        <div className="space-y-2">
          {rankingData.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                index === 0 ? 'bg-amber-50' :
                index === 1 ? 'bg-gray-100' :
                index === 2 ? 'bg-orange-50' : 'bg-gray-50'
              }`}
            >
              <span className="text-2xl">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
              </span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {player.avatar}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{player.nome}</p>
                <p className="text-xs text-gray-500">{player.acertos} acertos</p>
              </div>
              <span className="font-bold text-amber-600">{player.pontos} pts</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  // Gallery Section
  const GallerySection = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Image className="w-7 h-7 text-purple-500" />
        Galeria de Fotos
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {demoPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer shadow-lg"
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <div>
                <p className="text-white font-bold">{photo.title}</p>
                <p className="text-white/70 text-sm">{photo.date}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Videos Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Video className="w-6 h-6 text-red-500" />
          Vídeos dos Cultos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Culto de Domingo - 05/01/2025', views: '234 visualizações' },
            { title: 'Noite de Louvor Especial', views: '189 visualizações' }
          ].map((video, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
            >
              <div className="relative h-40 bg-gray-900">
                <img
                  src={demoPhotos[index].url}
                  alt=""
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.views}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Donations Section
  const DonationsSection = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Heart className="w-7 h-7 text-green-500" />
        Doações
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <Gift className="w-12 h-12 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Contribua com a Igreja</h2>
        <p className="text-white/90 mb-4">
          "Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria." - 2 Coríntios 9:7
        </p>
        <button
          onClick={() => setShowDonationModal(true)}
          className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
        >
          Fazer uma Doação 💛
        </button>
      </motion.div>

      {/* Payment Methods Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'MB WAY', icon: '📱', color: 'from-red-500 to-rose-600', country: '🇵🇹' },
          { name: 'Transferência IBAN', icon: '🏦', color: 'from-blue-500 to-indigo-600', country: '🇵🇹' },
          { name: 'PIX', icon: '💚', color: 'from-green-500 to-emerald-600', country: '🇧🇷' }
        ].map((method, index) => (
          <motion.div
            key={method.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-4 text-center"
          >
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>
              {method.icon}
            </div>
            <h3 className="font-bold text-gray-800">{method.name}</h3>
            <span className="text-2xl">{method.country}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Messages Section
  const MessagesSection = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <MessageSquare className="w-7 h-7 text-blue-500" />
        Mensagem para o Pastor
      </h1>

      <AnimatePresence mode="wait">
        {messageSent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-green-800 mb-2">Mensagem Enviada!</h2>
            <p className="text-green-700">O pastor receberá sua mensagem em breve.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <p className="text-gray-600 mb-6">
              Envie uma mensagem diretamente para a liderança da igreja. Seu pedido de oração, dúvida ou sugestão será respondido com carinho.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                <input
                  type="text"
                  value={messageForm.assunto}
                  onChange={(e) => setMessageForm({ ...messageForm, assunto: e.target.value })}
                  placeholder="Ex: Pedido de oração, Dúvida, Sugestão..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sua Mensagem</label>
                <textarea
                  value={messageForm.mensagem}
                  onChange={(e) => setMessageForm({ ...messageForm, mensagem: e.target.value })}
                  placeholder="Escreva sua mensagem aqui..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={handleMessageSubmit}
                disabled={!messageForm.assunto || !messageForm.mensagem}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Enviar Mensagem
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Alerts Section
  const AlertsSection = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Bell className="w-7 h-7 text-red-500" />
        Alertas e Avisos
      </h1>

      <div className="space-y-4">
        {events.map((event, index) => {
          const dateInfo = formatEventDate(event.data);
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg p-4 border-l-4 ${
                dateInfo.isToday ? 'border-red-500' : dateInfo.isTomorrow ? 'border-amber-500' : 'border-indigo-500'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  dateInfo.isToday ? 'bg-red-100' : dateInfo.isTomorrow ? 'bg-amber-100' : 'bg-indigo-100'
                }`}>
                  <Bell className={`w-6 h-6 ${
                    dateInfo.isToday ? 'text-red-600 animate-pulse' : dateInfo.isTomorrow ? 'text-amber-600' : 'text-indigo-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {dateInfo.isToday && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                        🔴 HOJE!
                      </span>
                    )}
                    {dateInfo.isTomorrow && (
                      <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full font-bold">
                        Amanhã
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800">{event.titulo}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(event.data).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
                    <MapPin className="w-4 h-4 ml-2" />
                    <span>{event.local}</span>
                  </div>
                  {event.pregador && (
                    <p className="text-sm text-amber-600 mt-1">🎤 {event.pregador}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowPresenceModal(true);
                  }}
                  className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'home': return <HomeSection />;
      case 'events': return <EventsSection />;
      case 'quiz': return <QuizSection />;
      case 'gallery': return <GallerySection />;
      case 'donations': return <DonationsSection />;
      case 'messages': return <MessagesSection />;
      case 'alerts': return <AlertsSection />;
      default: return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="md:hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => setSidebarOpen(true)} className="p-2">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-bold">Área do Membro</h1>
        <button onClick={onLogout} className="p-2">
          <LogOut className="w-6 h-6" />
        </button>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-white shadow-xl min-h-screen sticky top-0">
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h1 className="font-bold text-lg">Igreja Cristã Nova Vida</h1>
            <p className="text-sm text-white/80">Área do Membro</p>
          </div>
          
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {user?.nome?.charAt(0) || 'M'}
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.nome}</p>
                <p className="text-sm text-gray-500">Membro</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.id === 'alerts' && (
                  <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {events.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="md:hidden fixed inset-0 bg-black/50 z-50"
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="md:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl"
              >
                <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
                  <div>
                    <h1 className="font-bold">Igreja Cristã Nova Vida</h1>
                    <p className="text-sm text-white/80">Área do Membro</p>
                  </div>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {user?.nome?.charAt(0) || 'M'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user?.nome}</p>
                      <p className="text-sm text-gray-500">Membro</p>
                    </div>
                  </div>
                </div>

                <nav className="p-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                        activeSection === item.id
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>

      {/* Presence Modal */}
      <AnimatePresence>
        {showPresenceModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {presenceConfirmed ? (
                <div className="p-6 text-center">
                  <div className="relative mb-4">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][i % 5],
                          left: `${Math.random() * 100}%`,
                          top: 0
                        }}
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: 200, opacity: 0 }}
                        transition={{ duration: 1.5, delay: i * 0.05 }}
                      />
                    ))}
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Presença Confirmada! 🎉</h2>
                  <p className="text-gray-600 mb-4">
                    Olá {presenceForm.nome.split(' ')[0]}, recebemos sua confirmação!
                  </p>

                  <div className="bg-green-50 rounded-xl p-4 text-left mb-4">
                    <p className="text-sm text-green-800">
                      ✅ WhatsApp enviado para {presenceForm.whatsapp}<br/>
                      ✅ SMS enviado<br/>
                      ✅ Lembrete agendado
                    </p>
                  </div>

                  <div className="bg-gray-100 rounded-xl p-4 text-left">
                    <p className="text-xs text-gray-500 mb-1">Preview da mensagem:</p>
                    <p className="text-sm text-gray-700">
                      🙏 Olá {presenceForm.nome.split(' ')[0]}! Sua presença no evento "{selectedEvent.titulo}" foi confirmada. Te esperamos! 🙌
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-red-500 to-rose-600 p-4 text-white">
                    <h2 className="font-bold text-lg">Confirmar Presença</h2>
                    <p className="text-sm text-white/80">{selectedEvent.titulo}</p>
                  </div>

                  <div className="p-4">
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(selectedEvent.data).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(selectedEvent.data).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
                        <MapPin className="w-4 h-4 ml-2" />
                        <span>{selectedEvent.local}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <User className="w-4 h-4 inline mr-1" />
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={presenceForm.nome}
                          onChange={(e) => setPresenceForm({ ...presenceForm, nome: e.target.value })}
                          placeholder="Seu nome completo"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Phone className="w-4 h-4 inline mr-1" />
                          WhatsApp / Telemóvel * 🇵🇹
                        </label>
                        <input
                          type="tel"
                          value={presenceForm.whatsapp}
                          onChange={(e) => setPresenceForm({ ...presenceForm, whatsapp: e.target.value })}
                          placeholder="+351 9XX XXX XXX"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">🇧🇷 Brasil: +55 | 🇵🇹 Portugal: +351</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={() => {
                          setShowPresenceModal(false);
                          setPresenceForm({ nome: user?.nome || '', whatsapp: '+351 ' });
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handlePresenceSubmit}
                        disabled={!presenceForm.nome || presenceForm.whatsapp.length < 12 || sendingNotifications}
                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {sendingNotifications ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            Confirmar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {donationCompleted ? (
                <div className="p-6 text-center">
                  <div className="relative mb-4">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'][i % 4],
                          left: `${Math.random() * 100}%`,
                          top: 0
                        }}
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: 200, opacity: 0 }}
                        transition={{ duration: 1.5, delay: i * 0.05 }}
                      />
                    ))}
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Obrigado! 🙏</h2>
                  <p className="text-gray-600 mb-2">Sua doação de €{donationForm.valor} foi registrada!</p>
                  <p className="text-sm text-gray-500 mb-4">Um lembrete de agradecimento foi enviado para seu WhatsApp.</p>
                  
                  <button
                    onClick={() => {
                      setShowDonationModal(false);
                      setDonationCompleted(false);
                      setDonationForm({ nome: user?.nome || '', whatsapp: '+351 ', email: '', valor: '', tipo: 'oferta', metodo: 'mbway' });
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold"
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-bold text-lg">Fazer Doação</h2>
                        <p className="text-sm text-white/80">💛 O que seu coração falar</p>
                      </div>
                      <button onClick={() => setShowDonationModal(false)}>
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={donationForm.nome}
                        onChange={(e) => setDonationForm({ ...donationForm, nome: e.target.value })}
                        placeholder="Nome Completo *"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="tel"
                        value={donationForm.whatsapp}
                        onChange={(e) => setDonationForm({ ...donationForm, whatsapp: e.target.value })}
                        placeholder="+351 WhatsApp *"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>

                    <input
                      type="email"
                      value={donationForm.email}
                      onChange={(e) => setDonationForm({ ...donationForm, email: e.target.value })}
                      placeholder="E-mail (opcional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      {['dizimo', 'oferta'].map((tipo) => (
                        <button
                          key={tipo}
                          onClick={() => setDonationForm({ ...donationForm, tipo: tipo as 'dizimo' | 'oferta' })}
                          className={`py-2 rounded-lg font-medium text-sm transition-all ${
                            donationForm.tipo === tipo
                              ? tipo === 'dizimo' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {tipo === 'dizimo' ? '📖 Dízimo' : '💜 Oferta'}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valor (€)</label>
                      <input
                        type="number"
                        value={donationForm.valor}
                        onChange={(e) => setDonationForm({ ...donationForm, valor: e.target.value })}
                        placeholder="0,00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-xl font-bold text-center"
                      />
                      <div className="flex gap-2 mt-2">
                        {[10, 25, 50, 100].map((val) => (
                          <button
                            key={val}
                            onClick={() => setDonationForm({ ...donationForm, valor: val.toString() })}
                            className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
                          >
                            €{val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'mbway', name: 'MB WAY', icon: '📱', flag: '🇵🇹' },
                        { id: 'iban', name: 'IBAN', icon: '🏦', flag: '🇵🇹' },
                        { id: 'pix', name: 'PIX', icon: '💚', flag: '🇧🇷' }
                      ].map((metodo) => (
                        <button
                          key={metodo.id}
                          onClick={() => setDonationForm({ ...donationForm, metodo: metodo.id })}
                          className={`py-3 rounded-lg text-center transition-all ${
                            donationForm.metodo === metodo.id
                              ? 'bg-green-100 border-2 border-green-500'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <span className="text-xl">{metodo.icon}</span>
                          <p className="text-xs font-medium">{metodo.name}</p>
                          <span className="text-xs">{metodo.flag}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleDonationSubmit}
                      disabled={!donationForm.nome || donationForm.whatsapp.length < 12 || !donationForm.valor}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
                    >
                      Confirmar Doação
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {showEventDetail && eventDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              {eventDetail.imagem && (
                <div className="relative h-48">
                  <img src={eventDetail.imagem} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <button
                    onClick={() => setShowEventDetail(false)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex gap-2 mb-2">
                      <span className={`text-white text-xs px-2 py-1 rounded-full ${
                        eventDetail.tipo === 'culto' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}>
                        {eventDetail.tipo === 'culto' ? 'Culto' : 'Evento'}
                      </span>
                    </div>
                    <h2 className="text-white font-bold text-xl">{eventDetail.titulo}</h2>
                  </div>
                </div>
              )}

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Calendar className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    <span className="text-sm font-medium">
                      {new Date(eventDetail.data).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <span className="text-sm font-medium">
                      {new Date(eventDetail.data).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <MapPin className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <span className="text-sm font-medium truncate block">{eventDetail.local}</span>
                  </div>
                </div>

                {(eventDetail.pregador || eventDetail.cantores) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h3 className="font-bold text-amber-800 mb-2">⭐ Quem vai ministrar</h3>
                    {eventDetail.pregador && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
                          <Mic className="w-4 h-4 text-amber-700" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Pregador</p>
                          <p className="font-medium text-gray-800">{eventDetail.pregador}</p>
                        </div>
                      </div>
                    )}
                    {eventDetail.cantores && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                          <Music className="w-4 h-4 text-purple-700" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Louvor</p>
                          <p className="font-medium text-gray-800">{eventDetail.cantores}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {eventDetail.descricao && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">📝 Sobre o Evento</h3>
                    <p className="text-gray-600">{eventDetail.descricao}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowEventDetail(false);
                    setSelectedEvent(eventDetail);
                    setShowPresenceModal(true);
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 rounded-xl font-bold"
                >
                  Confirmar Presença
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
