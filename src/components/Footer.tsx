import { motion } from 'framer-motion';
import { Heart, Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useLanguage();
  
  const links = [
    { label: t('aboutUs'), section: 'about' },
    { label: t('events'), section: 'events' },
    { label: t('prayerWall'), section: 'prayer' },
    { label: t('gallery'), section: 'gallery' },
    { label: t('donations'), section: 'donations' },
    { label: t('contact'), section: 'contact' },
  ];

  const socialLinks = [
    { icon: Instagram, url: '#', color: 'hover:text-pink-500' },
    { icon: Facebook, url: '#', color: 'hover:text-blue-500' },
    { icon: Youtube, url: '#', color: 'hover:text-red-500' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl rotate-6" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">IC</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">Igreja Conectada</h3>
                <p className="text-gray-400 text-sm">Fé que Transforma</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Uma comunidade conectada pelo amor de Deus, transformando vidas através do Evangelho.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-colors`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.section}>
                  <button
                    onClick={() => onNavigate(link.section)}
                    className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Rua da Fé, 123<br />Lisboa, Portugal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <span className="text-gray-400 text-sm">+351 912 345 678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <span className="text-gray-400 text-sm">contato@igrejaconectada.org</span>
              </li>
            </ul>
          </div>

          {/* Schedule */}
          <div>
            <h4 className="font-bold text-lg mb-6">Horários</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Domingo</span>
                <span className="text-white">10h e 18h</span>
              </li>
              <li className="flex justify-between">
                <span>Quarta-feira</span>
                <span className="text-white">20h</span>
              </li>
              <li className="flex justify-between">
                <span>Sexta-feira</span>
                <span className="text-white">20h</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Feito com <Heart className="w-4 h-4 text-red-500 fill-red-500" /> Igreja Conectada © 2025
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">LGPD/RGPD</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
