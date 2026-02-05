import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, Calendar, Image, Heart, Video, 
  TrendingUp, DollarSign, Eye, Plus, Edit, Trash2, LogOut,
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminPanelProps {
  onLogout: () => void;
}

type TabType = 'dashboard' | 'members' | 'events' | 'gallery' | 'prayers' | 'lives';

const stats = [
  { label: 'Membros Ativos', value: 523, change: '+12', icon: Users, color: 'blue' },
  { label: 'Frequência Média', value: '78%', change: '+5%', icon: Eye, color: 'green' },
  { label: 'Doações do Mês', value: '€4.250', change: '+18%', icon: DollarSign, color: 'orange' },
  { label: 'Novos Visitantes', value: 34, change: '+8', icon: TrendingUp, color: 'purple' },
];

const mockMembers = [
  { id: '1', name: 'Maria Silva', email: 'maria@email.com', status: 'active', joined: '2023-01-15' },
  { id: '2', name: 'João Santos', email: 'joao@email.com', status: 'active', joined: '2023-03-20' },
  { id: '3', name: 'Ana Costa', email: 'ana@email.com', status: 'inactive', joined: '2022-08-10' },
];

const mockEvents = [
  { id: '1', title: 'Culto de Celebração', date: '2025-01-19', status: 'scheduled' },
  { id: '2', title: 'Conferência de Jovens', date: '2025-01-25', status: 'draft' },
  { id: '3', title: 'Batismo', date: '2025-02-02', status: 'scheduled' },
];

const mockPrayers = [
  { id: '1', name: 'Carlos', message: 'Pela saúde da minha família', status: 'pending', date: '2025-01-14' },
  { id: '2', name: 'Teresa', message: 'Agradeço pela bênção recebida', status: 'approved', date: '2025-01-13' },
  { id: '3', name: 'Anônimo', message: 'Preciso de oração pelo trabalho', status: 'pending', date: '2025-01-12' },
];

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

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
              </button>
            ))}
          </nav>

          <button
            onClick={onLogout}
            className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t('logout')}</span>
          </button>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 pt-24">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard')}</h1>

              {/* Stats Grid */}
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

              {/* Charts Placeholder */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-gray-900 mb-4">Crescimento de Membros</h3>
                  <div className="h-64 bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                      <p className="text-gray-500">Gráfico de Crescimento</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-gray-900 mb-4">Frequência nos Cultos</h3>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                      <p className="text-gray-500">Gráfico de Frequência</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'members' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestão de Membros</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-xl font-medium">
                  <Plus className="w-4 h-4" />
                  Novo Membro
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Nome</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Email</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Membro desde</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {member.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{member.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            member.status === 'active' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {member.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(member.joined).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                              <Edit className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4 text-red-500" />
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

          {activeTab === 'events' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestão de Eventos</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-xl font-medium">
                  <Plus className="w-4 h-4" />
                  Novo Evento
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'scheduled' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {event.status === 'scheduled' ? 'Agendado' : 'Rascunho'}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                        Editar
                      </button>
                      <button className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'prayers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Moderação do Mural de Oração</h1>

              <div className="space-y-4">
                {mockPrayers.map((prayer, index) => (
                  <motion.div
                    key={prayer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {prayer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{prayer.name}</p>
                            <p className="text-xs text-gray-500">{new Date(prayer.date).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <p className="text-gray-600 ml-13">{prayer.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {prayer.status === 'pending' ? (
                          <>
                            <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                            Aprovado
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestão da Galeria</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-xl font-medium">
                  <Plus className="w-4 h-4" />
                  Upload de Fotos
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Image className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">Arraste e solte fotos aqui ou clique para fazer upload</p>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">
                  Selecionar Arquivos
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'lives' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Controle de Lives</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-medium">
                  <Video className="w-4 h-4" />
                  Iniciar Live
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-4 h-4 bg-gray-300 rounded-full" />
                  <span className="text-gray-500">Nenhuma transmissão ao vivo no momento</span>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold text-gray-900 mb-4">Próxima Transmissão Agendada</h3>
                  <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Culto de Domingo</p>
                      <p className="text-sm text-gray-500">19 de Janeiro, 2025 - 10:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </section>
  );
}
