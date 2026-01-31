import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Church, Eye, EyeOff, Users, Shield, MapPin, CheckCircle, CreditCard, Star, Crown, Zap, Copy, Check, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitch: () => void;
  onSuccess: () => void;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'basico',
    name: 'Básico',
    price: 35,
    icon: <Zap className="w-6 h-6" />,
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'border-blue-500/50',
    features: [
      'Até 200 membros',
      'Agenda de cultos e eventos',
      'Versículo do dia',
      'Galeria de fotos',
      'Avisos internos',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 60,
    icon: <Star className="w-6 h-6" />,
    color: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-purple-600/20',
    borderColor: 'border-purple-500/50',
    popular: true,
    features: [
      'Até 1.000 membros',
      'Tudo do Básico +',
      'WhatsApp + E-mail automático',
      'Escolinha dominical com Quiz',
      'Doações online',
      'Galeria de vídeos',
    ],
  },
  {
    id: 'ouro',
    name: 'Ouro',
    price: 80,
    icon: <Crown className="w-6 h-6" />,
    color: 'text-amber-400',
    bgColor: 'from-amber-500/20 to-amber-600/20',
    borderColor: 'border-amber-500/50',
    features: [
      'Membros ilimitados',
      'Tudo do Premium +',
      'SMS integrado',
      'Relatórios avançados',
      'Histórico espiritual',
      'Suporte prioritário 24/7',
    ],
  },
];

