import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, User, LogIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';

interface HeaderProps {
  onNavigate: (section: string) => void;
  currentSection: string;
  isLoggedIn: boolean;
  onLogin: () => void;
  isAdmin: boolean;
}

export function Header({ onNavigate, currentSection, isLoggedIn, onLogin, isAdmin }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const menuItems = [
    { id: 'home', label: t('home') },
    { id: 'about', label: t('aboutUs') },
    { id: 'events', label: t('events') },
    { id: 'prayer', label: t('prayerWall') },
    { id: 'media', label: t('media') },
    { id: 'gallery', label: t('gallery') },
    { id: 'quiz', label: t('quiz') },
    { id: 'donations', label: t('donations') },
    { id: 'cells', label: t('cells') },
    { id: 'contact', label: t('contact') },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl rotate-6 transform-gpu" style={{ transformStyle: 'preserve-3d' }} />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg md:text-xl">IC</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg md:text-xl text-gray-900">Igreja Conectada</h1>
              <p className="text-xs text-gray-500">Fé que Transforma</p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.slice(0, 7).map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentSection === item.id
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
            <div className="relative group">
              <button className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
                Mais ▾
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {menuItems.slice(7).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Selector */}
            <div className="relative">
              <motion.button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600 hidden sm:inline">{language.toUpperCase()}</span>
              </motion.button>
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-orange-50 transition-colors ${
                          language === lang.code ? 'bg-orange-100 text-orange-600' : 'text-gray-600'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Login/Profile */}
            <motion.button
              onClick={onLogin}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white text-sm font-medium shadow-lg shadow-orange-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoggedIn ? (
                <>
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{isAdmin ? 'Admin' : t('members')}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('login')}</span>
                </>
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 gap-2">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors ${
                    currentSection === item.id
                      ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
