import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Calendar, Image, Heart, Video, 
  TrendingUp, DollarSign, Eye, Plus, Edit, Trash2, LogOut,
  CheckCircle, XCircle, X, Upload, Save, ExternalLink, Camera
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData, Member, Event } from '../contexts/DataContext';

interface AdminPanelProps {
  onBack: () => void;
}

type TabType = 'dashboard' | 'members' | 'events' | 'gallery' | 'prayers' | 'lives';

const stats = [
  { label: 'Membros Ativos', value: 523, change: '+12', icon: Users, color: 'blue' },
  { label: 'Frequência Média', value: '78%', change: '+5%', icon: Eye, color: 'green' },
  { label: 'Doações do Mês', value: '€4.250', change: '+18%', icon: DollarSign, color: 'orange' },
  { label: 'Novos Visitantes', value: 34, change: '+8', icon: TrendingUp, color: 'purple' },
];

export function AdminPanel({ onBack }: AdminPanelProps) {
  const { t } = useLanguage();
  const { 
    members, addMember, updateMember, deleteMember,
    events, addEvent, updateEvent, deleteEvent,
    prayerRequests, approvePrayerRequest, rejectPrayerRequest, deletePrayerRequest,
    galleryPhotos, addGalleryPhoto, deleteGalleryPhoto,
    youtubeChannelUrl, setYoutubeChannelUrl, liveStream, setLiveStream
  } = useData();
  
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Member Modal State
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberForm, setMemberForm] = useState({ name: '', email: '', phone: '', photo: '', status: 'active' as 'active' | 'inactive' });
  
  // Event Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '', date: '', time: '', location: '', description: '',
    poster: '', pastorName: '', pastorPhoto: '', singerName: '', singerPhoto: '',
    photos: [] as string[], status: 'scheduled' as 'scheduled' | 'draft' | 'completed'
  });
  
  // Gallery Upload State
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ title: '', category: 'Cultos', url: '' });
  
  // Live Modal State
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [liveForm, setLiveForm] = useState({ title: '', youtubeUrl: '' });

  const tabs = [
    { id: 'dashboard' as const, label: t('dashboard'), icon: LayoutDashboard },
    { id: 'members' as const, label: 'Membros', icon: Users },
    { id: 'events' as const, label: t('events'), icon: Calendar },
    { id: 'gallery' as const, label: t('gallery'), icon: Image },
    { id: 'prayers' as const, label: 'Orações', icon: Heart },
    { id: 'lives' as const, label: 'Lives', icon: Video },
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600',
      purple: 'from-purple-500 to-purple-600',
    };
    return colors[color] || colors.blue;
  };

  // Member handlers
  const handleOpenMemberModal = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setMemberForm({
        name: member.name,
        email: member.email,
        phone: member.phone,
        photo: member.photo || '',
        status: member.status
      });
    } else {
      setEditingMember(null);
      setMemberForm({ name: '', email: '', phone: '', photo: '', status: 'active' });
    }
    setShowMemberModal(true);
  };

  const handleSaveMember = () => {
    if (editingMember) {
      updateMember(editingMember.id, memberForm);
    } else {
      addMember({ ...memberForm, joinedAt: new Date().toISOString().split('T')[0] });
    }
    setShowMemberModal(false);
  };

  // Event handlers
  const handleOpenEventModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
        poster: event.poster || '',
        pastorName: event.pastorName,
        pastorPhoto: event.pastorPhoto || '',
        singerName: event.singerName,
        singerPhoto: event.singerPhoto || '',
        photos: event.photos || [],
        status: event.status
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: '', date: '', time: '', location: '', description: '',
        poster: '', pastorName: '', pastorPhoto: '', singerName: '', singerPhoto: '',
        photos: [], status: 'scheduled'
      });
    }
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventForm);
    } else {
      addEvent(eventForm);
    }
    setShowEventModal(false);
  };

  // Gallery handlers
  const handleSaveGalleryPhoto = () => {
    addGalleryPhoto({
      title: galleryForm.title,
      category: galleryForm.category,
      url: galleryForm.url,
      createdAt: new Date().toISOString()
    });
    setShowGalleryModal(false);
    setGalleryForm({ title: '', category: 'Cultos', url: '' });
  };

  // File upload simulation
  const handleFileUpload = (callback: (url: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          callback(base64);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Start Live
  const handleStartLive = () => {
    if (liveForm.youtubeUrl) {
      setLiveStream({
        id: Date.now().toString(),
        title: liveForm.title || 'Transmissão ao Vivo',
        youtubeUrl: liveForm.youtubeUrl,
        scheduledAt: new Date().toISOString(),
        isLive: true
      });
      setShowLiveModal(false);
      window.open(liveForm.youtubeUrl, '_blank');
    }
  };

  const privatePrayers = prayerRequests.filter(p => !p.isPublic || p.status === 'pending');

  return (
    <section className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-6 pt-24 z-40"
        >
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white">{t('adminPanel')}</h2>
            <p className="text-gray-400 text-sm">Igreja Conectada</p>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                {tab.id === 'prayers' && privatePrayers.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {privatePrayers.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <button
            onClick={onBack}
            className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t('menu.logout')}</span>
          </button>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 pt-24">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard')}</h1>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${getColorClass(stat.color)} rounded-xl flex items-center justify-center mb-4`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-gray-900 mb-4">Crescimento de Membros</h3>
                  <div className="h-64 bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                      <p className="text-gray-500">Gráfico de Crescimento</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{members.length} membros</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-gray-900 mb-4">Frequência nos Cultos</h3>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                      <p className="text-gray-500">Gráfico de Frequência</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{events.length} eventos</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestão de Membros</h1>
                <button 
                  onClick={() => handleOpenMemberModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                >
                  <Plus className="w-4 h-4" />
                  Novo Membro
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Foto</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Nome</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Email</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Telefone</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          {member.photo ? (
                            <img src={member.photo} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {member.name.charAt(0)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{member.name}</td>
                        <td className="px-6 py-4 text-gray-600">{member.email}</td>
                        <td className="px-6 py-4 text-gray-600">{member.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            member.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {member.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleOpenMemberModal(member)}
                              className="p-2 hover:bg-blue-50 rounded-lg text-blue-500"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteMember(member.id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestão de Eventos</h1>
                <button 
                  onClick={() => handleOpenEventModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                >
                  <Plus className="w-4 h-4" />
                  Novo Evento
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    {/* Event Poster */}
                    <div className="h-32 bg-gradient-to-br from-orange-500 to-blue-600 relative">
                      {event.poster ? (
                        <img src={event.poster} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'scheduled' ? 'bg-green-500 text-white' :
                        event.status === 'completed' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-white'
                      }`}>
                        {event.status === 'scheduled' ? 'Agendado' : event.status === 'completed' ? 'Realizado' : 'Rascunho'}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                      </p>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Pastor:</span>
                          <span className="font-medium">{event.pastorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Cantor:</span>
                          <span className="font-medium">{event.singerName}</span>
                        </div>
                        {event.photos.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500">{event.photos.length} fotos</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenEventModal(event)}
                          className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 flex items-center justify-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        <button 
                          onClick={() => deleteEvent(event.id)}
                          className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestão da Galeria</h1>
                <button 
                  onClick={() => setShowGalleryModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                >
                  <Upload className="w-4 h-4" />
                  Upload de Fotos
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryPhotos.map((photo) => (
                  <div key={photo.id} className="relative group bg-gray-100 rounded-xl aspect-square overflow-hidden">
                    {photo.url ? (
                      <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">📷</div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => deleteGalleryPhoto(photo.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                      <p className="text-white/70 text-xs">{photo.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Prayers Tab */}
          {activeTab === 'prayers' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Moderação do Mural de Oração</h1>

              {/* Private/Pending Prayers Alert */}
              {privatePrayers.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <h3 className="font-bold text-yellow-800 mb-2">⚠️ Pedidos Privados Pendentes</h3>
                  <p className="text-yellow-700 text-sm">Você tem {privatePrayers.length} pedidos de oração privados aguardando análise.</p>
                </div>
              )}

              <div className="space-y-4">
                {prayerRequests.map((prayer, index) => (
                  <motion.div
                    key={prayer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-2xl shadow-lg p-6 ${!prayer.isPublic ? 'border-l-4 border-yellow-500' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {prayer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-900">{prayer.name}</p>
                              {!prayer.isPublic && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">Privado</span>
                              )}
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                prayer.status === 'approved' ? 'bg-green-100 text-green-700' :
                                prayer.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {prayer.status === 'approved' ? 'Aprovado' : prayer.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{new Date(prayer.createdAt).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <p className="text-gray-600">{prayer.message}</p>
                        <p className="text-sm text-gray-400 mt-2">{prayer.prayingCount} pessoas orando</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {prayer.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => approvePrayerRequest(prayer.id)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                              title="Aprovar"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => rejectPrayerRequest(prayer.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                              title="Rejeitar"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => deletePrayerRequest(prayer.id)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                          title="Excluir"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Lives Tab */}
          {activeTab === 'lives' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Controle de Lives</h1>
                <button 
                  onClick={() => setShowLiveModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600"
                >
                  <Video className="w-4 h-4" />
                  Iniciar Live
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL do Canal do YouTube</label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={youtubeChannelUrl}
                      onChange={(e) => setYoutubeChannelUrl(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
                      placeholder="https://www.youtube.com/@SeuCanal"
                    />
                    <a 
                      href={youtubeChannelUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Abrir Canal
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-4 h-4 rounded-full ${liveStream?.isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
                  <span className="text-gray-600">
                    {liveStream?.isLive ? `Ao vivo: ${liveStream.title}` : 'Nenhuma transmissão ao vivo no momento'}
                  </span>
                </div>

                {liveStream?.isLive && (
                  <div className="p-4 bg-red-50 rounded-xl mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-red-800">{liveStream.title}</p>
                        <p className="text-sm text-red-600">{liveStream.youtubeUrl}</p>
                      </div>
                      <button 
                        onClick={() => setLiveStream(null)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Encerrar Live
                      </button>
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="font-bold text-gray-900 mb-4">Próximos Eventos para Transmissão</h3>
                  <div className="space-y-3">
                    {events.filter(e => e.status === 'scheduled').slice(0, 3).map(event => (
                      <div key={event.id} className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Video className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                          </p>
                        </div>
                        <button 
                          onClick={() => {
                            setLiveForm({ title: event.title, youtubeUrl: youtubeChannelUrl + '/live' });
                            setShowLiveModal(true);
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                        >
                          Iniciar Live
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Member Modal */}
      <AnimatePresence>
        {showMemberModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowMemberModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingMember ? 'Editar Membro' : 'Novo Membro'}
                </h2>
                <button onClick={() => setShowMemberModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Photo Upload */}
                <div className="flex justify-center">
                  <div 
                    onClick={() => handleFileUpload((url) => setMemberForm({ ...memberForm, photo: url }))}
                    className="relative w-24 h-24 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    {memberForm.photo ? (
                      <img src={memberForm.photo} alt="Foto" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                    placeholder="+351 912 345 678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={memberForm.status}
                    onChange={(e) => setMemberForm({ ...memberForm, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveMember}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingMember ? 'Salvar Alterações' : 'Cadastrar Membro'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingEvent ? 'Editar Evento' : 'Novo Evento'}
                </h2>
                <button onClick={() => setShowEventModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Poster Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pôster do Evento</label>
                  <div 
                    onClick={() => handleFileUpload((url) => setEventForm({ ...eventForm, poster: url }))}
                    className="w-full h-40 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors flex items-center justify-center overflow-hidden"
                  >
                    {eventForm.poster ? (
                      <img src={eventForm.poster} alt="Poster" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Clique para fazer upload</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título do Evento</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                      placeholder="Nome do evento"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                      placeholder="Local do evento"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={eventForm.status}
                      onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as 'scheduled' | 'draft' | 'completed' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="scheduled">Agendado</option>
                      <option value="draft">Rascunho</option>
                      <option value="completed">Realizado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={3}
                    placeholder="Descrição do evento"
                  />
                </div>

                {/* Pastor Section */}
                <div className="p-4 bg-orange-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-3">Pastor / Pregador</h3>
                  <div className="flex gap-4">
                    <div 
                      onClick={() => handleFileUpload((url) => setEventForm({ ...eventForm, pastorPhoto: url }))}
                      className="w-20 h-20 bg-white rounded-xl cursor-pointer hover:bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0"
                    >
                      {eventForm.pastorPhoto ? (
                        <img src={eventForm.pastorPhoto} alt="Pastor" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={eventForm.pastorName}
                        onChange={(e) => setEventForm({ ...eventForm, pastorName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                        placeholder="Nome do Pastor/Pregador"
                      />
                    </div>
                  </div>
                </div>

                {/* Singer Section */}
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-3">Cantor / Ministério de Louvor</h3>
                  <div className="flex gap-4">
                    <div 
                      onClick={() => handleFileUpload((url) => setEventForm({ ...eventForm, singerPhoto: url }))}
                      className="w-20 h-20 bg-white rounded-xl cursor-pointer hover:bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0"
                    >
                      {eventForm.singerPhoto ? (
                        <img src={eventForm.singerPhoto} alt="Cantor" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={eventForm.singerName}
                        onChange={(e) => setEventForm({ ...eventForm, singerName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                        placeholder="Nome do Cantor/Ministério"
                      />
                    </div>
                  </div>
                </div>

                {/* Event Photos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fotos do Evento</label>
                  <div className="grid grid-cols-4 gap-2">
                    {eventForm.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setEventForm({ ...eventForm, photos: eventForm.photos.filter((_, i) => i !== index) })}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div 
                      onClick={() => handleFileUpload((url) => setEventForm({ ...eventForm, photos: [...eventForm.photos, url] }))}
                      className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center justify-center"
                    >
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveEvent}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingEvent ? 'Salvar Alterações' : 'Cadastrar Evento'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGalleryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowGalleryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upload de Foto</h2>
                <button onClick={() => setShowGalleryModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => handleFileUpload((url) => setGalleryForm({ ...galleryForm, url }))}
                  className="w-full h-48 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors flex items-center justify-center overflow-hidden"
                >
                  {galleryForm.url ? (
                    <img src={galleryForm.url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Clique para selecionar uma foto</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                    placeholder="Título da foto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Cultos">Cultos</option>
                    <option value="Batismos">Batismos</option>
                    <option value="Eventos">Eventos</option>
                    <option value="Escolinha">Escolinha</option>
                    <option value="Missões">Missões</option>
                    <option value="Células">Células</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveGalleryPhoto}
                  disabled={!galleryForm.url || !galleryForm.title}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  Salvar Foto
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Modal */}
      <AnimatePresence>
        {showLiveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowLiveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Iniciar Live</h2>
                <button onClick={() => setShowLiveModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título da Live</label>
                  <input
                    type="text"
                    value={liveForm.title}
                    onChange={(e) => setLiveForm({ ...liveForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
                    placeholder="Ex: Culto de Domingo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL do YouTube</label>
                  <input
                    type="url"
                    value={liveForm.youtubeUrl}
                    onChange={(e) => setLiveForm({ ...liveForm, youtubeUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <button
                  onClick={handleStartLive}
                  disabled={!liveForm.youtubeUrl}
                  className="w-full py-3 bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 disabled:opacity-50"
                >
                  <Video className="w-5 h-5" />
                  Iniciar Transmissão
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
