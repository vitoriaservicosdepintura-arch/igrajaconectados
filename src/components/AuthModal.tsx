import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Church, Eye, EyeOff, Users, Shield, MapPin, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitch: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, mode, onClose, onSwitch, onSuccess }: AuthModalProps) {
  const { t } = useLanguage();
  const { login, loginMember, register, igrejas } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'member'>('member');
  const [selectedIgrejaId, setSelectedIgrejaId] = useState<string>('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [formData, setFormData] = useState({
    churchName: '',
    adminName: '',
    email: '',
    phone: '+351 ',
    password: '',
    confirmPassword: '',
    endereco: '',
    memberName: '',
    memberPhone: '+351 ',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'register') {
      if (!formData.churchName || formData.churchName.length < 3) {
        newErrors.churchName = 'Nome da igreja deve ter pelo menos 3 caracteres';
      }
      if (!formData.adminName || formData.adminName.length < 3) {
        newErrors.adminName = 'Nome do administrador deve ter pelo menos 3 caracteres';
      }
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'E-mail inválido';
      }
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
      if (!formData.phone || formData.phone.replace(/\D/g, '').length < 9) {
        newErrors.phone = 'Telefone inválido';
      }
    }

    if (mode === 'login' && loginType === 'admin') {
      if (!formData.email) {
        newErrors.email = 'E-mail é obrigatório';
      }
      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória';
      }
    }

    if (mode === 'login' && loginType === 'member') {
      if (!formData.memberName || formData.memberName.length < 3) {
        newErrors.memberName = 'Nome deve ter pelo menos 3 caracteres';
      }
      if (!formData.memberPhone || formData.memberPhone.replace(/\D/g, '').length < 9) {
        newErrors.memberPhone = 'WhatsApp inválido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        let success = false;
        if (loginType === 'member') {
          success = await loginMember(formData.memberName, formData.memberPhone, selectedIgrejaId);
        } else {
          success = await login(formData.email, formData.password, 'admin');
        }
        if (success) {
          onSuccess();
        }
      } else {
        const success = await register({
          churchName: formData.churchName,
          adminName: formData.adminName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          endereco: formData.endereco
        });
        if (success) {
          setRegisterSuccess(true);
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      churchName: '',
      adminName: '',
      email: '',
      phone: '+351 ',
      password: '',
      confirmPassword: '',
      endereco: '',
      memberName: '',
      memberPhone: '+351 ',
    });
    setErrors({});
    setRegisterSuccess(false);
  };

  const handleSwitch = () => {
    resetForm();
    onSwitch();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Decoration */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 pt-10">
              {/* Success Message */}
              {registerSuccess ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Igreja Cadastrada! 🎉</h2>
                  <p className="text-gray-400 mb-4">
                    Sua igreja foi criada com sucesso!<br />
                    Todos os dados começam do zero.
                  </p>
                  <p className="text-green-400 text-sm">
                    Redirecionando para o painel...
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Logo */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
                      <span className="text-white text-3xl">✝</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {mode === 'login' ? t('auth.login') : 'Cadastrar Igreja'}
                    </h2>
                    <p className="text-gray-400 mt-1">
                      {mode === 'login' ? 'Acesse sua conta' : 'Crie sua igreja do zero'}
                    </p>
                  </div>

                  {/* Login Type Selector (only for login mode) */}
                  {mode === 'login' && (
                    <div className="flex gap-2 mb-6">
                      <button
                        type="button"
                        onClick={() => setLoginType('member')}
                        className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                          loginType === 'member'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <Users className="w-5 h-5" />
                        Membro
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginType('admin')}
                        className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                          loginType === 'admin'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <Shield className="w-5 h-5" />
                        Administrador
                      </button>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                      <>
                        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-4">
                          <p className="text-indigo-400 text-sm text-center">
                            ⛪ Cadastre sua igreja e comece do zero!<br />
                            <span className="text-xs text-gray-400">Todos os dados serão salvos automaticamente</span>
                          </p>
                        </div>

                        <div className="relative">
                          <Church className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            placeholder="Nome da Igreja *"
                            value={formData.churchName}
                            onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                              errors.churchName ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'
                            }`}
                          />
                          {errors.churchName && <p className="text-red-400 text-xs mt-1">{errors.churchName}</p>}
                        </div>

                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            placeholder="Nome do Administrador/Pastor *"
                            value={formData.adminName}
                            onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                              errors.adminName ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'
                            }`}
                          />
                          {errors.adminName && <p className="text-red-400 text-xs mt-1">{errors.adminName}</p>}
                        </div>

                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            placeholder="E-mail *"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                              errors.email ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'
                            }`}
                          />
                          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            placeholder="WhatsApp/Telefone *"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={`w-full pl-11 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                              errors.phone ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'
                            }`}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg">🇵🇹</span>
                          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            placeholder="Endereço (opcional)"
                            value={formData.endereco}
                            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>

                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Senha *"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`w-full pl-11 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                              errors.password ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirmar Senha *"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                              errors.confirmPassword ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'
                            }`}
                          />
                          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>
                      </>
                    )}

                    {/* Member Login Fields */}
                    {mode === 'login' && loginType === 'member' && (
                      <>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                          <p className="text-green-400 text-sm text-center">
                            👋 Bem-vindo(a)! Acesse com seu nome e WhatsApp
                          </p>
                        </div>

                        {igrejas.length > 0 && (
                          <div className="relative">
                            <Church className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                              value={selectedIgrejaId}
                              onChange={(e) => setSelectedIgrejaId(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors appearance-none"
                            >
                              <option value="" className="bg-slate-800">Selecione sua igreja</option>
                              {igrejas.map(igreja => (
                                <option key={igreja.id} value={igreja.id} className="bg-slate-800">
                                  {igreja.nome}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            placeholder="Seu nome completo"
                            value={formData.memberName}
                            onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors ${
                              errors.memberName ? 'border-red-500' : 'border-white/10'
                            }`}
                          />
                          {errors.memberName && <p className="text-red-400 text-xs mt-1">{errors.memberName}</p>}
                        </div>

                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            placeholder="+351 9XX XXX XXX"
                            value={formData.memberPhone}
                            onChange={(e) => setFormData({ ...formData, memberPhone: e.target.value })}
                            className={`w-full pl-11 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors ${
                              errors.memberPhone ? 'border-red-500' : 'border-white/10'
                            }`}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg">🇵🇹</span>
                          {errors.memberPhone && <p className="text-red-400 text-xs mt-1">{errors.memberPhone}</p>}
                        </div>
                        <p className="text-xs text-gray-500 -mt-2">🇧🇷 Brasil: +55 | 🇵🇹 Portugal: +351</p>
                      </>
                    )}

                    {/* Admin Login Fields */}
                    {mode === 'login' && loginType === 'admin' && (
                      <>
                        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-4">
                          <p className="text-indigo-400 text-sm text-center">
                            🔐 Acesso restrito para administradores da igreja
                          </p>
                        </div>

                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            placeholder={t('auth.email')}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors ${
                              errors.email ? 'border-red-500' : 'border-white/10'
                            }`}
                          />
                          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('auth.password')}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`w-full pl-11 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors ${
                              errors.password ? 'border-red-500' : 'border-white/10'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div className="text-right">
                          <button type="button" className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors">
                            {t('auth.forgotPassword')}
                          </button>
                        </div>
                      </>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 ${
                        loginType === 'member' && mode === 'login'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 shadow-green-500/30'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-indigo-500/30'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {mode === 'register' ? 'Criando igreja...' : 'Entrando...'}
                        </span>
                      ) : (
                        mode === 'login' 
                          ? (loginType === 'member' ? '🚀 Entrar como Membro' : '🔐 Entrar como Admin')
                          : '⛪ Cadastrar minha Igreja'
                      )}
                    </button>
                  </form>

                  {/* Switch Mode */}
                  {mode === 'login' && loginType === 'admin' && (
                    <p className="text-center text-gray-400 mt-6">
                      Não tem uma igreja cadastrada?{' '}
                      <button onClick={handleSwitch} className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                        Cadastrar Igreja
                      </button>
                    </p>
                  )}

                  {mode === 'register' && (
                    <p className="text-center text-gray-400 mt-6">
                      Já tem uma conta?{' '}
                      <button onClick={handleSwitch} className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                        Fazer Login
                      </button>
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
