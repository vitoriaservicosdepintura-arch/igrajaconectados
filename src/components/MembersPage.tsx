import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, CheckCircle, Bell, Calendar, Heart, Settings } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'dashboard';

export function MembersPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/register
    setIsLoggedIn(true);
    setAuthMode('dashboard');
  };

  const memberData = {
    name: 'João da Silva',
    email: 'joao@email.com',
    memberSince: '2020',
    activities: [
      { date: '14/01/2024', activity: 'Culto de Domingo', type: 'presence' },
      { date: '10/01/2024', activity: 'Estudo Bíblico', type: 'presence' },
      { date: '07/01/2024', activity: 'Culto de Domingo', type: 'presence' },
      { date: '05/01/2024', activity: 'Doação - R$ 100', type: 'donation' }
    ],
    notifications: [
      { title: 'Conferência de Jovens', message: 'Evento dia 10/02. Confirme sua presença!', isNew: true },
      { title: 'Retiro Espiritual', message: 'Inscrições abertas até 01/03', isNew: true },
      { title: 'Aniversário do mês', message: 'Parabéns pelo seu aniversário!', isNew: false }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-950 to-slate-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-600/30 mb-4">
                  <User className="w-8 h-8 text-amber-400" />
                </div>
                <h1 className="text-3xl font-bold text-amber-100 mb-2">
                  {authMode === 'login' ? 'Entrar' : 'Criar Conta'}
                </h1>
                <p className="text-amber-200/70">
                  {authMode === 'login' 
                    ? 'Acesse sua área de membro' 
                    : 'Junte-se à nossa comunidade'}
                </p>
              </div>

              {/* Auth Form */}
              <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-2xl p-8 border border-amber-700/30">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-amber-200/80 text-sm mb-2">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Seu nome completo"
                          className="w-full bg-amber-800/30 border border-amber-700/50 rounded-xl py-3 pl-12 pr-4 text-amber-100 placeholder-amber-500/50 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-amber-200/80 text-sm mb-2">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                        className="w-full bg-amber-800/30 border border-amber-700/50 rounded-xl py-3 pl-12 pr-4 text-amber-100 placeholder-amber-500/50 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-amber-200/80 text-sm mb-2">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-amber-800/30 border border-amber-700/50 rounded-xl py-3 pl-12 pr-12 text-amber-100 placeholder-amber-500/50 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {authMode === 'register' && (
                    <div>
                      <label className="block text-amber-200/80 text-sm mb-2">Confirmar Senha</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full bg-amber-800/30 border border-amber-700/50 rounded-xl py-3 pl-12 pr-4 text-amber-100 placeholder-amber-500/50 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  )}

                  {authMode === 'login' && (
                    <div className="text-right">
                      <button type="button" className="text-amber-400 text-sm hover:underline">
                        Esqueceu a senha?
                      </button>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                  >
                    {authMode === 'login' ? (
                      <>
                        <LogIn className="w-5 h-5" />
                        Entrar
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Criar Conta
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-amber-200/60">
                    {authMode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                    <button
                      onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                      className="text-amber-400 font-medium ml-2 hover:underline"
                    >
                      {authMode === 'login' ? 'Cadastre-se' : 'Entrar'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-2xl font-bold text-white">
                    {memberData.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-amber-100">{memberData.name}</h1>
                    <p className="text-amber-200/60">Membro desde {memberData.memberSince}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-amber-800/40 hover:bg-amber-700/50 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-amber-400" />
                  </button>
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="px-4 py-2 bg-amber-800/40 hover:bg-amber-700/50 rounded-lg text-amber-200 font-medium transition-colors"
                  >
                    Sair
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Stats */}
                <div className="md:col-span-3 grid grid-cols-3 gap-4">
                  {[
                    { icon: Calendar, value: '45', label: 'Cultos Participados', color: 'text-blue-400' },
                    { icon: Heart, value: 'R$ 1.200', label: 'Total Doado', color: 'text-red-400' },
                    { icon: CheckCircle, value: '12', label: 'Eventos Confirmados', color: 'text-green-400' }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-xl p-4 border border-amber-700/30 text-center"
                    >
                      <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                      <div className="text-2xl font-bold text-amber-100">{stat.value}</div>
                      <div className="text-sm text-amber-200/60">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Activity History */}
                <div className="md:col-span-2 bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-2xl p-6 border border-amber-700/30">
                  <h2 className="text-xl font-bold text-amber-100 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    Histórico de Participação
                  </h2>
                  <div className="space-y-3">
                    {memberData.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-amber-800/20 rounded-xl"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'presence' ? 'bg-green-600/30' : 'bg-amber-600/30'
                        }`}>
                          {activity.type === 'presence' ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <Heart className="w-5 h-5 text-amber-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-amber-100 font-medium">{activity.activity}</p>
                          <p className="text-amber-200/60 text-sm">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-2xl p-6 border border-amber-700/30">
                  <h2 className="text-xl font-bold text-amber-100 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-400" />
                    Notificações
                  </h2>
                  <div className="space-y-3">
                    {memberData.notifications.map((notif, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-xl ${
                          notif.isNew ? 'bg-amber-600/20 border border-amber-500/30' : 'bg-amber-800/20'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <p className="text-amber-100 font-medium text-sm">{notif.title}</p>
                          {notif.isNew && (
                            <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                              Nova
                            </span>
                          )}
                        </div>
                        <p className="text-amber-200/60 text-sm mt-1">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
