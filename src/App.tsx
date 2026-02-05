import { useState, useEffect, useRef } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { VersePopup } from './components/VersePopup';
import { FloatingWidgets } from './components/FloatingWidgets';
import { LoginModal } from './components/LoginModal';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { EventsSection } from './components/sections/EventsSection';
import { PrayerWallSection } from './components/sections/PrayerWallSection';
import { MediaSection } from './components/sections/MediaSection';
import { GallerySection } from './components/sections/GallerySection';
import { QuizSection } from './components/sections/QuizSection';
import { DonationsSection } from './components/sections/DonationsSection';
import { CellsSection } from './components/sections/CellsSection';
import { ContactSection } from './components/sections/ContactSection';
import { MemberArea } from './components/MemberArea';
import { AdminPanel } from './components/AdminPanel';

type ViewType = 'public' | 'member' | 'admin';

export function App() {
  const [showVersePopup, setShowVersePopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('public');
  const [memberName, setMemberName] = useState('');
  
  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    events: useRef<HTMLDivElement>(null),
    prayer: useRef<HTMLDivElement>(null),
    media: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    quiz: useRef<HTMLDivElement>(null),
    donations: useRef<HTMLDivElement>(null),
    cells: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  // Show verse popup on first visit
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setShowVersePopup(true);
        sessionStorage.setItem('hasVisited', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle navigation
  const handleNavigate = (section: string) => {
    if (currentView !== 'public') {
      setCurrentView('public');
    }
    
    setCurrentSection(section);
    
    const ref = sectionRefs[section as keyof typeof sectionRefs];
    if (ref?.current) {
      const headerHeight = 80;
      const top = ref.current.offsetTop - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Handle login
  const handleLogin = (admin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
    setMemberName(admin ? 'Administrador' : 'Membro');
    setCurrentView(admin ? 'admin' : 'member');
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setMemberName('');
    setCurrentView('public');
  };

  // Handle login button click
  const handleLoginClick = () => {
    if (isLoggedIn) {
      setCurrentView(isAdmin ? 'admin' : 'member');
    } else {
      setShowLoginModal(true);
    }
  };

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (currentView !== 'public') return;
      
      const scrollPosition = window.scrollY + 100;
      
      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header - Always visible */}
        <Header
          onNavigate={handleNavigate}
          currentSection={currentSection}
          isLoggedIn={isLoggedIn}
          onLogin={handleLoginClick}
          isAdmin={isAdmin}
        />

        {/* Main Content */}
        {currentView === 'public' && (
          <>
            <div ref={sectionRefs.home}>
              <HeroSection onNavigate={handleNavigate} />
            </div>
            <div ref={sectionRefs.about}>
              <AboutSection />
            </div>
            <div ref={sectionRefs.events}>
              <EventsSection />
            </div>
            <div ref={sectionRefs.prayer}>
              <PrayerWallSection />
            </div>
            <div ref={sectionRefs.media}>
              <MediaSection />
            </div>
            <div ref={sectionRefs.gallery}>
              <GallerySection />
            </div>
            <div ref={sectionRefs.quiz}>
              <QuizSection />
            </div>
            <div ref={sectionRefs.donations}>
              <DonationsSection />
            </div>
            <div ref={sectionRefs.cells}>
              <CellsSection />
            </div>
            <div ref={sectionRefs.contact}>
              <ContactSection />
            </div>
            <Footer onNavigate={handleNavigate} />
          </>
        )}

        {currentView === 'member' && (
          <MemberArea onLogout={handleLogout} memberName={memberName} />
        )}

        {currentView === 'admin' && (
          <AdminPanel onLogout={handleLogout} />
        )}

        {/* Floating Widgets - Only on public view */}
        {currentView === 'public' && (
          <FloatingWidgets whatsappNumber="351912345678" />
        )}

        {/* Modals */}
        <VersePopup 
          isOpen={showVersePopup} 
          onClose={() => setShowVersePopup(false)} 
        />
        
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      </div>
    </LanguageProvider>
  );
}
