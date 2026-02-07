import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (isAdmin: boolean) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError(t('acceptPrivacy'));
      return;
    }
    
    // Admin login
    if (username.toLowerCase() === 'admin' && password === '123') {
      onLogin(true);
      onClose();
      setUsername('');
      setPassword('');
      setConsent(false);
      return;
    }
    
    // Regular member login (any credentials)
    if (username && password) {
      onLogin(false);
      onClose();
      setUsername('');
      setPassword('');
      setConsent(false);
      return;
    }
    
    setError(t('invalidCredentials'));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, rotateX: -10, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            exit={{ scale: 0.9, rotateX: 10, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative w-full max-w-md"
            style={{ perspective: '1000px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 3D Effect Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-blue-600 rounded-3xl transform rotate-3 scale-[1.02] opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-orange-500 rounded-3xl transform -rotate-2 scale-[1.01] opacity-30" />
            
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative h-24 bg-gradient-to-br from-orange-500 via-orange-400 to-blue-600 flex items-center justify-center">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30"
                >
                  <User className="w-8 h-8 text-white" />
                </motion.div>
                
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">{t('login')}</h2>
                <p className="text-gray-500 text-center mb-6 text-sm">
                  {t('accessMemberArea')}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('usernameOrEmail')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setError(''); }}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('password')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm text-center"
                    >
                      {error}
                    </motion.p>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 text-orange-500 rounded"
                    />
                    <span className="text-sm text-gray-600">
                      {t('privacyConsent')}
                    </span>
                  </label>

                  <motion.button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('login')}
                  </motion.button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Admin: <code className="bg-gray-100 px-2 py-1 rounded">admin / 123</code>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
