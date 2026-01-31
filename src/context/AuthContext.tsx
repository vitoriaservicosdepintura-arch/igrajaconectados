import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Igreja, Usuario } from '@/types';

type UserRole = 'admin' | 'pastor' | 'lider' | 'membro';

interface AuthContextType {
  isAuthenticated: boolean;
  user: Usuario | null;
  igreja: Igreja | null;
  userRole: UserRole | null;
  igrejas: Igreja[];
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  loginMember: (name: string, phone: string, igrejaId?: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

interface RegisterData {
  churchName: string;
  adminName: string;
  email: string;
  phone: string;
  password: string;
  endereco?: string;
}

interface StoredUser extends Usuario {
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Funções para gerenciar localStorage
const loadIgrejas = (): Igreja[] => {
  try {
    const saved = localStorage.getItem('churchApp_igrejas');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const loadUsers = (): StoredUser[] => {
  try {
    const saved = localStorage.getItem('churchApp_users');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveIgrejas = (igrejas: Igreja[]) => {
  localStorage.setItem('churchApp_igrejas', JSON.stringify(igrejas));
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem('churchApp_users', JSON.stringify(users));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);
  const [igreja, setIgreja] = useState<Igreja | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [igrejas, setIgrejas] = useState<Igreja[]>([]);

  // Carregar dados e verificar sessão ao iniciar
  useEffect(() => {
    const savedIgrejas = loadIgrejas();
    setIgrejas(savedIgrejas);

    // Verificar sessão salva
    const savedSession = localStorage.getItem('churchApp_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setUser(session.user);
        setIgreja(session.igreja);
        setUserRole(session.user.role);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('churchApp_session');
      }
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole = 'admin'): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = loadUsers();
    const existingIgrejas = loadIgrejas();
    
    // Encontrar usuário
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      alert('E-mail ou senha incorretos!');
      return false;
    }

    // Encontrar igreja do usuário
    const igrejaData = existingIgrejas.find(i => i.id === foundUser.igreja_id);
    
    if (!igrejaData) {
      alert('Igreja não encontrada!');
      return false;
    }

    const userWithoutPassword: Usuario = {
      id: foundUser.id,
      nome: foundUser.nome,
      email: foundUser.email,
      igreja_id: foundUser.igreja_id,
      senha: '',
      role: foundUser.role || role
    };

    setIsAuthenticated(true);
    setUser(userWithoutPassword);
    setIgreja(igrejaData);
    setUserRole(userWithoutPassword.role);

    // Salvar sessão
    localStorage.setItem('churchApp_session', JSON.stringify({
      user: userWithoutPassword,
      igreja: igrejaData
    }));

    return true;
  };

  const loginMember = async (name: string, phone: string, igrejaId?: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!name || !phone) {
      return false;
    }

    const existingIgrejas = loadIgrejas();
    let targetIgreja: Igreja | null = null;

    if (igrejaId) {
      targetIgreja = existingIgrejas.find(i => i.id === igrejaId) || null;
    } else if (existingIgrejas.length > 0) {
      targetIgreja = existingIgrejas[0];
    }

    const memberUser: Usuario = {
      id: 'member-' + Date.now(),
      igreja_id: targetIgreja?.id || 'public',
      nome: name,
      email: '',
      senha: '',
      role: 'membro',
    };
    
    setIsAuthenticated(true);
    setUser(memberUser);
    setIgreja(targetIgreja);
    setUserRole('membro');

    // Salvar sessão
    localStorage.setItem('churchApp_session', JSON.stringify({
      user: memberUser,
      igreja: targetIgreja
    }));

    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = loadUsers();
    const existingIgrejas = loadIgrejas();

    // Verificar se e-mail já existe
    if (users.find(u => u.email === data.email)) {
      alert('Este e-mail já está cadastrado! Faça login.');
      return false;
    }

    // Criar IDs únicos
    const igrejaId = 'igreja_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const userId = 'user_' + Date.now();

    // Criar nova igreja
    const newIgreja: Igreja = {
      id: igrejaId,
      nome: data.churchName,
      email: data.email,
      telefone: data.phone,
      cores: { primary: '#6366f1', secondary: '#8b5cf6' },
      plano_id: '1',
      status: 'ativo',
      idioma_padrao: 'pt',
      data_cadastro: new Date(),
    };

    // Criar admin
    const newUser: StoredUser = {
      id: userId,
      nome: data.adminName,
      email: data.email,
      igreja_id: igrejaId,
      senha: '',
      role: 'admin',
      password: data.password
    };

    // Salvar no localStorage
    const novasIgrejas = [...existingIgrejas, newIgreja];
    const novosUsers = [...users, newUser];
    
    saveIgrejas(novasIgrejas);
    saveUsers(novosUsers);
    setIgrejas(novasIgrejas);

    // IMPORTANTE: Inicializar dados VAZIOS para a nova igreja
    localStorage.setItem(`church_${igrejaId}_eventos`, JSON.stringify([]));
    localStorage.setItem(`church_${igrejaId}_fotos`, JSON.stringify([]));
    localStorage.setItem(`church_${igrejaId}_videos`, JSON.stringify([]));
    localStorage.setItem(`church_${igrejaId}_membros`, JSON.stringify([]));
    localStorage.setItem(`church_${igrejaId}_doacoes`, JSON.stringify([]));
    localStorage.setItem(`church_${igrejaId}_presencas`, JSON.stringify([]));
    localStorage.setItem(`church_${igrejaId}_mensagens`, JSON.stringify([]));
    localStorage.setItem(`church_${igrejaId}_avisos`, JSON.stringify([]));
    localStorage.setItem(`church_${igrejaId}_quiz`, JSON.stringify([]));
    localStorage.setItem(`church_${igrejaId}_ranking`, JSON.stringify([]));

    const userWithoutPassword: Usuario = {
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      igreja_id: newUser.igreja_id,
      senha: '',
      role: 'admin'
    };

    setIsAuthenticated(true);
    setUser(userWithoutPassword);
    setIgreja(newIgreja);
    setUserRole('admin');

    // Salvar sessão
    localStorage.setItem('churchApp_session', JSON.stringify({
      user: userWithoutPassword,
      igreja: newIgreja
    }));

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIgreja(null);
    setUserRole(null);
    localStorage.removeItem('churchApp_session');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      igreja, 
      userRole, 
      igrejas,
      login, 
      loginMember, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
