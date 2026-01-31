import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

// Tipos
interface Evento {
  id: string;
  igreja_id: string;
  titulo: string;
  descricao: string;
  data: Date | string;
  hora?: string;
  tipo: 'culto' | 'evento';
  local?: string;
  pregador?: string;
  cantores?: string;
  imagem?: string;
}

interface Foto {
  id: string;
  url: string;
  titulo: string;
  data: string;
  evento_id?: string;
}

interface Video {
  id: string;
  url: string;
  thumbnail: string;
  titulo: string;
  data: string;
}

interface Membro {
  id: string;
  igreja_id: string;
  nome: string;
  email: string;
  telefone: string;
  data_batismo?: Date | string;
  status: 'ativo' | 'inativo';
}

interface Doacao {
  id: string;
  igreja_id: string;
  membro_id?: string;
  nome?: string;
  telefone?: string;
  email?: string;
  valor: number;
  tipo: 'dizimo' | 'oferta';
  metodo?: string;
  data: Date | string;
}

interface Presenca {
  id: string;
  evento_id: string;
  nome: string;
  telefone: string;
  data: Date | string;
}

interface Mensagem {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  assunto: string;
  mensagem: string;
  data: Date | string;
  lida: boolean;
}

interface Aviso {
  id: string;
  igreja_id: string;
  mensagem: string;
  canal: 'whatsapp' | 'email' | 'sms' | 'interno';
  data: Date | string;
}

interface QuizQuestion {
  id: string;
  igreja_id: string;
  pergunta: string;
  opcoes: string[];
  resposta_correta: number;
  categoria?: string;
  dificuldade?: string;
  imagem?: string;
}

interface RankingEntry {
  id: string;
  nome: string;
  pontuacao: number;
  acertos: number;
  erros: number;
  data: Date | string;
}

interface ChurchDataContextType {
  // Estados
  eventos: Evento[];
  fotos: Foto[];
  videos: Video[];
  membros: Membro[];
  doacoes: Doacao[];
  presencas: Presenca[];
  mensagens: Mensagem[];
  avisos: Aviso[];
  quiz: QuizQuestion[];
  ranking: RankingEntry[];
  isLoading: boolean;
  
  // Funções de Eventos
  addEvento: (evento: Omit<Evento, 'id' | 'igreja_id'>) => void;
  updateEvento: (id: string, evento: Partial<Evento>) => void;
  deleteEvento: (id: string) => void;
  
  // Funções de Fotos
  addFoto: (foto: Omit<Foto, 'id'>) => void;
  deleteFoto: (id: string) => void;
  
  // Funções de Videos
  addVideo: (video: Omit<Video, 'id'>) => void;
  deleteVideo: (id: string) => void;
  
  // Funções de Membros
  addMembro: (membro: Omit<Membro, 'id' | 'igreja_id'>) => void;
  updateMembro: (id: string, membro: Partial<Membro>) => void;
  deleteMembro: (id: string) => void;
  
  // Funções de Doações
  addDoacao: (doacao: Omit<Doacao, 'id' | 'igreja_id'>) => void;
  
  // Funções de Presença
  addPresenca: (presenca: Omit<Presenca, 'id'>) => void;
  
  // Funções de Mensagens
  addMensagem: (mensagem: Omit<Mensagem, 'id' | 'lida'>) => void;
  markMensagemAsRead: (id: string) => void;
  
  // Funções de Avisos
  addAviso: (aviso: Omit<Aviso, 'id' | 'igreja_id'>) => void;
  
  // Funções de Quiz
  addQuizQuestion: (question: Omit<QuizQuestion, 'id' | 'igreja_id'>) => void;
  addRankingEntry: (entry: Omit<RankingEntry, 'id'>) => void;
  
  // Refresh
  refreshData: () => void;
}

const ChurchDataContext = createContext<ChurchDataContextType | undefined>(undefined);

