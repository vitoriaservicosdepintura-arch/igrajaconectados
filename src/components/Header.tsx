import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Church, Home, Users, Image, Calendar, Heart, HelpCircle, UserCircle } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const menuItems = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'about', label: 'Quem Somos', icon: Users },
  { id: 'gallery', label: 'Galeria', icon: Image },
  { id: 'events', label: 'Cultos e Eventos', icon: Calendar },
  { id: 'donations', label: 'Doações', icon: Heart },
  { id: 'quiz', label: 'Quiz Bíblico', icon: HelpCircle },
  { id: 'members', label: 'Membros', icon: UserCircle },
];

export function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-900/95 via-amber-800/95 to-amber-900/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentPage('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-amber-100 p-2 rounded-full">
              <Church className="w-8 h-8 text-amber-800" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-amber-100">Igreja Luz do Mundo</h1>
              <p className="text-xs text-amber-300">Iluminando caminhos com amor</p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  currentPage === item.id
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-amber-100 hover:bg-amber-700/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-amber-100 hover:bg-amber-700/50 rounded-lg"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-amber-800/95 border-t border-amber-700"
          >
            <nav className="px-4 py-3 space-y-1">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium flex items-center gap-3 ${
                    currentPage === item.id
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-amber-100 hover:bg-amber-700/50'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-5 h-5" />
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
