import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, Phone, Church, Eye, EyeOff, Users, Shield } from 'lucide-react';
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
  
  const [formData, setFormData] = useState({
    adminName: '',
    password: '',
    confirmPassword: '',
    memberName: '',
    memberPhone: '+351 ',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'register') {
      if (!formData.adminName || formData.adminName.length < 3) {
        newErrors.adminName = 'Nome do Pastor deve ter pelo menos 3 caracteres';
      }
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    if (mode === 'login' && loginType === 'admin') {
      if (!formData.adminName || formData.adminName.length < 3) {
        newErrors.adminName = 'Nome do Pastor é obrigatório';
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
      let success = false;
      
      if (mode === 'login') {
        if (loginType === 'member') {
          success = await loginMember(formData.memberName, formData.memberPhone, selectedIgrejaId);
        } else {
          // Login admin usando nome e senha
          success = await login(formData.adminName, formData.password, 'admin');
        }
      } else {
        // Cadastro de novo administrador
        success = await register({
          churchName: `Igreja de ${formData.adminName}`,
          adminName: formData.adminName,
          email: `${formData.adminName.toLowerCase().replace(/\s/g, '.')}@igreja.com`,
          phone: '+351 000 000 000',
          password: formData.password,
          endereco: '',
          plano: 'premium',
        });
      }

      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      adminName: '',
      password: '',
      confirmPassword: '',
      memberName: '',
      memberPhone: '+351 ',
    });
    setErrors({});
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
            className="relative w-full max-w-md max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Decoration */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 pt-10">
              {/* Logo */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
                  <span className="text-white text-4xl">✝</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {mode === 'login' ? t('auth.login') : 'Cadastrar Administrador'}
                </h2>
                <p className="text-gray-400 mt-1">
                  {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta de pastor'}
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
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
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
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
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
                
                {/* Admin Login/Register Fields */}
                {(mode === 'register' || (mode === 'login' && loginType === 'admin')) && (
                  <>
                    <div className={`${mode === 'register' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-purple-500/10 border-purple-500/30'} border rounded-xl p-4 mb-4`}>
                      <p className={`${mode === 'register' ? 'text-indigo-400' : 'text-purple-400'} text-sm text-center`}>
                        {mode === 'register' 
                          ? '⛪ Cadastre-se como Pastor/Administrador'
                          : '🔐 Acesso restrito para administradores'
                        }
                      </p>
                    </div>

                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Nome do Pastor/Administrador *"
                        value={formData.adminName}
                        onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                        className={`w-full pl-11 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                          errors.adminName ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'
                        }`}
                      />
                      {errors.adminName && <p className="text-red-400 text-xs mt-1">{errors.adminName}</p>}
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Senha *"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`w-full pl-11 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
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

                    {mode === 'register' && (
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirmar Senha *"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className={`w-full pl-11 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                            errors.confirmPassword ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'
                          }`}
                        />
                        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                      </div>
                    )}
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
                          className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors appearance-none"
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
                        className={`w-full pl-11 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors ${
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
                        className={`w-full pl-11 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors ${
                          errors.memberPhone ? 'border-red-500' : 'border-white/10'
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg">🇵🇹</span>
                      {errors.memberPhone && <p className="text-red-400 text-xs mt-1">{errors.memberPhone}</p>}
                    </div>
                    <p className="text-xs text-gray-500 -mt-2">🇧🇷 Brasil: +55 | 🇵🇹 Portugal: +351</p>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 ${
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
                      {mode === 'register' ? 'Cadastrando...' : 'Entrando...'}
                    </span>
                  ) : (
                    mode === 'login' 
                      ? (loginType === 'member' ? '🚀 Entrar como Membro' : '🔐 Entrar como Admin')
                      : '✅ Cadastrar'
                  )}
                </button>
              </form>

              {/* Switch Mode */}
              <div className="mt-6 pt-6 border-t border-white/10">
                {mode === 'login' ? (
                  <p className="text-center text-gray-400">
                    Não tem uma conta?{' '}
                    <button onClick={handleSwitch} className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                      Cadastrar como Pastor
                    </button>
                  </p>
                ) : (
                  <p className="text-center text-gray-400">
                    Já tem uma conta?{' '}
                    <button onClick={handleSwitch} className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                      Fazer Login
                    </button>
                  </p>
                )}
              </div>

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                  <Lock className="w-3 h-3" />
                  Acesso seguro e criptografado
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
