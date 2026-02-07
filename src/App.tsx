import { useState, useEffect, useRef } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Header';
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

interface User {
  username: string;
  role: string;
}

export function App() {
  const [showVersePopup, setShowVersePopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('public');
  const [user, setUser] = useState<User | null>(null);
  
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

  // Handle login
  const handleLogin = (isAdmin: boolean) => {
    const newUser = {
      username: isAdmin ? 'Admin' : 'Membro',
      role: isAdmin ? 'admin' : 'member'
    };
    setUser(newUser);
    setCurrentView(isAdmin ? 'admin' : 'member');
    setShowLoginModal(false);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setCurrentView('public');
  };

  return (
    <LanguageProvider>
      <DataProvider>
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
          {/* Header - Always visible */}
          <Header
            user={user}
            onLoginClick={() => setShowLoginModal(true)}
            onLogout={handleLogout}
            onMemberArea={() => setCurrentView('member')}
            onAdminPanel={() => setCurrentView('admin')}
          />

          {/* Main Content */}
          {currentView === 'public' && (
            <>
              <div id="home" ref={sectionRefs.home}>
                <HeroSection />
              </div>
              <div id="about" ref={sectionRefs.about}>
                <AboutSection />
              </div>
              <div id="events" ref={sectionRefs.events}>
                <EventsSection />
              </div>
              <div id="prayer" ref={sectionRefs.prayer}>
                <PrayerWallSection />
              </div>
              <div id="media" ref={sectionRefs.media}>
                <MediaSection />
              </div>
              <div id="gallery" ref={sectionRefs.gallery}>
                <GallerySection />
              </div>
              <div id="quiz" ref={sectionRefs.quiz}>
                <QuizSection />
              </div>
              <div id="donations" ref={sectionRefs.donations}>
                <DonationsSection />
              </div>
              <div id="cells" ref={sectionRefs.cells}>
                <CellsSection />
              </div>
              <div id="contact" ref={sectionRefs.contact}>
                <ContactSection />
              </div>
              <Footer />
            </>
          )}

          {currentView === 'member' && user && (
            <MemberArea 
              onBack={() => setCurrentView('public')} 
              username={user.username} 
            />
          )}

          {currentView === 'admin' && (
            <AdminPanel onBack={() => setCurrentView('public')} />
          )}

          {/* Floating Widgets - Only on public view */}
          {currentView === 'public' && (
            <FloatingWidgets />
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
      </DataProvider>
    </LanguageProvider>
  );
}
