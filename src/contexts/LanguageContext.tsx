import { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

const translations = {
  // Navigation
  home: { pt: 'Início', en: 'Home', es: 'Inicio' },
  aboutUs: { pt: 'Quem Somos', en: 'About Us', es: 'Quiénes Somos' },
  contact: { pt: 'Contato', en: 'Contact', es: 'Contacto' },
  events: { pt: 'Eventos', en: 'Events', es: 'Eventos' },
  sundaySchool: { pt: 'Escolinha Dominical', en: 'Sunday School', es: 'Escuela Dominical' },
  gallery: { pt: 'Galeria', en: 'Gallery', es: 'Galería' },
  members: { pt: 'Membros', en: 'Members', es: 'Miembros' },
  donations: { pt: 'Doações', en: 'Donations', es: 'Donaciones' },
  quiz: { pt: 'Quiz Bíblico', en: 'Bible Quiz', es: 'Quiz Bíblico' },
  prayerWall: { pt: 'Mural de Oração', en: 'Prayer Wall', es: 'Muro de Oración' },
  media: { pt: 'Mídia', en: 'Media', es: 'Media' },
  cells: { pt: 'Células', en: 'Cell Groups', es: 'Células' },
  
  // General
  amen: { pt: 'Amém', en: 'Amen', es: 'Amén' },
  close: { pt: 'Fechar', en: 'Close', es: 'Cerrar' },
  submit: { pt: 'Enviar', en: 'Submit', es: 'Enviar' },
  login: { pt: 'Entrar', en: 'Login', es: 'Iniciar Sesión' },
  logout: { pt: 'Sair', en: 'Logout', es: 'Cerrar Sesión' },
  name: { pt: 'Nome', en: 'Name', es: 'Nombre' },
  email: { pt: 'E-mail', en: 'Email', es: 'Correo' },
  phone: { pt: 'Telefone', en: 'Phone', es: 'Teléfono' },
  password: { pt: 'Senha', en: 'Password', es: 'Contraseña' },
  
  // Hero
  heroTitle: { pt: 'Fé que Transforma', en: 'Faith that Transforms', es: 'Fe que Transforma' },
  heroSubtitle: { pt: 'Uma comunidade conectada pelo amor de Deus', en: 'A community connected by God\'s love', es: 'Una comunidad conectada por el amor de Dios' },
  joinUs: { pt: 'Junte-se a Nós', en: 'Join Us', es: 'Únete a Nosotros' },
  
  // Prayer Wall
  prayerRequest: { pt: 'Deixe seu Pedido', en: 'Leave Your Request', es: 'Deja tu Petición' },
  praying: { pt: 'pessoas orando', en: 'people praying', es: 'personas orando' },
  prayForThis: { pt: 'Orar', en: 'Pray', es: 'Orar' },
  public: { pt: 'Público', en: 'Public', es: 'Público' },
  private: { pt: 'Privado', en: 'Private', es: 'Privado' },
  
  // Donations
  donateNow: { pt: 'Doar Agora', en: 'Donate Now', es: 'Donar Ahora' },
  donationGoal: { pt: 'Meta de Doação', en: 'Donation Goal', es: 'Meta de Donación' },
  raised: { pt: 'Arrecadado', en: 'Raised', es: 'Recaudado' },
  
  // Events
  addToCalendar: { pt: 'Adicionar à Agenda', en: 'Add to Calendar', es: 'Añadir al Calendario' },
  upcomingEvents: { pt: 'Próximos Eventos', en: 'Upcoming Events', es: 'Próximos Eventos' },
  
  // Quiz
  startQuiz: { pt: 'Iniciar Quiz', en: 'Start Quiz', es: 'Iniciar Quiz' },
  nextQuestion: { pt: 'Próxima Pergunta', en: 'Next Question', es: 'Siguiente Pregunta' },
  score: { pt: 'Pontuação', en: 'Score', es: 'Puntuación' },
  ranking: { pt: 'Ranking', en: 'Ranking', es: 'Ranking' },
  
  // Contact
  talkToUs: { pt: 'Fale com um dos nossos', en: 'Talk to Us', es: 'Habla con Nosotros' },
  confirmPresence: { pt: 'Confirmar Presença', en: 'Confirm Presence', es: 'Confirmar Presencia' },
  nextService: { pt: 'Próximo Culto', en: 'Next Service', es: 'Próximo Culto' },
  
  // Admin
  adminPanel: { pt: 'Painel Administrativo', en: 'Admin Panel', es: 'Panel Administrativo' },
  dashboard: { pt: 'Dashboard', en: 'Dashboard', es: 'Panel' },
  manageContent: { pt: 'Gerenciar Conteúdo', en: 'Manage Content', es: 'Gestionar Contenido' },
  
  // LGPD
  privacyConsent: { pt: 'Aceito a política de privacidade e proteção de dados', en: 'I accept the privacy policy and data protection', es: 'Acepto la política de privacidad y protección de datos' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');
  
  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    return translation ? translation[language] : key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