export function AuthModal({ isOpen, mode, onClose, onSwitch, onSuccess }: AuthModalProps) {
  const { t } = useLanguage();
  const { login, loginMember, register, igrejas } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'member'>('member');
  const [selectedIgrejaId, setSelectedIgrejaId] = useState<string>('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  
  // Payment flow states
  const [step, setStep] = useState<'form' | 'plans' | 'payment' | 'processing' | 'success'>('form');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mbway' | 'pix' | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
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

  // Payment details
  const mbwayDetails = {
    phone: '+351 965 838 589',
    name: 'Mayckon Luiz Conceição',
    bank: 'Novobanco Portugal',
  };

  const pixDetails = {
    key: 'mayckon.conceicao@email.com',
    name: 'Mayckon Luiz Conceição',
    bank: 'Banco do Brasil',
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (mode === 'register') {
      // Go to plan selection
      setStep('plans');
    } else {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      let success = false;
      if (loginType === 'member') {
        success = await loginMember(formData.memberName, formData.memberPhone, selectedIgrejaId);
      } else {
        success = await login(formData.email, formData.password, 'admin');
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

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setStep('payment');
  };

  const handlePaymentMethodSelect = (method: 'mbway' | 'pix') => {
    setPaymentMethod(method);
  };

  const handleConfirmPayment = async () => {
    if (!paymentConfirmed) return;
    
    setStep('processing');
    setLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const success = await register({
        churchName: formData.churchName,
        adminName: formData.adminName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        endereco: formData.endereco,
        plano: selectedPlan?.id || 'basico',
      });

      if (success) {
        setStep('success');
        setRegisterSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (error) {
      console.error('Register error:', error);
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
    setStep('form');
    setSelectedPlan(null);
    setPaymentMethod(null);
    setPaymentConfirmed(false);
  };

  const handleSwitch = () => {
    resetForm();
    onSwitch();
  };

  const handleBack = () => {
    if (step === 'payment') {
      setStep('plans');
      setPaymentMethod(null);
      setPaymentConfirmed(false);
    } else if (step === 'plans') {
      setStep('form');
    }
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
            className={`relative w-full ${step === 'plans' ? 'max-w-4xl' : 'max-w-md'} max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl`}
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

            {/* Back Button */}
            {(step === 'plans' || step === 'payment') && (
              <button
                onClick={handleBack}
                className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors z-10 flex items-center gap-1"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Voltar</span>
              </button>
            )}

            <div className="p-8 pt-10">
              {/* Step: Processing */}
              {step === 'processing' && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6 animate-pulse">
                    <CreditCard className="w-10 h-10 text-white animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Processando Pagamento...</h2>
                  <p className="text-gray-400 mb-4">
                    Aguarde enquanto verificamos seu pagamento
                  </p>
                  <div className="flex justify-center">
                    <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3 }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step: Success */}
              {step === 'success' && registerSuccess && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  {/* Confetti */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: -20, x: Math.random() * 400 - 200, opacity: 1 }}
                        animate={{ y: 400, opacity: 0, rotate: Math.random() * 360 }}
                        transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5 }}
                        className={`absolute top-0 w-3 h-3 ${
                          ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-pink-400', 'bg-purple-400'][i % 5]
                        }`}
                        style={{ left: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>

                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Pagamento Confirmado! 🎉</h2>
                  <p className="text-gray-400 mb-4">
                    Sua igreja foi criada com sucesso!
                  </p>
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 mb-4">
                    <p className="text-white font-semibold mb-1">Plano {selectedPlan?.name}</p>
                    <p className="text-green-400 text-2xl font-bold">€{selectedPlan?.price}/mês</p>
                  </div>
                  <p className="text-green-400 text-sm animate-pulse">
                    Redirecionando para o painel administrativo...
                  </p>
                </motion.div>
              )}

              {/* Step: Plan Selection */}
              {step === 'plans' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Escolha seu Plano</h2>
                    <p className="text-gray-400">Selecione o plano ideal para sua igreja</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <motion.div
                        key={plan.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative cursor-pointer rounded-2xl border-2 ${plan.borderColor} bg-gradient-to-br ${plan.bgColor} p-6 transition-all ${
                          selectedPlan?.id === plan.id ? 'ring-2 ring-white' : ''
                        }`}
                        onClick={() => handlePlanSelect(plan)}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                              MAIS POPULAR
                            </span>
                          </div>
                        )}
                        
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 ${plan.color} mb-4`}>
                          {plan.icon}
                        </div>
                        
                        <h3 className={`text-xl font-bold ${plan.color} mb-2`}>{plan.name}</h3>
                        
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-white">€{plan.price}</span>
                          <span className="text-gray-400">/mês</span>
                        </div>
                        
                        <ul className="space-y-2">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <button className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}>
                          Selecionar
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step: Payment */}
              {step === 'payment' && selectedPlan && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Pagamento</h2>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${selectedPlan.bgColor} ${selectedPlan.borderColor} border`}>
                      {selectedPlan.icon}
                      <span className={`font-semibold ${selectedPlan.color}`}>
                        Plano {selectedPlan.name} - €{selectedPlan.price}/mês
                      </span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-400 text-sm text-center">Escolha a forma de pagamento:</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {/* MBWAY */}
                      <button
                        onClick={() => handlePaymentMethodSelect('mbway')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === 'mbway'
                            ? 'border-red-500 bg-red-500/20'
                            : 'border-white/10 bg-white/5 hover:border-white/30'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">MB</span>
                          </div>
                          <span className="text-white font-medium">MB WAY</span>
                          <span className="text-xs text-gray-400">🇵🇹 Portugal</span>
                        </div>
                      </button>

                      {/* PIX */}
                      <button
                        onClick={() => handlePaymentMethodSelect('pix')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === 'pix'
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-white/10 bg-white/5 hover:border-white/30'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-green-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold">PIX</span>
                          </div>
                          <span className="text-white font-medium">PIX</span>
                          <span className="text-xs text-gray-400">🇧🇷 Brasil</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* MBWAY Details */}
                  {paymentMethod === 'mbway' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-5 mb-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">MB</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">Pagamento via MB WAY</h4>
                          <p className="text-red-300 text-sm">Envie €{selectedPlan.price} para:</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                          <div>
                            <p className="text-xs text-gray-400">Número MB WAY</p>
                            <p className="text-white font-mono font-bold">{mbwayDetails.phone}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard('351965838589', 'mbway-phone')}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                          >
                            {copiedField === 'mbway-phone' ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <Copy className="w-5 h-5 text-white" />
                            )}
                          </button>
                        </div>

                        <div className="bg-white/10 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Nome</p>
                          <p className="text-white font-medium">{mbwayDetails.name}</p>
                        </div>

                        <div className="bg-white/10 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Banco</p>
                          <p className="text-white font-medium">{mbwayDetails.bank}</p>
                        </div>

                        <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3">
                          <p className="text-amber-300 text-sm">
                            💡 Após enviar o pagamento, marque a confirmação abaixo
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* PIX Details */}
                  {paymentMethod === 'pix' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-xl p-5 mb-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">PIX</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">Pagamento via PIX</h4>
                          <p className="text-green-300 text-sm">Envie R$ {(selectedPlan.price * 5.5).toFixed(2)} para:</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400">Chave PIX (E-mail)</p>
                            <p className="text-white font-mono text-sm truncate">{pixDetails.key}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(pixDetails.key, 'pix-key')}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0 ml-2"
                          >
                            {copiedField === 'pix-key' ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <Copy className="w-5 h-5 text-white" />
                            )}
                          </button>
                        </div>

                        <div className="bg-white/10 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Nome</p>
                          <p className="text-white font-medium">{pixDetails.name}</p>
                        </div>

                        <div className="bg-white/10 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Banco</p>
                          <p className="text-white font-medium">{pixDetails.bank}</p>
                        </div>

                        <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3">
                          <p className="text-amber-300 text-sm">
                            💡 Após enviar o pagamento, marque a confirmação abaixo
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Payment Confirmation */}
                  {paymentMethod && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors mb-4">
                        <input
                          type="checkbox"
                          checked={paymentConfirmed}
                          onChange={(e) => setPaymentConfirmed(e.target.checked)}
                          className="w-5 h-5 rounded border-gray-600 text-green-500 focus:ring-green-500"
                        />
                        <span className="text-white">
                          ✅ Confirmo que realizei o pagamento de <strong>€{selectedPlan.price}</strong>
                        </span>
                      </label>

                      <button
                        onClick={handleConfirmPayment}
                        disabled={!paymentConfirmed || loading}
                        className={`w-full py-4 font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                          paymentConfirmed
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 shadow-green-500/30'
                            : 'bg-gray-600 text-gray-400'
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processando...
                          </span>
                        ) : (
                          '🚀 Confirmar Pagamento e Criar Igreja'
                        )}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step: Form (Login/Register) */}
              {step === 'form' && !registerSuccess && (
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
                      {mode === 'login' ? 'Acesse sua conta' : 'Crie sua igreja e gerencie tudo'}
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
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    {mode === 'register' && (
                      <>
                        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-4 mb-4">
                          <p className="text-indigo-400 text-sm text-center">
                            ⛪ Cadastre sua igreja e escolha um plano<br />
                            <span className="text-xs text-gray-400">Pagamento seguro via MB WAY ou PIX</span>
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
                          {mode === 'register' ? 'Processando...' : 'Entrando...'}
                        </span>
                      ) : (
                        mode === 'login' 
                          ? (loginType === 'member' ? '🚀 Entrar como Membro' : '🔐 Entrar como Admin')
                          : '➡️ Continuar para Escolher Plano'
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
