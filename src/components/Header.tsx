import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiChevronDown, FiUser, FiLogOut, 
  FiSettings, FiGlobe
} from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  user: { username: string; role: string } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onMemberArea: () => void;
  onAdminPanel: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onLoginClick, 
  onLogout, 
  onMemberArea, 
  onAdminPanel 
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
  };

  const menuItems = [
    { id: 'home', label: t('menu.home') },
    { id: 'about', label: t('menu.about') },
    { id: 'events', label: t('menu.events') },
    { id: 'gallery', label: t('menu.gallery') },
    { id: 'prayer', label: t('menu.prayer') },
    { id: 'donations', label: t('menu.donations') },
  ];

  const moreMenuItems = [
    { id: 'quiz', label: t('menu.quiz') },
    { id: 'cells', label: t('menu.cells') },
    { id: 'media', label: t('menu.media') },
    { id: 'contact', label: t('menu.contact') },
  ];

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection('home')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white font-bold text-xl">IC</span>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                {language === 'en' ? 'Connected Church' : language === 'es' ? 'Iglesia Conectada' : 'Igreja Conectada'}
              </h1>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-orange-600 hover:bg-orange-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* More Menu */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-orange-600 hover:bg-orange-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {t('menu.more')}
                <FiChevronDown className={`ml-1 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isMoreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                  >
                    {moreMenuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="w-full px-4 py-3 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  isScrolled 
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <FiGlobe className="w-4 h-4" />
                <span className="text-lg">{currentLang?.flag}</span>
                <span className="hidden sm:inline text-sm font-medium">{currentLang?.code.toUpperCase()}</span>
                <FiChevronDown className={`w-4 h-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as 'pt' | 'en' | 'es');
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors ${
                          language === lang.code 
                            ? 'bg-orange-50 text-orange-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                        {language === lang.code && (
                          <motion.div 
                            layoutId="activeLang"
                            className="ml-auto w-2 h-2 bg-orange-500 rounded-full"
                          />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu or Login Button */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    isScrolled 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  <FiUser className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">{user.username}</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user.username}</p>
                        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                      </div>
                      
                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            onAdminPanel();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center space-x-2"
                        >
                          <FiSettings className="w-4 h-4" />
                          <span>{t('menu.adminPanel')}</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          onMemberArea();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center space-x-2"
                      >
                        <FiUser className="w-4 h-4" />
                        <span>{t('menu.memberArea')}</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          onLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>{t('menu.logout')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden sm:flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium transition-all bg-[#F5DEB3] hover:bg-[#E8D4A8] text-gray-800 shadow-md hover:shadow-lg border border-[#D4C4A0]"
              >
                <FiUser className="w-4 h-4" />
                <span>{t('menu.login')}</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {[...menuItems, ...moreMenuItems].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <p className="px-4 text-sm text-gray-500 mb-2">{t('common.select')} {t('menu.more').toLowerCase()}</p>
                <div className="flex space-x-2 px-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as 'pt' | 'en' | 'es');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                        language === lang.code 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Mobile Login Button */}
              {!user && (
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-4 px-4 py-3 bg-[#F5DEB3] hover:bg-[#E8D4A8] text-gray-800 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-md border border-[#D4C4A0]"
                >
                  <FiUser className="w-4 h-4" />
                  <span>{t('menu.login')}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
