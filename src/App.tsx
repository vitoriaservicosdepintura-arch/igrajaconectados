import { useState, useEffect } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ChurchDataProvider } from '@/contexts/ChurchDataContext';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';
import { MemberPortal } from '@/components/MemberPortal';
import { AuthModal } from '@/components/AuthModal';
import { VersePopup } from '@/components/VersePopup';

// Interface para igreja salva
interface IgrejaSalva {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  logo?: string;
  cores?: { primary: string; secondary: string };
}

// Função para buscar a última igreja cadastrada
function getLastRegisteredChurch(): { id: string; nome: string } {
  try {
    const igrejasStr = localStorage.getItem('churchApp_igrejas');
    if (igrejasStr) {
      const igrejas: IgrejaSalva[] = JSON.parse(igrejasStr);
      if (igrejas.length > 0) {
        // Retorna a última igreja cadastrada
        const lastChurch = igrejas[igrejas.length - 1];
        return { id: lastChurch.id, nome: lastChurch.nome };
      }
    }
  } catch (e) {
    console.error('Erro ao buscar igrejas:', e);
  }
  return { id: 'public', nome: 'Igreja Cristã' };
}

function AppContent() {
  const { isAuthenticated, userRole, user, igreja, logout } = useAuth();
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'register' }>({
    open: false,
    mode: 'login',
  });
  const [showVersePopup, setShowVersePopup] = useState(false);
  const [publicChurch, setPublicChurch] = useState<{ id: string; nome: string }>({ id: 'public', nome: 'Igreja Cristã' });

  // Buscar a última igreja cadastrada para mostrar na página pública
  useEffect(() => {
    const church = getLastRegisteredChurch();
    setPublicChurch(church);
    
    // Escutar mudanças no localStorage (quando admin salva dados)
    const handleStorageChange = () => {
      const updatedChurch = getLastRegisteredChurch();
      setPublicChurch(updatedChurch);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Verificar a cada 2 segundos por atualizações (para mesma aba)
    const interval = setInterval(() => {
      const updatedChurch = getLastRegisteredChurch();
      if (updatedChurch.id !== publicChurch.id) {
        setPublicChurch(updatedChurch);
      }
    }, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Show verse popup on first visit
  useEffect(() => {
    const hasSeenVerse = sessionStorage.getItem('hasSeenVerse');
    if (!hasSeenVerse && !isAuthenticated) {
      const timer = setTimeout(() => {
        setShowVersePopup(true);
        sessionStorage.setItem('hasSeenVerse', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleLogin = () => setAuthModal({ open: true, mode: 'login' });
  const handleRegister = () => setAuthModal({ open: true, mode: 'register' });
  const handleCloseAuth = () => setAuthModal({ ...authModal, open: false });
  const handleSwitchAuth = () => setAuthModal({ ...authModal, mode: authModal.mode === 'login' ? 'register' : 'login' });
  const handleAuthSuccess = () => {
    setAuthModal({ ...authModal, open: false });
    // Atualizar a igreja pública após login/cadastro
    const church = getLastRegisteredChurch();
    setPublicChurch(church);
  };
  const handleLogout = () => {
    logout();
    sessionStorage.removeItem('hasSeenVerse');
  };

  // Get igreja ID for data context
  const igrejaId = igreja?.id || user?.igreja_id || 'public';
  const igrejaNome = igreja?.nome || 'Minha Igreja';

  // Authenticated - show appropriate portal
  if (isAuthenticated) {
    return (
      <ChurchDataProvider igrejaId={igrejaId} igrejaNome={igrejaNome}>
        {userRole === 'membro' ? (
          <MemberPortal onLogout={handleLogout} />
        ) : (
          <Dashboard onLogout={handleLogout} />
        )}
      </ChurchDataProvider>
    );
  }

  // Not authenticated - show landing page with last registered church data
  return (
    <>
      <ChurchDataProvider igrejaId={publicChurch.id} igrejaNome={publicChurch.nome}>
        <LandingPage onLogin={handleLogin} onRegister={handleRegister} />
      </ChurchDataProvider>
      <AuthModal
        isOpen={authModal.open}
        mode={authModal.mode}
        onClose={handleCloseAuth}
        onSwitch={handleSwitchAuth}
        onSuccess={handleAuthSuccess}
      />
      <VersePopup isOpen={showVersePopup} onClose={() => setShowVersePopup(false)} />
    </>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