export function ChurchDataProvider({ children }: { children: ReactNode }) {
  const { igreja, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);

  // Função para obter o prefixo de storage baseado na igreja
  const getStorageKey = useCallback((key: string) => {
    const igrejaId = igreja?.id || 'public';
    return `church_${igrejaId}_${key}`;
  }, [igreja?.id]);

  // Função para carregar dados do localStorage
  const loadData = useCallback(<T,>(key: string, defaultValue: T[]): T[] => {
    try {
      const storageKey = getStorageKey(key);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
      return defaultValue;
    } catch {
      return defaultValue;
    }
  }, [getStorageKey]);

  // Função para salvar dados no localStorage
  const saveData = useCallback(<T,>(key: string, data: T[]) => {
    try {
      const storageKey = getStorageKey(key);
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }, [getStorageKey]);

  // Carregar todos os dados quando a igreja mudar
  const refreshData = useCallback(() => {
    setIsLoading(true);
    
    setEventos(loadData<Evento>('eventos', []));
    setFotos(loadData<Foto>('fotos', []));
    setVideos(loadData<Video>('videos', []));
    setMembros(loadData<Membro>('membros', []));
    setDoacoes(loadData<Doacao>('doacoes', []));
    setPresencas(loadData<Presenca>('presencas', []));
    setMensagens(loadData<Mensagem>('mensagens', []));
    setAvisos(loadData<Aviso>('avisos', []));
    setQuiz(loadData<QuizQuestion>('quiz', []));
    setRanking(loadData<RankingEntry>('ranking', []));
    
    setIsLoading(false);
  }, [loadData]);

  // Carregar dados quando a igreja mudar ou usuário logar
  useEffect(() => {
    refreshData();
  }, [igreja?.id, isAuthenticated, refreshData]);

  // ===== FUNÇÕES DE EVENTOS =====
  const addEvento = (evento: Omit<Evento, 'id' | 'igreja_id'>) => {
    const newEvento: Evento = {
      ...evento,
      id: 'evento_' + Date.now(),
      igreja_id: igreja?.id || 'public'
    };
    const updated = [...eventos, newEvento];
    setEventos(updated);
    saveData('eventos', updated);
  };

  const updateEvento = (id: string, eventoData: Partial<Evento>) => {
    const updated = eventos.map(e => e.id === id ? { ...e, ...eventoData } : e);
    setEventos(updated);
    saveData('eventos', updated);
  };

  const deleteEvento = (id: string) => {
    const updated = eventos.filter(e => e.id !== id);
    setEventos(updated);
    saveData('eventos', updated);
  };

  // ===== FUNÇÕES DE FOTOS =====
  const addFoto = (foto: Omit<Foto, 'id'>) => {
    const newFoto: Foto = {
      ...foto,
      id: 'foto_' + Date.now()
    };
    const updated = [...fotos, newFoto];
    setFotos(updated);
    saveData('fotos', updated);
  };

  const deleteFoto = (id: string) => {
    const updated = fotos.filter(f => f.id !== id);
    setFotos(updated);
    saveData('fotos', updated);
  };

  // ===== FUNÇÕES DE VIDEOS =====
  const addVideo = (video: Omit<Video, 'id'>) => {
    const newVideo: Video = {
      ...video,
      id: 'video_' + Date.now()
    };
    const updated = [...videos, newVideo];
    setVideos(updated);
    saveData('videos', updated);
  };

  const deleteVideo = (id: string) => {
    const updated = videos.filter(v => v.id !== id);
    setVideos(updated);
    saveData('videos', updated);
  };

  // ===== FUNÇÕES DE MEMBROS =====
  const addMembro = (membro: Omit<Membro, 'id' | 'igreja_id'>) => {
    const newMembro: Membro = {
      ...membro,
      id: 'membro_' + Date.now(),
      igreja_id: igreja?.id || 'public'
    };
    const updated = [...membros, newMembro];
    setMembros(updated);
    saveData('membros', updated);
  };

  const updateMembro = (id: string, membroData: Partial<Membro>) => {
    const updated = membros.map(m => m.id === id ? { ...m, ...membroData } : m);
    setMembros(updated);
    saveData('membros', updated);
  };

  const deleteMembro = (id: string) => {
    const updated = membros.filter(m => m.id !== id);
    setMembros(updated);
    saveData('membros', updated);
  };

  // ===== FUNÇÕES DE DOAÇÕES =====
  const addDoacao = (doacao: Omit<Doacao, 'id' | 'igreja_id'>) => {
    const newDoacao: Doacao = {
      ...doacao,
      id: 'doacao_' + Date.now(),
      igreja_id: igreja?.id || 'public'
    };
    const updated = [...doacoes, newDoacao];
    setDoacoes(updated);
    saveData('doacoes', updated);
  };

  // ===== FUNÇÕES DE PRESENÇA =====
  const addPresenca = (presenca: Omit<Presenca, 'id'>) => {
    const newPresenca: Presenca = {
      ...presenca,
      id: 'presenca_' + Date.now()
    };
    const updated = [...presencas, newPresenca];
    setPresencas(updated);
    saveData('presencas', updated);
  };

  // ===== FUNÇÕES DE MENSAGENS =====
  const addMensagem = (mensagem: Omit<Mensagem, 'id' | 'lida'>) => {
    const newMensagem: Mensagem = {
      ...mensagem,
      id: 'msg_' + Date.now(),
      lida: false
    };
    const updated = [...mensagens, newMensagem];
    setMensagens(updated);
    saveData('mensagens', updated);
  };

  const markMensagemAsRead = (id: string) => {
    const updated = mensagens.map(m => m.id === id ? { ...m, lida: true } : m);
    setMensagens(updated);
    saveData('mensagens', updated);
  };

  // ===== FUNÇÕES DE AVISOS =====
  const addAviso = (aviso: Omit<Aviso, 'id' | 'igreja_id'>) => {
    const newAviso: Aviso = {
      ...aviso,
      id: 'aviso_' + Date.now(),
      igreja_id: igreja?.id || 'public'
    };
    const updated = [...avisos, newAviso];
    setAvisos(updated);
    saveData('avisos', updated);
  };

  // ===== FUNÇÕES DE QUIZ =====
  const addQuizQuestion = (question: Omit<QuizQuestion, 'id' | 'igreja_id'>) => {
    const newQuestion: QuizQuestion = {
      ...question,
      id: 'quiz_' + Date.now(),
      igreja_id: igreja?.id || 'public'
    };
    const updated = [...quiz, newQuestion];
    setQuiz(updated);
    saveData('quiz', updated);
  };

  const addRankingEntry = (entry: Omit<RankingEntry, 'id'>) => {
    const newEntry: RankingEntry = {
      ...entry,
      id: 'rank_' + Date.now()
    };
    const updated = [...ranking, newEntry].sort((a, b) => b.pontuacao - a.pontuacao).slice(0, 100);
    setRanking(updated);
    saveData('ranking', updated);
  };

  return (
    <ChurchDataContext.Provider value={{
      // Estados
      eventos,
      fotos,
      videos,
      membros,
      doacoes,
      presencas,
      mensagens,
      avisos,
      quiz,
      ranking,
      isLoading,
      
      // Funções
      addEvento,
      updateEvento,
      deleteEvento,
      addFoto,
      deleteFoto,
      addVideo,
      deleteVideo,
      addMembro,
      updateMembro,
      deleteMembro,
      addDoacao,
      addPresenca,
      addMensagem,
      markMensagemAsRead,
      addAviso,
      addQuizQuestion,
      addRankingEntry,
      refreshData
    }}>
      {children}
    </ChurchDataContext.Provider>
  );
}

export function useChurchData() {
  const context = useContext(ChurchDataContext);
  if (!context) {
    throw new Error('useChurchData must be used within ChurchDataProvider');
  }
  return context;
}
