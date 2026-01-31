import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Calendar, Heart, BookOpen, Bell, Image, Settings,
  LayoutDashboard, LogOut, Menu, X, Plus, Search, ChevronRight,
  DollarSign, TrendingUp, UserPlus, Play, Edit3, ToggleLeft, ToggleRight,
  Phone, Mail, Save, Trash2, User, CheckCircle, XCircle, Clock,
  Send, MessageCircle, AlertTriangle, CalendarPlus, Eye, MapPin, Share2
} from 'lucide-react';
import { ServiceReminder, ServiceAlertButton } from './ServiceReminder';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useChurchData } from '@/contexts/ChurchDataContext';
import type { Membro, EventoCulto, QuizEscolinha, Doacao } from '@/types';

interface DashboardProps {
  onLogout: () => void;
}

// No demo data - all data comes from ChurchDataContext
// Each church starts with empty data

export function Dashboard({ onLogout }: DashboardProps) {
  const { t } = useLanguage();
  const { user, igreja } = useAuth();
  
  // Use ChurchDataContext for shared data - all data starts empty
  const { 
    eventos: contextEvents, 
    setEventos,
    membros: contextMembros,
    doacoes: contextDoacoes
  } = useChurchData();
  
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showServiceReminder, setShowServiceReminder] = useState(false);
  
  // Converte eventos do contexto para o formato EventoCulto
  const events: EventoCulto[] = contextEvents.map(e => ({
    id: e.id.toString(),
    igreja_id: e.igreja_id.toString(),
    titulo: e.titulo,
    descricao: e.descricao || '',
    data: new Date(e.data),
    tipo: e.tipo,
    pregador: e.pregador,
    cantores: e.cantores,
    imagem: e.imagem,
    local: e.local
  }));
  
  // Função para atualizar eventos no contexto
  const setEvents = (newEvents: EventoCulto[] | ((prev: EventoCulto[]) => EventoCulto[])) => {
    if (typeof newEvents === 'function') {
      const updated = newEvents(events);
      setEventos(updated.map(e => ({
        id: e.id.toString(),
        igreja_id: '1',
        titulo: e.titulo,
        descricao: e.descricao || '',
        data: e.data instanceof Date ? e.data.toISOString().split('T')[0] : e.data as string,
        horario: e.data instanceof Date ? e.data.toTimeString().slice(0, 5) : '10:00',
        tipo: e.tipo,
        pregador: e.pregador,
        cantores: e.cantores,
        imagem: e.imagem,
        local: e.local
      })));
    } else {
      setEventos(newEvents.map(e => ({
        id: e.id.toString(),
        igreja_id: '1',
        titulo: e.titulo,
        descricao: e.descricao || '',
        data: e.data instanceof Date ? e.data.toISOString().split('T')[0] : e.data as string,
        horario: e.data instanceof Date ? e.data.toTimeString().slice(0, 5) : '10:00',
        tipo: e.tipo,
        pregador: e.pregador,
        cantores: e.cantores,
        imagem: e.imagem,
        local: e.local
      })));
    }
  };
  
  // Converte membros do contexto para o formato Membro
  const members: Membro[] = contextMembros.map(m => ({
    id: m.id.toString(),
    igreja_id: m.igreja_id.toString(),
    nome: m.nome,
    email: m.email,
    telefone: m.telefone,
    data_batismo: m.data_batismo ? new Date(m.data_batismo) : undefined,
    status: m.status,
    foto: m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.nome}`
  }));
  
  // Converte doações do contexto para o formato Doacao
  const donations: Doacao[] = contextDoacoes.map(d => ({
    id: d.id.toString(),
    igreja_id: d.igreja_id.toString(),
    membro_id: d.membro_id?.toString(),
    valor: d.valor,
    tipo: d.tipo,
    data: new Date(d.data),
    nome_doador: d.nome_doador,
    whatsapp_doador: d.whatsapp_doador,
    email_doador: d.email_doador,
    metodo: d.metodo
  }));

  // Show service reminder automatically when there's an event within 24 hours
  useEffect(() => {
    const checkUpcomingEvents = () => {
      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const hasEventSoon = events.some(e => {
        const eventDate = new Date(e.data);
        return eventDate > now && eventDate <= in24Hours;
      });
      
      // Show reminder on first visit if there's an upcoming event
      const hasSeenReminder = sessionStorage.getItem('hasSeenServiceReminder');
      if (hasEventSoon && !hasSeenReminder) {
        setTimeout(() => {
          setShowServiceReminder(true);
          sessionStorage.setItem('hasSeenServiceReminder', 'true');
        }, 2000);
      }
    };

    checkUpcomingEvents();
  }, [events]);

  const hasUpcomingEvent = events.some(e => new Date(e.data) > new Date());

  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: t('dashboard.overview') },
    { id: 'members', icon: Users, label: t('dashboard.members') },
    { id: 'events', icon: Calendar, label: t('dashboard.events') },
    { id: 'donations', icon: Heart, label: t('dashboard.donations') },
    { id: 'school', icon: BookOpen, label: t('dashboard.sundaySchool') },
    { id: 'gallery', icon: Image, label: t('dashboard.gallery') },
    { id: 'notifications', icon: Bell, label: t('dashboard.notifications') },
    { id: 'settings', icon: Settings, label: t('dashboard.settings') },
  ];

  // Calculate stats from context data
  const totalDonations = donations.reduce((acc, d) => acc + d.valor, 0);
  const nextEvent = events.filter(e => new Date(e.data) > new Date()).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())[0];
  const nextEventLabel = nextEvent 
    ? new Date(nextEvent.data).toLocaleDateString('pt-BR', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
    : 'Nenhum';
  
  const stats = [
    { label: t('dashboard.totalMembers'), value: members.length.toString(), icon: Users, color: 'from-blue-500 to-cyan-500', change: members.length > 0 ? '+' + members.length : '0' },
    { label: t('dashboard.monthlyDonations'), value: '€' + totalDonations.toFixed(2), icon: DollarSign, color: 'from-green-500 to-emerald-500', change: donations.length > 0 ? '+' + donations.length : '0' },
    { label: t('dashboard.nextEvent'), value: nextEventLabel, icon: Calendar, color: 'from-purple-500 to-pink-500', change: events.length + ' eventos' },
    { label: t('dashboard.activeQuizzes'), value: '0', icon: BookOpen, color: 'from-orange-500 to-amber-500', change: 'Padrão' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection stats={stats} members={members} events={events} />;
      case 'members':
        return <MembersSection members={members} />;
      case 'events':
        return <EventsSection events={events} members={members} onEventsChange={setEvents} />;
      case 'donations':
        return <DonationsSection donations={donations} />;
      case 'school':
        return <SundaySchoolSection quizzes={[]} />;
      case 'gallery':
        return <GallerySection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'settings':
        return <SettingsSection igreja={igreja} />;
      default:
        return <OverviewSection stats={stats} members={members} events={events} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar - Desktop */}
      <aside className={`fixed left-0 top-0 bottom-0 z-40 bg-slate-800/90 backdrop-blur-xl border-r border-white/10 transition-all duration-300 hidden md:block ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">✝</span>
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span className="text-white font-bold">ChurchConnect</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Church Info */}
        {sidebarOpen && (
          <div className="p-4 border-b border-white/10">
            <p className="text-white font-semibold truncate">{igreja?.nome}</p>
            <p className="text-gray-400 text-sm truncate">{user?.email}</p>
          </div>
        )}

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Toggle & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <Menu className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Minimizar</span>}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>{t('dashboard.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-800/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white">✝</span>
            </div>
            <span className="text-white font-bold">{igreja?.nome}</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10 overflow-hidden"
            >
              <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : 'text-gray-400'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 rounded-xl">
                  <LogOut className="w-5 h-5" />
                  <span>{t('dashboard.logout')}</span>
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className={`transition-all duration-300 pt-20 md:pt-0 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {t('dashboard.welcome')}, {user?.nome?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-400 mt-1">{menuItems.find(m => m.id === activeSection)?.label}</p>
          </div>

          {/* Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>

      {/* Service Reminder Alert */}
      <ServiceReminder
        events={events}
        isOpen={showServiceReminder}
        onClose={() => setShowServiceReminder(false)}
        onViewAll={() => {
          setShowServiceReminder(false);
          setActiveSection('events');
        }}
        onOpenAgenda={() => {
          setShowServiceReminder(false);
          setActiveSection('events');
          // Trigger agenda modal after switching to events section
          setTimeout(() => {
            const agendaBtn = document.querySelector('[data-agenda-btn]') as HTMLButtonElement;
            if (agendaBtn) agendaBtn.click();
          }, 100);
        }}
      />

      {/* Floating Alert Button */}
      <ServiceAlertButton
        onClick={() => setShowServiceReminder(true)}
        hasUpcoming={hasUpcomingEvent}
        nextEvent={events.filter(e => new Date(e.data) > new Date()).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())[0] || null}
        onOpenAgenda={() => {
          setActiveSection('events');
          // Trigger agenda modal after switching to events section
          setTimeout(() => {
            const agendaBtn = document.querySelector('[data-agenda-btn]') as HTMLButtonElement;
            if (agendaBtn) agendaBtn.click();
          }, 100);
        }}
      />
    </div>
  );
}

// Overview Section
function OverviewSection({ stats, members, events }: { stats: any[]; members: Membro[]; events: EventoCulto[] }) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Membros Recentes</h3>
            <button className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {members.length > 0 ? (
            <div className="space-y-3">
              {members.slice(0, 4).map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <img src={member.foto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.nome}`} alt={member.nome} className="w-10 h-10 rounded-full bg-slate-700" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{member.nome}</p>
                    <p className="text-gray-400 text-sm truncate">{member.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${member.status === 'ativo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {member.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Nenhum membro cadastrado</p>
              <p className="text-gray-500 text-xs mt-1">Comece adicionando membros da sua igreja</p>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Próximos Eventos</h3>
            <button className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex flex-col items-center justify-center text-white">
                    <span className="text-xs">{new Date(event.data).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                    <span className="text-lg font-bold">{new Date(event.data).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{event.titulo}</p>
                    <p className="text-gray-400 text-sm">{new Date(event.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${event.tipo === 'culto' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {event.tipo}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Nenhum evento cadastrado</p>
              <p className="text-gray-500 text-xs mt-1">Crie seu primeiro culto ou evento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Members Section
function MembersSection({ members: initialMembers }: { members: Membro[] }) {
  const [members, setMembers] = useState<Membro[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Membro | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    data_batismo: '',
    status: 'ativo' as 'ativo' | 'inativo'
  });

  const filteredMembers = members.filter(member =>
    member.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewMemberModal = () => {
    setEditingMember(null);
    setFormData({ nome: '', email: '', telefone: '', data_batismo: '', status: 'ativo' });
    setShowModal(true);
  };

  const openEditModal = (member: Membro) => {
    setEditingMember(member);
    setFormData({
      nome: member.nome,
      email: member.email,
      telefone: member.telefone || '',
      data_batismo: member.data_batismo ? new Date(member.data_batismo).toISOString().split('T')[0] : '',
      status: member.status
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.email) return;

    if (editingMember) {
      // Update existing member
      setMembers(members.map(m => 
        m.id === editingMember.id 
          ? { 
              ...m, 
              nome: formData.nome,
              email: formData.email,
              telefone: formData.telefone,
              data_batismo: formData.data_batismo ? new Date(formData.data_batismo) : undefined,
              status: formData.status
            }
          : m
      ));
    } else {
      // Add new member
      const newMember: Membro = {
        id: Date.now().toString(),
        igreja_id: '1',
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        data_batismo: formData.data_batismo ? new Date(formData.data_batismo) : undefined,
        status: formData.status,
        foto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.nome}`
      };
      setMembers([...members, newMember]);
    }
    setShowModal(false);
  };

  const toggleStatus = (memberId: string) => {
    setMembers(members.map(m =>
      m.id === memberId
        ? { ...m, status: m.status === 'ativo' ? 'inativo' : 'ativo' }
        : m
    ));
  };

  const deleteMember = (memberId: string) => {
    if (confirm('Tem certeza que deseja remover este membro?')) {
      setMembers(members.filter(m => m.id !== memberId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar membro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button 
          onClick={openNewMemberModal}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/30"
        >
          <UserPlus className="w-5 h-5" />
          <span>Novo Membro</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total de Membros</p>
          <p className="text-2xl font-bold text-white">{members.length}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <p className="text-green-400 text-sm">Ativos</p>
          <p className="text-2xl font-bold text-green-400">{members.filter(m => m.status === 'ativo').length}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">Inativos</p>
          <p className="text-2xl font-bold text-red-400">{members.filter(m => m.status === 'inativo').length}</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
          <p className="text-purple-400 text-sm">Batizados</p>
          <p className="text-2xl font-bold text-purple-400">{members.filter(m => m.data_batismo).length}</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">Nome</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium hidden md:table-cell">Email</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium hidden lg:table-cell">Telefone</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">Status</th>
                <th className="px-6 py-4 text-right text-gray-400 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers.map((member) => (
                <motion.tr 
                  key={member.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={member.foto} alt={member.nome} className="w-10 h-10 rounded-full bg-slate-700" />
                      <div>
                        <span className="text-white font-medium block">{member.nome}</span>
                        {member.data_batismo && (
                          <span className="text-gray-500 text-xs">
                            Batizado em {new Date(member.data_batismo).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {member.telefone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(member.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                        member.status === 'ativo'
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                    >
                      {member.status === 'ativo' ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          <span className="text-xs font-medium">Ativo</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          <span className="text-xs font-medium">Inativo</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(member)}
                        className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteMember(member.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum membro encontrado</p>
          </div>
        )}
      </div>

      {/* Member Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      {editingMember ? <Edit3 className="w-6 h-6 text-white" /> : <UserPlus className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {editingMember ? 'Editar Membro' : 'Novo Membro'}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {editingMember ? 'Atualize as informações do membro' : 'Cadastre um novo membro gratuitamente'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Nome Completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Digite o nome completo"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">E-mail *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Digite o e-mail"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="+55 11 99999-9999"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Data de Batismo</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.data_batismo}
                      onChange={(e) => setFormData({ ...formData, data_batismo: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Status</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'ativo' })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                        formData.status === 'ativo'
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Ativo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'inativo' })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                        formData.status === 'inativo'
                          ? 'bg-red-500/20 border-red-500 text-red-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Inativo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-white/5 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.nome || !formData.email}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingMember ? 'Atualizar' : 'Cadastrar'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Use EventoCulto from types (already includes pregador, cantores, imagem, local)
type EventoExtended = EventoCulto;

// Events Section
function EventsSection({ events: initialEvents, members, onEventsChange }: { events: EventoCulto[]; members: Membro[]; onEventsChange?: (events: EventoCulto[]) => void }) {
  const [events, setEventsLocal] = useState<EventoExtended[]>(initialEvents.map(e => ({
    ...e,
    pregador: e.pregador || '',
    cantores: e.cantores || '',
    imagem: e.imagem || '',
    local: e.local || 'Templo Principal'
  })));
  
  // Sincroniza eventos locais com o pai
  const setEvents = (newEvents: EventoExtended[] | ((prev: EventoExtended[]) => EventoExtended[])) => {
    setEventsLocal(prev => {
      const updated = typeof newEvents === 'function' ? newEvents(prev) : newEvents;
      if (onEventsChange) {
        onEventsChange(updated);
      }
      return updated;
    });
  };
  const [showModal, setShowModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<EventoExtended | null>(null);
  const [showInterestConfirm, setShowInterestConfirm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventoExtended | null>(null);
  const [selectedEventForReminder, setSelectedEventForReminder] = useState<EventoExtended | null>(null);
  const [reminderSent, setReminderSent] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data: '',
    hora: '',
    tipo: 'culto' as 'culto' | 'evento',
    local: '',
    pregador: '',
    cantores: '',
    imagem: ''
  });

  const openNewEventModal = () => {
    setEditingEvent(null);
    setFormData({ titulo: '', descricao: '', data: '', hora: '', tipo: 'culto', local: '', pregador: '', cantores: '', imagem: '' });
    setSelectedImage(null);
    setShowModal(true);
  };

  const openEditModal = (event: EventoExtended) => {
    setEditingEvent(event);
    const eventDate = new Date(event.data);
    setFormData({
      titulo: event.titulo,
      descricao: event.descricao || '',
      data: eventDate.toISOString().split('T')[0],
      hora: eventDate.toTimeString().slice(0, 5),
      tipo: event.tipo,
      local: event.local || '',
      pregador: event.pregador || '',
      cantores: event.cantores || '',
      imagem: event.imagem || ''
    });
    setSelectedImage(event.imagem || null);
    setShowModal(true);
  };
  
  // Handle image upload simulation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate image upload - in real app, upload to server
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setSelectedImage(imageUrl);
        setFormData({ ...formData, imagem: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Sample images for selection
  const sampleImages = [
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1519491050282-cf00c82424fd?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?w=400&h=200&fit=crop',
  ];

  const handleSave = () => {
    if (!formData.titulo || !formData.data || !formData.hora) return;

    const eventDateTime = new Date(`${formData.data}T${formData.hora}`);

    if (editingEvent) {
      setEvents(events.map(e =>
        e.id === editingEvent.id
          ? { 
              ...e, 
              titulo: formData.titulo, 
              descricao: formData.descricao, 
              data: eventDateTime, 
              tipo: formData.tipo,
              pregador: formData.pregador,
              cantores: formData.cantores,
              imagem: formData.imagem,
              local: formData.local
            }
          : e
      ));
    } else {
      const newEvent: EventoExtended = {
        id: Date.now().toString(),
        igreja_id: '1',
        titulo: formData.titulo,
        descricao: formData.descricao,
        data: eventDateTime,
        tipo: formData.tipo,
        pregador: formData.pregador,
        cantores: formData.cantores,
        imagem: formData.imagem,
        local: formData.local
      };
      setEvents([...events, newEvent]);
    }
    setShowModal(false);
  };

  const deleteEvent = (eventId: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  const openReminderModal = (event: EventoCulto) => {
    setSelectedEventForReminder(event);
    setShowReminderModal(true);
  };

  const openEventDetails = (event: EventoExtended) => {
    setSelectedEventForDetails(event);
    setShowEventDetailModal(true);
  };

  const confirmInterest = () => {
    setShowInterestConfirm(true);
    setTimeout(() => {
      setShowInterestConfirm(false);
    }, 3000);
  };

  const sendReminder = (channel: 'whatsapp' | 'email' | 'sms' | 'all') => {
    if (!selectedEventForReminder) return;
    
    // Simulate sending reminders
    setTimeout(() => {
      setReminderSent(prev => [...prev, `${selectedEventForReminder.id}-${channel}`]);
      setTimeout(() => {
        setShowReminderModal(false);
        setSelectedEventForReminder(null);
      }, 1500);
    }, 1000);
  };

  const isReminderSent = (eventId: string, channel: string) => {
    return reminderSent.includes(`${eventId}-${channel}`) || reminderSent.includes(`${eventId}-all`);
  };

  const getRelativeDate = (date: Date) => {
    const now = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Passou';
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    return `Em ${diffDays} dias`;
  };

  const upcomingEvents = events
    .filter(e => new Date(e.data) >= new Date())
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  const pastEvents = events
    .filter(e => new Date(e.data) < new Date())
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Agenda de Cultos e Eventos</h2>
          <p className="text-gray-400 text-sm mt-1">{upcomingEvents.length} eventos próximos • {members.length} membros para notificar</p>
        </div>
        <button 
          onClick={openNewEventModal}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/30"
        >
          <CalendarPlus className="w-5 h-5" />
          <span>Novo Evento</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total de Eventos</p>
          <p className="text-2xl font-bold text-white">{events.length}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <p className="text-blue-400 text-sm">Cultos</p>
          <p className="text-2xl font-bold text-blue-400">{events.filter(e => e.tipo === 'culto').length}</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
          <p className="text-purple-400 text-sm">Eventos Especiais</p>
          <p className="text-2xl font-bold text-purple-400">{events.filter(e => e.tipo === 'evento').length}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <p className="text-green-400 text-sm">Lembretes Enviados</p>
          <p className="text-2xl font-bold text-green-400">{reminderSent.length}</p>
        </div>
      </div>

      {/* Agenda Completa Button */}
      <div className="flex justify-end mb-4">
        <button
          data-agenda-btn
          onClick={() => setShowAgendaModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-400 hover:to-rose-500 transition-all shadow-lg shadow-red-500/30"
        >
          <Calendar className="w-5 h-5" />
          <span>📅 Ver Agenda Completa</span>
        </button>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Próximos Eventos
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => {
              const relativeDate = getRelativeDate(event.data);
              const isToday = relativeDate === 'Hoje';
              const isTomorrow = relativeDate === 'Amanhã';
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white/5 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all ${
                    isToday ? 'border-amber-500/50 bg-amber-500/5' : 
                    isTomorrow ? 'border-indigo-500/50' : 'border-white/10'
                  }`}
                >
                  {/* Event Image */}
                  {event.imagem && (
                    <div className="relative h-32 overflow-hidden">
                      <img src={event.imagem} alt={event.titulo} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.tipo === 'culto' ? 'bg-blue-500/80 text-white' : 'bg-purple-500/80 text-white'
                        }`}>
                          {event.tipo === 'culto' ? '⛪ Culto' : '🎉 Evento'}
                        </span>
                        {isToday && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse font-bold">
                            HOJE!
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4">
                    {/* Urgent Badge - Only if no image */}
                    {isToday && !event.imagem && (
                      <div className="flex items-center gap-2 mb-3 text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase animate-pulse">Hoje!</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white ${
                        event.tipo === 'culto' 
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                          : 'bg-gradient-to-br from-purple-500 to-pink-500'
                      }`}>
                        <span className="text-[10px]">{new Date(event.data).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                        <span className="text-xl font-bold">{new Date(event.data).getDate()}</span>
                      </div>
                      <div className="text-right">
                        {!event.imagem && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.tipo === 'culto' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {event.tipo}
                          </span>
                        )}
                        <div className={`text-xs font-medium mt-1 ${
                          isToday ? 'text-amber-400' : isTomorrow ? 'text-indigo-400' : 'text-gray-500'
                        }`}>
                          {relativeDate}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-1">{event.titulo}</h3>
                    
                    {/* Location */}
                    {event.local && (
                      <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
                        📍 {event.local}
                      </p>
                    )}
                    
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.descricao}</p>
                    
                    {/* Preacher & Singers */}
                    {(event.pregador || event.cantores) && (
                      <div className="bg-white/5 rounded-lg p-2 mb-3 space-y-1">
                        {event.pregador && (
                          <p className="text-amber-400 text-xs flex items-center gap-1">
                            🎤 <span className="text-gray-300">Pregador:</span> {event.pregador}
                          </p>
                        )}
                        {event.cantores && (
                          <p className="text-purple-400 text-xs flex items-center gap-1">
                            🎵 <span className="text-gray-300">Louvor:</span> {event.cantores}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(event.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => openEventDetails(event)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Detalhes</span>
                      </button>
                      <button
                        onClick={() => openReminderModal(event)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all text-xs"
                      >
                        <Send className="w-3 h-3" />
                        <span>Lembrete</span>
                      </button>
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-2 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Reminder Status */}
                    {isReminderSent(event.id, 'all') && (
                      <div className="mt-2 flex items-center gap-1 text-green-400 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        <span>Lembrete enviado para {members.length} membros</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-400 mb-4">Eventos Anteriores</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
            {pastEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-xl flex flex-col items-center justify-center text-white">
                    <span className="text-xs">{new Date(event.data).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                    <span className="text-lg font-bold">{new Date(event.data).getDate()}</span>
                  </div>
                  <span className="text-gray-500 text-xs">Realizado</span>
                </div>
                <h3 className="text-md font-semibold text-gray-300">{event.titulo}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
          <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum evento cadastrado</h3>
          <p className="text-gray-400 mb-4">Crie seu primeiro culto ou evento para começar</p>
          <button
            onClick={openNewEventModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Criar Evento</span>
          </button>
        </div>
      )}

      {/* Event Modal - Complete with Image, Preacher, Singers */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      {editingEvent ? <Edit3 className="w-5 h-5 text-white" /> : <CalendarPlus className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {editingEvent ? 'Editar Evento' : 'Novo Evento/Culto'}
                      </h3>
                      <p className="text-white/70 text-xs">
                        Preencha todos os detalhes do evento
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 space-y-4">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                    📸 Imagem do Evento
                  </label>
                  
                  {/* Selected Image Preview */}
                  {selectedImage && (
                    <div className="relative mb-3 rounded-xl overflow-hidden">
                      <img src={selectedImage} alt="Preview" className="w-full h-40 object-cover" />
                      <button
                        onClick={() => { setSelectedImage(null); setFormData({...formData, imagem: ''}); }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  {!selectedImage && (
                    <div className="space-y-3">
                      <label className="flex items-center justify-center gap-3 p-4 bg-white/5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-indigo-500 transition-all">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Image className="w-6 h-6 text-gray-400" />
                        <span className="text-gray-400">Clique para fazer upload de imagem</span>
                      </label>
                      
                      {/* Sample Images */}
                      <div>
                        <p className="text-gray-500 text-xs mb-2">Ou selecione uma imagem:</p>
                        <div className="grid grid-cols-6 gap-2">
                          {sampleImages.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => { setSelectedImage(img); setFormData({...formData, imagem: img}); }}
                              className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all"
                            >
                              <img src={img} alt={`Sample ${idx}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Title and Type Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">Título *</label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      placeholder="Ex: Culto de Domingo"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Tipo</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tipo: 'culto' })}
                        className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border text-sm transition-all ${
                          formData.tipo === 'culto'
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        Culto
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tipo: 'evento' })}
                        className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border text-sm transition-all ${
                          formData.tipo === 'evento'
                            ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        Evento
                      </button>
                    </div>
                  </div>
                </div>

                {/* Date, Time, Location Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">📅 Data *</label>
                    <input
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">🕐 Horário *</label>
                    <input
                      type="time"
                      value={formData.hora}
                      onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">📍 Local</label>
                    <input
                      type="text"
                      value={formData.local}
                      onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                      placeholder="Templo Principal"
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Preacher and Singers - Special Section */}
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
                  <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                    ⭐ Ministração
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        🎤 Pregador / Preletor
                      </label>
                      <input
                        type="text"
                        value={formData.pregador}
                        onChange={(e) => setFormData({ ...formData, pregador: e.target.value })}
                        placeholder="Nome do pregador"
                        className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        🎵 Cantores / Louvor
                      </label>
                      <input
                        type="text"
                        value={formData.cantores}
                        onChange={(e) => setFormData({ ...formData, cantores: e.target.value })}
                        placeholder="Ministério de louvor, cantores"
                        className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">📝 Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva detalhes do evento, mensagem especial, tema do culto..."
                    rows={2}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-white/5 border-t border-white/10 flex gap-3 sticky bottom-0">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.titulo || !formData.data || !formData.hora}
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingEvent ? 'Atualizar' : 'Criar Evento'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminder Modal */}
      <AnimatePresence>
        {showReminderModal && selectedEventForReminder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReminderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Enviar Lembrete</h3>
                      <p className="text-white/70 text-sm">Notifique os membros sobre o evento</p>
                    </div>
                  </div>
                  <button onClick={() => setShowReminderModal(false)} className="text-white/70 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Event Info */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white ${
                    selectedEventForReminder.tipo === 'culto' 
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }`}>
                    <span className="text-xs">{new Date(selectedEventForReminder.data).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                    <span className="text-xl font-bold">{new Date(selectedEventForReminder.data).getDate()}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{selectedEventForReminder.titulo}</h4>
                    <p className="text-gray-400 text-sm">
                      {new Date(selectedEventForReminder.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-amber-400 mb-2">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">{members.length} membros serão notificados</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    O lembrete será enviado para todos os membros ativos cadastrados.
                  </p>
                </div>
              </div>

              {/* Send Options */}
              <div className="p-6 space-y-3">
                <p className="text-gray-400 text-sm mb-3">Escolha o canal de comunicação:</p>
                
                <button
                  onClick={() => sendReminder('whatsapp')}
                  disabled={isReminderSent(selectedEventForReminder.id, 'whatsapp')}
                  className="w-full flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-50"
                >
                  <MessageCircle className="w-6 h-6" />
                  <div className="flex-1 text-left">
                    <span className="font-semibold block">WhatsApp</span>
                    <span className="text-sm text-gray-400">Enviar para grupo ou individual</span>
                  </div>
                  {isReminderSent(selectedEventForReminder.id, 'whatsapp') && <CheckCircle className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => sendReminder('email')}
                  disabled={isReminderSent(selectedEventForReminder.id, 'email')}
                  className="w-full flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/20 transition-all disabled:opacity-50"
                >
                  <Mail className="w-6 h-6" />
                  <div className="flex-1 text-left">
                    <span className="font-semibold block">E-mail</span>
                    <span className="text-sm text-gray-400">Enviar e-mail para todos</span>
                  </div>
                  {isReminderSent(selectedEventForReminder.id, 'email') && <CheckCircle className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => sendReminder('sms')}
                  disabled={isReminderSent(selectedEventForReminder.id, 'sms')}
                  className="w-full flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/20 transition-all disabled:opacity-50"
                >
                  <Phone className="w-6 h-6" />
                  <div className="flex-1 text-left">
                    <span className="font-semibold block">SMS</span>
                    <span className="text-sm text-gray-400">Mensagem de texto</span>
                  </div>
                  {isReminderSent(selectedEventForReminder.id, 'sms') && <CheckCircle className="w-5 h-5" />}
                </button>

                <div className="pt-3 border-t border-white/10">
                  <button
                    onClick={() => sendReminder('all')}
                    disabled={isReminderSent(selectedEventForReminder.id, 'all')}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold hover:from-indigo-400 hover:to-purple-500 transition-all disabled:opacity-50"
                  >
                    {isReminderSent(selectedEventForReminder.id, 'all') ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span>Lembrete Enviado!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        <span>Enviar por Todos os Canais</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agenda Completa Modal */}
      <AnimatePresence>
        {showAgendaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAgendaModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 p-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">📅 Agenda Completa</h3>
                      <p className="text-white/70 text-xs">Todos os cultos e eventos da igreja</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAgendaModal(false)} className="text-white/70 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-red-400">{events.length}</p>
                    <p className="text-gray-400 text-xs">Total</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">{events.filter(e => e.tipo === 'culto').length}</p>
                    <p className="text-gray-400 text-xs">Cultos</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-purple-400">{events.filter(e => e.tipo === 'evento').length}</p>
                    <p className="text-gray-400 text-xs">Eventos</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-amber-400">{upcomingEvents.length}</p>
                    <p className="text-gray-400 text-xs">Próximos</p>
                  </div>
                </div>

                {/* Upcoming Events List */}
                {upcomingEvents.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      🔴 Próximos Eventos
                    </h4>
                    <div className="space-y-3">
                      {upcomingEvents.map((event, idx) => {
                        const relativeDate = getRelativeDate(event.data);
                        const isToday = relativeDate === 'Hoje';
                        const isTomorrow = relativeDate === 'Amanhã';
                        
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`flex gap-4 p-3 rounded-xl border transition-all ${
                              isToday ? 'bg-red-500/10 border-red-500/50' :
                              isTomorrow ? 'bg-amber-500/10 border-amber-500/50' :
                              'bg-white/5 border-white/10'
                            }`}
                          >
                            {/* Event Image or Date */}
                            {event.imagem ? (
                              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={event.imagem} alt={event.titulo} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ${
                                event.tipo === 'culto' 
                                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
                              }`}>
                                <span className="text-xs text-white">{new Date(event.data).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                                <span className="text-2xl font-bold text-white">{new Date(event.data).getDate()}</span>
                              </div>
                            )}
                            
                            {/* Event Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="text-white font-semibold truncate">{event.titulo}</h5>
                                <span className={`px-2 py-0.5 text-[10px] rounded-full ${
                                  event.tipo === 'culto' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {event.tipo}
                                </span>
                                {isToday && (
                                  <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full animate-pulse font-bold">
                                    HOJE!
                                  </span>
                                )}
                                {isTomorrow && (
                                  <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] rounded-full font-bold">
                                    AMANHÃ
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-3 text-gray-400 text-xs mb-2">
                                <span className="flex items-center gap-1">
                                  📅 {new Date(event.data).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                                </span>
                                <span className="flex items-center gap-1">
                                  🕐 {new Date(event.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {event.local && (
                                  <span className="flex items-center gap-1">
                                    📍 {event.local}
                                  </span>
                                )}
                              </div>
                              
                              {/* Preacher & Singers */}
                              <div className="flex flex-wrap gap-2">
                                {event.pregador && (
                                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-lg flex items-center gap-1">
                                    🎤 {event.pregador}
                                  </span>
                                )}
                                {event.cantores && (
                                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-lg flex items-center gap-1">
                                    🎵 {event.cantores}
                                  </span>
                                )}
                              </div>
                              
                              {event.descricao && (
                                <p className="text-gray-500 text-xs mt-2 line-clamp-1">{event.descricao}</p>
                              )}
                            </div>
                            
                            {/* Actions */}
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => { setShowAgendaModal(false); openEventDetails(event); }}
                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                                title="Ver Detalhes"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setShowAgendaModal(false); openReminderModal(event); }}
                                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                                title="Enviar Lembrete"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setShowAgendaModal(false); openEditModal(event); }}
                                className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-all"
                                title="Editar"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Past Events */}
                {pastEvents.length > 0 && (
                  <div>
                    <h4 className="text-gray-400 font-semibold mb-3 flex items-center gap-2">
                      📋 Eventos Anteriores
                    </h4>
                    <div className="space-y-2 opacity-60">
                      {pastEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex gap-3 p-2 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="w-12 h-12 bg-gray-700 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                            <span className="text-[8px] text-gray-400">{new Date(event.data).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}</span>
                            <span className="text-sm font-bold text-gray-300">{new Date(event.data).getDate()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-gray-300 font-medium text-sm truncate">{event.titulo}</h5>
                            <p className="text-gray-500 text-xs">
                              {new Date(event.data).toLocaleDateString('pt-BR')} • {event.tipo}
                              {event.pregador && ` • 🎤 ${event.pregador}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {events.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhum evento cadastrado</h3>
                    <p className="text-gray-400">Crie seu primeiro culto ou evento</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-white/5 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => setShowAgendaModal(false)}
                  className="flex-1 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
                >
                  Fechar
                </button>
                <button
                  onClick={() => { setShowAgendaModal(false); openNewEventModal(); }}
                  className="flex-1 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-400 hover:to-rose-500 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Novo Evento
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Details Modal - Full Page */}
      <AnimatePresence>
        {showEventDetailModal && selectedEventForDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4"
            onClick={() => setShowEventDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-slate-900 w-full h-full sm:max-w-2xl sm:h-auto sm:max-h-[95vh] sm:rounded-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Image */}
              <div className="relative h-48 sm:h-56 flex-shrink-0">
                {selectedEventForDetails.imagem ? (
                  <img 
                    src={selectedEventForDetails.imagem} 
                    alt={selectedEventForDetails.titulo} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full ${ 
                    selectedEventForDetails.tipo === 'culto' 
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-600' 
                      : 'bg-gradient-to-br from-purple-600 to-pink-600'
                  }`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                
                {/* Close Button */}
                <button 
                  onClick={() => setShowEventDetailModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                
                {/* Event Type Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedEventForDetails.tipo === 'culto' 
                      ? 'bg-blue-500/90 text-white' 
                      : 'bg-purple-500/90 text-white'
                  }`}>
                    {selectedEventForDetails.tipo === 'culto' ? '⛪ Culto' : '🎉 Evento'}
                  </span>
                  {getRelativeDate(selectedEventForDetails.data) === 'Hoje' && (
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full animate-pulse">
                      HOJE!
                    </span>
                  )}
                </div>
                
                {/* Title */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                    {selectedEventForDetails.titulo}
                  </h2>
                </div>
              </div>
              
              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Countdown Timer */}
                {new Date(selectedEventForDetails.data) > new Date() && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-red-500/20 via-rose-500/20 to-red-500/20 border border-red-500/40 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-3 h-3 bg-red-500 rounded-full"
                      />
                      <span className="text-red-400 font-semibold">⏱️ Contagem Regressiva</span>
                    </div>
                    <CountdownTimer eventDate={selectedEventForDetails.data} />
                  </motion.div>
                )}
                
                {/* Date, Time, Location */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                    <Calendar className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                    <p className="text-white font-semibold text-sm">
                      {new Date(selectedEventForDetails.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(selectedEventForDetails.data).toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                    <Clock className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-white font-semibold text-sm">
                      {new Date(selectedEventForDetails.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-gray-500 text-xs">Horário</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                    <MapPin className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <p className="text-white font-semibold text-sm truncate">
                      {selectedEventForDetails.local || 'Igreja'}
                    </p>
                    <p className="text-gray-500 text-xs">Local</p>
                  </div>
                </div>
                
                {/* Preacher & Singers Section */}
                {(selectedEventForDetails.pregador || selectedEventForDetails.cantores) && (
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
                    <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                      ⭐ Quem Vai Ministrar
                    </h3>
                    <div className="space-y-3">
                      {selectedEventForDetails.pregador && (
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-xl">🎤</span>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Pregador / Preletor</p>
                            <p className="text-white font-semibold">{selectedEventForDetails.pregador}</p>
                          </div>
                        </div>
                      )}
                      {selectedEventForDetails.cantores && (
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-xl">🎵</span>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Louvor / Cantores</p>
                            <p className="text-white font-semibold">{selectedEventForDetails.cantores}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Description */}
                {selectedEventForDetails.descricao && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      📝 Sobre o Evento
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedEventForDetails.descricao}
                    </p>
                  </div>
                )}
                
                {/* Interest Confirmation */}
                <AnimatePresence>
                  {showInterestConfirm && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-xl p-4 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                        className="text-4xl mb-2"
                      >
                        ✅
                      </motion.div>
                      <h4 className="text-green-400 font-bold text-lg">Presença Confirmada!</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        Você receberá um lembrete via WhatsApp, E-mail e SMS antes do evento.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Action Buttons - Fixed Bottom */}
              <div className="flex-shrink-0 p-4 bg-slate-800/90 backdrop-blur border-t border-white/10">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmInterest}
                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Tenho Interesse</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowEventDetailModal(false);
                      openReminderModal(selectedEventForDetails);
                    }}
                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Enviar Lembrete</span>
                  </motion.button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button className="flex items-center justify-center gap-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm">
                    <Share2 className="w-4 h-4" />
                    <span>Compartilhar</span>
                  </button>
                  <button className="flex items-center justify-center gap-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                  <button className="flex items-center justify-center gap-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all text-sm">
                    <Phone className="w-4 h-4" />
                    <span>Ligar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Countdown Timer Component
function CountdownTimer({ eventDate }: { eventDate: Date }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const diff = new Date(eventDate).getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };
    
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);
  
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="bg-white/10 rounded-lg p-2 text-center">
        <p className="text-2xl font-bold text-red-400">{countdown.days}</p>
        <p className="text-gray-400 text-xs">Dias</p>
      </div>
      <div className="bg-white/10 rounded-lg p-2 text-center">
        <p className="text-2xl font-bold text-red-400">{countdown.hours}</p>
        <p className="text-gray-400 text-xs">Horas</p>
      </div>
      <div className="bg-white/10 rounded-lg p-2 text-center">
        <p className="text-2xl font-bold text-red-400">{countdown.minutes}</p>
        <p className="text-gray-400 text-xs">Min</p>
      </div>
      <div className="bg-white/10 rounded-lg p-2 text-center">
        <motion.p 
          key={countdown.seconds}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-2xl font-bold text-red-400"
        >
          {countdown.seconds}
        </motion.p>
        <p className="text-gray-400 text-xs">Seg</p>
      </div>
    </div>
  );
}

// Extended Donation type with donor info
interface DoacaoExtended extends Doacao {
  dataNascimento?: string;
  smsEnviado?: boolean;
  emailEnviado?: boolean;
  whatsappEnviado?: boolean;
}

// Donations Section
function DonationsSection({ donations: initialDonations }: { donations: Doacao[] }) {
  const [donations, setDonations] = useState<DoacaoExtended[]>(initialDonations.map(d => ({
    ...d,
    nome_doador: d.nome_doador || 'Membro Anônimo',
    whatsapp_doador: d.whatsapp_doador || ''
  })));
  const [showModal, setShowModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDonation, setLastDonation] = useState<DoacaoExtended | null>(null);
  const [sendingNotifications, setSendingNotifications] = useState({
    whatsapp: false,
    email: false,
    sms: false
  });
  const [notificationsSent, setNotificationsSent] = useState({
    whatsapp: false,
    email: false,
    sms: false
  });
  const [formData, setFormData] = useState({
    valor: '',
    tipo: 'oferta' as 'dizimo' | 'oferta',
    nome: '',
    whatsapp: '',
    email: '',
    dataNascimento: '',
    mensagem: '',
    metodo: 'mbway' as 'mbway' | 'transferencia' | 'pix'
  });
  const [error, setError] = useState('');

  const total = donations.reduce((acc, d) => acc + d.valor, 0);
  const dizimos = donations.filter(d => d.tipo === 'dizimo').reduce((acc, d) => acc + d.valor, 0);
  const ofertas = donations.filter(d => d.tipo === 'oferta').reduce((acc, d) => acc + d.valor, 0);

  const handleValueChange = (value: string) => {
    const numValue = parseFloat(value);
    if (value === '' || numValue >= 0) {
      setFormData({ ...formData, valor: value });
      if (numValue <= 0 && value !== '') {
        setError('Por favor, informe um valor válido');
      } else {
        setError('');
      }
    }
  };

  const formatWhatsApp = (value: string) => {
    // Remove non-digits
    let digits = value.replace(/\D/g, '');
    
    // If empty or just starting, suggest Portugal prefix
    if (digits.length === 0) return '+351 ';
    
    // Portugal format: +351 9XX XXX XXX
    if (digits.startsWith('351')) {
      if (digits.length <= 3) return `+${digits}`;
      if (digits.length <= 6) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
      if (digits.length <= 9) return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9, 12)}`;
    }
    
    // Brazil format: +55 XX XXXXX-XXXX
    if (digits.startsWith('55')) {
      if (digits.length <= 2) return `+${digits}`;
      if (digits.length <= 4) return `+${digits.slice(0, 2)} ${digits.slice(2)}`;
      if (digits.length <= 9) return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`;
      return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 9)}-${digits.slice(9, 13)}`;
    }
    
    // Default: assume Portugal prefix
    digits = '351' + digits;
    if (digits.length <= 6) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 9) return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9, 12)}`;
  };

  const handleWhatsAppChange = (value: string) => {
    const formatted = formatWhatsApp(value);
    setFormData({ ...formData, whatsapp: formatted });
  };

  const isFormValid = () => {
    const valor = parseFloat(formData.valor);
    return formData.nome.trim().length >= 3 && 
           formData.whatsapp.replace(/\D/g, '').length >= 10 && 
           !isNaN(valor) && 
           valor > 0;
  };

  const handleDonate = () => {
    const valor = parseFloat(formData.valor);
    if (isNaN(valor) || valor <= 0) {
      setError('Por favor, informe um valor válido');
      return;
    }

    if (formData.nome.trim().length < 3) {
      setError('Por favor, informe seu nome completo');
      return;
    }

    if (formData.whatsapp.replace(/\D/g, '').length < 10) {
      setError('Por favor, informe um WhatsApp válido');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Simulate payment processing
    setTimeout(() => {
      const newDonation: DoacaoExtended = {
        id: Date.now().toString(),
        igreja_id: '1',
        membro_id: '1',
        valor: valor,
        tipo: formData.tipo,
        data: new Date(),
        nome_doador: formData.nome,
        whatsapp_doador: formData.whatsapp,
        email_doador: formData.email,
        dataNascimento: formData.dataNascimento,
        mensagem: formData.mensagem,
        metodo: formData.metodo,
        whatsappEnviado: true,
        emailEnviado: !!formData.email,
        smsEnviado: true
      };

      setDonations([newDonation, ...donations]);
      setLastDonation(newDonation);
      setIsProcessing(false);
      setShowModal(false);
      
      // Reset notifications state
      setNotificationsSent({ whatsapp: false, email: false, sms: false });
      setSendingNotifications({ whatsapp: false, email: false, sms: false });
      
      // Show thank you modal and start sending notifications
      setShowThankYouModal(true);
      
      // Simulate sequential notification sending
      // WhatsApp first
      setSendingNotifications(prev => ({ ...prev, whatsapp: true }));
      setTimeout(() => {
        setSendingNotifications(prev => ({ ...prev, whatsapp: false }));
        setNotificationsSent(prev => ({ ...prev, whatsapp: true }));
        
        // Then Email (if provided)
        if (formData.email) {
          setSendingNotifications(prev => ({ ...prev, email: true }));
          setTimeout(() => {
            setSendingNotifications(prev => ({ ...prev, email: false }));
            setNotificationsSent(prev => ({ ...prev, email: true }));
            
            // Finally SMS
            setSendingNotifications(prev => ({ ...prev, sms: true }));
            setTimeout(() => {
              setSendingNotifications(prev => ({ ...prev, sms: false }));
              setNotificationsSent(prev => ({ ...prev, sms: true }));
            }, 1000);
          }, 1200);
        } else {
          // Skip email, go to SMS
          setSendingNotifications(prev => ({ ...prev, sms: true }));
          setTimeout(() => {
            setSendingNotifications(prev => ({ ...prev, sms: false }));
            setNotificationsSent(prev => ({ ...prev, sms: true }));
          }, 1000);
        }
      }, 1500);
      
      setFormData({
        valor: '',
        tipo: 'oferta',
        nome: '',
        whatsapp: '',
        email: '',
        dataNascimento: '',
        mensagem: '',
        metodo: 'mbway'
      });
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Doações Online</h2>
          <p className="text-gray-400 text-sm mt-1">Gerencie dízimos e ofertas da sua igreja</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all shadow-lg shadow-green-500/30"
        >
          <Heart className="w-5 h-5" />
          <span>Nova Doação</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm">Total do Mês</p>
              <p className="text-3xl font-bold text-white mt-1">{formatCurrency(total)}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+12% vs mês anterior</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm">Dízimos</p>
              <p className="text-3xl font-bold text-white mt-1">{formatCurrency(dizimos)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-3 text-gray-400 text-sm">
            {donations.filter(d => d.tipo === 'dizimo').length} contribuições
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm">Ofertas</p>
              <p className="text-3xl font-bold text-white mt-1">{formatCurrency(ofertas)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-3 text-gray-400 text-sm">
            {donations.filter(d => d.tipo === 'oferta').length} contribuições
          </div>
        </motion.div>
      </div>

      {/* Donations List */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Últimas Doações</h3>
        </div>
        
        {donations.length > 0 ? (
          <div className="divide-y divide-white/5">
            {donations.map((donation, index) => (
              <motion.div 
                key={donation.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    donation.tipo === 'dizimo' 
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }`}>
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {donation.nome_doador || 'Membro Anônimo'}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-gray-400 text-sm">
                        {donation.tipo === 'dizimo' ? 'Dízimo' : 'Oferta'} • {new Date(donation.data).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric'
                        })}
                      </p>
                      {donation.metodo && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          donation.metodo === 'mbway' ? 'bg-red-500/20 text-red-400' :
                          donation.metodo === 'pix' ? 'bg-green-500/20 text-green-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {donation.metodo === 'mbway' ? 'MB WAY' :
                           donation.metodo === 'pix' ? 'PIX' :
                           'Transferência'}
                        </span>
                      )}
                    </div>
                    {donation.whatsapp_doador && (
                      <p className="text-green-400 text-xs flex items-center gap-1 mt-1">
                        <MessageCircle className="w-3 h-3" />
                        {donation.whatsapp_doador}
                        <span className="text-gray-500 ml-2">• Lembrete enviado ✓</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-green-400">{formatCurrency(donation.valor)}</span>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Confirmado</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma doação registrada</h3>
            <p className="text-gray-400 mb-4">As doações da igreja aparecerão aqui</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Fazer Primeira Doação</span>
            </button>
          </div>
        )}
      </div>

      {/* Donation Modal - Compact Version */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header - Compact */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Fazer Doação</h3>
                      <p className="text-white/70 text-xs">Contribua com sua igreja</p>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body - Compact */}
              <div className="p-4 space-y-4">
                {/* Dados do Doador - Grid Compacto */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Nome */}
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">
                      Nome <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Seu nome"
                        className="w-full pl-8 pr-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>

                  {/* Data de Nascimento */}
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">
                      Nascimento
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={formData.dataNascimento}
                        onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                        className="w-full pl-8 pr-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp com Prefixo de Portugal */}
                <div>
                  <label className="block text-gray-400 text-xs mb-1">
                    WhatsApp <span className="text-red-400">*</span>
                    <span className="text-gray-500 ml-1">(receberá lembrete)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <span className="text-xs">🇵🇹</span>
                      <MessageCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.whatsapp || '+351 '}
                      onChange={(e) => handleWhatsAppChange(e.target.value)}
                      placeholder="+351 9XX XXX XXX"
                      className="w-full pl-14 pr-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <p className="text-gray-500 text-[10px] mt-1">🇧🇷 Brasil: +55 | 🇵🇹 Portugal: +351</p>
                </div>

                {/* Email Opcional */}
                <div>
                  <label className="block text-gray-400 text-xs mb-1">
                    E-mail <span className="text-gray-500">(opcional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="w-full pl-8 pr-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                {/* Tipo de Doação - Compacto */}
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Tipo</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tipo: 'dizimo' })}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-sm transition-all ${
                        formData.tipo === 'dizimo'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Dízimo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tipo: 'oferta' })}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-sm transition-all ${
                        formData.tipo === 'oferta'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                      <span>Oferta</span>
                    </button>
                  </div>
                </div>

                {/* Valor - Compacto */}
                <div>
                  <label className="block text-gray-400 text-xs mb-1">
                    Valor <span className="text-amber-400 italic">💛 O que seu coração falar</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400">€</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.valor}
                      onChange={(e) => handleValueChange(e.target.value)}
                      placeholder="0,00"
                      className={`w-full pl-10 pr-3 py-3 bg-white/5 border rounded-lg text-white text-xl font-bold placeholder-gray-500 focus:outline-none ${
                        error ? 'border-red-500' : 'border-white/10 focus:border-green-500'
                      }`}
                    />
                  </div>
                  {error && (
                    <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {error}
                    </p>
                  )}
                  
                  {/* Valores Rápidos */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[10, 25, 50, 100, 200].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, valor: value.toString() });
                          setError('');
                        }}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          formData.valor === value.toString()
                            ? 'bg-green-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        €{value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Método de Pagamento - Compacto */}
                <div>
                  <label className="block text-gray-400 text-xs mb-2">Pagamento</label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* MB WAY */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, metodo: 'mbway' })}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                        formData.metodo === 'mbway'
                          ? 'bg-red-500/20 border-red-500 text-red-400'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                        MB
                      </div>
                      <span className="text-[10px] font-medium">MB WAY</span>
                      <span className="text-[8px] text-gray-500">🇵🇹</span>
                    </button>

                    {/* Transferência */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, metodo: 'transferencia' })}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                        formData.metodo === 'transferencia'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-lg">
                        🏦
                      </div>
                      <span className="text-[10px] font-medium">IBAN</span>
                      <span className="text-[8px] text-gray-500">🇵🇹</span>
                    </button>

                    {/* PIX */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, metodo: 'pix' })}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                        formData.metodo === 'pix'
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                          <path d="M13.59 4.83l3.54 3.54a2.01 2.01 0 010 2.83l-3.54 3.54a2.01 2.01 0 01-2.83 0l-3.54-3.54a2.01 2.01 0 010-2.83l3.54-3.54a2.01 2.01 0 012.83 0z"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-medium">PIX</span>
                      <span className="text-[8px] text-gray-500">🇧🇷</span>
                    </button>
                  </div>

                  {/* Detalhes do Pagamento */}
                  {formData.metodo === 'transferencia' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs"
                    >
                      <p className="text-blue-400 font-medium mb-1">Dados Bancários:</p>
                      <p className="text-gray-300"><span className="text-gray-500">IBAN:</span> PT50 0035 0000 0000 0000 0000 0</p>
                      <p className="text-gray-300"><span className="text-gray-500">BIC:</span> CGDIPTPL</p>
                    </motion.div>
                  )}

                  {formData.metodo === 'mbway' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs"
                    >
                      <p className="text-red-400 font-medium">Número MB WAY: +351 9XX XXX XXX</p>
                      <p className="text-gray-400 mt-1">Receberá pedido no telemóvel</p>
                    </motion.div>
                  )}

                  {formData.metodo === 'pix' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-xs"
                    >
                      <p className="text-green-400 font-medium">Chave PIX:</p>
                      <div className="flex items-center gap-2 bg-white/5 p-2 rounded mt-1">
                        <code className="text-gray-300 flex-1 text-xs">igreja@exemplo.com.br</code>
                        <button className="text-green-400 text-xs">Copiar</button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Modal Footer - Compacto */}
              <div className="p-4 bg-white/5 border-t border-white/10">
                <button
                  onClick={handleDonate}
                  disabled={!isFormValid() || isProcessing}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" />
                      <span>
                        Doar {formData.valor ? formatCurrency(parseFloat(formData.valor)) : '€0,00'}
                      </span>
                    </>
                  )}
                </button>
                <p className="text-center text-gray-500 text-[10px] mt-2">
                  🔒 Pagamento seguro • Lembrete enviado via WhatsApp
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thank You Modal with All Notifications */}
      <AnimatePresence>
        {showThankYouModal && lastDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowThankYouModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden text-center max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Celebration Animation */}
              <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-6 relative overflow-hidden">
                {/* Confetti-like elements */}
                <motion.div
                  animate={{ 
                    y: [-20, 200],
                    x: [0, -30],
                    rotate: [0, 360],
                    opacity: [1, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                  className="absolute top-0 left-1/4 w-3 h-3 bg-yellow-400 rounded-full"
                />
                <motion.div
                  animate={{ 
                    y: [-20, 200],
                    x: [0, 30],
                    rotate: [0, -360],
                    opacity: [1, 0]
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.3 }}
                  className="absolute top-0 right-1/4 w-2 h-2 bg-pink-400 rounded-full"
                />
                <motion.div
                  animate={{ 
                    y: [-20, 200],
                    x: [0, 20],
                    rotate: [0, 180],
                    opacity: [1, 0]
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.7 }}
                  className="absolute top-0 left-1/3 w-2 h-2 bg-blue-400"
                />
                <motion.div
                  animate={{ 
                    y: [-20, 200],
                    x: [0, -20],
                    rotate: [0, -180],
                    opacity: [1, 0]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.2 }}
                  className="absolute top-0 right-1/3 w-3 h-3 bg-purple-400 rounded-full"
                />
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.4 }}
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold text-white mt-3"
                >
                  Obrigado, {lastDonation.nome_doador?.split(' ')[0]}! 🙏
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/80 text-sm mt-1"
                >
                  Sua contribuição foi recebida com gratidão!
                </motion.p>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Donation Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4"
                >
                  <p className="text-gray-400 text-xs mb-1">Valor doado</p>
                  <p className="text-3xl font-bold text-green-400">
                    {formatCurrency(lastDonation.valor)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {lastDonation.tipo === 'dizimo' ? 'Dízimo' : 'Oferta'} • {new Date(lastDonation.data).toLocaleDateString('pt-BR')} • {
                      lastDonation.metodo === 'mbway' ? '🔴 MB WAY' :
                      lastDonation.metodo === 'pix' ? '💚 PIX' :
                      '🏦 Transferência'
                    }
                  </p>
                </motion.div>

                {/* Notifications Section Title */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-2 pt-2"
                >
                  <Bell className="w-4 h-4 text-amber-400" />
                  <p className="text-white text-sm font-semibold">Lembretes de Agradecimento Enviados:</p>
                </motion.div>

                {/* WhatsApp Notification */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-xl overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-white text-sm font-medium flex items-center gap-2">
                        WhatsApp
                        {sendingNotifications.whatsapp ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full"
                          />
                        ) : notificationsSent.whatsapp ? (
                          <span className="text-green-400 text-xs">✓ Enviado</span>
                        ) : null}
                      </p>
                      <p className="text-gray-400 text-xs">{lastDonation.whatsapp_doador}</p>
                    </div>
                    {notificationsSent.whatsapp && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* WhatsApp Message Preview */}
                  {notificationsSent.whatsapp && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="p-3 bg-[#075E54]/20 border-t border-green-500/20"
                    >
                      <div className="bg-[#DCF8C6] p-2 rounded-lg rounded-tl-none text-left">
                        <p className="text-[#111] text-xs">
                          🙏 *Igreja Cristã*{'\n\n'}
                          Olá *{lastDonation.nome_doador?.split(' ')[0]}*! Recebemos sua {lastDonation.tipo === 'dizimo' ? 'fidelidade' : 'oferta'} de *{formatCurrency(lastDonation.valor)}*! Que Deus multiplique suas bênçãos! 🙌✨
                        </p>
                        <p className="text-[#667] text-[9px] text-right mt-1">
                          {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} ✓✓
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Email Notification */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className={`border rounded-xl p-3 ${
                    lastDonation.email_doador 
                      ? 'bg-blue-500/10 border-blue-500/30' 
                      : 'bg-gray-500/10 border-gray-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      lastDonation.email_doador ? 'bg-blue-500' : 'bg-gray-600'
                    }`}>
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-white text-sm font-medium flex items-center gap-2">
                        E-mail
                        {lastDonation.email_doador ? (
                          sendingNotifications.email ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full"
                            />
                          ) : notificationsSent.email ? (
                            <span className="text-blue-400 text-xs">✓ Enviado</span>
                          ) : null
                        ) : (
                          <span className="text-gray-500 text-xs">Não informado</span>
                        )}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {lastDonation.email_doador || 'Comprovante não enviado'}
                      </p>
                    </div>
                    {notificationsSent.email && lastDonation.email_doador && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        <CheckCircle className="w-5 h-5 text-blue-400" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* SMS Notification */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-white text-sm font-medium flex items-center gap-2">
                        SMS
                        {sendingNotifications.sms ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full"
                          />
                        ) : notificationsSent.sms ? (
                          <span className="text-purple-400 text-xs">✓ Enviado</span>
                        ) : null}
                      </p>
                      <p className="text-gray-400 text-xs">{lastDonation.whatsapp_doador}</p>
                    </div>
                    {notificationsSent.sms && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        <CheckCircle className="w-5 h-5 text-purple-400" />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* SMS Message Preview */}
                  {notificationsSent.sms && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-2 p-2 bg-white/5 rounded-lg border border-white/10"
                    >
                      <p className="text-gray-300 text-xs">
                        📱 Igreja Cristã: Obrigado {lastDonation.nome_doador?.split(' ')[0]}! Recebemos sua {lastDonation.tipo} de {formatCurrency(lastDonation.valor)}. Deus abençoe! 🙏
                      </p>
                    </motion.div>
                  )}
                </motion.div>

                {/* All Sent Confirmation */}
                {notificationsSent.whatsapp && notificationsSent.sms && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-xl p-3"
                  >
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <p className="text-sm font-semibold">Todos os lembretes enviados com sucesso!</p>
                    </div>
                  </motion.div>
                )}

                {/* Bible Verse */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="bg-white/5 rounded-xl p-3"
                >
                  <p className="text-white italic text-sm">
                    "Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria."
                  </p>
                  <p className="text-gray-500 text-xs mt-1">2 Coríntios 9:7</p>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  onClick={() => setShowThankYouModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all"
                >
                  Fechar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Bible Questions Database - Infinite Random Questions
const bibleQuestionsDatabase: Array<{
  pergunta: string;
  opcoes: string[];
  resposta_correta: number;
  categoria: string;
  imagem: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
}> = [
  // Personagens Bíblicos
  { pergunta: 'Quem construiu a arca para salvar os animais do dilúvio?', opcoes: ['Abraão', 'Noé', 'Moisés', 'Davi'], resposta_correta: 1, categoria: 'Personagens', imagem: 'https://images.unsplash.com/photo-1534951009808-766178b47a4f?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Quem derrotou o gigante Golias?', opcoes: ['Sansão', 'Josué', 'Davi', 'Samuel'], resposta_correta: 2, categoria: 'Personagens', imagem: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Quem foi engolido por um grande peixe?', opcoes: ['Jonas', 'Pedro', 'Paulo', 'Elias'], resposta_correta: 0, categoria: 'Personagens', imagem: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Quem era o irmão de Moisés?', opcoes: ['Josué', 'Arão', 'Calebe', 'Samuel'], resposta_correta: 1, categoria: 'Personagens', imagem: 'https://images.unsplash.com/photo-1490730141103-6cac27abb37f?w=300&h=200&fit=crop', dificuldade: 'medio' },
  { pergunta: 'Quem traiu Jesus com um beijo?', opcoes: ['Pedro', 'Tomé', 'Judas', 'João'], resposta_correta: 2, categoria: 'Personagens', imagem: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Qual foi o primeiro rei de Israel?', opcoes: ['Davi', 'Saul', 'Salomão', 'Samuel'], resposta_correta: 1, categoria: 'Personagens', imagem: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', dificuldade: 'medio' },
  { pergunta: 'Quem foi jogado na cova dos leões?', opcoes: ['Elias', 'Daniel', 'Isaías', 'Ezequiel'], resposta_correta: 1, categoria: 'Personagens', imagem: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Quem era a mãe de Jesus?', opcoes: ['Sara', 'Raquel', 'Maria', 'Rute'], resposta_correta: 2, categoria: 'Personagens', imagem: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=300&h=200&fit=crop', dificuldade: 'facil' },
  
  // Números na Bíblia
  { pergunta: 'Quantos dias Jesus ficou no deserto?', opcoes: ['20 dias', '30 dias', '40 dias', '50 dias'], resposta_correta: 2, categoria: 'Números', imagem: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Quantos discípulos Jesus tinha?', opcoes: ['10', '11', '12', '13'], resposta_correta: 2, categoria: 'Números', imagem: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Quantos anos viveu Matusalém?', opcoes: ['800 anos', '900 anos', '969 anos', '1000 anos'], resposta_correta: 2, categoria: 'Números', imagem: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=300&h=200&fit=crop', dificuldade: 'dificil' },
  { pergunta: 'Quantas pragas Deus enviou ao Egito?', opcoes: ['7', '8', '9', '10'], resposta_correta: 3, categoria: 'Números', imagem: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=300&h=200&fit=crop', dificuldade: 'medio' },
  { pergunta: 'Quantos livros tem a Bíblia?', opcoes: ['59', '63', '66', '72'], resposta_correta: 2, categoria: 'Números', imagem: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=300&h=200&fit=crop', dificuldade: 'medio' },
  
  // Histórias Bíblicas
  { pergunta: 'Qual foi o primeiro milagre de Jesus?', opcoes: ['Multiplicar pães', 'Transformar água em vinho', 'Curar um cego', 'Ressuscitar Lázaro'], resposta_correta: 1, categoria: 'Milagres', imagem: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=200&fit=crop', dificuldade: 'medio' },
  { pergunta: 'Em qual cidade Jesus nasceu?', opcoes: ['Nazaré', 'Jerusalém', 'Belém', 'Cafarnaum'], resposta_correta: 2, categoria: 'Histórias', imagem: 'https://images.unsplash.com/photo-1482424917728-d82d29662023?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Qual fruto Adão e Eva comeram?', opcoes: ['Maçã', 'Uva', 'Fruto proibido', 'Figo'], resposta_correta: 2, categoria: 'Histórias', imagem: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Quem escreveu os Salmos?', opcoes: ['Moisés', 'Davi', 'Salomão', 'Samuel'], resposta_correta: 1, categoria: 'Histórias', imagem: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=200&fit=crop', dificuldade: 'medio' },
  { pergunta: 'Qual mar Moisés abriu?', opcoes: ['Mar Morto', 'Mar da Galileia', 'Mar Vermelho', 'Mar Mediterrâneo'], resposta_correta: 2, categoria: 'Milagres', imagem: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'O que Jesus multiplicou para alimentar 5000 pessoas?', opcoes: ['3 pães e 2 peixes', '5 pães e 2 peixes', '7 pães e 3 peixes', '2 pães e 5 peixes'], resposta_correta: 1, categoria: 'Milagres', imagem: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=300&h=200&fit=crop', dificuldade: 'medio' },
  
  // Lugares Bíblicos
  { pergunta: 'Em qual jardim Deus colocou Adão e Eva?', opcoes: ['Getsêmani', 'Éden', 'Oliveiras', 'Paraíso'], resposta_correta: 1, categoria: 'Lugares', imagem: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Qual montanha Moisés recebeu os 10 Mandamentos?', opcoes: ['Monte Carmelo', 'Monte Sinai', 'Monte Sião', 'Monte das Oliveiras'], resposta_correta: 1, categoria: 'Lugares', imagem: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=200&fit=crop', dificuldade: 'medio' },
  
  // Animais na Bíblia
  { pergunta: 'Qual animal falou com Balaão?', opcoes: ['Camelo', 'Jumento', 'Ovelha', 'Leão'], resposta_correta: 1, categoria: 'Animais', imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', dificuldade: 'medio' },
  { pergunta: 'Qual animal tentou Eva no Éden?', opcoes: ['Serpente', 'Leão', 'Águia', 'Lobo'], resposta_correta: 0, categoria: 'Animais', imagem: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Quantos animais de cada espécie entraram na arca?', opcoes: ['1', '2', '3', '7'], resposta_correta: 1, categoria: 'Animais', imagem: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=300&h=200&fit=crop', dificuldade: 'facil' },
  
  // Novo Testamento
  { pergunta: 'Quem batizou Jesus?', opcoes: ['Pedro', 'João Batista', 'Paulo', 'Tiago'], resposta_correta: 1, categoria: 'Novo Testamento', imagem: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Qual apóstolo negou Jesus três vezes?', opcoes: ['Judas', 'Tomé', 'Pedro', 'João'], resposta_correta: 2, categoria: 'Novo Testamento', imagem: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Qual o nome do apóstolo que duvidou da ressurreição?', opcoes: ['Pedro', 'Tomé', 'Tiago', 'André'], resposta_correta: 1, categoria: 'Novo Testamento', imagem: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Jesus nasceu em qual estábulo?', opcoes: ['Casa', 'Palácio', 'Manjedoura', 'Templo'], resposta_correta: 2, categoria: 'Novo Testamento', imagem: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=300&h=200&fit=crop', dificuldade: 'facil' },
  
  // Versículos Famosos
  { pergunta: 'Complete: "Porque Deus amou o mundo de tal maneira que deu..."', opcoes: ['Sua graça', 'Seu Filho unigênito', 'Sua paz', 'Seu reino'], resposta_correta: 1, categoria: 'Versículos', imagem: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=300&h=200&fit=crop', dificuldade: 'facil' },
  { pergunta: 'Qual é o versículo mais curto da Bíblia?', opcoes: ['Deus é amor', 'Jesus chorou', 'Orai sempre', 'Amai-vos'], resposta_correta: 1, categoria: 'Versículos', imagem: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=300&h=200&fit=crop', dificuldade: 'dificil' },
];

// Player Ranking Type
interface QuizPlayer {
  id: string;
  nome: string;
  pontuacao: number;
  acertos: number;
  erros: number;
  avatar: string;
  ultimaPartida: Date;
}

// Sunday School Section - Complete Quiz System
function SundaySchoolSection({ quizzes: initialQuizzes }: { quizzes: QuizEscolinha[] }) {
  const [quizzes] = useState(initialQuizzes);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ acertos: 0, erros: 0, pontos: 0 });
  const [quizQuestions, setQuizQuestions] = useState<typeof bibleQuestionsDatabase>([]);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [ranking, setRanking] = useState<QuizPlayer[]>([
    { id: '1', nome: 'Maria', pontuacao: 850, acertos: 17, erros: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', ultimaPartida: new Date() },
    { id: '2', nome: 'João Pedro', pontuacao: 720, acertos: 14, erros: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JoaoPedro', ultimaPartida: new Date() },
    { id: '3', nome: 'Ana Clara', pontuacao: 650, acertos: 13, erros: 7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnaClara', ultimaPartida: new Date() },
    { id: '4', nome: 'Lucas', pontuacao: 500, acertos: 10, erros: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas', ultimaPartida: new Date() },
    { id: '5', nome: 'Sofia', pontuacao: 400, acertos: 8, erros: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', ultimaPartida: new Date() },
  ]);

  // Start quiz with random questions
  const startQuiz = () => {
    if (!playerName.trim()) return;
    
    // Shuffle and pick 10 random questions
    const shuffled = [...bibleQuestionsDatabase].sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled.slice(0, 10));
    setCurrentQuestion(0);
    setScore({ acertos: 0, erros: 0, pontos: 0 });
    setShowWelcome(false);
    setShowQuiz(true);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  // Handle answer selection
  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === quizQuestions[currentQuestion].resposta_correta;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      const pontos = quizQuestions[currentQuestion].dificuldade === 'facil' ? 30 : 
                     quizQuestions[currentQuestion].dificuldade === 'medio' ? 50 : 80;
      setScore(prev => ({
        ...prev,
        acertos: prev.acertos + 1,
        pontos: prev.pontos + pontos
      }));
    } else {
      setScore(prev => ({
        ...prev,
        erros: prev.erros + 1
      }));
    }
  };

  // Go to next question
  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // End of quiz - update ranking
      const newPlayer: QuizPlayer = {
        id: Date.now().toString(),
        nome: playerName,
        pontuacao: score.pontos,
        acertos: score.acertos,
        erros: score.erros,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${playerName}`,
        ultimaPartida: new Date()
      };
      
      setRanking(prev => {
        const updated = [...prev, newPlayer].sort((a, b) => b.pontuacao - a.pontuacao);
        return updated.slice(0, 10); // Keep top 10
      });
      
      setShowQuiz(false);
      setShowFinalResult(true);
    }
  };

  // Reset quiz
  const resetQuiz = () => {
    setShowWelcome(true);
    setShowQuiz(false);
    setShowFinalResult(false);
    setPlayerName('');
    setCurrentQuestion(0);
    setScore({ acertos: 0, erros: 0, pontos: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            📚 Escolinha Dominical - Quiz Bíblico
          </h2>
          <p className="text-gray-400 text-sm mt-1">Aprenda a Bíblia de forma divertida! 🎮</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-xl p-4"
        >
          <p className="text-orange-400 text-sm">Total de Perguntas</p>
          <p className="text-2xl font-bold text-white">{bibleQuestionsDatabase.length + quizzes.length}</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4"
        >
          <p className="text-green-400 text-sm">Jogadores no Ranking</p>
          <p className="text-2xl font-bold text-white">{ranking.length}</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4"
        >
          <p className="text-blue-400 text-sm">Categorias</p>
          <p className="text-2xl font-bold text-white">8</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4"
        >
          <p className="text-purple-400 text-sm">Recorde</p>
          <p className="text-2xl font-bold text-white">{ranking[0]?.pontuacao || 0} pts</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Quiz Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Screen */}
          <AnimatePresence mode="wait">
            {showWelcome && !showQuiz && !showFinalResult && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/30 rounded-2xl overflow-hidden"
              >
                {/* Welcome Header with Animation */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-center relative overflow-hidden">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    📖
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">Bem-vindo ao Quiz Bíblico! 🎉</h3>
                  <p className="text-white/80 mt-2">
                    Aprenda sobre a Bíblia de forma divertida e interativa!
                  </p>
                  
                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-4 left-4 text-3xl"
                  >
                    ⭐
                  </motion.div>
                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute top-4 right-4 text-3xl"
                  >
                    ✨
                  </motion.div>
                </div>

                {/* Welcome Content */}
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">🎯</div>
                      <h4 className="text-white font-semibold">10 Perguntas</h4>
                      <p className="text-gray-400 text-sm">Aleatórias</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">🏆</div>
                      <h4 className="text-white font-semibold">Ganhe Pontos</h4>
                      <p className="text-gray-400 text-sm">Entre no ranking</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">📸</div>
                      <h4 className="text-white font-semibold">Com Imagens</h4>
                      <p className="text-gray-400 text-sm">Visual divertido</p>
                    </div>
                  </div>

                  {/* Player Name Input */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <label className="block text-white font-semibold mb-3 text-center">
                      👋 Qual é o seu nome?
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          placeholder="Digite seu nome..."
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-lg"
                          onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startQuiz}
                        disabled={!playerName.trim()}
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Começar!
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quiz in Progress */}
            {showQuiz && quizQuestions.length > 0 && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
              >
                {/* Progress Bar */}
                <div className="bg-white/5 p-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Pergunta {currentQuestion + 1} de {quizQuestions.length}</span>
                    <span>⭐ {score.pontos} pontos</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                </div>

                {/* Question Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={quizQuestions[currentQuestion].imagem} 
                    alt="Quiz" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      quizQuestions[currentQuestion].dificuldade === 'facil' ? 'bg-green-500/20 text-green-400' :
                      quizQuestions[currentQuestion].dificuldade === 'medio' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {quizQuestions[currentQuestion].dificuldade === 'facil' ? '🟢 Fácil' :
                       quizQuestions[currentQuestion].dificuldade === 'medio' ? '🟡 Médio' : '🔴 Difícil'}
                    </span>
                    <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-xs text-white">
                      {quizQuestions[currentQuestion].categoria}
                    </span>
                  </div>
                </div>

                {/* Question */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6 text-center">
                    {quizQuestions[currentQuestion].pergunta}
                  </h3>

                  {/* Options */}
                  <div className="grid gap-3">
                    {quizQuestions[currentQuestion].opcoes.map((opcao, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrectAnswer = index === quizQuestions[currentQuestion].resposta_correta;
                      
                      let buttonClass = 'bg-white/5 border-white/20 text-white hover:bg-white/10';
                      
                      if (showResult) {
                        if (isCorrectAnswer) {
                          buttonClass = 'bg-green-500/20 border-green-500 text-green-400';
                        } else if (isSelected && !isCorrectAnswer) {
                          buttonClass = 'bg-red-500/20 border-red-500 text-red-400';
                        }
                      } else if (isSelected) {
                        buttonClass = 'bg-indigo-500/20 border-indigo-500 text-indigo-400';
                      }
                      
                      return (
                        <motion.button
                          key={index}
                          whileHover={{ scale: showResult ? 1 : 1.02 }}
                          whileTap={{ scale: showResult ? 1 : 0.98 }}
                          onClick={() => handleAnswer(index)}
                          disabled={showResult}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${buttonClass}`}
                        >
                          <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1">{opcao}</span>
                          {showResult && isCorrectAnswer && (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          )}
                          {showResult && isSelected && !isCorrectAnswer && (
                            <XCircle className="w-6 h-6 text-red-400" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Result Feedback */}
                  <AnimatePresence>
                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`mt-6 p-4 rounded-xl text-center ${
                          isCorrect 
                            ? 'bg-green-500/20 border border-green-500/50' 
                            : 'bg-red-500/20 border border-red-500/50'
                        }`}
                      >
                        {isCorrect ? (
                          <div>
                            <span className="text-4xl">🎉</span>
                            <p className="text-green-400 font-bold text-lg mt-2">Parabéns! Resposta Correta!</p>
                            <p className="text-green-300 text-sm">
                              +{quizQuestions[currentQuestion].dificuldade === 'facil' ? 30 : 
                                quizQuestions[currentQuestion].dificuldade === 'medio' ? 50 : 80} pontos
                            </p>
                          </div>
                        ) : (
                          <div>
                            <span className="text-4xl">😔</span>
                            <p className="text-red-400 font-bold text-lg mt-2">Ops! Resposta Incorreta</p>
                            <p className="text-red-300 text-sm">
                              A resposta correta era: {quizQuestions[currentQuestion].opcoes[quizQuestions[currentQuestion].resposta_correta]}
                            </p>
                          </div>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={nextQuestion}
                          className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl"
                        >
                          {currentQuestion < quizQuestions.length - 1 ? 'Próxima Pergunta →' : 'Ver Resultado 🏆'}
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Score Footer */}
                <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span>{score.acertos} acertos</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-400">
                      <XCircle className="w-5 h-5" />
                      <span>{score.erros} erros</span>
                    </div>
                  </div>
                  <div className="text-white font-bold">
                    Jogador: {playerName}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Final Result */}
            {showFinalResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/30 rounded-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-center relative overflow-hidden">
                  {/* Confetti */}
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -20, opacity: 1 }}
                      animate={{ y: 200, opacity: 0 }}
                      transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                      className={`absolute w-3 h-3 ${
                        ['bg-yellow-400', 'bg-pink-400', 'bg-green-400', 'bg-blue-400'][i % 4]
                      } rounded-full`}
                      style={{ left: `${10 + i * 9}%` }}
                    />
                  ))}
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.3 }}
                    className="text-7xl mb-4"
                  >
                    🏆
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white">Parabéns, {playerName}!</h3>
                  <p className="text-white/80 mt-2">Você completou o Quiz!</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Score Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4 text-center">
                      <p className="text-4xl font-bold text-amber-400">{score.pontos}</p>
                      <p className="text-gray-400 text-sm">Pontos</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 text-center">
                      <p className="text-4xl font-bold text-green-400">{score.acertos}</p>
                      <p className="text-gray-400 text-sm">Acertos</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-xl p-4 text-center">
                      <p className="text-4xl font-bold text-red-400">{score.erros}</p>
                      <p className="text-gray-400 text-sm">Erros</p>
                    </div>
                  </div>

                  {/* Performance Message */}
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    {score.acertos >= 8 ? (
                      <p className="text-green-400 text-lg">🌟 Excelente! Você é um expert na Bíblia!</p>
                    ) : score.acertos >= 5 ? (
                      <p className="text-yellow-400 text-lg">👏 Muito bom! Continue estudando!</p>
                    ) : (
                      <p className="text-blue-400 text-lg">📖 Continue aprendendo, você vai melhorar!</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetQuiz}
                      className="flex-1 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                    >
                      Jogar Novamente
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { resetQuiz(); setShowWelcome(true); }}
                      className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl"
                    >
                      Novo Jogador
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Custom Questions from Church */}
          {quizzes.length > 0 && showWelcome && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                ✏️ Perguntas Personalizadas da Igreja
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {quizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <h4 className="text-white font-medium text-sm">{quiz.pergunta}</h4>
                    </div>
                    <div className="space-y-1">
                      {quiz.opcoes.map((opcao, i) => (
                        <div
                          key={i}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            i === quiz.resposta_correta
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-white/5 text-gray-400'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}. {opcao}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ranking Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-500/30 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-center">
              <span className="text-3xl">🏆</span>
              <h3 className="text-xl font-bold text-white mt-2">Ranking</h3>
              <p className="text-white/70 text-sm">Top 10 Jogadores</p>
            </div>
            
            <div className="p-4 space-y-2">
              {ranking.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    index === 0 ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border border-gray-400/40' :
                    index === 2 ? 'bg-gradient-to-r from-orange-700/20 to-orange-600/20 border border-orange-600/40' :
                    'bg-white/5 border border-white/10'
                  }`}
                >
                  {/* Position */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-amber-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-white/10 text-gray-400'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>
                  
                  {/* Avatar */}
                  <img 
                    src={player.avatar} 
                    alt={player.nome}
                    className="w-10 h-10 rounded-full bg-slate-700"
                  />
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate text-sm">{player.nome}</p>
                    <p className="text-gray-500 text-xs">
                      {player.acertos} acertos • {player.erros} erros
                    </p>
                  </div>
                  
                  {/* Score */}
                  <div className="text-right">
                    <p className={`font-bold ${
                      index === 0 ? 'text-amber-400' :
                      index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-orange-400' :
                      'text-white'
                    }`}>
                      {player.pontuacao}
                    </p>
                    <p className="text-gray-500 text-xs">pts</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <h4 className="text-white font-semibold mb-3">📂 Categorias</h4>
            <div className="flex flex-wrap gap-2">
              {['Personagens', 'Números', 'Milagres', 'Histórias', 'Lugares', 'Animais', 'Versículos', 'Novo Testamento'].map((cat) => (
                <span key={cat} className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// Gallery Section with Upload functionality
function GallerySection() {
  const { fotos, videos, addFoto, addVideo } = useChurchData();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'foto' | 'video'>('foto');
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    url: '',
    data: new Date().toISOString().split('T')[0],
    evento: ''
  });

  const handleUpload = () => {
    if (!formData.titulo || !formData.url) return;

    if (uploadType === 'foto') {
      addFoto({
        igreja_id: '1',
        titulo: formData.titulo,
        url: formData.url,
        descricao: formData.descricao,
        data: formData.data
      });
    } else {
      addVideo({
        igreja_id: '1',
        titulo: formData.titulo,
        url: formData.url,
        thumbnail: formData.url.includes('youtube') 
          ? `https://img.youtube.com/vi/${formData.url.split('v=')[1]?.split('&')[0] || ''}/hqdefault.jpg`
          : 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=400&h=300&fit=crop',
        descricao: formData.descricao,
        data: formData.data
      });
    }

    setFormData({ titulo: '', descricao: '', url: '', data: new Date().toISOString().split('T')[0], evento: '' });
    setShowUploadModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample images for quick selection
  const sampleImages = [
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519491050282-cf00c82424fd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1602002418679-79d972f4ac8a?w=400&h=300&fit=crop',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Galeria de Fotos e Vídeos</h2>
          <p className="text-gray-400 text-sm mt-1">{fotos.length} fotos • {videos.length} vídeos</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/30"
        >
          <Plus className="w-5 h-5" />
          <span>+ Upload</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-4">
          <p className="text-indigo-400 text-sm">Total de Fotos</p>
          <p className="text-2xl font-bold text-white">{fotos.length}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-xl p-4">
          <p className="text-pink-400 text-sm">Total de Vídeos</p>
          <p className="text-2xl font-bold text-white">{videos.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
          <p className="text-green-400 text-sm">Este Mês</p>
          <p className="text-2xl font-bold text-white">{fotos.filter(f => new Date(f.data).getMonth() === new Date().getMonth()).length}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4">
          <p className="text-amber-400 text-sm">Última Atualização</p>
          <p className="text-lg font-bold text-white">
            {fotos.length > 0 ? new Date(fotos[fotos.length - 1].data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Photos Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📷 Fotos
          <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-1 rounded-full">{fotos.length}</span>
        </h3>
        {fotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fotos.map((foto, index) => (
              <motion.div
                key={foto.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="relative group aspect-video rounded-xl overflow-hidden cursor-pointer bg-slate-700"
              >
                <img src={foto.url} alt={foto.titulo} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white font-medium text-sm truncate">{foto.titulo}</p>
                    <p className="text-gray-300 text-xs">{new Date(foto.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                {foto.descricao && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-indigo-500/80 text-white text-xs rounded-full">
                    {foto.descricao}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <Image className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma foto cadastrada</h3>
            <p className="text-gray-400 mb-4">Adicione fotos da sua igreja e eventos</p>
            <button
              onClick={() => { setUploadType('foto'); setShowUploadModal(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar Foto</span>
            </button>
          </div>
        )}
      </div>

      {/* Videos Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🎬 Vídeos
          <span className="bg-pink-500/20 text-pink-400 text-xs px-2 py-1 rounded-full">{videos.length}</span>
        </h3>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative group rounded-xl overflow-hidden cursor-pointer bg-slate-700"
              >
                <div className="aspect-video relative">
                  <img src={video.thumbnail} alt={video.titulo} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Play className="w-6 h-6 text-white ml-1" />
                    </motion.div>
                  </div>
                </div>
                <div className="p-3 bg-slate-800">
                  <p className="text-white font-medium truncate">{video.titulo}</p>
                  <p className="text-gray-400 text-sm">{new Date(video.data).toLocaleDateString('pt-BR')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <Play className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum vídeo cadastrado</h3>
            <p className="text-gray-400 mb-4">Adicione vídeos de cultos e eventos</p>
            <button
              onClick={() => { setUploadType('video'); setShowUploadModal(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar Vídeo</span>
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`p-4 ${uploadType === 'foto' ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-600'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      {uploadType === 'foto' ? <Image className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {uploadType === 'foto' ? 'Adicionar Foto' : 'Adicionar Vídeo'}
                      </h3>
                      <p className="text-white/70 text-xs">Preencha os detalhes</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowUploadModal(false)} 
                    className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Type Selector */}
              <div className="p-4 border-b border-white/10">
                <div className="flex gap-2">
                  <button
                    onClick={() => setUploadType('foto')}
                    className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                      uploadType === 'foto'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    📷 Foto
                  </button>
                  <button
                    onClick={() => setUploadType('video')}
                    className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                      uploadType === 'video'
                        ? 'bg-pink-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    🎬 Vídeo
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Título *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder={uploadType === 'foto' ? 'Ex: Culto de Domingo' : 'Ex: Pregação do Pastor'}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição opcional..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                {/* Date and Event */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">📅 Data</label>
                    <input
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">🎉 Evento</label>
                    <input
                      type="text"
                      value={formData.evento}
                      onChange={(e) => setFormData({ ...formData, evento: e.target.value })}
                      placeholder="Ex: Culto, Batismo..."
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* URL or File Upload */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    {uploadType === 'foto' ? '🖼️ Imagem' : '🔗 URL do Vídeo (YouTube)'} *
                  </label>
                  
                  {uploadType === 'foto' ? (
                    <>
                      {/* File Upload */}
                      <label className="flex items-center justify-center gap-3 p-4 bg-white/5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-indigo-500 transition-all mb-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Image className="w-6 h-6 text-gray-400" />
                        <span className="text-gray-400">Clique para fazer upload</span>
                      </label>

                      {/* URL Input */}
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="Ou cole a URL da imagem"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      />

                      {/* Sample Images */}
                      <div className="mt-3">
                        <p className="text-gray-500 text-xs mb-2">Ou selecione uma imagem:</p>
                        <div className="grid grid-cols-6 gap-2">
                          {sampleImages.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setFormData({ ...formData, url: img })}
                              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                formData.url === img ? 'border-indigo-500' : 'border-transparent hover:border-white/30'
                              }`}
                            >
                              <img src={img} alt={`Sample ${idx}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  )}

                  {/* Preview */}
                  {formData.url && uploadType === 'foto' && (
                    <div className="mt-3 relative rounded-xl overflow-hidden">
                      <img src={formData.url} alt="Preview" className="w-full h-40 object-cover" />
                      <button
                        onClick={() => setFormData({ ...formData, url: '' })}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-white/5 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!formData.titulo || !formData.url}
                  className={`flex-1 py-2.5 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    uploadType === 'foto'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500'
                      : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500'
                  }`}
                >
                  <Save className="w-5 h-5" />
                  <span>Salvar</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Notifications Section
function NotificationsSection() {
  const channels = [
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', connected: true },
    { id: 'email', name: 'E-mail', icon: '📧', connected: true },
    { id: 'sms', name: 'SMS', icon: '📱', connected: false },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Canais de Comunicação</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <div key={channel.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="text-4xl mb-4">{channel.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{channel.name}</h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${channel.connected ? 'bg-green-500' : 'bg-gray-500'}`} />
              <span className={channel.connected ? 'text-green-400' : 'text-gray-400'}>
                {channel.connected ? 'Conectado' : 'Não conectado'}
              </span>
            </div>
            <button className={`mt-4 w-full py-2 rounded-xl ${channel.connected ? 'bg-white/10 text-white' : 'bg-indigo-500 text-white'}`}>
              {channel.connected ? 'Configurar' : 'Conectar'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Enviar Aviso</h3>
        <textarea
          placeholder="Digite sua mensagem..."
          className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-indigo-500"
        />
        <div className="flex flex-wrap gap-2 mt-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded-xl flex items-center gap-2">
            💬 WhatsApp
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-xl flex items-center gap-2">
            📧 E-mail
          </button>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-xl flex items-center gap-2">
            📢 Interno
          </button>
        </div>
      </div>
    </div>
  );
}

// Settings Section with Logo Upload and Color Selection
function SettingsSection({ igreja }: { igreja: any }) {
  const [formData, setFormData] = useState({
    nome: igreja?.nome || '',
    email: igreja?.email || '',
    telefone: igreja?.telefone || '',
    endereco: igreja?.endereco || '',
    logo: igreja?.logo || '',
    corPrincipal: igreja?.cor_principal || '#6366f1'
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaving(true);
    
    // Save to localStorage
    const igrejas = JSON.parse(localStorage.getItem('churchApp_igrejas') || '[]');
    const updatedIgrejas = igrejas.map((i: any) => 
      i.id === igreja?.id 
        ? { ...i, ...formData, cor_principal: formData.corPrincipal }
        : i
    );
    localStorage.setItem('churchApp_igrejas', JSON.stringify(updatedIgrejas));
    
    // Update session
    const session = JSON.parse(localStorage.getItem('churchApp_session') || '{}');
    if (session.igreja) {
      session.igreja = { ...session.igreja, ...formData, cor_principal: formData.corPrincipal };
      localStorage.setItem('churchApp_session', JSON.stringify(session));
    }
    
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const colorOptions = [
    { color: '#6366f1', name: 'Índigo' },
    { color: '#8b5cf6', name: 'Violeta' },
    { color: '#ec4899', name: 'Rosa' },
    { color: '#10b981', name: 'Verde' },
    { color: '#f59e0b', name: 'Âmbar' },
    { color: '#ef4444', name: 'Vermelho' },
    { color: '#3b82f6', name: 'Azul' },
    { color: '#14b8a6', name: 'Teal' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Configurações da Igreja</h2>
          <p className="text-gray-400 text-sm mt-1">Personalize a identidade visual da sua igreja</p>
        </div>
        {saved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Alterações salvas!</span>
          </motion.div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Church Info */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            ⛪ Informações da Igreja
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Nome da Igreja *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Telefone / WhatsApp</label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="+351 912 345 678"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Endereço</label>
              <textarea
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Rua, Número, Cidade, País"
                rows={2}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            🎨 Identidade Visual
          </h3>
          <div className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Logo da Igreja</label>
              <div className="flex items-center gap-4">
                {formData.logo ? (
                  <div className="relative">
                    <img 
                      src={formData.logo} 
                      alt="Logo" 
                      className="w-24 h-24 rounded-xl object-cover border-2 border-white/20"
                    />
                    <button
                      onClick={() => setFormData({ ...formData, logo: '' })}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-24 h-24 bg-white/10 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-white/20 cursor-pointer hover:border-indigo-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Image className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-gray-500 text-xs">Upload</span>
                  </label>
                )}
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">Faça upload do logo da sua igreja</p>
                  <p className="text-gray-500 text-xs mt-1">Recomendado: 200x200px, PNG ou JPG</p>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Cor Principal</label>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map(({ color, name }) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({ ...formData, corPrincipal: color })}
                    className={`relative w-full aspect-square rounded-xl transition-all ${
                      formData.corPrincipal === color 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800' 
                        : 'hover:ring-2 hover:ring-white/50'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {formData.corPrincipal === color && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <CheckCircle className="w-6 h-6 text-white drop-shadow-lg" />
                      </motion.div>
                    )}
                    <span className="sr-only">{name}</span>
                  </motion.button>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Cor selecionada: <span className="font-medium" style={{ color: formData.corPrincipal }}>{formData.corPrincipal}</span>
              </p>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Pré-visualização</label>
              <div 
                className="rounded-xl p-4 border border-white/10"
                style={{ backgroundColor: formData.corPrincipal + '20', borderColor: formData.corPrincipal + '50' }}
              >
                <div className="flex items-center gap-3">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: formData.corPrincipal }}
                    >
                      {formData.nome?.charAt(0) || '⛪'}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-semibold">{formData.nome || 'Nome da Igreja'}</p>
                    <p className="text-gray-400 text-sm">Sua igreja conectada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🌐 Redes Sociais
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Instagram</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-l-xl text-sm">
                @
              </span>
              <input
                type="text"
                placeholder="suaigreja"
                className="flex-1 p-3 bg-white/5 border border-white/10 border-l-0 rounded-r-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Facebook</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-blue-600 text-white rounded-l-xl text-sm">
                fb.com/
              </span>
              <input
                type="text"
                placeholder="suaigreja"
                className="flex-1 p-3 bg-white/5 border border-white/10 border-l-0 rounded-r-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">YouTube</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-red-600 text-white rounded-l-xl text-sm">
                youtube.com/
              </span>
              <input
                type="text"
                placeholder="@suaigreja"
                className="flex-1 p-3 bg-white/5 border border-white/10 border-l-0 rounded-r-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">WhatsApp da Igreja</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-green-500 text-white rounded-l-xl text-sm">
                +351
              </span>
              <input
                type="tel"
                placeholder="912 345 678"
                className="flex-1 p-3 bg-white/5 border border-white/10 border-l-0 rounded-r-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={saving}
        className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 disabled:opacity-50"
      >
        {saving ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
            <span>Salvando...</span>
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            <span>Salvar Alterações</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
