import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiInstagram, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };
  
  const links = [
    { label: t('menu.about'), section: 'about' },
    { label: t('menu.events'), section: 'events' },
    { label: t('menu.prayer'), section: 'prayer' },
    { label: t('menu.gallery'), section: 'gallery' },
    { label: t('menu.donations'), section: 'donations' },
    { label: t('menu.contact'), section: 'contact' },
  ];

  const socialLinks = [
    { icon: FiInstagram, url: '#', color: 'hover:text-pink-500', label: 'Instagram' },
    { icon: FiFacebook, url: '#', color: 'hover:text-blue-500', label: 'Facebook' },
    { icon: FiYoutube, url: '#', color: 'hover:text-red-500', label: 'YouTube' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  const churchName = language === 'en' ? 'Connected Church' : language === 'es' ? 'Iglesia Conectada' : 'Igreja Conectada';

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
                <h3 className="font-bold text-lg">{churchName}</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-colors`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.section}>
                  <button
                    onClick={() => scrollToSection(link.section)}
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
            <h4 className="font-bold text-lg mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">{t('contact.addressValue')}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-orange-500" />
                <span className="text-gray-400 text-sm">+351 965 838 589</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-orange-500" />
                <span className="text-gray-400 text-sm">contato@igrejaconectada.org</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6">{t('footer.newsletter')}</h4>
            <p className="text-gray-400 text-sm mb-4">{t('footer.newsletterText')}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <FiSend className="w-4 h-4" />
              </motion.button>
            </form>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400 text-sm mt-2"
              >
                {t('footer.subscribed')}
              </motion.p>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <FiHeart className="w-4 h-4 text-red-500" /> {churchName} © 2025 - {t('footer.rights')}
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer.lgpd')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
